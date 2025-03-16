# Budjettisovellus

 Budjettisovellus on käyttäjäystävällinen verkkosovellus, joka auttaa seuraamaan **tuloja**, **menoja** ja **säästöjä** kuukausi- ja vuositasolla. Käyttäjät voivat luoda, muokata ja poistaa budjettejaan sekä tarkastella taloudellista tilannettaan helposti.

**Live-demo**: [TÄHÄN VERCELIN URL](https://your-app.vercel.app)

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

Käy testaamassa sovellus täältä! [TÄHÄN VERCELIN URL](https://your-app.vercel.app)