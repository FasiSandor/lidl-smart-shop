const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const code=fs.readFileSync('api/sync.js','utf8');
const queries=[],state={revision:0,payload:{zones:Array.from({length:23},()=>[]),shopping:[]}};
const client={async query(sql,args){queries.push(sql);if(sql.startsWith('SELECT failures'))return {rows:[]};if(sql.startsWith('SELECT id FROM households'))return {rows:[{id:'house'}]};if(sql.startsWith('INSERT INTO households'))return {rows:[{id:'house'}]};if(sql.startsWith('SELECT revision,payload'))return {rows:[{...state,updated_at:new Date().toISOString()}]};if(sql.startsWith('UPDATE household_sync_state')){if(args[2]!==state.revision)return {rowCount:0,rows:[]};state.payload=JSON.parse(args[0]);state.revision++;return {rowCount:1,rows:[{revision:state.revision,updated_at:new Date().toISOString()}]}}return {rows:[],rowCount:1}},release(){}};
const db={connect:async()=>client,query:(...args)=>client.query(...args)};
const context={require:name=>name==='node:crypto'?crypto:{Pool:class{constructor(){}connect(){return db.connect()}query(...args){return db.query(...args)}}},module:{exports:{}},process:{env:{DATABASE_URL:'postgres://test',SMARTSHOP_SESSION_SECRET:'x'.repeat(40),SMARTSHOP_FAMILY_PASSWORD:'correct-password'}},console,Buffer,Date,JSON,String,Number,URL};
vm.runInNewContext(code,context);
const handler=context.module.exports;
function req(method,body,cookie){return {method,body,headers:{host:'localhost',origin:'https://localhost',cookie:cookie||'', 'x-forwarded-for':'127.0.0.1'}}}
function res(){return {statusCode:200,headers:{},status(x){this.statusCode=x;return this},setHeader(k,v){this.headers[k]=v;return this},json(x){this.body=x;return this}}}
(async()=>{
 let r=res();await handler(req('GET',{}),r);assert.equal(r.statusCode,401);
 r=res();await handler(req('POST',{action:'login',password:'wrong'}),r);assert.equal(r.statusCode,401);
 r=res();await handler(req('POST',{action:'login',password:'correct-password'}),r);assert.equal(r.statusCode,200);let cookie=r.headers['Set-Cookie'].split(';')[0];assert(cookie.includes('smartshop_session='));
 r=res();await handler(req('GET',{},cookie),r);assert.equal(r.statusCode,200);assert.equal(r.body.revision,0);
 r=res();await handler(req('PUT',{revision:0,payload:state.payload},cookie),r);assert.equal(r.statusCode,200);assert.equal(r.body.revision,1);
 r=res();await handler(req('PUT',{revision:0,payload:state.payload},cookie),r);assert.equal(r.statusCode,409);
 r=res();await handler(req('PUT',{revision:1,payload:{zones:[],shopping:[]}},cookie),r);assert.equal(r.statusCode,400);
 console.log('API integration checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
