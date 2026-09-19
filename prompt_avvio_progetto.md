CONTESTO PROGETTO "METEO BALCONE"

Obiettivo: PWA + bot Telegram che controlla il meteo e avvisa quando pioggia/vento minacciano piante sul balcone.
Budget: 0€.
Stack: GitHub (Actions + Pages + branch "db" come database JSON), Open-Meteo (meteo), Telegram Bot API, Groq (LLM opzionale).
Linguaggio backend: Python 3.11.
Frontend: HTML/CSS/JS vanilla (PWA).
Ambiente: io non so programmare, uso vibe coding. Ho bisogno di istruzioni passo-passo, comandi esatti da copiare, e file completi (non frammenti).
Vincoli noti: cron GitHub funziona solo su repo pubblici; workflow disabilitati dopo 60gg di inattività; token GitHub solo nei Secrets; Telegram max 1 msg/s per chat.
Fase attuale: [INSERISCI FASE]

REGOLE DI OUTPUT:
- Dammi file completi, pronti da copiare, non frammenti.
- Non spiegare cosa fa il codice se non te lo chiedo.
- Se servono azioni manuali da parte mia (click su siti, creazione account), elencale come "AZIONI MANUALI" numerate.
- Se servono comandi da terminale, mettili in blocchi di codice separati.
- Non fare domande di chiarimento: se manca un dato, scegli tu il default più sensato e segnalalo come "SCELTA PREDEFINITA".

Usando il CONTESTO PROGETTO, genera la struttura completa del repository "meteo-balcone".

Voglio che tu produca:
1. L'albero completo delle cartelle e dei file (formato testo).
2. Il contenuto ESATTO di questi file base:
   - .gitignore (adatto a Python + Node + macOS/Windows)
   - README.md (semplice, con placeholder per ora)
   - backend/requirements.txt (solo: requests)
   - backend/weather_checker.py (scheletro con TODO e commenti, non logica)
   - frontend/index.html (scheletro PWA minimale con manifest link)
   - frontend/manifest.json (PWA base)
   - db/piante.json (array vuoto [])
   - db/regole.json (oggetto con soglie default per profili Robusta/Media/Delicata)
   - db/stato.json (oggetto con ultimo_controllo: null, ultimi_avvisi: {})

NON spiegare il codice. Voglio solo i file completi in blocchi separati, con il percorso del file come titolo.

Usando il CONTESTO PROGETTO, definisci lo schema dati definitivo del progetto.

Genera i 3 file JSON completi e popolati con dati di esempio realistici:
1. db/piante.json — almeno 3 piante di esempio (una per profilo: Robusta, Media, Delicata). Ogni pianta deve avere: id, nome, profilo, posizione, note, data_aggiunta.
2. db/regole.json — soglie vento/pioggia per i 3 profili + orari report (mattina/sera) + modalità notturna (inizio/fine) + soglia allerte critiche.
3. db/stato.json — stato vuoto iniziale con: ultimo_controllo, ultimo_report_mattina, ultimo_report_sera, avvisi_inviati (oggetto per deduplicazione).

Regole:
- Usa ID numerici interi per le piante.
- Le soglie vento in km/h, pioggia in mm/h.
- Aggiungi un campo "versione_schema": 1 in ogni file.
- Commenta lo schema (in un blocco separato, non dentro il JSON) con una tabella che spiega ogni campo.

NON aggiungere altri file. Voglio solo i 3 JSON completi + la tabella dello schema.

Usando il CONTESTO PROGETTO, dammi la guida operativa completa per le AZIONI MANUALI che devo fare io prima di procedere con lo sviluppo.

Elenca in ordine, numerate, con istruzioni precise:
1. Creazione repository GitHub pubblico "meteo-balcone" (con screenshot mentali: dove cliccare, cosa scrivere).
2. Creazione bot Telegram tramite @BotFather (comandi esatti da inviare, cosa copiare).
3. Come ottenere il mio chat_id Telegram tramite @userinfobot (comandi esatti).
4. Creazione Personal Access Token GitHub con gli scope corretti (quali spunte mettere, cosa copiare).
5. Dove salvare ogni credenziale in modo sicuro (file .env locale da NON committare, + promemoria).
6. Creazione account Groq e ottenimento API key (opzionale, ma includilo).

Per ogni azione:
- Titolo chiaro.
- Passi numerati.
- Cosa copiare e dove incollarlo.
- Come verificare che l'azione sia andata a buon fine.

NON spiegare perché. Voglio solo la procedura operativa. Formato: lista numerata con sottopunti.

Usando il CONTESTO PROGETTO, dammi la procedura esatta per configurare i GitHub Secrets nel repository "meteo-balcone".

Voglio:
1. La lista ESATTA dei secrets da creare, con nome esatto (maiuscolo, underscore) e descrizione di cosa contiene ciascuno:
   - TELEGRAM_TOKEN
   - CHAT_ID
   - PAT_TOKEN (Personal Access Token GitHub)
   - GROQ_API_KEY
2. La procedura passo-passo per aggiungerli (Settings > Secrets and variables > Actions > New repository secret).
3. Un blocco di codice Python di esempio che legge questi secrets da os.environ e verifica che esistano, stampando un messaggio chiaro se mancano.
4. Un promemoria sulle regole di sicurezza: mai committare i secrets, mai metterli nel frontend, ruotarli se esposti.

NON aggiungere altri secrets. Formato: lista + procedura + blocco codice + promemoria.

Usando il CONTESTO PROGETTO, scrivi il README.md completo per il repository "meteo-balcone".

Il README deve contenere:
1. Titolo + descrizione breve (2 righe).
2. Badge stato progetto (placeholder).
3. Architettura: diagramma ASCII semplificato dei componenti (GitHub, Open-Meteo, Telegram, Groq).
4. Stack tecnologico (tabella).
5. Struttura del repository (albero cartelle).
6. Setup rapido: rimando al file SETUP.md (che creeremo dopo).
7. Come funziona il bot (breve: cron, lettura regole, valutazione, notifica).
8. Profili piante (tabella Robusta/Media/Delicata con soglie).
9. Limiti noti e mitigazioni (tabella).
10. Roadmap (checkbox con fasi).
11. Licenza (MIT).

Formato: markdown pulito, senza fronzoli. Non inventare funzionalità non presenti nel contesto. Voglio il file completo.

Usando il CONTESTO PROGETTO, genera il file .github/workflows/weather.yml scheletro.

Il workflow deve:
1. Chiamarsi "Weather Check".
2. Avere due trigger:
   - schedule: cron ogni 30 minuti ('*/30 * * * *')
   - workflow_dispatch (manuale)
3. Eseguire su ubuntu-latest.
4. Fare checkout del branch "db" (non del main).
5. Impostare Python 3.11.
6. Installare le dipendenze da backend/requirements.txt.
7. Eseguire backend/weather_checker.py passando i secrets come variabili d'ambiente.
8. Aggiungere un timeout di 5 minuti al job.
9. Aggiungere un job separato "keep-alive" schedulato il primo del mese che fa un commit vuoto per mantenere il repo attivo.

Regole:
- Commenta ogni sezione con un commento YAML chiaro.
- Non inventare step non richiesti.
- Il file deve essere pronto per essere committato così com'è.

Voglio il file YAML completo.

Usando il CONTESTO PROGETTO e quanto fatto finora, dammi una CHECKLIST DI VERIFICA per la fase di setup.

La checklist deve permettermi di verificare, punto per punto, che tutto sia a posto:
1. Repository pubblico creato e visibile.
2. Branch "db" creato e popolato con i 3 JSON.
3. Secrets configurati correttamente (lista con nome esatto).
4. Bot Telegram creato e token valido (test: invia un messaggio dal bot a te stesso).
5. Chat ID ottenuto e corretto.
6. PAT GitHub con scope corretti e non scaduto.
7. Workflow GitHub Actions presente e visibile nella tab Actions.
8. Workflow eseguibile manualmente (workflow_dispatch) senza errori.
9. GitHub Pages configurato (per dopo).
10. Groq API key valida (test: chiamata di prova).

Per ogni punto:
- Cosa verificare esattamente.
- Come verificarlo (comando, click, o controllo visivo).
- Cosa fare se fallisce (rimando al prompt che lo ha generato).

Formato: checklist con caselle [ ], divisa per categoria. NIENTE spiegazioni lunghe.