# CROSS preview

## Preview routes

Studio images supplied by the owner in `Downloads/photos_mockup_2/1.png` through `6.png`: 1 Premium, 2 U2, 3 Titan 2 Pro, 4 Titan Pro, 5 Monster 2 Pro, 6 Monster Pro. Converted to WebP for both mockups. These are generated/edited product illustrations, not new documentary photographs. Mockup 1 now includes all six model pages. Mockup 2 includes a battery catalogue (21/30/45 Ah; standalone prices unknown) and a photo strip from channel export photos 6, 66, 68. Photo 66 documents a room with bicycles; its location is not independently established. Parts are mentioned in service post 89, but no SKU catalogue was present in the export.

- `/`: mockup selector.
- `/mockup-1/`: original photographic storefront restored from commit `1dce5bd`, including its catalogue, model and comparison routes.
- `/mockup-2/`: courier product feed and battery/seat configurator.

Each mockup has independent entry files and relative assets. Future mockups should be added as separate directories and linked from the selector. CRM is not connected.

Static storefront prototype. GitHub Pages deploys `public/` on pushes to `main`.

Run locally:

```sh
python3 -m http.server 4173 --directory public
```

Order forms demonstrate the interaction only. They do not send orders or store customer details. Social icons are visual placeholders.

The main landing now previews ten CROSS variants with real channel photographs and a battery/seat configurator. Saved configurations stay in localStorage; no order is sent. Seat compatibility and surcharges are provisional. Published channel prices are historical. Other routes retain the earlier prototype.

Catalogue photo provenance: CROSS BIKE Telegram export dated 2026-11-14, photos 3, 10, 15, 22, 32, 36, 49, 56, 59, 71. WebP conversions preserve the originals' content. Model data comes from channel posts 15, 22, 29, 36, 43, 50, 57, 64, 77, 98 at https://t.me/crossbike24.

All routes and assets support hosting either at the domain root or in a project subdirectory.
