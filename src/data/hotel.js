// Tutti i contenuti modificabili del sito: contatti, camere, prezzi, orari.
// Prezzi e descrizioni presi da orizzontehotel.it (ottobre 2026).

export const hotel = {
  name: 'Hotel Orizzonte',
  phone: '081 509 0433',
  phoneHref: 'tel:+390815090433',
  whatsapp: '390815090433',
  email: 'info@orizzontehotel.it',
  address: 'Via San Francesco a Patria 189',
  city: '80014 Giugliano in Campania (NA)',
  mapsQuery: 'Hotel Orizzonte, Via San Francesco a Patria 189, Giugliano in Campania',
  instagram: 'https://www.instagram.com/orizzontehotelreal',
  facebook: 'https://www.facebook.com/orizzontehotel',
};

export const extras = [
  { id: 'dolci', label: 'Dolci momenti', detail: 'Prosecco con dolci o frutta in camera', price: 35 },
];

// `light` è il colore della luce della camera: tinge l'alone della card e del pannello.
export const suites = [
  {
    id: 'spa',
    name: 'Suite SPA',
    kind: 'suite',
    light: '#6a5cff',
    tagline: 'Una spa privata, solo per voi due',
    description:
      'La punta di diamante dell’hotel. Vasca idromassaggio con cromoterapia, audio-terapia e aromaterapia, sauna, bagno turco, doccia emozionale e hammam, più una terrazza privata con braciere.',
    features: ['Idromassaggio con cromoterapia', 'Sauna e bagno turco', 'Doccia emozionale e hammam', 'Terrazza privata', 'iPad per la musica', 'TV 42" con Sky', 'Minibar incluso'],
    prices: { sosta: 280, pernottamento: 380 },
    images: ['spa-onice', 'spa-terrazza', 'spa-letto', 'spa-sauna', 'spa-teli', 'spa-terrazza-2'],
  },
  {
    id: 'amalfi',
    name: 'Suite Amalfi',
    kind: 'suite',
    light: '#3d8fd6',
    tagline: 'La Costiera, senza uscire di camera',
    description:
      'Toni freschi, maioliche blu e marmi chiari: la luce di una giornata al mare. Ampia vasca con cromoterapia, arredi morbidi e smart TV.',
    features: ['Vasca con cromoterapia', 'Smart TV', 'Minibar incluso', 'Kit di cortesia'],
    prices: { sosta: 130, pernottamento: 170 },
    images: ['amalfi-vasca', 'amalfi-letto', 'amalfi-vasca-2', 'amalfi-bagno', 'amalfi-camera'],
  },
  {
    id: 'black',
    name: 'Black Suite',
    kind: 'suite',
    light: '#c2302a',
    tagline: 'Nero, velluto rosso e una vasca di design',
    description:
      'L’ultima arrivata: atmosfera di assoluta intimità, vasca di design nera, doccia in vetro con doppio soffione a cascata, cromoterapia e idromassaggio. Bluetooth privato collegato alla filodiffusione.',
    features: ['Vasca di design', 'Doccia a cascata con idromassaggio', 'Cromoterapia', 'Smart TV a specchio', 'Bluetooth in camera', 'Minibar incluso'],
    prices: { sosta: 130, pernottamento: 170 },
    images: ['black-vasca', 'black-letto', 'black-doccia', 'black-camera'],
  },
  {
    id: 'orizzonte',
    name: 'Suite Orizzonte',
    kind: 'suite',
    light: '#e0407a',
    tagline: 'Idromassaggio per due sotto un cielo di luci',
    description:
      'Ampia vasca idromassaggio per due persone, luci di cromoterapia che cambiano colore e TV 42" a specchio. Un rifugio per attimi di assoluta intimità.',
    features: ['Idromassaggio per due', 'Cromoterapia', 'TV 42" a specchio', 'Cassetta di sicurezza', 'Minibar incluso'],
    prices: { sosta: 130, pernottamento: 170 },
    images: ['orizzonte-letto', 'orizzonte-vasca', 'orizzonte-viola', 'orizzonte-rosso'],
  },
  {
    id: 'luxury',
    name: 'Junior Suite Luxury',
    kind: 'junior',
    light: '#3f9d80',
    tagline: 'Marmo, vetro nero e luce calda',
    description:
      'Design contemporaneo con finiture in marmo, piano in vetro nero specchiato con smart TV, lavabo incassato in marmo pregiato e doccia a doppio soffione.',
    features: ['Finiture in marmo', 'Doppio soffione', 'Smart TV a specchio', 'Minibar incluso'],
    prices: { sosta: 100, pernottamento: 135 },
    images: ['luxury-camera', 'luxury-marmo', 'luxury-letto', 'luxury-bagno'],
  },
  {
    id: 'bubble',
    name: 'Junior Suite Bubble',
    kind: 'junior',
    light: '#a88be6',
    tagline: 'Letto tondo e bolle di luce',
    description:
      'Colori e forme fuori dall’ordinario: letto tondo, cromoterapia con tecnologia a specchio e TV LED 42" con Sky.',
    features: ['Letto tondo', 'Cromoterapia', 'TV 42" con Sky', 'Minibar incluso'],
    prices: { sosta: 80, pernottamento: 110 },
    images: ['bubble-letto', 'bubble-camera', 'bubble-cuscini', 'bubble-dettaglio'],
  },
  {
    id: 'savana',
    name: 'Junior Suite Savana',
    kind: 'junior',
    light: '#d6963a',
    tagline: 'Maculato, luci basse e doccia per due',
    description:
      'Un’oasi dal design ricercato per chi cerca emozioni forti: doccia idromassaggio, cromoterapia per due persone e TV 42" con Sky.',
    features: ['Doccia idromassaggio', 'Cromoterapia per due', 'TV 42" con Sky', 'Minibar incluso'],
    prices: { sosta: 70, pernottamento: 110 },
    images: ['savana-letto', 'savana-camera', 'savana-dettaglio'],
  },
  {
    id: 'tigrata',
    name: 'Junior Suite Tigrata',
    kind: 'junior',
    light: '#b8804c',
    tagline: 'Un design fuori dagli schemi',
    description:
      'Una suite non convenzionale, ideale per soste o pernottamenti da condividere con la persona amata: doccia idromassaggio, cromoterapia per due e TV 42" con Sky.',
    features: ['Doccia idromassaggio', 'Cromoterapia per due', 'TV 42" con Sky', 'Minibar incluso'],
    prices: { sosta: 70, pernottamento: 110 },
    images: ['tigrata-letto', 'tigrata-camera', 'tigrata-bagno'],
  },
  {
    id: 'superior',
    name: 'Camera Deluxe Superior',
    kind: 'camera',
    light: '#1d9c9a',
    tagline: 'Il design dell’hotel a un prezzo accessibile',
    description: 'Concept ricercato e gli stessi standard delle suite. TV con Sky e minibar incluso.',
    features: ['TV con Sky', 'Minibar incluso'],
    prices: { sosta: 48, pernottamento: 90 },
    images: ['superior-letto', 'superior-camera'],
  },
  {
    id: 'deluxe',
    name: 'Camera Deluxe',
    kind: 'camera',
    light: '#c9a77c',
    tagline: 'Semplice ed elegante',
    description: 'Ogni comfort per la coppia: TV con Sky e minibar incluso. Disponibile anche come tripla.',
    features: ['TV con Sky', 'Minibar incluso', 'Anche tripla'],
    prices: { sosta: 43, pernottamento: 80 },
    images: ['deluxe-letto', 'deluxe-camera'],
  },
  {
    id: 'classic',
    name: 'Camera Standard',
    kind: 'camera',
    light: '#c98a4a',
    tagline: 'Tutto il necessario, con stile',
    description: 'Semplice ed elegante: TV e minibar incluso nel prezzo.',
    features: ['TV', 'Minibar incluso'],
    prices: { sosta: 35, pernottamento: 68 },
    images: ['classic-letto', 'classic-camera'],
  },
];

export const restaurantHours = [
  ['Lunedì – Mercoledì', '12:00 – 24:00'],
  ['Giovedì', '12:00 – 01:00'],
  ['Venerdì', '12:00 – 02:00'],
  ['Sabato', '12:00 – 03:00'],
  ['Domenica', '12:00 – 01:00'],
];
