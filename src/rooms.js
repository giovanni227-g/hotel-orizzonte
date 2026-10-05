// Card delle camere e scheda camera con prenotazione.
import { suites, extras, hotel } from './data/hotel.js';
import { img, prefetch } from './lib/media.js';
import {
  state, setMode, onModeChange, findSuite, euro, total, todayISO,
  modeLabel, priceUnit, bookingWhatsappUrl,
} from './lib/booking.js';

const $ = (sel, root = document) => root.querySelector(sel);
const shortName = (s) => s.name.replace(/^(Junior Suite|Camera) /, '');
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const priceHtml = (s) => `
  <span class="font-display text-[1.6rem] leading-none" data-price="${s.id}">${euro(s.prices[state.mode])}</span>
  <span class="text-sm whitespace-nowrap text-nebbia" data-unit>${priceUnit(state.mode)}</span>`;

/* ------------------------------------------------------------
   Card
------------------------------------------------------------ */
function featuredCard(s) {
  return `
  <article class="room-card grid lg:grid-cols-12" style="--light:${s.light}">
    <div class="grid grid-cols-2 gap-1 lg:col-span-7">
      <div class="row-span-2 overflow-hidden max-lg:col-span-2">
        ${img(s.images[0], { sizes: '(min-width:1024px) 30vw, 100vw', alt: `${s.name}: parete in onice e vasca illuminata`, className: 'room-img h-full w-full object-cover max-lg:aspect-[4/5] sm:max-lg:aspect-[16/10]' })}
      </div>
      <div class="overflow-hidden max-lg:hidden">${img(s.images[1], { sizes: '30vw', alt: `${s.name}: terrazza privata con braciere`, className: 'room-img aspect-[4/3] h-full w-full object-cover' })}</div>
      <div class="overflow-hidden max-lg:hidden">${img(s.images[2], { sizes: '30vw', alt: `${s.name}: la camera con luce blu`, className: 'room-img aspect-[4/3] h-full w-full object-cover' })}</div>
    </div>
    <div class="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-12">
      <p class="flex items-center gap-2.5 text-sm text-avorio/80"><span class="light-dot"></span>Il fiore all’occhiello dell’hotel</p>
      <h3 class="mt-5 text-display-lg">${s.name}</h3>
      <p class="mt-5 text-avorio/80">${s.description}</p>
      <ul class="mt-6 hidden grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem] text-nebbia sm:grid">
        ${s.features.slice(0, 6).map((f) => `<li class="flex gap-2.5"><span class="mt-[0.6em] size-1 shrink-0 rounded-full bg-candela"></span>${f}</li>`).join('')}
      </ul>
      <div class="mt-auto flex flex-wrap items-end justify-between gap-5 pt-10">
        <p class="flex items-baseline gap-2"><span class="text-sm text-nebbia">da</span>${priceHtml(s)}</p>
        <button type="button" class="btn btn-candela" data-room="${s.id}">Scopri e prenota</button>
      </div>
    </div>
  </article>`;
}

function card(s) {
  return `
  <button type="button" class="room-card w-[82vw] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none" style="--light:${s.light}" data-room="${s.id}" aria-label="${s.name}, apri la scheda">
    <div class="overflow-hidden">
      ${img(s.images[0], { sizes: '(min-width:1024px) 30vw, (min-width:640px) 50vw, 82vw', alt: '', className: 'room-img aspect-[4/5] w-full object-cover' })}
    </div>
    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <h4 class="flex items-center gap-3 font-display text-[1.65rem] leading-tight"><span class="light-dot shrink-0"></span>${shortName(s)}</h4>
      <p class="mt-1.5 text-[0.98rem] text-nebbia">${s.tagline}</p>
      <p class="mt-auto flex items-baseline gap-2 pt-6"><span class="text-sm text-nebbia">da</span>${priceHtml(s)}</p>
    </div>
  </button>`;
}

function rowCard(s) {
  return `
  <button type="button" class="room-card flex-row items-stretch gap-4 p-3 min-[360px]:gap-5" style="--light:${s.light}" data-room="${s.id}" aria-label="${s.name}, apri la scheda">
    <div class="w-24 shrink-0 overflow-hidden rounded-xl min-[360px]:w-28 sm:w-36">
      ${img(s.images[0], { sizes: '144px', alt: '', className: 'room-img aspect-square h-full w-full object-cover' })}
    </div>
    <div class="flex min-w-0 flex-1 flex-col py-1 pr-2">
      <h4 class="flex items-center gap-2.5 font-display text-[1.45rem] leading-tight"><span class="light-dot shrink-0"></span>${shortName(s)}</h4>
      <p class="mt-1 text-[0.95rem] leading-snug text-nebbia">${s.tagline}</p>
      <p class="mt-auto flex flex-wrap items-baseline gap-x-2 pt-3"><span class="text-sm text-nebbia">da</span>${priceHtml(s)}</p>
    </div>
  </button>`;
}

function updatePrices() {
  document.querySelectorAll('[data-price]').forEach((el) => {
    el.textContent = euro(findSuite(el.dataset.price).prices[state.mode]);
  });
  document.querySelectorAll('[data-unit]').forEach((el) => (el.textContent = priceUnit(state.mode)));
}

/* ------------------------------------------------------------
   Selettore Sosta / Pernottamento
------------------------------------------------------------ */
export function bindModeSwitches(root = document) {
  root.querySelectorAll('[data-mode-switch]').forEach((sw) => {
    sw.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mode-value]');
      if (btn) setMode(btn.dataset.modeValue);
    });
  });
  syncModeSwitches(root);
}

function syncModeSwitches(root = document) {
  root.querySelectorAll('[data-mode-switch]').forEach((sw) => {
    sw.dataset.mode = state.mode;
    sw.querySelectorAll('[data-mode-value]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modeValue === state.mode)));
  });
}

/* ------------------------------------------------------------
   Scheda camera (gallery + prenotazione)
------------------------------------------------------------ */
const sheet = () => $('#roomSheet');
const SHEET_SIZES = '(min-width:1024px) 700px, 100vw';

function sheetHtml(s) {
  const suiteOptions = suites.map((x) => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${x.name}</option>`).join('');
  return `
  <!-- Mobile: foto e dettagli scorrono insieme, la barra con prezzo e pulsanti resta in fondo -->
  <div class="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[1.1fr_1fr] lg:overflow-visible">
    <!-- Galleria -->
    <div class="relative bg-notte max-lg:shrink-0">
      <div class="scrollbar-none flex h-full snap-x snap-mandatory overflow-x-auto" data-slides tabindex="0" aria-label="Foto di ${s.name}">
        ${s.images.map((name, i) => `
          <div class="w-full shrink-0 snap-center">
            ${img(name, { sizes: SHEET_SIZES, alt: `${s.name}, foto ${i + 1} di ${s.images.length}`, className: 'aspect-[4/3] h-full w-full object-cover lg:aspect-auto', lazy: i > 0 })}
          </div>`).join('')}
      </div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-notte/70 to-transparent p-4 pt-12">
        <span class="rounded-full bg-notte/60 px-3 py-1 text-sm backdrop-blur" data-counter>1 / ${s.images.length}</span>
        <div class="pointer-events-auto hidden gap-2 sm:flex">
          <button type="button" class="grid size-11 place-items-center rounded-full bg-notte/60 backdrop-blur hover:bg-notte" data-slide="-1" aria-label="Foto precedente"><svg class="size-5"><use href="#i-left"/></svg></button>
          <button type="button" class="grid size-11 place-items-center rounded-full bg-notte/60 backdrop-blur hover:bg-notte" data-slide="1" aria-label="Foto successiva"><svg class="size-5"><use href="#i-right"/></svg></button>
        </div>
      </div>
      <button type="button" class="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 grid size-11 place-items-center rounded-full bg-notte/70 backdrop-blur hover:bg-notte lg:hidden" data-close aria-label="Chiudi"><svg class="size-5"><use href="#i-close"/></svg></button>
    </div>

    <!-- Dettagli e prenotazione -->
    <div class="flex flex-1 flex-col max-lg:shrink-0 lg:min-h-0">
      <div class="flex-1 px-5 pt-6 pb-6 sm:px-8 lg:overflow-y-auto lg:overscroll-contain lg:px-10 lg:pt-10">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="flex items-center gap-2.5 text-sm text-nebbia"><span class="light-dot" style="--light:${s.light}"></span>${s.kind === 'camera' ? 'Camera' : s.kind === 'junior' ? 'Junior suite' : 'Suite'}</p>
            <h2 id="roomSheetTitle" class="mt-3 text-display-md">${s.name}</h2>
          </div>
          <button type="button" class="hidden size-11 shrink-0 place-items-center rounded-full border border-avorio/15 hover:border-avorio/40 lg:grid" data-close aria-label="Chiudi"><svg class="size-5"><use href="#i-close"/></svg></button>
        </div>
        <p class="mt-4 text-avorio/80">${s.description}</p>
        <ul class="mt-5 flex flex-wrap gap-2">
          ${s.features.map((f) => `<li class="rounded-full border border-avorio/12 px-3 py-1 text-sm text-avorio/80">${f}</li>`).join('')}
        </ul>

        <form class="mt-8 grid gap-5" data-booking-form>
          <fieldset class="grid gap-2">
            <legend class="mb-2 text-[0.8rem] text-nebbia">Formula</legend>
            <div class="grid grid-cols-2 gap-2">
              ${['sosta', 'pernottamento'].map((m) => `
                <label class="relative cursor-pointer rounded-xl border border-avorio/15 p-4 transition-colors has-checked:border-candela has-checked:bg-candela/10 hover:border-avorio/35">
                  <input type="radio" name="mode" value="${m}" class="peer sr-only" ${state.mode === m ? 'checked' : ''} />
                  <span class="block text-[0.95rem]">${modeLabel(m)}</span>
                  <span class="mt-1 block font-display text-[1.5rem] leading-none">${euro(s.prices[m])}</span>
                  <span class="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-candela"></span>
                </label>`).join('')}
            </div>
          </fieldset>

          <div class="grid grid-cols-2 gap-3">
            <label class="field col-span-2 sm:col-span-1">
              <span>Camera</span>
              <select name="suite" class="input">${suiteOptions}</select>
            </label>
            <label class="field">
              <span>Data</span>
              <input type="date" name="date" class="input" min="${todayISO()}" value="${esc(state.date)}" />
            </label>
            <label class="field">
              <span>Arrivo previsto</span>
              <input type="time" name="time" class="input" value="${esc(state.time)}" step="900" />
            </label>
            <label class="field col-span-2 sm:col-span-1">
              <span>Il vostro nome (facoltativo)</span>
              <input type="text" name="name" class="input" autocomplete="given-name" value="${esc(state.name)}" />
            </label>
          </div>

          ${extras.map((e) => `
          <label class="flex cursor-pointer items-center gap-4 rounded-xl border border-avorio/15 p-4 transition-colors has-checked:border-candela has-checked:bg-candela/10 hover:border-avorio/35">
            <input type="checkbox" name="extra" value="${e.id}" class="size-5 accent-[#e7b977]" ${state.extras.has(e.id) ? 'checked' : ''} />
            <span class="flex-1"><span class="block">${e.label}</span><span class="text-sm text-nebbia">${e.detail}</span></span>
            <span class="font-display text-[1.2rem]">+${euro(e.price)}</span>
          </label>`).join('')}

          <p class="text-sm text-nebbia">I prezzi possono variare in base alla stagione. Vi confermiamo disponibilità e prezzo finale prima dell’arrivo.</p>
        </form>
      </div>

      <!-- Riepilogo e azioni -->
      <div class="sticky bottom-0 z-10 border-t border-avorio/10 bg-velluto/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-8 lg:px-10 lg:pb-6">
        <div class="flex items-baseline justify-between gap-4">
          <span class="text-sm text-nebbia" data-summary></span>
          <span class="font-display text-[1.9rem] leading-none" data-total></span>
        </div>
        <div class="mt-4 grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_auto_auto]">
          <a class="btn btn-wa" data-wa target="_blank" rel="noopener noreferrer"><svg class="size-5"><use href="#i-wa"/></svg>Chiedi disponibilità</a>
          <button type="button" class="btn btn-vetro max-sm:order-3 max-sm:col-span-2" data-todo><svg class="size-5"><use href="#i-card"/></svg>Paga online</button>
          <a class="btn btn-vetro aspect-square px-0" href="${hotel.phoneHref}" aria-label="Chiama ${hotel.phone}"><svg class="size-5"><use href="#i-phone"/></svg></a>
        </div>
      </div>
    </div>
  </div>`;
}

function refreshSummary(panel) {
  const s = findSuite(state.suite);
  const extrasCount = state.extras.size;
  $('[data-summary]', panel).textContent = `${s.name}, ${modeLabel(state.mode).toLowerCase()}${extrasCount ? ' con extra' : ''}`;
  $('[data-total]', panel).textContent = euro(total());
  $('[data-wa]', panel).href = bookingWhatsappUrl();
}

function bindGallery(panel) {
  const track = $('[data-slides]', panel);
  const counter = $('[data-counter]', panel);
  const count = track.children.length;
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  track.addEventListener('scroll', () => (counter.textContent = `${current() + 1} / ${count}`), { passive: true });
  const go = (dir) => {
    const next = (current() + dir + count) % count;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
  };
  panel.querySelectorAll('[data-slide]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.slide))));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
}

function renderSheet() {
  const s = findSuite(state.suite);
  const dialog = sheet();
  const panel = $('#roomSheetPanel');
  dialog.style.setProperty('--light', s.light);
  panel.innerHTML = sheetHtml(s);
  bindGallery(panel);
  refreshSummary(panel);

  const form = $('[data-booking-form]', panel);
  form.addEventListener('input', (e) => {
    const { name, value, checked } = e.target;
    if (name === 'mode') setMode(value);
    if (name === 'date') state.date = value;
    if (name === 'time') state.time = value;
    if (name === 'name') state.name = value;
    if (name === 'extra') checked ? state.extras.add(value) : state.extras.delete(value);
    if (name === 'suite') {
      state.suite = value;
      renderSheet();
      $('select[name="suite"]', panel).focus();
      return;
    }
    refreshSummary(panel);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
}

export function openRoom(id) {
  if (id) state.suite = id;
  renderSheet();
  const dialog = sheet();
  if (!dialog.open) dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
}

/* ------------------------------------------------------------
   Avvio
------------------------------------------------------------ */
export function initRooms() {
  const byKind = (k) => suites.filter((s) => s.kind === k);
  const [featured, ...otherSuites] = byKind('suite');
  $('#featured').innerHTML = featuredCard(featured);
  $('#suiteList').innerHTML = otherSuites.map(card).join('');
  $('#juniorList').innerHTML = byKind('junior').map(card).join('');
  $('#roomList').innerHTML = byKind('camera').map(rowCard).join('');

  // Precarica la prima foto della scheda quando il cursore o il dito si avvicinano alla card
  const warm = (e) => {
    const room = e.target.closest?.('[data-room]');
    if (room) prefetch(findSuite(room.dataset.room).images[0], SHEET_SIZES);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });

  document.addEventListener('click', (e) => {
    const room = e.target.closest('[data-room]');
    if (room) openRoom(room.dataset.room);
    if (e.target.closest('[data-book]')) openRoom();
  });

  const dialog = sheet();
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => (document.documentElement.style.overflow = ''));

  bindModeSwitches();
  onModeChange(() => {
    syncModeSwitches();
    updatePrices();
    const panel = $('#roomSheetPanel');
    if (dialog.open) {
      panel.querySelectorAll('input[name="mode"]').forEach((r) => (r.checked = r.value === state.mode));
      refreshSummary(panel);
    }
  });
}
