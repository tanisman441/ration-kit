// wedding-fx/confetti-shower — yeni evli çiftin üstüne konfeti yağar: at anında patlama, sonra süzülen yağmur.
// NOT: canvas y-aşağıdır; (0,0) çiftin ayakları, konfeti yukarıdan (negatif y) aşağı düşer.
export default {
  name: 'confetti-shower', category: 'wedding-fx',
  desc: 'Yeni evli çiftin üstüne konfeti yağar: at anında patlama, sonra süzülen renkli yağmur',
  tags: ['konfeti', 'düğün', 'kutlama', 'yağmur', 'çift', 'confetti', 'wedding', 'celebration', 'couple', 'shower'],
  box: [-210, -340, 210, 40],
  bleed: 40,
  anchor: 'çiftin ayakları (0,0); konfeti tepeden aşağı yağar',
  points: { couple: [0, -60], top: [0, -320] },
  params: {
    at: { type: 'time', default: null, desc: 'konfeti patlamasının anı' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba(p.color);
    const inkC = k.rgba('ink');
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

    const d = p.at == null ? -1 : t - p.at;
    const bob = 3 * Math.sin(2 * Math.PI * t / 2.4); // çiftin nefesi
    const sway = 5 * Math.sin(2 * Math.PI * t / 2.4 + 0.6);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 110, 10, 0, 0, k.TAU); ctx.fill();

    // çift: damat (sol, takım) + gelin (sağ, elbise), başlar birbirine yakın
    // damat
    limb(-52 + sway, -8, -46 + sway, -120 - bob, 20, body);
    limb(-46 + sway, -120 - bob, -40 + sway, -8, 18, body);
    blob(-84 + sway, -232 - bob, 62, 116, 26, body);
    disc(-53 + sway, -272 - bob, 33, 31, body);
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(-62 + sway, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(-44 + sway, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(-53 + sway, -262 - bob, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // damat kolu gelinin belinde
    limb(-30 + sway, -210 - bob, 18 + sway, -196 - bob, 16, body);
    // gelin
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(6 + sway, -6); ctx.lineTo(96 + sway, -6);
    ctx.lineTo(66 + sway, -168 - bob); ctx.lineTo(26 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(12 + sway, -6); ctx.lineTo(90 + sway, -6);
    ctx.lineTo(62 + sway, -168 - bob); ctx.lineTo(30 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12); // sağ alt gölge
    ctx.beginPath();
    ctx.moveTo(56 + sway, -6); ctx.lineTo(90 + sway, -6);
    ctx.lineTo(62 + sway, -168 - bob); ctx.lineTo(48 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();
    blob(24 + sway, -252 - bob, 56, 88, 24, body);
    disc(52 + sway, -272 - bob, 33, 31, body);
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(43 + sway, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(61 + sway, -276 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(52 + sway, -262 - bob, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // gelinin duvağı
    ctx.fillStyle = k.rgba('panel2', 0.85);
    ctx.beginPath();
    ctx.moveTo(26 + sway, -302 - bob);
    ctx.quadraticCurveTo(88 + sway, -280 - bob, 78 + sway, -222 - bob);
    ctx.lineTo(56 + sway, -244 - bob);
    ctx.closePath(); ctx.fill();
    // gelin kolu damadın omzunda
    limb(30 + sway, -228 - bob, -16 + sway, -238 - bob, 15, body);

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-66 + sway, -282 - bob, 12, 8, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(40 + sway, -282 - bob, 12, 8, -0.4, 0, k.TAU); ctx.fill();

    // konfeti yağmuru: döngüsel düşüş (her zaman yağar) + at anında patlama
    const cols = ['red', 'cyan', 'yellow', 'green', 'purple'];
    if (d >= 0 && d < 0.15) k.glow(0, -300, 90 * (1 - d / 0.15), p.color, 0.4 * (1 - d / 0.15));
    for (let i = 0; i < 52; i++) {
      const h1 = k.hash(i * 3 + 51), h2 = k.hash(i * 5 + 53), h3 = k.hash(i * 7 + 59);
      // döngüsel yağmur: yaş 0..1, tepeden tabana
      const age = ((t / 2.6 + h3) % 1 + 1) % 1;
      let x = (h1 - 0.5) * 380 + k.noise1(i * 2 + t * 1.5) * 22;
      let y = -330 + age * 360;
      let al = 0.9 * (1 - k.prog(age, 0.85, 1));
      // at patlaması: ilk 1.2 sn ekstra hızlı parçalar
      if (d >= 0 && d < 1.2 && i < 30) {
        const dd = Math.max(d - h3 * 0.25, 0);
        const spread = (h1 - 0.5) * 2;
        x = spread * 150 * (1 - Math.pow(1 - Math.min(dd * 1.6, 1), 2)) + k.noise1(i * 2 + d * 4) * 14;
        y = -300 - (60 + h2 * 120) * dd + 150 * dd * dd;
        al = 0.95 * (1 - k.prog(d, 0.8, 1.2));
      }
      if (y > 30 || y < -335 || al <= 0) continue;
      const spin = age * (4 + h2 * 6) + h1 * k.TAU;
      const w = (6 + h2 * 6) * (0.4 + 0.6 * Math.abs(Math.cos(spin)));
      ctx.fillStyle = k.rgba(cols[i % 5], al);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(spin * 0.7) * 0.6);
      ctx.fillRect(-w / 2, -4, w, 8);
      ctx.restore();
    }
  },
};
