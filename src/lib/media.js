import media from '../data/media.json';

const url = (name, size) => `media/${name}-${size}.webp`;

/** Attributi <img> responsive per una foto del manifest. */
export function imgAttrs(name, sizes = '100vw') {
  const m = media.images[name];
  if (!m) throw new Error(`Foto non trovata: ${name}`);
  return {
    src: url(name, m.sizes.at(-2) ?? m.sizes[0]),
    srcset: m.sizes.map((s) => `${url(name, s)} ${s}w`).join(', '),
    sizes,
    width: m.w,
    height: m.h,
    style: `background-color:${m.color}`,
  };
}

/** Markup <img> come stringa. */
export function img(name, { sizes, alt = '', className = '', lazy = true } = {}) {
  const a = imgAttrs(name, sizes);
  return `<img src="${a.src}" srcset="${a.srcset}" sizes="${a.sizes}" width="${a.width}" height="${a.height}"
    style="${a.style}" alt="${alt}" class="${className}" decoding="async" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} />`;
}

/** Completa gli <img data-img="nome"> scritti a mano nell'HTML. */
export function hydrateImages(root = document) {
  root.querySelectorAll('img[data-img]').forEach((el) => {
    const a = imgAttrs(el.dataset.img, el.dataset.sizes);
    el.srcset = a.srcset;
    el.sizes = a.sizes;
    el.src = a.src;
    el.width = a.width;
    el.height = a.height;
    el.style.backgroundColor = media.images[el.dataset.img].color;
  });
}

/** Scarica in anticipo una foto (es. al passaggio sulla card), così la scheda si apre già pronta. */
const warmed = new Set();
export function prefetch(name, sizes = '100vw') {
  if (warmed.has(name)) return;
  warmed.add(name);
  const a = imgAttrs(name, sizes);
  const im = new Image();
  im.decoding = 'async';
  im.sizes = a.sizes;
  im.srcset = a.srcset;
  im.src = a.src;
  im.decode?.().catch(() => {});
}
export const imageMeta = (name) => media.images[name];
