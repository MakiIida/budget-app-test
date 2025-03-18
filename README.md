# Budjettisovellus

 Budjettisovellus on käyttäjäystävällinen verkkosovellus, joka auttaa seuraamaan **tuloja**, **menoja** ja **säästöjä** kuukausi- ja vuositasolla. Käyttäjät voivat luoda, muokata ja poistaa budjettejaan sekä tarkastella taloudellista tilannettaan helposti.

**Live-demo**: (https://youtu.be/h4M2ejz-C_0)
**Projektin Backendin repo**: (https://github.com/MakiIida/budget-app-backend)
**Projektin Frontendin repo Vercel**: (https://github.com/MakiIida/budget-app-test)
**Projektin Frontendin repo Lokaalisti**: (https://github.com/MakiIida/budget-app-frontend)

## **Ominaisuudet**
- Käyttäjät voivat **rekisteröityä ja kirjautua sisään**  
- Mahdollisuus **luoda kuukausittaisia budjetteja**  
- Tulojen ja menojen **lisääminen, muokkaaminen ja poistaminen**  
- **Automaattinen säästöjen laskeminen**  
- **Pylväsdiagrammi** näyttää säästöt eri kuukausilta  
- Käyttäjä voi **päivittää profiilitietojaan** ja **poistaa tilinsä**  

## **Käyttöohjeet**
### **Rekisteröidy ja kirjaudu sisään**
- Luo käyttäjätili syöttämällä **nimi, sähköposti ja salasana**  
- Kirjaudu sisään samoilla tunnuksilla  

### **Luo uusi budjetti**
- Valitse kuukausi ja vuosi  
- Syötä suunnitellut **tulot ja menot** eri kategorioihin  
- Tallenna budjetti

### **Lisää tapahtumia**
- Lisää yksittäisiä **tuloja** ja **menoja**. 
- Sovellus **päivittää säästöt automaattisesti**

### **Tarkastele ja muokkaa budjetteja**
- Näet listan tallennetuista budjeteista  
- Voit **muokata** tai **poistaa** budjetteja  
- Visuaalinen pylväsdiagrammi näyttää kertyneet säästöt  

### **Hallinnoi käyttäjätiliä**
- Käyttäjä voi **päivittää käyttäjänimen tai salasanan**  
- Mahdollisuus **poistaa tili pysyvästi**

## **Teknologiat**
- **Front-end:** React, React Router, Recharts  
- **Back-end:** Node.js, Express.js, PostgreSQL  
- **Autentikaatio:** JWT (JSON Web Token)  
- **Tietokanta:** PostgreSQL  
- **Hosting:**  
  - Back-end: **Render**  
  - Front-end: **Vercel**  

## **Asennusohjeet (lokaali kehitys)**
Jos haluat ajaa sovelluksen paikallisesti, noudata näitä ohjeita:

### **Kloonaa front-end**
```bash
git clone https://github.com/MakiIida/budget-app-frontend
cd budget-app-frontend
npm install
npm start
```
### **Kloonaa back-end**
```bash
git clone https://github.com/MakiIida/budget-app-backend
cd budget-app-backend
npm install
npm start
```
### **Asenna riippuvuudet**
```bash
cd frontend
npm install
```
### **Käynnistä kehityspalvelin**
```bash
npm start
```

Käy testaamassa sovellus täältä! (https://budget-app-frontend-rguazeqqj-makiiidas-projects.vercel.app/)

## **Tuntikirjanpito**

| Päivämäärä | Työtunnit | Mitä tein? |
|------------|----------|------------|
| 15.2.      | 4        | Projektin alustus ja Supabase-tietokannan testaus. |
| 16.2.      | 4        | Supabase (ei toimi), vaihdetaan PostgreSQL Render-palveluun. Yhteyden testaaminen ja alustavat tietokantataulut määritetty. Ensimmäiset tietokantakyselyt testattu. |
| 17.2.      | 6        | PostgreSQL-kannan asennus ja yhdistäminen backend-sovellukseen. REST API:n ensimmäisten POST- ja GET-reittien toteutus sekä testaus. Lisätty validointeja POST- ja PUT-pyyntöihin käyttäen express-validator-kirjastoa. |
| 18.2.      | 5        | Toteutettu ja testattu PUT- ja DELETE-reitit. Lisätty käyttäjäautentikointi ja käyttöoikeuksien hallinta: rekisteröinti, kirjautuminen ja salasanojen tallennus tietokantaan bcrypt.js-kirjastolla. Toteutettu kirjautumisen yhteydessä JWT-tokenin luonti ja sen käyttö reittien suojaamiseen. Testattu kaikkien toimintojen onnistuminen PowerShellin kautta. |
| 19.2.      | 5        | Frontend aloitus. React-projektin perusrakenne ja ensimmäiset komponentit. |
| 20.2.      | 7        | React-komponenttien optimointi ja debuggaus. Korjattu tilanhallintaan liittyviä ongelmia ja optimoitu komponenttien uudelleenrenderöinti sekä frontendissä että backendissä. Selvitetty käyttäjätietojen näkymiseen liittyvä virhe (tekstivärit) ja parannettu state-hallintaa. |
| 21.2.      | 5        | Sovelluksen toiminnallisuuksien suunnittelu. Määritelty tarvittavat komponentit ja niiden väliset suhteet, hahmoteltu sovelluksen perustoiminnot. |
| 22.2.      | 7        | Navigoinnin ja budjetti-sivun toteutus. Lisätty navigointi eri näkymien välillä ja luotu new-budget sivu. |
| 23.2.      | 8        | Tietokantayhteyden vianmääritys ja uusien taulujen: budgets, transactions ja categories lisäys. |
| 24.2. | 7 | Backendin ja frontendin yhdistäminen tietokannan kanssa GET, DELETE, POST-reitit lisätty ja testattu. |
| 25.2. | 5 | Budjetin tallennuksen ja käyttöliittymän parannukset ja bugien selvittelyä. |
| 26.2. | 5 | Budjetin tallennuksen ja käyttöliittymän parannukset: transactions-taulu. |
| 27.2. | 5 | Budjetin tallennuksen ja käyttöliittymän parannukset: uusi toiminto, "lisää uusi yksittäinen tapahtuma". |
| 28.2. | 5 | Toiminnon "Lisää yksittäinen tapahtuma" kehitystyö. |
| 1.3. | 5 | Lisätty toiminto: "Tallennetun budjetin muokkaus". |
| 2.3. | 5 | Toiminnon "Tallennetun budjetin muokkaus" kehitystyö jatkuu. |
| 3.3. | 5 | Käyttöliittymän kehittäminen sivuilla: login ja register. |
| 4.3. | 4 | Käyttöliittymän kehitys sivulla new-budget: debug uuden tapahtuman lisääminen ja tallennus tietokantaan. |
| 5.3. | 5 | Käyttöliittymän kehitys sivulla new-budget: tietokantayhteydet korjattu. |
| 6.3. | 5 | Käyttöliittymän kehitys sivulla new-budget: debug tallenna budjetti. |
| 7.3. | 7 | Käyttöliittymän kehitys sivulla new-budget. Toiminto tallenna budjetti korjattu. |
| 8.3. | 5 | Käyttöliittymän kehitys ja tyylittely sivulla new-budget. |
| 9.3. | 4 | Käyttöliittymän kehitys sivuilla: dashboard, new-budget, register ja login. |
| 10.3. | 7 | Käyttöliittymän kehitys sivuilla budget-list. SQL-kysely: menot päivitetty. Tiedostojen siistiminen. |
| 11.3. | 8 | Käyttöliittymän kehitys sivulla edit-budget. SQL-kysely: tulot päivitetty. |
| 12.3. | 8 | Käyttöliittymän kehitys sivuilla budget-list ja edit-budget. Lisätty toiminto: savings + graafi. |
| 13.3. | 8 | Käyttöliittymän kehitys sivuilla: savings ja settings. Tiedostojen siistiminen. |
| 14.3. | 8 | Käyttöliittymän kehitys sivuilla: settings, register ja savings. |
| 15.3. | 7 | Testattu toiminto käyttäjätietojen päivitys ja tilin poistaminen. Backendissä lisätty reitti käyttäjätietojen päivitykseen ja tilin poistamiseen, korjattu autentikointi ja tietokantakyselyt vastaamaan uusia käyttäjätietokenttiä. Tiedostojen siistiminen. |
| 16.3. | 5 | Backendin päivittäminen Renderiin. Frontendin vieminen Verceliin: muutokset API-kutsuihin. README.md käyttöohjeet ja kuvaus projektista. |
| 17.3. | 3 | Viimeistelytyöt ja palautusversion teko ja palautus. |
| 18.3. | 5 | Korjattu API-kutsut ja päivitetty versio palautuksesta. |

Yhteenlasketut työtunnit: 182 tuntia.