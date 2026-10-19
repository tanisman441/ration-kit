// character-actions/wave — el sallayan insan figürü. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'wave',
  category: 'character-actions',
  desc: 'El sallayan insan figürü; kol kalkar, el yana salınır, sonra iner',
  tags: ['el sallama', 'selam', 'merhaba', 'veda', 'sallamak', 'wave', 'waving', 'hello', 'goodbye'],
  box: [-120, -345, 140, 24],
  bleed: 25,
  anchor: 'ayaklar (0,0); sağ el yukarıda sallanır',
  points: { head: [8, -262], hand: [88, -298], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
    wave: { type: 'time', default: null, desc: 'el sallama anı; null ise sürekli yavaşça sallar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const continuous = p.wave == null;
    const d = continuous ? 0 : t - p.wave;
    const br = Math.sin(t * k.TAU / 2.4) * 2;               // nefes
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;               // göz kırpma

    // kol kalkma miktarı: 0.3 sn'de kalkar, 1.0 sn sallar, 0.3 sn'de iner
    const raise = continuous ? 1 : sstep(-0.3, 0, d) * (1 - sstep(1.0, 1.3, d));
    const waving = continuous || (d >= 0 && d < 1.0);
    const wPhase = continuous ? t * k.TAU / 1.2 : d * k.TAU / 0.32;
    const waveAmp = (continuous ? 14 : 26) * (waving ? 1 : 0);
    const bounce = waving ? Math.abs(Math.sin(wPhase)) * 4 * raise : 0;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130 - bounce * 0.4, shoY = -206 - bounce - br * 0.5;

    // bacaklar
    for (const s of [-1, 1]) {
      const fx = s * 13, fy = -16;
      limb(s * 13, hipY, fx, fy - 6, 20, body);
      blob(fx - 12, -13, 24, 13, 6, body);
    }

    // gövde (sallanan ele hafifçe eğilir)
    const tiltX = 8 * raise;
    blob(-31 + tiltX * 0.4, -240 - bounce * 0.5 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(17 + tiltX * 0.4, -152 - bounce * 0.5, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // sol kol: yanda, hafif salınım
    const swayL = Math.sin(t * 1.4) * 4;
    limb(-29, shoY, -37 + swayL, -134 - bounce * 0.3, 18, body);
    disc(-37 + swayL, -134 - bounce * 0.3, 10, 10, body);

    // sağ kol: yukarı kalkar, el yana salınır
    const shx = 29, shy = shoY;
    const handX = 88 + Math.sin(wPhase) * waveAmp;
    const handY = -298 - bounce + Math.cos(wPhase * 2) * 6 * (waving ? 1 : 0);
    // raise ile omuzdan ele geçiş: kalkık poz ↔ yandaki poz
    const downX = 37, downY = -134;
    const tx = downX + (handX - downX) * raise, ty = downY + (handY - downY) * raise;
    const ebx = shx + (tx - shx) * 0.5 + 12 * raise, eby = shy + (ty - shy) * 0.5 - 8 * raise;
    limb(shx, shy, ebx, eby, 18, body);
    limb(ebx, eby, tx, ty, 15, body);
    disc(tx, ty, 10, 10, body);

    // sallanma yayları (el hareketini vurgular)
    if (waving && raise > 0.5) {
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const rr = 26 + i * 14;
        const a0 = -0.5 + Math.sin(wPhase) * 0.3;
        ctx.beginPath(); ctx.arc(tx, ty, rr, a0 - 0.6, a0 + 0.6); ctx.stroke();
      }
    }

    // baş (sallanan ele hafif eğik)
    const hbx = tiltX, hby = -250 - bounce * 0.6 - br * 0.6;
    disc(hbx, hby, 36, 34, body);

    // yüz
    const ey = hby - 2, ex = 10;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex + hbx, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 5 : 4;
        ctx.beginPath(); ctx.ellipse(s * ex + hbx, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hbx, hby + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hbx, hby + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hbx, hby + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hbx - 8, hby + 12); ctx.lineTo(hbx + 8, hby + 12); ctx.stroke(); }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-15 + tiltX * 0.4, -214 - bounce * 0.5, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
