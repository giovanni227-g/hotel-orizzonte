import './styles.css';
import { hotel, suites, restaurantHours } from './data/hotel.js';
import { hydrateImages } from './lib/media.js';
import { state, todayISO, whatsappUrl } from './lib/booking.js';
import { initRooms, openRoom } from './rooms.js';
import { initGallery } from './gallery.js';
import { initHero } from './hero.js';

const $ = (sel, root = document) => root.querySelector(sel);

/* ---------- Navigazione ---------- */
function initNav() {
  const nav = $('#nav');
  const bar = $('#mobileBar');
  const hero = $('main > section');
  const onScroll = () => {
    nav.dataset.scrolled = String(scrollY > 40);
    // La barra mobile compare quando l'hero (che ha già il suo form) è passato
    bar.dataset.hidden = String(scrollY < hero.offsetHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menu = $('#menu');
  const btn = $('#menuBtn');
  btn.addEventListener('click', () => {
    menu.showModal();
    btn.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => btn.setAttribute('aria-expanded', 'false'));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) menu.close();
  });
}

/* ---------- Mappe ----------
   Su telefono i link aprono direttamente l'app di navigazione, senza passare dal sito di Google:
   iPhone e iPad → Mappe di Apple; Android → l'app predefinita o la scelta (Google Maps, Waze…).
   Su computer resta Google Maps in una nuova scheda (l'href scritto nell'HTML). */
function initMaps() {
  const q = encodeURIComponent(hotel.mapsQuery);
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);
  if (!ios && !android) return;
  const urls = ios
    ? { place: `https://maps.apple.com/?q=${q}`, directions: `https://maps.apple.com/?daddr=${q}` }
    : { place: `geo:0,0?q=${q}`, directions: `geo:0,0?q=${q}` };
  document.querySelectorAll('[data-maps]').forEach((a) => {
    a.href = urls[a.dataset.maps];
    a.removeAttribute('target');
  });
}

/* ---------- Prenotazione rapida (hero) ---------- */
function initQuickBook() {
  const form = $('#quickBook');
  const select = $('[data-suite-select]', form);
  select.innerHTML = suites.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
  const date = $('[data-date]', form);
  date.min = todayISO();
  date.value = todayISO();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.date = date.value;
    openRoom(select.value);
  });
}

/* ---------- Ristorante ---------- */
function initRestaurant() {
  $('#hours').innerHTML = restaurantHours
    .map(([day, time]) => `<tr><td class="text-avorio/80">${day}</td><td class="text-right tabular-nums">${time}</td></tr>`)
    .join('');
  $('#tableBtn').href = whatsappUrl('Ciao Hotel Orizzonte, vorrei prenotare un tavolo al ristorante.\n• Data:\n• Ora:\n• Persone:');
}

// Data e ora: il calendario si apre toccando un punto qualsiasi del campo, non solo l'icona
document.addEventListener('click', (e) => {
  const field = e.target.closest?.('input.input:is([type="date"], [type="time"])');
  try { field?.showPicker(); } catch { /* già aperto o non supportato: resta il comportamento nativo */ }
});

// Link e pulsanti non ancora attivi (pagamento online, privacy, menù): da collegare alla consegna
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-todo]')) e.preventDefault();
});

initNav();
initRooms();
initQuickBook();
initRestaurant();
hydrateImages();
initGallery();
initHero();
initMaps();
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
