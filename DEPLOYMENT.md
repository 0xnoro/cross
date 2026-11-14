# CROSS preview

Static storefront prototype. GitHub Pages deploys `public/` on pushes to `main`.

Run locally:

```sh
python3 -m http.server 4173 --directory public
```

Order forms demonstrate the interaction only. They do not send orders or store customer details. Social icons are visual placeholders.

The main landing now previews ten CROSS variants with real channel photographs and a battery/seat configurator. Saved configurations stay in localStorage; no order is sent. Seat compatibility and surcharges are provisional. Published channel prices are historical. Other routes retain the earlier prototype.

Catalogue photo provenance: CROSS BIKE Telegram export dated 2026-11-14, photos 3, 10, 15, 22, 32, 36, 49, 56, 59, 71. WebP conversions preserve the originals' content. Model data comes from channel posts 15, 22, 29, 36, 43, 50, 57, 64, 77, 98 at https://t.me/crossbike24.

All routes and assets support hosting either at the domain root or in a project subdirectory.
