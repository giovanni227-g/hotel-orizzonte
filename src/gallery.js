// Galleria "Dentro l'hotel" con lightbox (tastiera, swipe, frecce).
import { img, imgAttrs, imageMeta } from './lib/media.js';

const photos = [
  ['spa-terrazza-2', 'La terrazza privata della Suite SPA'],
  ['black-vasca', 'La vasca nera della Black Suite'],
  ['amalfi-vasca', 'La vasca della Suite Amalfi'],
  ['spa-sauna', 'La sauna della Suite SPA'],
  ['orizzonte-vasca', 'Idromassaggio per due nella Suite Orizzonte'],
  ['reception', 'La reception'],
  ['bubble-camera', 'La Junior Suite Bubble'],
  ['luxury-marmo', 'Il bagno in marmo della Junior Suite Luxury'],
  ['ristorante-sala-3', 'Il ristorante'],
  ['savana-letto', 'La Junior Suite Savana'],
  ['bar-bottiglie', 'Il lounge bar'],
  ['superior-letto', 'La camera Deluxe Superior'],
  ['spa-teli', 'Teli e parete in onice nella Suite SPA'],
  ['piatto-risotto', 'Un piatto del ristorante'],
  ['corridoio', 'I corridoi dell’hotel'],
  ['amalfi-letto', 'La Suite Amalfi'],
];

export function initGallery() {
  const grid = document.querySelector('#gallery');
  grid.innerHTML = photos
    .map(([name, alt], i) => {
      const m = imageMeta(name);
      return `<button type="button" class="group block w-full overflow-hidden rounded-[1rem] break-inside-avoid" data-photo="${i}" aria-label="Ingrandisci: ${alt}">
        ${img(name, { sizes: '(min-width:1024px) 25vw, 50vw', alt, className: 'w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]' })}
      </button>`.replace('class="w-full', `style="aspect-ratio:${m.w}/${m.h}" class="w-full`);
    })
    .join('');

  const dialog = document.querySelector('#lightbox');
  const panel = document.querySelector('#lightboxPanel');
  let index = 0;

  const show = (i) => {
    index = (i + photos.length) % photos.length;
    const [name, alt] = photos[index];
    const a = imgAttrs(name, '100vw');
    panel.innerHTML = `
      <figure class="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-10">
        <img src="${a.src}" srcset="${a.srcset}" sizes="(min-width:1024px) 80vw, 100vw" alt="${alt}" class="max-h-[80vh] w-auto max-w-full rounded-xl object-contain" />
        <figcaption class="text-center text-nebbia">${alt} <span class="ml-2 tabular-nums">${index + 1} / ${photos.length}</span></figcaption>
      </figure>
      <button type="button" class="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-velluto/80 hover:bg-velluto" data-close aria-label="Chiudi la galleria"><svg class="size-5"><use href="#i-close"/></svg></button>
      <button type="button" class="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-velluto/80 hover:bg-velluto sm:left-6" data-step="-1" aria-label="Foto precedente"><svg class="size-5"><use href="#i-left"/></svg></button>
      <button type="button" class="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-velluto/80 hover:bg-velluto sm:right-6" data-step="1" aria-label="Foto successiva"><svg class="size-5"><use href="#i-right"/></svg></button>`;
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-photo]');
    if (!btn) return;
    show(Number(btn.dataset.photo));
    dialog.showModal();
  });
  dialog.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) return show(index + Number(step.dataset.step));
    if (e.target.closest('[data-close]') || e.target === panel) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  // Swipe su mobile
  let x0 = null;
  panel.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  panel.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}
