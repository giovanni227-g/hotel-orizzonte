// Hero "Le luci delle suite".
// Ogni suite ha la sua luce (hotel.js → light): la foto e l'alone della pagina
// cambiano con la suite scelta, e la scelta passa al modulo di prenotazione.
import { suites } from './data/hotel.js';
import { imgAttrs, imageMeta, prefetch } from './lib/media.js';
import { state, onModeChange, euro, priceUnit } from './lib/booking.js';
import { openRoom } from './rooms.js';

// La foto che rappresenta ogni suite nell'hero (scelte per reggere il taglio verticale)
const PHOTOS = {
  spa: 'spa-onice',
  amalfi: 'amalfi-vasca',
  black: 'black-vasca',
  orizzonte: 'orizzonte-vasca',
  luxury: 'luxury-marmo',
  bubble: 'bubble-camera',
  savana: 'savana-letto',
  tigrata: 'tigrata-camera',
};
const DURATION = 6000;

const $ = (sel, root = document) => root.querySelector(sel);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = suites.filter((s) => PHOTOS[s.id]);
const shortName = (s) => s.name.replace(/^(Junior Suite|Suite) | Suite$/g, '');

export function initHero() {
  const hero = $('[data-luci]');
  const photos = $('[data-luci-photos]');
  const glow = $('[data-luci-glow]');
  const caption = $('[data-luci-caption]');
  const strip = $('[data-luci-list]');
  const form = $('#quickBook');
  const select = $('[data-suite-select]', form);

  // La foto copre il riquadro (desktop) o tutto lo schermo (mobile): sizes in base alle proporzioni
  const sizesFor = (name) => {
    const { w, h } = imageMeta(name);
    const r = w / h;
    return `(min-width:1024px) ${Math.ceil(66 * Math.max(r, 9 / 16))}vh, max(100vw, ${Math.ceil(100 * r)}vh)`;
  };

  strip.innerHTML = list
    .map((s) => `
      <button type="button" class="luci-btn" style="--light:${s.light}" data-luci-id="${s.id}" aria-pressed="false" aria-label="${s.name}">
        <span class="luci-dot" aria-hidden="true"></span>${shortName(s)}
        <span class="luci-progress" aria-hidden="true"></span>
      </button>`)
    .join('');
  const buttons = [...strip.children];

  let current = 0;
  let token = 0;
  let stopped = reducedMotion;
  let progress;
  const holds = new Set();

  function renderCaption() {
    const s = list[current];
    caption.innerHTML = `
      <span class="flex items-center gap-2.5 font-display text-[1.6rem] leading-tight"><span class="light-dot shrink-0"></span>${s.name}</span>
      <span class="mt-1 block text-[0.95rem] text-avorio/80">${s.tagline}</span>
      <span class="mt-4 flex items-baseline justify-between gap-4">
        <span class="text-sm text-nebbia">da <span class="font-display text-[1.3rem] text-avorio">${euro(s.prices[state.mode])}</span> ${priceUnit(state.mode)}</span>
        <span class="text-sm text-candela underline decoration-candela/40 underline-offset-4">Scopri la suite</span>
      </span>`;
  }

  function setGlow(light, animate) {
    const layer = glow.firstElementChild;
    ['--amb-1', '--amb-2', '--amb-3'].forEach((p) => layer.style.setProperty(p, light));
    glow.append(layer);
    if (animate) layer.animate({ opacity: [0, 1] }, { duration: 1000, easing: 'linear' });
  }

  async function setPhoto(s) {
    const mine = ++token;
    const name = PHOTOS[s.id];
    const img = photos.firstElementChild;
    const a = imgAttrs(name, sizesFor(name));
    img.sizes = a.sizes;
    img.srcset = a.srcset;
    img.src = a.src;
    img.alt = `${s.name}: ${s.tagline.toLowerCase()}`;
    await img.decode().catch(() => {});
    if (mine !== token) return; // nel frattempo è stata scelta un'altra suite
    photos.append(img);
    img.animate({ opacity: [0, 1] }, { duration: reducedMotion ? 0 : 700, easing: 'ease-out' });
  }

  function show(i, { animate = true } = {}) {
    current = (i + list.length) % list.length;
    const s = list[current];
    hero.style.setProperty('--light', s.light);
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === current)));
    select.value = s.id;
    renderCaption();
    setGlow(s.light, animate && !reducedMotion);
    if (animate) setPhoto(s);
    restartProgress();
    const next = list[(current + 1) % list.length];
    prefetch(PHOTOS[next.id], sizesFor(PHOTOS[next.id]));
  }

  /* ---------- Scorrimento automatico ----------
     La barretta sotto la suite attiva è un'animazione: quando arriva in fondo
     passa alla suite successiva. Si ferma del tutto appena l'utente sceglie. */
  function restartProgress() {
    progress?.cancel();
    if (stopped) return;
    const bar = buttons[current].querySelector('.luci-progress');
    progress = bar.animate({ transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: DURATION, easing: 'linear' });
    progress.onfinish = () => show(current + 1);
    if (holds.size) progress.pause();
  }
  const hold = (reason, on) => {
    if (on) holds.add(reason);
    else holds.delete(reason);
    if (!progress || stopped) return;
    if (holds.size) progress.pause();
    else progress.play();
  };
  const stop = () => {
    stopped = true;
    progress?.cancel();
  };

  strip.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-luci-id]');
    if (!btn) return;
    stop();
    show(buttons.indexOf(btn));
  });
  caption.addEventListener('click', () => openRoom(list[current].id));
  select.addEventListener('change', () => {
    stop();
    const i = list.findIndex((s) => s.id === select.value);
    if (i >= 0) show(i);
  });
  // Chi sta compilando il modulo non deve vedersi cambiare la suite sotto gli occhi
  form.addEventListener('focusin', stop);

  [strip, $('[data-luci-stage]')].forEach((el) => {
    el.addEventListener('pointerenter', () => hold('hover', true));
    el.addEventListener('pointerleave', () => hold('hover', false));
  });
  new IntersectionObserver(([entry]) => hold('view', !entry.isIntersecting)).observe(hero);
  document.querySelectorAll('dialog').forEach((d) =>
    new MutationObserver(() => hold('dialog', d.open)).observe(d, { attributes: true, attributeFilter: ['open'] }));
  onModeChange(renderCaption);

  show(0, { animate: false });
}
