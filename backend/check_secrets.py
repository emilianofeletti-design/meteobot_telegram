#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_secrets.py - Verifica che i GitHub Secrets siano presenti come variabili d'ambiente.

Uso locale (PowerShell):
    python backend/check_secrets.py

Uso in GitHub Actions: viene richiamato dal workflow .github/workflows/weather.yml.

Nessun secret viene stampato: viene mostrata solo la presenza e la lunghezza.
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