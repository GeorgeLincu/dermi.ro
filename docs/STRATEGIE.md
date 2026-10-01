# Strategie dermi.ro: vizibilitate pentru un medic dermatolog

Document de lucru pentru Dr. Mădălina Iulia Lincu și George. Recomandările se bazează pe ce fac bine
site-urile medicale de referință (DermNet, American Academy of Dermatology, NHS, Mayo Clinic) și
creatorii de conținut dermatologic de succes. Toate respectă regulile de mai jos.

## Regulile care nu se negociază

1. **Codul de deontologie medicală al CMR**: informare, nu reclamă. Fără garanții de rezultat, fără
   comparații cu alți medici, fără mărturii ale pacienților folosite promoțional.
2. **Medicamentele pe rețetă** (inclusiv toxina botulinică) nu se promovează către public.
3. **Produsele cosmetice**: fără afirmații interzise de Reg. (UE) 1223/2009 și 655/2013.
4. **Fără conținut inventat**: recenziile false sunt ilegale (Directiva Omnibus, Legea 363/2007).
5. **Datele de sănătate** (fotografii, simptome) sunt date sensibile (GDPR art. 9): doar cu acord
   scris explicit, niciodată prin e-mail sau formular.

## 1. Încredere (E-E-A-T): cel mai important pentru Google la subiecte medicale

Google tratează sănătatea ca subiect „Your Money or Your Life”, unde contează cine scrie.

- [ ] **Pagina Despre completă**: fotografie profesională, cod CMR (cu link la registrul public),
      studii, rezidențiat, competențe (de ex. dermatoscopie, estetică), unde profesează, limbi.
      Totul se completează în `src/config.ts` și apare automat și în datele pentru Google.
- [ ] **Revizia medicală vizibilă**: fiecare articol publicat de Dr. Mădălina, cu data actualizării.
- [ ] **Surse la vedere**: deja există în fiecare articol. Linkurile se completează la revizie.
- [ ] **Profiluri externe consistente**: același nume, aceeași specialitate și aceeași fotografie pe
      LinkedIn, pe pagina clinicii și pe Google Business Profile.

## 2. Conținut: grupuri de teme (topic clusters)

Site-urile de succes au un **ghid principal** pe fiecare temă și articole scurte care trimit spre el.

| Temă | Ghid principal | Articole-satelit (exemple) |
|---|---|---|
| Acnee | Acneea la adulți | mituri, cicatrici post-acnee, acid azelaic, retinoizi |
| Pete și pigmentare | Cum previi petele pigmentare | melasma, vitamina C, protecție solară |
| Alunițe și cancer de piele | Alunițele: semne de alarmă | dermatoscopia, protecția solară la copii |
| Estetică | Îmbătrânirea pielii: ce funcționează | toxina botulinică, fillere, peeling, laser |
| Rutine | Rutina de îngrijire de bază | piele sensibilă, iarnă, sarcină |

Ritm realist: **2 articole pe lună**, revizuite atent, sunt mai valoroase decât 10 nerevizuite.
Primele de publicat: cele cu cea mai mare căutare în România (acnee, alunițe, căderea părului,
dermatită atopică, protecție solară, rozacee).

## 3. Funcții noi, în ordinea recomandată

### a) Programări online (cel mai mare impact)
- Simplu: un link spre sistemul de programări al clinicii unde profesează Dr. Mădălina. Se pune în
  `src/config.ts` → `bookingUrl`, iar butonul „Programează o consultație” apare peste tot.
- Fără formulare care colectează simptome sau poze pe site.

### b) Google Business Profile (dacă există un loc de consultație)
- Apare în Google Maps și în căutările „dermatolog + oraș”.
- Recenziile trebuie să fie **reale**; nu se cer recenzii în schimbul unor beneficii.

### c) Consultații online
- Telemedicina în România are reguli proprii (consimțământ, platformă sigură, documentare).
  Recomand o platformă de telemedicină autorizată, nu e-mail sau WhatsApp. **De verificat cu CMR și
  cu un jurist înainte de lansare.**

### d) Recomandări de produse și linkuri afiliate
- **Întâi întrebați CMR** dacă și în ce condiții un medic poate recomanda produse comerciale.
- Dacă da: pagini separate („Recomandări”), marcate clar ca afiliere sau sponsorizare, niciodată în
  articolele despre boli; criterii transparente (ingrediente, dovezi), nu „cel mai bun produs”.
- Pagina de informații legale se actualizează în aceeași zi.

### e) Newsletter (mai târziu)
- Doar cu dublă confirmare (double opt-in), un furnizor conform GDPR, dezabonare cu un clic.
- Politica de confidențialitate și CSP-ul site-ului se actualizează înainte.

## 4. Vizibilitate în afara site-ului

- **Video scurt** (Instagram Reels, TikTok, YouTube Shorts): un mit demontat, o întrebare de la
  consultație (fără date despre pacienți), cu link spre articol. Este canalul prin care cresc cei
  mai cunoscuți dermatologi online.
- **Distribuire**: fiecare articol are imagine proprie pentru Facebook, WhatsApp și LinkedIn.
- **Agenți AI** (ChatGPT, Claude, Perplexity, Gemini): site-ul le oferă `llms.txt` și versiuni
  Markdown ale articolelor. Articolele clare, cu surse și autor medic, sunt citate mai des.

## 5. Securitate și continuitate

- [ ] **2FA sau passkeys** pe GitHub, Cloudflare, Gmail (ambele conturi) și la registrar (RoTLD).
- [ ] **Blocarea domeniului și reînnoirea automată** pentru dermi.ro.
- [ ] **Tokenurile** (Cloudflare, GitHub) au dată de expirare. Puneți-vă reminder în calendar.
- [ ] **Backup**: codul și articolele sunt în GitHub (cu istoric complet). Fișierele din zona
      privată (R2) se pot descărca periodic din `/vault/`. Recomand o dată pe lună, pentru
      documentele importante.
- [ ] **Evidența imaginilor**: `docs/IMAGE-RIGHTS.md`, câte un rând pentru fiecare fotografie.

## 6. Ce măsurăm

- Google Search Console: afișări, clicuri și pozițiile pe căutările importante, lunar.
- Cloudflare Web Analytics (fără cookie-uri): articolele cele mai citite.
- Câte programări vin de pe site (de întrebat pacienții noi „de unde ați aflat de noi?”).
