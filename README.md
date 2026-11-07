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


## Termékvízió – családi Lidl-bevásárlás (2026-11-07)
A Smart Shop nem készletnyilvántartó, hanem egyszerű, gyors, iPhone-on kényelmesen használható családi bevásárlóalkalmazás. A kezdőképernyő a bevásárlólista: termék felvétele gépeléssel vagy magyar diktálással, kipipálás vásárláskor, áttekinthető sorok, bolti sorrend.

A második képernyő egy **valódi alaprajzot idéző, felülnézeti, szerkeszthető üzlettérkép** polcokkal, folyosókkal, bejárattal, pénztárakkal, hűtőkkel és akciós területekkel. Kezdetben életszerű, nem hiteles térkép; később a mezőtúri Lidlhez igazítandó. A már ismert 23 bolti szakaszt és termékcsoportokat meg kell tartani. Ismeretlen termék a listára felvehető, és „Nincs elhelyezve” állapotban marad addig, amíg a felhasználó érintéssel vagy húzással polchoz nem rendeli. A következő vásárlásnál a rendszer ezt a besorolást használja. A térképszerkesztés nem zavarhatja a normál vásárlási nézetet.

A család ugyanazt a listát használja, és a **cél az automatikus, ütközésbiztos szinkron**, nem a jelenlegi kézi feltöltés/letöltés. Az offline használhatóság is cél. Ezeket csak tényleges implementálás és teszt után szabad késznek nevezni.

Dizájn: modern, SwiftUI-szerű mobil-webapp, három világos fő területtel (Lista / Térkép / Beállítások), nagy érintési célokkal, minimális technikai zsúfoltsággal. Meglévő helyi adatok, JSON-mentések, Neon-kapcsolat és adatbiztonsági garanciák megőrzendők. GitHubon fejlesztünk, Vercelre csak összevont, tesztelt mérföldkő kerül.
