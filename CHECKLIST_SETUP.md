# Checklist di verifica - Fase di setup

Usa questa checklist **dopo** aver completato `SETUP.md`. Ogni punto fallito rimanda al prompt che lo ha generato.

## 1. Repository GitHub

- [ ] **Repo pubblico creato e visibile**
  - Verifica: apri `https://github.com/emilianofeletti-design/meteobot_telegram` in finestra anonima: deve essere visibile senza login e mostrare l'etichetta **Public**.
  - Comando (la GitHub CLI `gh` non e' installata su questo PC): `(Invoke-RestMethod 'https://api.github.com/repos/emilianofeletti-design/meteobot_telegram').visibility` -> atteso `public`
  - Nota: il repository e' **gia' stato creato** in fase di preparazione, non va ricreato.
  - Se fallisce -> prompt "1. Verifica del repository GitHub".

- [ ] **Remote locale puntato al repository giusto**
  - Verifica: `git remote -v` deve mostrare `origin https://emilianofeletti-design@github.com/emilianofeletti-design/meteobot_telegram.git (fetch)` e la stessa riga con `(push)`.
  - Nota: se mostra `mycoach1976/telegram-bot`, il codice e' stato pushato sull'account sbagliato -> SETUP.md, azione 7 CASO B e azione 9.
  - Se fallisce -> prompt "1. Verifica del repository GitHub" + azione 9 autenticazione.

- [ ] **Branch `db` creato e popolato con i 3 JSON**
  - Verifica: nel selettore branch compare `db`; dentro `db/` ci sono `piante.json`, `regole.json`, `stato.json`.
  - Comando: `git ls-remote --heads origin` -> attesi `refs/heads/main` e `refs/heads/db`
  - Nota: il branch `db` viene creato con `git checkout -b db` (SETUP.md, azione 7), non dal selettore branch della UI.
  - Se fallisce -> prompt "1. Verifica del repository GitHub" (sostituisce la creazione da UI).

- [ ] **File di struttura committati sul branch `main`**
  - Verifica: su `main` esistono `.github/workflows/weather.yml`, `backend/`, `frontend/`, `README.md`, `SETUP.md`.
  - Se fallisce -> prompt "1. Struttura completa del repository".

## 2. Secrets

- [ ] **Secrets configurati correttamente**
  - Verifica: Settings > Secrets and variables > Actions: devono apparire esattamente `TELEGRAM_TOKEN`, `CHAT_ID`, `PAT_TOKEN`, `GROQ_API_KEY` (i valori non sono visibili, solo i nomi).
  - Se fallisce -> prompt "4. Configurazione GitHub Secrets".

## 3. Telegram

- [ ] **Bot creato e token valido**
  - Verifica: apri `https://api.telegram.org/bot<IL-TUO-TOKEN>/getMe` nel browser: deve rispondere `"ok":true` con lo username del bot.
  - Test: apri la chat del tuo bot su Telegram e invia `/start`.
  - Se fallisce -> prompt "2. Creazione bot Telegram tramite @BotFather".

- [ ] **Chat ID ottenuto e corretto**
  - Verifica: apri `https://api.telegram.org/bot<IL-TUO-TOKEN>/getUpdates` dopo aver scritto al bot: deve contenere `"chat":{"id":<numero>}` uguale al valore del secret `CHAT_ID`.
  - Se fallisce -> prompt "3. Come ottenere il chat_id con @userinfobot".

## 4. GitHub PAT

- [ ] **PAT con scope corretti e non scaduto**
  - Verifica: `curl.exe -s -H "Authorization: Bearer <PAT>" https://api.github.com/user` deve restituire `"login":"emilianofeletti-design"`; su GitHub: Settings > Developer settings > Personal access tokens: la data di scadenza non deve essere passata e gli scope devono includere `repo` e `workflow`.
  - Nota: il PAT deve appartenere all'account emilianofeletti-design, non a un altro account (altrimenti il workflow fallisce con `403`).
  - Se fallisce -> prompt "4. Creazione Personal Access Token GitHub".

## 5. Workflow

- [ ] **Workflow presente e visibile nella tab Actions**
  - Verifica: tab **Actions** del repo: nella lista laterale deve comparire "Weather Check".
  - Nota: se non compare, il file `.github/workflows/weather.yml` deve esistere sul branch **default (`main`)**, non solo su `db`.
  - Se fallisce -> prompt "7. Workflow GitHub Actions weather.yml".

- [ ] **Esecuzione manuale senza errori**
  - Verifica: Actions > Weather Check > Run workflow (branch `main`) > il job "Controllo meteo e notifiche Telegram" diventa verde; nel log lo step "Verifica secrets" stampa `OK: tutti i secrets obbligatori sono presenti.`
  - Se fallisce -> prompt "4. Configurazione GitHub Secrets" oppure "7. Workflow GitHub Actions weather.yml".

## 6. GitHub Pages

- [ ] **Pages configurato (per la FASE 3)**
  - Verifica: Settings > Pages: Source = "Deploy from a branch", Branch = `main`, Folder = `/frontend`. Dopo il deploy `https://emilianofeletti-design.github.io/meteobot_telegram/` mostra "Meteo Balcone".
  - Se fallisce -> prompt "8. Configurazione GitHub Pages".

## 7. Groq (opzionale)

- [ ] **API key valida**
  - Verifica comando sotto: deve rispondere `"object":"chat.completion"` (o almeno non contenere "invalid_api_key").
  - Se fallisce -> prompt "6. Creazione account Groq e API key".

```bash
curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer <LA-TUA-GROQ-API-KEY>" -o groq_test.json; type groq_test.json
```

## 8. Verifica locale finale

- [ ] **JSON validi**
  - Comando (PowerShell):
```powershell
Get-ChildItem db\*.json | ForEach-Object { python -c "import json,sys; json.load(open(sys.argv[1], encoding='utf-8')); print('OK', sys.argv[1])" $_.FullName }
```

- [ ] **Script backend sintatticamente corretto**
```powershell
python -m py_compile backend\weather_checker.py backend\check_secrets.py; echo "OK sintassi"
```

- [ ] **`check_secrets.py` si comporta come previsto senza secrets configurati**
  - Verifica: deve stampare `[MANCANTE]` per i 3 secrets obbligatori e uscire con codice 1.
```powershell
python backend\check_secrets.py; echo "exit code: $LASTEXITCODE"
```

- [ ] **`.env` e `.kilo` non sono tracciati dal repo**
  - Verifica: il comando non deve stampare nulla.
```powershell
git ls-files | Select-String -Pattern "^\.env$|^\.kilo"
```

- [ ] **Branch remoti presenti**
  - Verifica: deve stampare `refs/heads/db` e `refs/heads/main`.
```powershell
git ls-remote --heads origin
```