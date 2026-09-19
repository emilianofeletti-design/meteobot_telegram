# Schema dati definitivo - meteobot_telegram

`versione_schema: 1` in tutti e tre i file JSON. Tutti i file vivono nel branch **`db`**.

## SCELTA PREDEFINITA

`db/piante.json` **non** e' un array puro (`[]`), ma un oggetto con il campo `versione_schema` e la lista dentro la chiave `piante`. Il requisito `versione_schema: 1` in ogni file lo richiede; il loader del backend deve quindi leggere la chiave `piante`.

---

## 1. `db/piante.json`

```json
{
  "versione_schema": 1,
  "piante": [
    {
      "id": 1,
      "nome": "Lavanda",
      "profilo": "Robusta",
      "posizione": "Angolo sud-est, vaso grande in terracotta",
      "note": "Sole pieno dal mattino, potata a marzo. Teme solo il ristagno d'acqua.",
      "data_aggiunta": "2025-04-12"
    },
    {
      "id": 2,
      "nome": "Geranio rosso",
      "profilo": "Media",
      "posizione": "Ringhiera lato strada, due vasi medi",
      "note": "Fioritura continua da maggio a settembre, va riparato con vento forte.",
      "data_aggiunta": "2025-05-03"
    },
    {
      "id": 3,
      "nome": "Basilico in vaso",
      "profilo": "Delicata",
      "posizione": "Tavolino centrale accanto alla portafinestra",
      "note": "Foglie larghe, si spezzano con vento over 30 km/h e con grandine.",
      "data_aggiunta": "2026-05-18"
    }
  ]
}
```

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `versione_schema` | intero | si | Versione dello schema dati. Attualmente `1`. |
| `piante` | array di oggetti | si | Elenco delle piante del balcone. |
| `piante[].id` | intero | si | Identificativo numerico univoco della pianta. |
| `piante[].nome` | stringa | si | Nome visualizzato (es. "Lavanda"). |
| `piante[].profilo` | stringa | si | Uno tra `Robusta`, `Media`, `Delicata`. Determina le soglie in `regole.json`. |
| `piante[].posizione` | stringa | no | Dove si trova la pianta sul balcone. |
| `piante[].note` | stringa | no | Note libere dell'utente. |
| `piante[].data_aggiunta` | stringa (ISO 8601, `YYYY-MM-DD`) | no | Data di inserimento della pianta. |

---

## 2. `db/regole.json`

```json
{
  "versione_schema": 1,
  "posizione_balcone": {
    "nome": "Balcone di casa",
    "latitudine": 41.9028,
    "longitudine": 12.4964,
    "fuso_orario": "Europe/Rome"
  },
  "profili": {
    "Robusta": {
      "soglia_vento_kmh": 60,
      "soglia_pioggia_mmh": 20,
      "descrizione": "Piante resistenti, sopportano vento forte e pioggia intensa.",
      "esempi": ["Lavanda", "Rosmarino", "Agave"]
    },
    "Media": {
      "soglia_vento_kmh": 45,
      "soglia_pioggia_mmh": 15,
      "descrizione": "Piante da fiore comuni, soffrono con vento sostenuto e rovesci.",
      "esempi": ["Gerani", "Petunie", "Basilico"]
    },
    "Delicata": {
      "soglia_vento_kmh": 30,
      "soglia_pioggia_mmh": 8,
      "descrizione": "Foglie larghe e piantine giovani, si danneggiano facilmente.",
      "esempi": ["Foglie larghe", "Piantine giovani", "Basilico in vaso"]
    }
  },
  "orari_report": {
    "mattina": "07:30",
    "sera": "20:30",
    "includi_report_mattina": true,
    "includi_report_sera": true
  },
  "modalita_notturna": {
    "inizio": "22:00",
    "fine": "07:00",
    "attiva": true
  },
  "allerta_critica": {
    "vento_kmh": 80,
    "pioggia_mmh": 30,
    "ignora_modalita_notturna": true
  },
  "controllo": {
    "intervallo_minuti": 30,
    "finestra_ore": 12,
    "deduplicazione_ore": 6,
    "notifiche_silenziose_report": true
  }
}
```

| Campo | Tipo | Descrizione |
|---|---|---|
| `versione_schema` | intero | Versione dello schema dati (`1`). |
| `posizione_balcone.nome` | stringa | Etichetta leggibile della posizione. |
| `posizione_balcone.latitudine` | numero | Latitudine del balcone per Open-Meteo. |
| `posizione_balcone.longitudine` | numero | Longitudine del balcone per Open-Meteo. |
| `posizione_balcone.fuso_orario` | stringa | Fuso IANA usato da Open-Meteo e per gli orari dei report. |
| `profili.<Nome>` | oggetto | Soglie di un profilo: `Robusta`, `Media`, `Delicata`. |
| `profili.<Nome>.soglia_vento_kmh` | numero | Velocita' vento (km/h) oltre la quale scatta un avviso. |
| `profili.<Nome>.soglia_pioggia_mmh` | numero | Intensita' pioggia (mm/h) oltre la quale scatta un avviso. |
| `profili.<Nome>.descrizione` | stringa | Testo descrittivo del profilo. |
| `profili.<Nome>.esempi` | array di stringhe | Esempi di piante appartenenti al profilo. |
| `orari_report.mattina` | stringa `HH:MM` | Ora locale del report del mattino (notifica silenziosa). |
| `orari_report.sera` | stringa `HH:MM` | Ora locale del report della sera. |
| `orari_report.includi_report_mattina` | booleano | Attiva/disattiva il report del mattino. |
| `orari_report.includi_report_sera` | booleano | Attiva/disattiva il report della sera. |
| `modalita_notturna.inizio` | stringa `HH:MM` | Inizio della fascia silenziosa. |
| `modalita_notturna.fine` | stringa `HH:MM` | Fine della fascia silenziosa. |
| `modalita_notturna.attiva` | booleano | Se `true`, di notte passano solo le allerte critiche. |
| `allerta_critica.vento_kmh` | numero | Soglia vento oltre la quale l'avviso e' critico. |
| `allerta_critica.pioggia_mmh` | numero | Soglia pioggia oltre la quale l'avviso e' critico. |
| `allerta_critica.ignora_modalita_notturna` | booleano | Se `true`, le allerte critiche arrivano anche di notte. |
| `controllo.intervallo_minuti` | intero | Deve coincidere con il cron del workflow (30 minuti). |
| `controllo.finestra_ore` | intero | Quante ore di previsioni future valutare ad ogni esecuzione. |
| `controllo.deduplicazione_ore` | intero | Finestra entro cui non si ripete lo stesso avviso. |
| `controllo.notifiche_silenziose_report` | booleano | Se `true` i report usano `disable_notification`. |

---

## 3. `db/stato.json`

```json
{
  "versione_schema": 1,
  "ultimo_controllo": null,
  "ultimo_report_mattina": null,
  "ultimo_report_sera": null,
  "avvisi_inviati": {}
}
```

| Campo | Tipo | Descrizione |
|---|---|---|
| `versione_schema` | intero | Versione dello schema dati (`1`). |
| `ultimo_controllo` | stringa ISO 8601 o `null` | Data/ora dell'ultima esecuzione del backend. `null` finche' non gira mai. |
| `ultimo_report_mattina` | stringa ISO 8601 o `null` | Data/ora dell'ultimo report del mattino inviato. |
| `ultimo_report_sera` | stringa ISO 8601 o `null` | Data/ora dell'ultimo report della sera inviato. |
| `avvisi_inviati` | oggetto `chiave -> stringa ISO 8601` | Mappa di deduplicazione. La chiave ha formato `"<tipo>_<id_pianta>_<ora_iso_oraria>"` (es. `"pioggia_3_2026-09-19T14"`), il valore e' la data/ora di invio. Le chiavi piu' vecchie di `controllo.deduplicazione_ore` vengono rimosse. |

Esempio di `stato.json` dopo alcune esecuzioni (solo per riferimento, non e' il file committato):

```json
{
  "versione_schema": 1,
  "ultimo_controllo": "2026-09-19T14:00:12+02:00",
  "ultimo_report_mattina": "2026-09-19T07:30:05+02:00",
  "ultimo_report_sera": "2026-09-18T20:30:04+02:00",
  "avvisi_inviati": {
    "vento_2_2026-09-19T16": "2026-09-19T14:00:12+02:00",
    "pioggia_3_2026-09-19T18": "2026-09-19T14:00:12+02:00"
  }
}
```

---

## Chi scrive cosa

| Chi scrive | File | Come |
|---|---|---|
| Utente (GitHub o PWA) | `piante.json`, `regole.json` | Commit sul branch `db` |
| Backend (`weather_checker.py`) | `stato.json` | GitHub Contents API con `PAT_TOKEN` |
| Frontend PWA | nessuno dei tre | Sola lettura da `raw.githubusercontent.com` |

Il token di scrittura non viene mai esposto nella PWA: tutte le scritture passano dal backend.