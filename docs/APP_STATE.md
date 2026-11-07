# Smart Shop – technikai állapot (2026-11-07)

## GitHub
- Repository: FasiSandor/lidl-smart-shop
- Production source: main (offline V1)
- Fejlesztési ág: feat/touch-map-editor-v2
- Vercel-projekt: **nincs**; telepítés nem történt.

## Neon
- Projekt: lidl-smart-shop
- Projektazonosító: jolly-term-22887567
- Adatbázis: smartshop
- Létrehozott táblák: households, household_members, store_zones, store_products, shopping_items.
- A táblák jelenleg **üresek**, a kliens nem csatlakozik hozzájuk.
- Kapcsolati karakterlánc / titok **nem kerülhet** a böngészőbe vagy a GitHubba.

## Következő integrációs mérföldkő
1. Hitelesítés és meghívásos családi tagság kialakítása szerveroldalon.
2. Minden adatlekérésnél és írásnál szerveroldali household-membership ellenőrzés; ne legyen anonim publikus API.
3. Verziózott műveletek, konfliktuskezelés és biztonságos offline→szerver migráció előnézettel.
4. Többkészülékes szinkron és konkurens szerkesztés tesztje.
5. Mobilos drag-and-drop, billentyűzetes alternatíva, JSON export/import tesztek.
6. PWA ikonok 192/512/180, manifest és install teszt.
7. Csak ellenőrzött mérföldkő után egyszeri tervezett Vercel telepítés.

## Jelenlegi képességek
- Helyi, készülékenként külön tárolás localStorage-ben.
- Öt polcsor és külön zónák, manuális termékcsoport-rendezés, visszavonás (max. 30 művelet a munkamenetben).
- Bevásárlólista, JSON export/import.
- Nincs valódi családi szinkron, Lidl Plus integráció, élő akciófigyelés vagy hiteles útvonaloptimalizálás.

## Megőrzési szabály
A V1 elfogadott felülete és a meglévő adatok nem írhatók felül észrevétlenül. A V2 változtatásai külön ágon maradnak a tesztekig. A Neon sémája új, korábbi adatok nélkül.

## 2026-11-07 – bevásárlólista V2
- Bolti szakaszonként csoportosított lista; egyedi tételszerkesztés és törlés; pipált tételek számlálója.
- Az ismeretlen szakaszú tételek külön figyelmeztetést kapnak.
- A lista továbbra is helyi; a Neonhoz nem kapcsolódik, nem szinkronizál.
- A megadott polcsorrend nem tekinthető hitelesen validált üzlettérképnek.

## 2026-11-07 – Családi szinkron MVP (fejlesztési ág)
- Neon: `household_sync_state` (verziózott JSONB állapot) és `auth_login_attempts` (IP-azonosító HMAC, 15 perces zárolás).
- API: `api/sync.js` GET/PUT, POST login/logout. HMAC-aláírt, HttpOnly, Secure, SameSite=Strict munkamenet-cookie; jelszó és szerveroldali session titok kizárólag környezeti változóban.
- Kliens: bejelentkezés, manuális letöltés/feltöltés, felülírás előtti megerősítés. 409-es verzióütközésnél nincs csendes felülírás.
- **Nem automatikus valós idejű szinkron**; azonos családi jelszóval minden résztvevő azonos hozzáférést kap. Egyéni fiók, meghívó, tagsági jogosultság és auditnapló még nincs.
- Nincs Vercel-projekt és nincs production URL. A funkcióhoz `DATABASE_URL`, `SMARTSHOP_SESSION_SECRET` (legalább 32 karakter) és `SMARTSHOP_FAMILY_PASSWORD` (legalább 12 karakter) szükséges a szerveroldali környezetben. A tényleges jelszót soha ne commitoljuk.
- **Telepítés előtt kötelező:** a GitHub Actions ellenőrzése, éles API/integrációs teszt, iPhone használati próba, backup restore teszt, és az ikon PNG 192/512/180 generálása. Az SVG forrás elkészült, a PNG-k még hiányoznak.
- Adatbázisprojekt már létrehozva; semmilyen régi helyi adat nem került automatikusan a szerverre.
- Biztonsági megjegyzés: a családi közös jelszavas modell csak MVP, nem személyenként elkülönített hozzáférés. Erősebb családi tagság és meghívókezelés későbbi mérföldkő.

## V3 spatial floorplan and iPhone navigation (development branch)
- Branch: `feat/ios-floorplan-v3`; do not merge to `main` or deploy without the consolidated milestone review.
- UI: shopping list is the default home screen; fixed three-tab bottom navigation (List / Store map / Data).
- Map: schematic, not a surveyed or official Lidl plan. Five aisle pairs, front and rear segments, cross-walkway, entry, checkout and special zones. All **23 existing zone indices** and product catalog values are preserved in localStorage key `smartshop-v1`.
- Products on the shopping list that cannot be matched to a zone appear in a separate unassigned tray. In map edit mode, drag one onto a shelf with touch or mouse; alternatively tap it and choose a numbered zone. The category is then appended to the existing zone and subsequent matching uses it.
- The map supports horizontal scrolling and +/- zoom; it is not a geometric routing engine and does not claim an accurate Lidl store layout.
- Existing JSON backup/import and explicit manual family sync remain. A remote household copy is only changed when the user explicitly uploads; local changes remain local until then.
- Known limitation: name-based matching can ambiguously map similar products; the zone is stored as a category string in the existing 23-zone data model. For future precise product locations, use a separately versioned mapping with migration and backup tests.
- Release checklist: green GitHub CI, hands-on iPhone Safari touch/zoom/scroll and import/restore verification, confirm existing family data, one consolidated production deployment after explicit approval.
