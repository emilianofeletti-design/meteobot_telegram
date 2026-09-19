# SETUP.md - Guida operativa (azioni manuali + GitHub Secrets)

Tutto quello che devi fare **a mano** prima e dopo aver caricato il codice. I comandi sono da copiare cosi' come sono (PowerShell su Windows).

**SCELTA PREDEFINITA:** il branch principale si chiama `main`, il branch del database si chiama `db`, il repository si chiama `meteobot_telegram` (owner `emilianofeletti-design`) ed e' **gia' stato creato** su GitHub. Il backend usa **Python 3.11**.

---

## PARTE 1 - AZIONI MANUALI

### 1. Verifica del repository GitHub (gia' creato)

Il repository esiste gia': `https://github.com/emilianofeletti-design/meteobot_telegram`. Non va ricreato.

1. Vai su [https://github.com/emilianofeletti-design/meteobot_telegram](https://github.com/emilianofeletti-design/meteobot_telegram).
2. Verifica visibilita': in alto a sinistra, sotto il nome del repository, deve esserci l'etichetta **Public**. In alternativa esegui (la GitHub CLI `gh` **non** e' installata su questo PC, quindi si usa l'API HTTP):
```powershell
(Invoke-RestMethod 'https://api.github.com/repos/emilianofeletti-design/meteobot_telegram').visibility
```
Atteso: `public`. Se stampa `private`, il cron non funzionera': vai in Settings > General > Danger Zone > Change visibility > **Change to public**.
3. Verifica che sia vuoto: la pagina deve mostrare **"This repository is empty"**. Se contiene gia' dei file, prima del push dell'azione 7 esegui `git pull --rebase origin main`.
4. Descrizione: il campo Description deve contenere `bot per ricevere aggiornamenti meteo su telegram` (gia' impostato). Se vuoto: ingranaggio accanto ad "About" > incolla il testo > **Save changes**.
5. **Non** creare i file `db/*.json` a mano dall'interfaccia web: li porta il push dell'azione 7.
6. **Non** creare il branch `db` dal selettore branch: viene creato con `git checkout -b db` nell'azione 7.
7. Verifica finale di questo punto: repository pubblico, vuoto, con `default_branch` = `main`.

### 2. Creazione bot Telegram tramite @BotFather

1. Sul telefono o su desktop, apri Telegram e cerca `@BotFather` (badge blu di verificato).
2. Apri la chat e premi **START**.
3. Invia esattamente questo comando:
```
/newbot
```
4. BotFather risponde chiedendo il nome: invia il nome visualizzato, ad esempio:
```
Meteo Balcone
```
5. Poi chiede lo username (deve finire con `bot`): invia:
```
meteo_balcone_mio_bot
```
6. Se lo username e' libero BotFather risponde con un messaggio tipo:
```
Done! Congratulations on your new bot. You will find it at t.me/meteo_balcone_mio_bot.
Use this token to access the HTTP API:
1234567890:AAH-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
7. Cosa copiare: **tutto** il valore dopo `Use this token to access the HTTP API:` (formato `numero:lettere`). Incollalo nel file `.env` locale come `TELEGRAM_TOKEN`.
8. (Opzionale) Imposta i comandi con questi due messaggi separati:
```
/setdescription
```
poi invia:
```
Avvisi su pioggia e vento per le piante del tuo balcone.
```
9. Verifica: apri nel browser `https://api.telegram.org/bot<IL-TUO-TOKEN>/getMe` sostituendo `<IL-TUO-TOKEN>`. Deve apparire `"ok":true` con `"username":"meteo_balcone_mio_bot"`.
10. Test di invio reale: nella chat del tuo bot premi **START** e invia `/start`. Il bot non rispondera' (il backend non gestisce ancora i comandi in ingresso), ma il messaggio verra' registrato e sara' visibile con `getUpdates` (punto 3).

### 3. Come ottenere il chat_id con @userinfobot

1. In Telegram cerca `@userinfobot`.
2. Apri la chat e premi **START**, oppure invia:
```
/start
```
3. Il bot risponde con i tuoi dati, tra cui:
```
Id: 123456789
```
4. Cosa copiare: solo la parte numerica (puo' essere negativa se e' un gruppo). Incollala nel file `.env` locale come `CHAT_ID` (il valore si mette **senza** virgolette e **senza** spazi).
5. In alternativa (o per conferma) usa il tuo bot:
   - Assicurati di aver scritto almeno un messaggio al tuo bot (punto 2, step 10).
   - Apri `https://api.telegram.org/bot<IL-TUO-TOKEN>/getUpdates`.
   - Cerca `"chat":{"id":` e leggi il numero.
6. Verifica: invia un messaggio di prova dal browser:
```
https://api.telegram.org/bot<IL-TUO-TOKEN>/sendMessage?chat_id=<IL-TUO-CHAT-ID>&text=prova
```
Deve rispondere `"ok":true` e il messaggio "prova" deve arrivare nella chat del bot.

### 4. Creazione Personal Access Token GitHub

1. Vai su [https://github.com/settings/tokens](https://github.com/settings/tokens).
2. Clicca **Generate new token** > **Generate new token (classic)**.
3. Compila:
   - **Note:** `meteobot_telegram backend`
   - **Expiration:** `Custom` e scegli una data a **90 giorni** (o `No expiration` se preferisci, ma e' meno sicuro).
   - **Select scopes:** spunta **`repo`** (l'intero blocco, che include `repo:status`, `repo_deployment`, `public_repo` e `security_events`) e spunta **`workflow`**.
4. Clicca **Generate token**.
5. Cosa copiare: il valore `ghp_...` che appare una sola volta. Incollalo nel file `.env` locale come `PAT_TOKEN`. Se cambi pagina lo perdi e devi rigenerarlo.
6. Verifica (PowerShell), sostituisci `<PAT>`:
```powershell
curl.exe -s -H "Authorization: Bearer <PAT>" https://api.github.com/user
```
Deve apparire il tuo `"login":"emilianofeletti-design"` e **non** deve apparire `"Bad credentials"`.
Attenzione: il PAT deve appartenere all'account **emilianofeletti-design** (quello che possiede il repository). Un PAT di un altro account non funzionera' e il workflow fallira' con `403`.
7. Promemoria scadenza: annota la data di scadenza nel calendario. Se scade, il backend non potra' piu' aggiornare `db/stato.json`.

### 5. Dove salvare le credenziali in locale

1. Nella cartella del progetto crea una copia del file `.env.example` e rinominala `.env` (su Windows, in Explorer, attiva "Estensioni nome file" per non creare `.env.txt`).
2. Comando consigliato (PowerShell), dalla cartella del progetto:
```powershell
Copy-Item .env.example .env
notepad .env
```
3. Incolla i valori reali accanto ai nomi gia' presenti:
```env
TELEGRAM_TOKEN=1234567890:AAH-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CHAT_ID=123456789
PAT_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY=emilianofeletti-design/meteobot_telegram
DB_BRANCH=db
DB_DIR=db
```
4. Salva e chiudi Notepad.
5. Verifica che il file **non** venga committato:
```powershell
git check-ignore -v .env
```
Deve stampare una riga che cita `.gitignore`. Se non stampa nulla, **fermati**: il `.gitignore` non sta funzionando e il token rischia di finire su GitHub.
6. Promemoria:
   - Il file `.env` resta solo sul tuo computer, mai su GitHub.
   - I GitHub Secrets (PARTE 2) sono l'unico posto dove le credenziali vanno su GitHub.
   - `.env.example` invece **va** committato: contiene solo nomi di variabili e valori vuoti.

### 6. Creazione account Groq e API key (opzionale)

1. Vai su [https://console.groq.com](https://console.groq.com) e clicca **Sign up** (puoi usare Google o GitHub).
2. Conferma l'email se richiesto e completa l'accesso.
3. Nel menu a sinistra clicca **API Keys** > **Create API Key**.
4. **Name:** `meteobot_telegram`. Clicca **Submit**.
5. Cosa copiare: la chiave `gsk_...` che appare una sola volta. Incollala nel file `.env` come `GROQ_API_KEY`.
6. Verifica (PowerShell), sostituisci `<LA-TUA-GROQ-API-KEY>`:
```powershell
curl.exe -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer <LA-TUA-GROQ-API-KEY>" -o groq_test.json; Get-Content groq_test.json -TotalCount 1
```
Deve apparire `"object":"list"` (elenco dei modelli). Se appare `invalid_api_key`, la chiave e' sbagliata: rigenerala.
7. Se salti questo punto, imposta `GROQ_API_KEY` vuota: il backend usera' il fallback testuale senza LLM.

### 7. Caricamento del codice su GitHub (branch main + branch db)

Prima di tutto controlla la situazione attuale della cartella:

```powershell
cd "C:\Users\Utente\codex\telegram bot"
git remote -v
```

**CASO A - `git remote -v` non stampa nulla** (cartella non ancora collegata a GitHub):

```powershell
git init
git branch -M main
git remote add origin https://emilianofeletti-design@github.com/emilianofeletti-design/meteobot_telegram.git
git add .
git commit -m "FASE 1: struttura repository meteobot_telegram"
git push -u origin main
```

**CASO B - `git remote -v` punta a un ALTRO repository** (es. `mycoach1976/telegram-bot`): il progetto e' stato pushato sull'account sbagliato e va riportato su quello giusto:

```powershell
git remote set-url origin https://emilianofeletti-design@github.com/emilianofeletti-design/meteobot_telegram.git
git update-ref -d refs/remotes/origin/main
git update-ref -d refs/remotes/origin/HEAD
git remote prune origin
git remote -v
git push -u origin main
```

Perche' lo username (`emilianofeletti-design@`) e' dentro l'URL: su Windows Git Credential Manager conserva una credenziale per host (`git:https://github.com`). Se quella credenziale appartiene a un altro account GitHub, il push viene rifiutato con `remote: Permission to emilianofeletti-design/meteobot_telegram.git denied to <altro-account>` seguito da `error: 403`. Specificando lo username nell'URL, git usa una credenziale separata e al primo push chiede di accedere con l'account corretto, **senza cancellare** la credenziale usata dagli altri repository.

Ora crea il branch del database e pubblicalo (il branch `db` nasce da `main` e contiene quindi anche i 3 file JSON):

```powershell
git checkout -b db
git push -u origin db
git checkout main
```

Note:
- Il repository e' vuoto, quindi il primo `git push` non richiede `git pull --rebase`.
- Al primo push Git Credential Manager puo' aprire una finestra di accesso: scegli/inserisci l'account **emilianofeletti-design** (non un altro account GitHub). Se preferisci, usa username `emilianofeletti-design` e come password il tuo PAT.
- Se il push viene rifiutato con `403` o `denied to <altro-account>`, salta alla sezione **"9. Errori di autenticazione e account sbagliato"**.
- Se in futuro la pagina GitHub mostra file che non hai pushato tu, esegui prima `git pull --rebase origin main` e poi ripeti il push.

Verifica che `.env` e la cartella `.kilo` **non** siano stati caricati:

```powershell
git ls-files | Select-String -Pattern "^\.env$|^\.kilo"
```

Non deve stampare nulla.

Verifica che esistano entrambi i branch sul remoto:

```powershell
git ls-remote --heads origin
```

Deve stampare una riga con `refs/heads/db` e una riga con `refs/heads/main`.

Verifica finale: apri `https://github.com/emilianofeletti-design/meteobot_telegram` -> il selettore branch in alto mostra `main`; cambia su `db` e controlla che la cartella `db/` contenga `piante.json`, `regole.json` e `stato.json`.

---

### 8. Dove si modificano i JSON (nota importante)

La **fonte di verita'** di `db/piante.json` e `db/regole.json` e' il branch **`db`**, non `main`:

- La PWA legge i dati da `raw.githubusercontent.com/emilianofeletti-design/meteobot_telegram/db/db/...` (branch `db`).
- Il backend (`weather_checker.py`) gira su un checkout del branch `db` e riscrive `stato.json` sempre sul branch `db`.
- Se modifichi `piante.json` o `regole.json` sul branch `main`, la PWA **non** vedra' le modifiche.

Come modificare in modo sicuro (dalla cartella del progetto):

```powershell
git checkout db
notepad db\piante.json
git add db\piante.json
git commit -m "aggiornamento piante"
git push origin db
git checkout main
```

Il branch `db` contiene una copia completa del repository (`backend/`, `frontend/`, `README.md`, ...): e' ridondante ma innocuo, perche' il workflow fa due checkout separati (`main` per il codice e `db` per i dati) e usa `DB_DIR: db-branch/db`.

### 9. Errori di autenticazione e account sbagliato

**Sintomo:** `remote: Permission to emilianofeletti-design/meteobot_telegram.git denied to mycoach1976` seguito da `error: 403`.
**Causa:** la credenziale salvata in Windows Credential Manager appartiene all'account `mycoach1976`, non a `emilianofeletti-design`.

**Soluzione 1 (consigliata, non distruttiva)** - metti lo username nell'URL del remote, cosi' git usa una credenziale dedicata all'account giusto:

```powershell
git remote set-url origin https://emilianofeletti-design@github.com/emilianofeletti-design/meteobot_telegram.git
git push -u origin main
```

Al primo push Git Credential Manager chiede di accedere: scegli/inserisci **emilianofeletti-design**. La credenziale degli altri repository resta intatta.

**Soluzione 2 (solo se la 1 non basta)** - rimuovi la credenziale a livello di host:

```powershell
cmdkey /delete:LegacyGeneric:target=git:https://github.com
git config --global credential.username emilianofeletti-design
git push -u origin main
```

Attenzione: dopo questo passo dovrai riautenticarti anche per eventuali altri repository di `mycoach1976`.

**Nota importante - identita' dei commit vs credenziali di push.** Sono due cose separate:

```powershell
git config --global user.name
git config --global user.email
```

Su questo PC valgono `emilianofeletti-design` e `emiliano.feletti@gmail.com`: i commit sono gia' firmati con l'identita' giusta. Il `403` riguarda solo chi si autentica per il push, non l'autore dei commit.

**Credenziali rilevate su questo PC** (verifica del 19/09/2026):

```powershell
cmdkey /list | Select-String -Pattern 'git:|GitHub'
```

| Voce | A cosa serve |
|---|---|
| `LegacyGeneric:target=git:https://github.com` | Credenziale usata da `git push` -> appartiene a `mycoach1976` |
| `GitHub - https://api.github.com/emilianofeletti-design` | Usata da GitHub Desktop, **non** da `git push` |

**Verifica finale dopo un push riuscito:**

```powershell
git ls-remote --heads origin
```

Attesi: una riga `refs/heads/main` e una riga `refs/heads/db`.

**Pulizia opzionale dell'account sbagliato:** il vecchio repository `mycoach1976/telegram-bot` e' **privato** e contiene solo i file di questo progetto (nessun segreto verificato). Se non ti serve: apri il repo > Settings > Danger Zone > **Delete this repository**.

---

## PARTE 2 - Configurazione dei GitHub Secrets

### Lista esatta dei secrets da creare

| Nome esatto | Contenuto | Dove lo trovi |
|---|---|---|
| `TELEGRAM_TOKEN` | Token del bot rilasciato da @BotFather (formato `1234567890:AAH-...`) | PARTE 1, azione 2 |
| `CHAT_ID` | Il tuo chat id numerico Telegram (es. `123456789`) | PARTE 1, azione 3 |
| `PAT_TOKEN` | Personal Access Token GitHub (formato `ghp_...`), scope `repo` + `workflow` | PARTE 1, azione 4 |
| `GROQ_API_KEY` | API key Groq (formato `gsk_...`). Puo' restare vuota | PARTE 1, azione 6 |

Non servono altri secrets. `GITHUB_REPOSITORY` viene fornito automaticamente da GitHub Actions.

### Procedura passo-passo

1. Apri `https://github.com/emilianofeletti-design/meteobot_telegram`.
2. Clicca la tab **Settings** (in alto, a destra di "Insights"), non le impostazioni del tuo account.
3. Nel menu di sinistra: **Secrets and variables** > **Actions**.
4. Clicca il pulsante verde **New repository secret**.
5. Primo secret:
   - **Name:** `TELEGRAM_TOKEN`
   - **Secret:** incolla il token del bot.
   - Clicca **Add secret**.
6. Ripeti i punti 4-5 altre tre volte con:
   - Name `CHAT_ID` -> valore: il tuo chat id numerico.
   - Name `PAT_TOKEN` -> valore: il token `ghp_...`.
   - Name `GROQ_API_KEY` -> valore: la chiave `gsk_...` (oppure lascia vuoto se non usi Groq).
7. Verifica: nella pagina **Actions secrets** devono comparire esattamente 4 righe con questi nomi e la scritta `Updated ...`. I valori non sono piu' visibili: e' normale.
8. Abilita i permessi di scrittura del workflow (serve al job keep-alive): **Settings** > **Actions** > **General** > sezione **Workflow permissions** > seleziona **Read and write permissions** > **Save**.
9. Attiva GitHub Pages (serve alla PWA, FASE 3): **Settings** > **Pages** > **Source** = `Deploy from a branch` > **Branch** = `main` e cartella `/frontend` > **Save**.
10. Test manuale del workflow: tab **Actions** > **Weather Check** (menu di sinistra) > pulsante **Run workflow** > seleziona il branch `main` > **Run workflow**. Attendi circa un minuto. Verifica: il job "Controllo meteo e notifiche Telegram" diventa verde e nel log compare `OK: tutti i secrets obbligatori sono presenti.`

### Codice Python che legge i secrets

File gia' presente nel repository: `backend/check_secrets.py`. Contenuto:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_secrets.py - Verifica che i GitHub Secrets siano presenti come variabili d'ambiente.
"""

from __future__ import annotations

import os
import sys

SECRETS_RICHIESTI = ("TELEGRAM_TOKEN", "CHAT_ID", "PAT_TOKEN")
SECRETS_OPZIONALI = ("GROQ_API_KEY",)


def verifica() -> int:
    print("[check_secrets] verifica delle variabili d'ambiente")
    print("-" * 52)

    mancanti: list[str] = []

    for nome in SECRETS_RICHIESTI:
        valore = os.environ.get(nome, "")
        if valore:
            print(f"[OK]       {nome} presente (lunghezza: {len(valore)})")
        else:
            print(f"[MANCANTE] {nome} NON impostato -> obbligatorio")
            mancanti.append(nome)

    for nome in SECRETS_OPZIONALI:
        valore = os.environ.get(nome, "")
        if valore:
            print(f"[OK]       {nome} presente (lunghezza: {len(valore)})")
        else:
            print(f"[OPZIONALE]{nome} NON impostato -> il riassunto LLM sara' disattivato")

    print("-" * 52)

    if mancanti:
        print("ERRORE: mancano questi secrets obbligatori: " + ", ".join(mancanti))
        print("Cosa fare:")
        print("  - Su GitHub: Settings > Secrets and variables > Actions > New repository secret")
        print("  - In locale: crea un file .env non committato e carica le variabili nella shell")
        print("  - Procedura completa: vedi SETUP.md")
        return 1

    print("OK: tutti i secrets obbligatori sono presenti.")
    return 0


if __name__ == "__main__":
    sys.exit(verifica())
```

Lo stesso controllo viene eseguito dal workflow nello step **Verifica secrets**, prima di lanciare il backend.

### Promemoria sulle regole di sicurezza

1. Mai committare i secrets: il file `.env` e' in `.gitignore`, verificalo con `git check-ignore -v .env` prima di ogni push.
2. Mai mettere i secrets nel frontend: tutto quello che finisce in `frontend/` e' pubblico. La PWA legge solo i JSON dal branch `db`.
3. Il `PAT_TOKEN` va usato solo dal backend (GitHub Actions), mai in JavaScript.
4. Ruotare subito le credenziali se esposte: se un token appare in un commit, su un sito o in una chat, rigeneralo su GitHub/Telegram/Groq e aggiorna il secret (**Actions secrets** > nome > **Update**).
5. Non incollare i valori dei secrets nei log: `check_secrets.py` stampa solo la presenza e la lunghezza, mai il valore.
6. Scadenza del PAT: annota la data; se scade, il backend non potra' aggiornare `db/stato.json` e riceverai lo stesso avviso piu' volte.
7. Repository pubblico: chiunque puo' leggere il codice e i JSON del branch `db`. Non inserire dati personali nei JSON (solo piante e soglie).