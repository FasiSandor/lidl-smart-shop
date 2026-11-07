# Smart Shop – Lidl Mezőtúr

Fejlesztési prototípus: öt polcsor, mindkét oldalon elülső/hátsó szakasz, középső keresztátjáró, bejárati akciós zóna, zöldségpult, hátsó hűtősor.

## Funkciók
- Szakasz kiválasztása, termékcsoportok felvétele, törlése, áthelyezése és átrendezése.
- Egérrel drag-and-drop, telefonon érintéses áthúzás kísérleti támogatása, gombos alternatíva.
- Egyszerű bevásárlólista bolti szakaszok szerinti besorolással.
- Helyi mentés és JSON export/import.

## Korlátok
- **Nincs éles Lidl-akciófigyelés, Lidl Plus integráció, felhasználói azonosítás vagy családi szinkron.**
- Az adat kizárólag az adott böngésző localStorage tárhelyén marad.
- A bolti bal/jobb pozíciók még ellenőrzendők; az útvonal még nem valós térbeli optimalizáció.
- Az iPhone-os drag-and-drop tesztelendő; minden mozgatás gombokkal is elvégezhető.
- PWA-ikonok még hiányoznak, telepítés előtt pótlandók.

## Fejlesztési szabályok
A WEBAPPOK_KOZPONTI_SZABALYOK.md projektforrás irányadó. A további fejlesztés külön ágon történjen, automatikus Vercel-deploy nélkül. A meglévő adatok és működés megőrzendők. A mentés-visszaállítás teljeskörű tesztje és a családi jogosultságkezelés szükséges az éles használathoz.

## Állapot
V1 GitHub forrás; **nincs Vercel deploy**. Következő mérföldkő: valódi touch DnD teszt, Neon adatmodell, családi bejelentkezés/szinkron, üzlet-térkép finomítás, akcióforrások jogszerű ellenőrzése.
