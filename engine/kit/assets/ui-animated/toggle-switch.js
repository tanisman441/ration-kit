// ui-animated/toggle-switch — açma/kapama anahtarı; `at` anında düğme
// kayar, ray rengi dim → green geçişi yapar, hafif overshoot ile yerine oturur.
// Contract: engine/kit/ASSETS.md — parlama düğme üzerinde (bilgi yüzeyi değil).
export default {
  name: 'toggle-switch',
  category: 'ui-animated',
  desc: 'Açma/kapama anahtarı; at anında düğme kayar ve ray rengi geçiş yapar',
  tags: ['toggle', 'anahtar', 'açma', 'kapama', 'düğme', 'ayar', 'switch', 'on off', 'geçiş', 'toggle switch'],
  box: [-140, -80, 140, 80],
  bleed: 20,
  anchor: 'anahtar merkezi (0,0)',
  points: { knobOff: [-52, 0], knobOn: [52, 0] },
  params: {
    state: { type: 'enum', values: ['off', 'on'], default: 'on', desc: 'anahtar konumu' },
    at: { type: 'time', default: null, desc: 'geçiş anı: düğme kayar' },
  },
  draw(ctx, t, p, k) {
    const TW = 232, TH = 116, TR = 58, KR = 44;
    const d = p.at == null ? 999 : t - p.at;
    if (d < 0) return;
    // geçiş: 0.35 sn, hafif overshoot ile
    const e = p.at == null ? 1 : k.E.outBack(k.clamp(d / 0.35, 0, 1), 1.6);
    const on = p.state === 'on';
    const target = on ? 1 : 0;
    const start = 1 - target;                 // geçiş öncesi konum
    const prog = p.at == null ? target : start + (target - start) * e;
    const kx = k.lerp(-TW / 2 + KR + 8, TW / 2 - KR - 8, k.clamp(prog, -0.08, 1.08));
    const alpha = k.clamp(d / 0.15, 0, 1);
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';

    ctx.save();
    ctx.globalAlpha = alpha;

    // ray: taban + green kaplama (geçiş oranıyla)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-TW / 2 - 3, -TH / 2 - 3, TW + 6, TH + 6, TR + 3); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-TW / 2, -TH / 2, TW, TH, TR); ctx.fill();
    const gg = k.clamp(prog, 0, 1);
    if (gg > 0) {
      ctx.fillStyle = k.rgba('green', gg);
      ctx.beginPath(); k.rrect(-TW / 2, -TH / 2, TW, TH, TR); ctx.fill();
    }

    // iç gölge hissi (ray altı, ince)
    ctx.fillStyle = k.rgba('bg', 0.18);
    ctx.beginPath(); k.rrect(-TW / 2 + 10, TH / 2 - 22, TW - 20, 12, 6); ctx.fill();

    // düğme: her iki temada da beyaz (rayla kontrast)
    const kb = kx;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(kb, 0, KR + 3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(250,250,250,1)';
    ctx.beginPath(); ctx.arc(kb, 0, KR, 0, k.TAU); ctx.fill();
    // parlama (premium, düğme üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.ellipse(kb - 12, -16, 20, 11, -0.5, 0, k.TAU); ctx.fill();
    // on konumunda onay işareti
    if (on && gg > 0.5) {
      ctx.strokeStyle = k.rgba('green', 0.95);
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(kb - 18, 1); ctx.lineTo(kb - 6, 13); ctx.lineTo(kb + 18, -13);
      ctx.stroke();
    }

    ctx.restore();
  },
};
