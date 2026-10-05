// Stato condiviso della prenotazione e messaggio WhatsApp precompilato.
import { hotel, suites, extras } from '../data/hotel.js';

const STORAGE_KEY = 'orizzonte-mode';
const listeners = new Set();

function readMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'pernottamento' ? 'pernottamento' : 'sosta';
  } catch {
    return 'sosta';
  }
}

export const state = {
  mode: readMode(),
  suite: 'spa',
  date: '',
  time: '',
  extras: new Set(),
  name: '',
};

export function setMode(mode) {
  state.mode = mode;
  try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* storage non disponibile */ }
  listeners.forEach((fn) => fn(state));
}

export const onModeChange = (fn) => listeners.add(fn);

export const modeLabel = (mode) => (mode === 'sosta' ? 'Sosta' : 'Pernottamento');
export const priceUnit = (mode) => (mode === 'sosta' ? 'la sosta' : 'a notte');
export const findSuite = (id) => suites.find((s) => s.id === id) ?? suites[0];
// \u00a0: numero ed € non vanno mai a capo separati
export const euro = (n) => `${n.toLocaleString('it-IT')}\u00a0€`;

export function total(s = state) {
  const room = findSuite(s.suite).prices[s.mode];
  const add = extras.filter((e) => s.extras.has(e.id)).reduce((sum, e) => sum + e.price, 0);
  return room + add;
}

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function whatsappMessage(s = state) {
  const suite = findSuite(s.suite);
  const lines = [
    'Ciao Hotel Orizzonte, vorrei verificare la disponibilità:',
    `• ${suite.name}, ${modeLabel(s.mode).toLowerCase()} (${euro(suite.prices[s.mode])})`,
  ];
  if (s.date) lines.push(`• Data: ${formatDate(s.date)}`);
  if (s.time) lines.push(`• Arrivo previsto: ${s.time}`);
  extras.filter((e) => s.extras.has(e.id)).forEach((e) => lines.push(`• Extra: ${e.label} (+${euro(e.price)})`));
  lines.push(`Totale indicativo: ${euro(total(s))}`);
  if (s.name.trim()) lines.push(`Nome: ${s.name.trim()}`);
  return lines.join('\n');
}

export const whatsappUrl = (text) => `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(text)}`;
export const bookingWhatsappUrl = (s = state) => whatsappUrl(whatsappMessage(s));
