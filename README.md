# Ration kit

Anlatım videolarını **veri olarak** yazmak için bir motor ve büyüyen bir çizim kütüphanesi.
Film yazan yapay zekâ çizim kodu yazmıyor. Sadece "ne, ne zaman, nerede görünsün" bilgisini yazıyor; çizimi kit yapıyor.

```js
import { film } from '../../engine/kit/film.js';
export default film({
  theme: 'night', brand: 'ONLINE FPS · ATEŞİN ARKA PLANI',
  lines: ['Online bir FPS oyununda ateş ettiğinde arka planda ne oluyor?', '…'],
  scenes: [{ name: 'hook', from: 0, cues: [
    { do: 'title', text: 'ATEŞ ETTİN.', at: 0.3 },
    { do: 'icon', id: 'ch', name: 'crosshair', x: 540, y: 1050, size: 340, anim: 'draw' },
    { do: 'hit', target: 'ch', at: 'ateş' },
  ] }],
});
```

## İçindekiler
- `engine/kit/film.js`: kit motoru. İçinde ~25 fiil (başlık, ikon, kart, paket, can barı, sayaç, tick çizgisi, ışın, asset…), anlatıma göre zamanlama, altyazı, geçişler ve HUD var.
- `engine/kit/KIT.md`: film yazan yapay zekâ için kılavuz.
- `engine/kit/ASSETS.md`: çizim (asset) sözleşmesi.
- `engine/kit/CATEGORIES.md`: çizilecek kategoriler ve öncelikleri.
- `engine/kit/BACKLOG.md`: filmlerden gelen çizim istekleri.
- `prompts/MUSE_ASSETS.md`: çizim ajanının görev tanımı.
- `tools/kit-asset.mjs`: çizim araçları: `new` / `check` / `build` / `approve` / `find`.
- `tools/kit-music.mjs`: lisanslı müzik havuzu: `add` / `list` / `mix` / `credits`.
- `tools/kit-api/`: `direct.mjs` (brief'ten film yazdırır, gerçek maliyeti raporlar) ve `asset-agent.mjs` (istek listesinden çizim yapar).
- `examples/fps-kit`, `examples/fps-api-opus`, `examples/fps-api-sonnet`: 1 dakikalık örnek filmler.
- `ENGINE.md`: alttaki ft-motion motorunun belgeleri.

## Kurulum
Node 18+, ffmpeg ve Chrome/Chromium/Edge gerekir.

```bash
npm install
node tools/kit-sync.mjs examples/fps-kit
node ft.mjs sheet examples/fps-kit 16
node ft.mjs render examples/fps-kit
```

## Ölçülen maliyet (API, 1 dakikalık FPS filmi)

| Model | Yazım | Yazım + 1 görsel kontrol turu |
|---|---|---|
| Claude Opus 5.5 (low effort) | $0,10 | $0,23 |
| Claude Sonnet 5.5 (low effort) | $0,05 | $0,11 |

## Lisans
- Motor: ft-motion, Serhat Demir, MIT lisansı ([LICENSE](LICENSE)).
- İkonlar: [Lucide](https://lucide.dev), ISC lisansı (`engine/kit/ICONS-LICENSE.txt`).
