# School logos

One SVG per school, named after that school's `id` in `seed.js`. The app
renders `logos/<id>.svg` in front of each school name, and falls back to
`_fallback.svg` if a file is missing.

## What these are

**These are not the schools' real logos.** They are monogram badges drawn
for this app: a rounded square in the school's brand colour with its
initials set in a serif face. Real university crests and wordmarks are
trademarks — they can't be redistributed in a public repo without
permission, so this app ships its own marks instead.

The colours are each school's publicly known brand colour, which is why the
badges still read as "Wharton navy" or "MIT red" at a glance.

## Swapping in real logos

If you have the right to use a school's actual logo, drop it in and the app
picks it up with no code change:

1. Name the file exactly `<school id>.svg` (or `.png`) — the ids are listed
   below.
2. If you use a format other than SVG, update the `src` in `renderSchools()`
   in `index.html`, which currently hardcodes `.svg`.
3. Add the filename to the `LOGOS` array in `sw.js` if the name changes, and
   bump `CACHE_VERSION` so devices re-fetch.

Square marks work best. They're rendered at 30×30 (28×28 on phones) with a
7px corner radius, and `object-fit: contain`, so anything roughly square
will sit correctly without distortion.

## The ids

| id | school | badge | colour |
|---|---|---|---|
| `cambridge-emba` | Cambridge Judge EMBA | CJ | `#8AB8A8` |
| `insead-gemba` | INSEAD GEMBA | IN | `#B01C2E` |
| `imd-emba` | IMD EMBA | IMD | `#004B87` |
| `oxford-said` | Oxford Saïd EMBA | OX | `#002147` |
| `lbs-emba` | LBS EMBA | LBS | `#9E1B32` |
| `trium` | TRIUM Global EMBA | TR | `#00694E` |
| `iese-gemba` | IESE Global EMBA | IE | `#0033A0` |
| `booth-emba` | Chicago Booth EMBA (London) | CB | `#800000` |
| `cambridge-global` | Cambridge Global EMBA | CG | `#6EA8A0` |
| `wharton-emba` | Wharton EMBA | WH | `#011F5B` |
| `columbia-lbs` | Columbia/LBS EMBA-Global | CL | `#75AADB` |
| `kellogg-emba` | Kellogg EMBA | KG | `#4E2A84` |
| `mit-sloan` | MIT Sloan Fellows | MIT | `#A31F34` |
| `hec-paris` | HEC Paris EMBA | HEC | `#00447C` |
| `escp-emba` | ESCP EMBA | ES | `#C8102E` |
| `sda-bocconi` | SDA Bocconi EMBA | SB | `#002D62` |
| `imperial-emba` | Imperial College EMBA | IC | `#003E74` |
| `manchester-gemba` | Manchester Global EMBA | MB | `#6B2C91` |

`_fallback.svg` is the grey "?" badge used when a file is missing.

These badges keep their own colours in both light and dark mode — they are
brand marks, not themed UI.
