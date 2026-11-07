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
