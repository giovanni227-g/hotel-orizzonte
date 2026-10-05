// Elenco delle foto e dei video usati nel sito.
// Le sorgenti sono le immagini originali pubblicate su orizzontehotel.it.
// Per cambiare una foto: modifica l'URL qui sotto e lancia `npm run media`.

const WP = 'https://www.orizzontehotel.it/wp-content/uploads/';

export const images = {
  // Suite SPA
  'spa-onice':      WP + '2014/05/WhatsApp-Image-2023-01-02-at-17.41.14.jpeg',
  'spa-letto':      WP + '2014/04/10.jpg',
  'spa-terrazza':   WP + '2014/05/DSC04413.jpg',
  'spa-terrazza-2': WP + '2014/05/DSC04417.jpg',
  'spa-sauna':      WP + '2014/04/131.jpg',
  'spa-teli':       WP + '2014/05/WhatsApp-Image-2023-01-24-at-16.37.30-2.jpeg',
  'spa-camera':     WP + '2014/05/DSC04442.jpg',

  // Suite Amalfi
  'amalfi-vasca':   WP + '2024/11/amalfi_1-1.jpg',
  'amalfi-letto':   WP + '2024/11/amalfi_5.jpg',
  'amalfi-vasca-2': WP + '2024/11/amalfi_10.jpg',
  'amalfi-bagno':   WP + '2024/11/amalfi_13.jpg',
  'amalfi-camera':  WP + '2024/11/amalfi_4.jpg',

  // Black Suite
  'black-vasca':    WP + '2019/11/DSC8664.jpg',
  'black-letto':    WP + '2019/11/DSC8982.jpg',
  'black-doccia':   WP + '2019/11/DSC8709.jpg',
  'black-camera':   WP + '2019/11/DSC8722.jpg',

  // Suite Orizzonte
  'orizzonte-vasca':  WP + '2014/04/Orizzonte_bagno02_blu.jpg',
  'orizzonte-letto':  WP + '2014/04/WhatsApp-Image-2021-08-05-at-20.23.23.jpeg',
  'orizzonte-viola':  WP + '2014/04/Orizzonte_bagno02_violaLR.jpg',
  'orizzonte-rosso':  WP + '2014/04/Orizzonte_bagno01_rossoLR.jpg',

  // Junior Suite Luxury
  'luxury-camera':  WP + '2022/03/camera1.jpeg',
  'luxury-letto':   WP + '2022/03/camera2.jpeg',
  'luxury-marmo':   WP + '2022/03/BAGNO-109-3.jpeg',
  'luxury-bagno':   WP + '2022/03/BAGNO-109-1.jpeg',

  // Junior Suite Bubble
  'bubble-letto':   WP + '2016/08/H.O.-3893.jpg',
  'bubble-camera':  WP + '2016/08/09.jpg',
  'bubble-dettaglio': WP + '2016/08/06.jpg',
  'bubble-cuscini': WP + '2016/08/H.O.-3896.jpg',

  // Junior Suite Savana
  'savana-letto':   WP + '2014/04/14.jpg',
  'savana-camera':  WP + '2014/04/34.jpg',
  'savana-dettaglio': WP + '2014/04/44.jpg',

  // Junior Suite Tigrata
  'tigrata-letto':  WP + '2014/04/26.jpg',
  'tigrata-camera': WP + '2014/04/18.jpg',
  'tigrata-bagno':  WP + '2014/04/46.jpg',

  // Camere
  'superior-letto': WP + '2019/11/Deluxe-Superior-1.jpg',
  'superior-camera': WP + '2019/11/Deluxe-Superior-3.jpg',
  'deluxe-letto':   WP + '2014/04/H.O.-3955.jpg',
  'deluxe-camera':  WP + '2014/04/H.O.-3945.jpg',
  'classic-letto':  WP + '2015/01/01.jpg',
  'classic-camera': WP + '2015/01/04.jpg',

  // Ristorante e lounge bar
  'ristorante-sala':   WP + '2022/06/ristorante-orizzonte-hotel.jpg',
  'ristorante-sala-2': WP + '2022/06/ristorante-orizzonte-hotel-2.jpg',
  'ristorante-sala-3': WP + '2022/06/ristorante-orizzonte-hotel-3.jpg',
  'piatto-pasta':      WP + '2022/03/WhatsApp-Image-2022-03-04-at-18.35.03.jpeg',
  'piatto-tagliata':   WP + '2022/03/WhatsApp-Image-2022-03-04-at-18.35.03-1.jpeg',
  'piatto-risotto':    WP + '2022/03/WhatsApp-Image-2022-03-04-at-18.35.04.jpeg',
  'bar-drink':         WP + '2022/04/23drink.jpg',
  'bar-bottiglie':     WP + '2022/04/22drink.jpg',

  // Struttura
  'esterno-notte':  WP + '2014/05/61.jpg',
  'reception':      WP + '2014/05/31.jpg',
  'corridoio':      WP + '2015/01/07.jpg',
};

// Video verticali (formato storie) — vengono tagliati e compressi per il web.
// Il video della Suite SPA non è più usato nell'hero. Per ripristinarlo:
//   hero: { src: WP + '2024/08/spa.mp4', start: 12, duration: 14 },
export const videos = {};

// Larghezze generate per ogni foto (srcset).
export const widths = [640, 1080, 1600];
