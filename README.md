# Hotel Orizzonte

Sito one-page per Hotel Orizzonte, hotel con suite a tema a Giugliano in Campania (NA).

Fatto con Vite, Tailwind CSS 4 e JavaScript senza framework.

## Avvio

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build in dist/
npm run preview   # anteprima della build
```

## Cosa c'è dentro

- Hero con le suite che cambiano foto e colore della luce, scelta della suite collegata al form di prenotazione.
- Scheda di ogni camera con galleria, formula sosta/pernottamento, extra e totale calcolato.
- La richiesta di disponibilità parte su WhatsApp con il messaggio già compilato.
- Galleria con lightbox (tastiera e swipe).
- Su telefono i link della mappa aprono direttamente Mappe (iOS) o l'app di navigazione (Android).

## Contenuti

Camere, prezzi, contatti e orari del ristorante stanno tutti in `src/data/hotel.js`.
I testi delle sezioni sono in `index.html`, colori e font in `src/styles.css`.

## Foto

Le foto vengono dal sito dell'hotel. L'elenco è in `scripts/media-manifest.mjs`:
`npm run media` le scarica, le converte in WebP a più larghezze in `public/media/`
e aggiorna `src/data/media.json`.

## Struttura

```text
index.html            markup
src/main.js           navigazione, prenotazione rapida, mappe, ristorante
src/hero.js           hero con le suite
src/rooms.js          card e scheda camera
src/gallery.js        galleria e lightbox
src/lib/booking.js    stato della prenotazione e link WhatsApp
src/lib/media.js      immagini responsive
src/data/             contenuti e manifest delle foto
scripts/              download e ottimizzazione delle foto
```
