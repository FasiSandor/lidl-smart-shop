'use strict';
const crypto=require('node:crypto');
const {Pool}=require('pg');
let pool;
function db(){if(!process.env.DATABASE_URL)throw Error('DATABASE_URL missing');return pool||(pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:true},max:3}))}
function config(){const secret=process.env.SMARTSHOP_SESSION_SECRET,password=process.env.SMARTSHOP_FAMILY_PASSWORD;if(!secret||secret.length<32||!password||password.length<12)throw Error('Secure environment configuration missing');return {secret,password}}
function sign(payload,secret){const body=Buffer.from(JSON.stringify(payload)).toString('base64url');return body+'.'+crypto.createHmac('sha256',secret).update(body).digest('base64url')}
function verify(token,secret){if(typeof token!=='string'||token.length>2048)return false;const [body,sig]=token.split('.');if(!body||!sig)return false;const expected=crypto.createHmac('sha256',secret).update(body).digest('base64url');if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;try{const p=JSON.parse(Buffer.from(body,'base64url').toString());return p.scope==='family'&&Number.isFinite(p.exp)&&p.exp>Date.now()}catch{return false}}
function cookies(req){const raw=req.headers.cookie||'';const out={};for(const part of raw.split(';')){const i=part.indexOf('=');if(i<1)continue;try{out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim())}catch{}}return out}
function safeData(p){return !!p&&Array.isArray(p.zones)&&p.zones.length===23&&p.zones.every(z=>Array.isArray(z)&&z.length<500&&z.every(x=>typeof x==='string'&&x.length<=300))&&Array.isArray(p.shopping)&&p.shopping.length<=10000&&p.shopping.every(x=>x&&typeof x.name==='string'&&x.name.length<=300&&typeof x.done==='boolean')}
function respond(res,status,body){res.status(status).setHeader('Cache-Control','no-store').json(body)}
async function ensureState(client){const household=await client.query("INSERT INTO households(name) SELECT 'Családi bevásárlás' WHERE NOT EXISTS(SELECT 1 FROM households WHERE name='Családi bevásárlás') RETURNING id");const h=household.rows[0]?.id||(await client.query("SELECT id FROM households WHERE name='Családi bevásárlás' ORDER BY created_at LIMIT 1")).rows[0].id;await client.query('INSERT INTO household_sync_state(household_id) VALUES($1) ON CONFLICT DO NOTHING',[h]);return h}
module.exports=async function handler(req,res){
 try{
  const {secret,password}=config();
  if(req.method!=='GET'){const origin=req.headers.origin,host=req.headers['x-forwarded-host']||req.headers.host;if(origin&&new URL(origin).host!==host)return respond(res,403,{error:'Érvénytelen kérés eredete'});}
  if(req.method==='POST'&&req.body?.action==='login'){
   const given=String(req.body.password||'');if(given.length>512)return respond(res,400,{error:'Érvénytelen jelszó'});
   const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
   const key=crypto.createHmac('sha256',secret).update(ip).digest('hex');
   const gate=await db().query('SELECT failures,blocked_until FROM auth_login_attempts WHERE client_key=$1',[key]);
   if(gate.rows[0]?.blocked_until&&new Date(gate.rows[0].blocked_until)>new Date())return respond(res,429,{error:'Túl sok próbálkozás. Próbáld újra később.'});
   const left=crypto.createHash('sha256').update(given).digest(),right=crypto.createHash('sha256').update(password).digest();
   if(!crypto.timingSafeEqual(left,right)){
    await db().query("INSERT INTO auth_login_attempts(client_key,failures,blocked_until) VALUES($1,1,NULL) ON CONFLICT(client_key) DO UPDATE SET failures=CASE WHEN auth_login_attempts.updated_at<now()-interval '15 minutes' THEN 1 ELSE auth_login_attempts.failures+1 END, blocked_until=CASE WHEN auth_login_attempts.failures>=4 AND auth_login_attempts.updated_at>=now()-interval '15 minutes' THEN now()+interval '15 minutes' ELSE NULL END,updated_at=now()",[key]);
    return respond(res,401,{error:'Hibás családi jelszó'});
   }
   await db().query('DELETE FROM auth_login_attempts WHERE client_key=$1',[key]);
   const token=sign({scope:'family',exp:Date.now()+7*86400000},secret);
   res.setHeader('Set-Cookie','smartshop_session='+encodeURIComponent(token)+'; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=604800');
   return respond(res,200,{ok:true});
  }
  if(req.method==='POST'&&req.body?.action==='logout'){res.setHeader('Set-Cookie','smartshop_session=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return respond(res,200,{ok:true})}
  if(!verify(cookies(req).smartshop_session,secret))return respond(res,401,{error:'Bejelentkezés szükséges'});
  if(req.method!=='GET'&&req.method!=='PUT')return respond(res,405,{error:'Nem támogatott művelet'});
  const client=await db().connect();
  try{
   await client.query('BEGIN');const id=await ensureState(client);
   if(req.method==='GET'){const r=await client.query('SELECT revision,payload,updated_at FROM household_sync_state WHERE household_id=$1',[id]);await client.query('COMMIT');return respond(res,200,{...r.rows[0],empty:r.rows[0].revision===0})}
   const {revision,payload}=req.body||{};
   if(!Number.isSafeInteger(revision)||revision<0||!safeData(payload)||JSON.stringify(payload).length>250000) {await client.query('ROLLBACK');return respond(res,400,{error:'Érvénytelen adat vagy verzió'})}
   const r=await client.query('UPDATE household_sync_state SET payload=$1::jsonb,revision=revision+1,updated_at=now() WHERE household_id=$2 AND revision=$3 RETURNING revision,updated_at',[JSON.stringify({zones:payload.zones,shopping:payload.shopping}),id,revision]);
   if(!r.rowCount){await client.query('ROLLBACK');return respond(res,409,{error:'Másik készülék módosította a listát. Frissítsd a közös adatokat, és ellenőrizd az eltéréseket.'})}
   await client.query('COMMIT');return respond(res,200,{...r.rows[0]});
  }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e}finally{client.release()}
 }catch(e){console.error('sync error',e.message);return respond(res,503,{error:'A szinkron jelenleg nem elérhető'})}
};
