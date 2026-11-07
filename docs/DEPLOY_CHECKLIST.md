# Smart Shop – első éles telepítés előtti ellenőrzés

## Jelenlegi állapot
- GitHub: https://github.com/FasiSandor/lidl-smart-shop
- Fejlesztési ág: feat/touch-map-editor-v2
- Neon projekt: jolly-term-22887567, adatbázis: smartshop
- Vercel: **nincs projekt és nincs telepítés**
- Az alkalmazás offline része localStorage-alapú, a családi sync manuális, nem real-time.
- A szinkron egyetlen **közös családi jelszót** használ. Nem személyenkénti hozzáférés.

## Kötelező titkok (csak Vercel Environment Variables)
- `DATABASE_URL`: Neon Postgres kapcsolat (server only)
- `SMARTSHOP_SESSION_SECRET`: minimum 32 karakter, kriptográfiailag véletlen
- `SMARTSHOP_FAMILY_PASSWORD`: minimum 12 karakter, egyedi családi jelmondat

Ne írd a GitHubba, ne add meg a kliensoldali JS-ben és ne exportáld őket. Az .env.example csak helyőrzőket tartalmaz.

## Első élesítés
1. GitHub Actions zöld státusz és PR átnézése.
2. Külön Vercel-projekt importálása ugyanebből a GitHub-repóból; importáláskor **először** beállítani a három titkot.
3. A GitHub/Vercel branch-deploy beállításokat ellenőrizni; a fejlesztési ágon ne induljanak véletlen Preview-deployok.
4. A PR egyesítése csak teszt és jóváhagyás után; összevont egyszeri production deploy.
5. Telefonon és asztali böngészőben tesztelni: login/logout, téves jelszó, jelszópróbálkozás-zárolás, helyi lista, export/import, első feltöltés, második készülék letöltése, konfliktus (409), visszavonás, touch húzás.
6. iPhone főképernyőikon PNG-k (192/512/180) elkészítése és telepítés tesztje.
7. Adatvesztési forgatókönyv: helyi lista exportja, visszaállítása, szerveradatok megőrzése.

## Korlátok
- A Neon adatbázis létrejött, de a szerveroldali kapcsolatot **nem teszteltük éles Vercel-környezetben**.
- A közös jelszavas megoldás családon belüli MVP; egyéni felhasználói fiókokhoz további auth szükséges.
- A böngészőben a szinkron manuális. Offline konfliktusoknál nincs automatikus összeolvasztás.
- Nincs Lidl API vagy élő akciófigyelés; a bolti térkép sematikus.
- A PWA SVG-ikon megvan, PNG-változatok hiányoznak.
