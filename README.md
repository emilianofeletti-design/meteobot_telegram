# Meteo Balcone

PWA collegata a un bot Telegram che controlla il meteo a intervalli regolari e avvisa quando pioggia intensa o vento forte minacciano le piante sul balcone.
Gestione di piante, regole e orari con budget **0&euro;**.

Repository: `https://github.com/emilianofeletti-design/meteobot_telegram`

![Stato progetto](https://img.shields.io/badge/stato-in%20sviluppo-orange)
![Fase](https://img.shields.io/badge/fase-1%20-%20struttura%20repository-blue)
![Licenza](https://img.shields.io/badge/licenza-MIT-green)

---

## Architettura

```
                        GITHUB (ecosistema, 0 euro)
  +----------------------+  +----------------------+  +----------------------+
  | Repository           |  | GitHub Actions       |  | GitHub Pages         |
  | codice + branch "db" |  | cron + backend Py    |  | PWA (UI)             |
  +----------+-----------+  +----------+-----------+  +----------+-----------+
             |                         |                         |
             |                         |                         |
             v                         v                         v
  +-----------------------------------------------------------------------+
  |                     BRANCH "db"  (database JSON versionato)           |
  |        db/piante.json   db/regole.json   db/stato.json                |
  +-----------------------------------------------------------------------+
                                       |
                                       v
  +----------------------+  +----------------------+  +----------------------+
  | Open-Meteo           |  | Telegram Bot API     |  | Groq LLM (opzionale) |
  | previsioni meteo     |  | notifiche            |  | riassunti naturali   |
  +----------------------+  +----------------------+  +----------------------+
```

**Flusso:** la PWA (GitHub Pages) mostra lo stato letto dal branch `db` -> il cron di GitHub Actions esegue `backend/weather_checker.py` -> lo script legge i JSON, chiama Open-Meteo, confronta i dati con le soglie -> invia i messaggi su Telegram -> riscrive `db/stato.json` per la deduplicazione.

---

## Stack tecnologico

| Componente | Tecnologia | Costo | Limiti free |
|---|---|---|---|
| Scheduler + Backend | GitHub Actions | 0&euro; | 2000 min/mese (privato), illimitato (pubblico) |
| Frontend PWA | GitHub Pages | 0&euro; | 1 GB sito, 100 GB/mese banda |
| Database | Branch Git (JSON) | 0&euro; | Illimitato (versionato) |
| API Meteo | Open-Meteo | 0&euro; | ~10.000 chiamate/giorno |
| Bot | Telegram Bot API | 0&euro; | ~30 msg/s globali, 1 msg/s per chat |
| LLM (opzionale) | Groq | 0&euro; | 30 req/min, 14.400 req/giorno |
| Stazione meteo (opz.) | ESP32 + BME280 | ~15-20&euro; | Hardware unico |

---

## Struttura del repository

```
meteobot_telegram/
├── .github/
│   └── workflows/
│       └── weather.yml          # cron ogni 30 min + keep-alive mensile
├── backend/
│   ├── requirements.txt         # dipendenze Python (requests)
│   ├── weather_checker.py       # scheletro del backend (logica in FASE 2)
│   └── check_secrets.py         # verifica presenza dei secrets
├── frontend/
│   ├── index.html               # PWA: dashboard, piante, regole
│   ├── app.js                   # logica frontend (lettura JSON da raw.githubusercontent)
│   ├── styles.css               # stile PWA
│   ├── sw.js                    # service worker (uso offline)
│   ├── manifest.json            # manifest PWA
│   └── icons/
│       └── icon.svg             # icona PWA (SVG, sizes "any")
├── db/
│   ├── piante.json              # elenco piante (branch "db")
│   ├── regole.json              # soglie profili, orari, modalita notturna
│   └── stato.json               # ultimo controllo e avvisi inviati
├── .env.example                 # modello per le credenziali locali
├── .gitignore
├── LICENSE                      # MIT
├── README.md
├── SETUP.md                     # azioni manuali + GitHub Secrets
├── SCHEMA_DATI.md               # schema dei 3 file JSON
└── CHECKLIST_SETUP.md           # checklist di verifica della fase di setup
```

---

## Setup rapido

Segui **`SETUP.md`**: contiene le azioni manuali da fare su GitHub, Telegram e Groq, la creazione dei GitHub Secrets e i comandi esatti da copiare.
Alla fine usa **`CHECKLIST_SETUP.md`** per verificare che tutto sia a posto.

---

## Come funziona il bot

1. **Cron:** GitHub Actions esegue `backend/weather_checker.py` ogni 30 minuti (repository pubblico).
2. **Lettura regole:** lo script legge `db/piante.json`, `db/regole.json` e `db/stato.json` dal branch `db`.
3. **Meteo:** chiama Open-Meteo con le coordinate del balcone (`posizione_balcone`).
4. **Valutazione:** confronta vento (km/h) e pioggia (mm/h) con le soglie del profilo di ogni pianta.
5. **Notifica:** invia su Telegram un report silenzioso agli orari configurati e un'allerta sonora quando una soglia viene superata.
6. **Deduplicazione:** salva in `db/stato.json` le chiavi degli avvisi inviati, per non ripetere lo stesso messaggio.

Report programmati: `disable_notification: true`. Allerte: notifica sonora. Di notte (22:00 - 07:00) arrivano solo le allerte critiche.

---

## Profili piante

| Profilo | Soglia vento | Soglia pioggia | Esempi |
|---|---|---|---|
| **Robusta** | 60 km/h | 20 mm/h | Lavanda, rosmarino, agave |
| **Media** | 45 km/h | 15 mm/h | Gerani, petunie, basilico |
| **Delicata** | 30 km/h | 8 mm/h | Foglie larghe, piantine giovani |

---

## Limiti noti e mitigazioni

| Limite | Rischio | Mitigazione |
|---|---|---|
| Cron su repo privato | Non funziona con account free | Repository **pubblico** |
| Inattivita' del repository | Workflow disabilitati dopo 60 giorni | Job `keep-alive` con commit vuoto il primo del mese |
| Ritardi del cron GitHub | Esecuzioni ritardate o saltate | Tolleranza accettata di 5-15 minuti |
| Token GitHub esposto | Accesso non autorizzato | Token solo nei GitHub Secrets, mai nel frontend |
| Rate limit Telegram | Flood wait | 1 messaggio/secondo per chat e deduplicazione |
| Notifiche PWA su iOS | Inaffidabili | Telegram come canale principale |
| CPU limit Cloudflare | 10 ms per invocazione | Solo se si migra su Workers: `waitUntil` e chiamate batch |

---

## Roadmap

- [x] **FASE 0** - Preparazione: account, repository pubblico, bot Telegram, chat ID, API keys
- [x] **FASE 1** - Struttura repository: cartelle, branch `db`, JSON iniziali, secrets
- [ ] **FASE 2** - Backend e cron job: logica `weather_checker.py`, deduplicazione, notifiche, workflow
  - [ ] 2.1 Lettura JSON + Open-Meteo + valutazione soglie
  - [ ] 2.2 Deduplicazione
  - [ ] 2.3 Invio Telegram (report silenziosi + allerte)
  - [ ] 2.4 Workflow `.github/workflows/weather.yml` attivo e testato
  - [ ] 2.5 Test manuale con `workflow_dispatch`
  - [ ] 2.6 Job keep-alive
- [ ] **FASE 3** - PWA frontend
  - [ ] 3.1 Struttura PWA
  - [ ] 3.2 Dashboard con stato attuale e prossimi avvisi
  - [ ] 3.3 Sezione "Le mie piante"
  - [ ] 3.4 Sezione "Regole e orari"
  - [ ] 3.5 Lettura JSON dal branch `db`
  - [ ] 3.6 Deploy su GitHub Pages
  - [ ] 3.7 Service Worker offline
- [ ] **FASE 4** - Integrazione LLM con Groq (opzionale)
- [ ] **FASE 5** - Stazione meteo ESP32 + BME280 (opzionale)
- [ ] **FASE 6** - Testing e rifinitura

---

## Licenza

Distribuito con licenza **MIT**. Vedi il file [LICENSE](LICENSE).