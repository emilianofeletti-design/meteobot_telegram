/* ============================================================
   app.js - meteobot_telegram (scheletro PWA)
   Nessuna chiamata di scrittura: la PWA e' sola lettura.
   Le modifiche (piante/regole) passano dal backend GitHub Actions.
   ============================================================ */

'use strict';

// ------------------------------------------------------------
// Configurazione: dati reali del repository
// ------------------------------------------------------------
const CONFIG = {
  owner: 'emilianofeletti-design',
  repo: 'meteobot_telegram',
  branch: 'db',
  dirDb: 'db',
};

const RAW_BASE = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.dirDb}`;

// ------------------------------------------------------------
// Lettura dei JSON dal branch "db"
// ------------------------------------------------------------
async function leggiJson(nomeFile) {
  // TODO FASE 3.5: fetch(`${RAW_BASE}/${nomeFile}`), controllo response.ok
  // e ritorno di response.json(). In caso di errore ritornare null.
  throw new Error('leggiJson non ancora implementata');
}

// ------------------------------------------------------------
// Render della dashboard
// ------------------------------------------------------------
function renderDashboard(stato, avvisi) {
  // TODO FASE 3.2: mostrare ultimo controllo e prossimi avvisi.
  const el = document.getElementById('ultimo-controllo');
  if (el) {
    el.textContent = (stato && stato.ultimo_controllo) || 'mai';
  }
}

// ------------------------------------------------------------
// Render della lista piante
// ------------------------------------------------------------
function renderPiante(datiPiante) {
  // TODO FASE 3.3: generare le voci <li> con nome, profilo e posizione.
  const lista = document.getElementById('lista-piante');
  if (!lista) {
    return;
  }
  lista.innerHTML = '';
  const piante = (datiPiante && datiPiante.piante) || [];
  if (piante.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nessuna pianta configurata.';
    lista.appendChild(li);
    return;
  }
  for (const p of piante) {
    const li = document.createElement('li');
    li.textContent = `${p.nome} - profilo ${p.profilo} - ${p.posizione}`;
    lista.appendChild(li);
  }
}

// ------------------------------------------------------------
// Avvio applicazione
// ------------------------------------------------------------
async function init() {
  console.log('[meteobot_telegram] PWA avviata (scheletro)');
  // TODO FASE 3.2 / 3.3 / 3.4: caricare piante.json, regole.json e stato.json
  // chiamando leggiJson e passando i dati alle funzioni di render.
}

document.addEventListener('DOMContentLoaded', init);

// ------------------------------------------------------------
// Service Worker (PWA)
// ------------------------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('[meteobot_telegram] service worker non registrato:', err);
    });
  });
}