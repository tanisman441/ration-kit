// wedding-fx/bouquet-toss — gelin buketi fırlatır: at anında buket havaya fırlar, döner, süzülür.
// NOT: canvas y-aşağıdır; (0,0) gelinin ayakları, buket yukarı (negatif y) fırlar.
export default {
  name: 'bouquet-toss', category: 'wedding-fx',
  desc: 'Gelin buketi fırlatır: at anında buket havaya fırlar, döner ve süzülerek düşer',
  tags: ['buket', 'düğün', 'gelin', 'fırlatmak', 'çiçek', 'bouquet', 'wedding', 'bride', 'toss', 'flowers'],
  box: [-170, -400, 170, 40],
  bleed: 60,
  anchor: 'gelinin ayakları (0,0); buket at anında yukarı fırlar',
  points: { bouquet: [30, -190], hand: [30, -180], head: [0, -300] },
  params: {
    at: { type: 'time', default: null, desc: 'buketin fırlatıldığı an' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const dress = k.rgba(p.color);
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
    const bob = 3 * Math.sin(2 * Math.PI * t / 2.4); // nefes
    const sway = 6 * Math.sin(2 * Math.PI * t / 2.4 + 0.8); // yana salınım

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(sway * 0.5, -4, 70, 10, 0, 0, k.TAU); ctx.fill();

    // gelin: elbise (trapez), gövde, baş + duvak
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-58 + sway, -6); ctx.lineTo(58 + sway, -6);
    ctx.lineTo(30 + sway, -168 - bob); ctx.lineTo(-30 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = dress;
    ctx.beginPath();
    ctx.moveTo(-52 + sway, -6); ctx.lineTo(52 + sway, -6);
    ctx.lineTo(26 + sway, -168 - bob); ctx.lineTo(-26 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();
    // elbise kat çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40 + sway, -60); ctx.lineTo(40 + sway, -60); ctx.stroke();
    // sağ alt gölge (%12)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath();
    ctx.moveTo(10 + sway, -6); ctx.lineTo(52 + sway, -6);
    ctx.lineTo(26 + sway, -168 - bob); ctx.lineTo(12 + sway, -168 - bob);
    ctx.closePath(); ctx.fill();

    blob(-30 + sway, -252 - bob, 60, 88, 26, dress); // üst gövde
    // duvak (başın arkasında, salınır)
    const veilSway = 8 * Math.sin(2 * Math.PI * t / 2.4 + 1.6);
    ctx.fillStyle = k.rgba('panel2', 0.85);
    ctx.beginPath();
    ctx.moveTo(-30 + sway, -330 - bob);
    ctx.quadraticCurveTo(-58 + veilSway + sway, -280 - bob, -40 + sway, -220 - bob);
    ctx.lineTo(-14 + sway, -240 - bob);
    ctx.closePath(); ctx.fill();
    disc(sway, -296 - bob, 34, 32, dress); // baş
    // yüz (mutlu, sağa bakar)
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(10 + sway, -300 - bob, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(22 + sway, -288 - bob, 8, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();

    // kollar: at'tan önce buketi göğüste tutar, at anında yukarı savrulur
    const throwP = d < 0 ? 0 : k.prog(d, 0, 0.3);
    const armUp = throwP * throwP * (3 - 2 * throwP);
    for (const s of [-1, 1]) {
      const shX = s * 26 + sway, shY = -236 - bob;
      const hX = s * 20 + sway + 18 * armUp, hY = -190 - bob - 110 * armUp;
      const eX = s * 30 + sway + 8 * armUp, eY = -214 - bob - 55 * armUp;
      limb(shX, shY, eX, eY, 16, dress);
      limb(eX, eY, hX, hY, 14, dress);
      disc(hX, hY, 9, 9, dress);
    }

    // buket: at'tan önce ellerde, at'ta parabolle fırlar, döner, süzülür
    let bX = 30 + sway, bY = -196 - bob, rot = 0, bScale = 1;
    if (d >= 0) {
      const flight = k.prog(d, 0, 1.4);
      bX = 30 + sway + 70 * flight;
      bY = -196 - 260 * Math.sin(Math.PI * Math.min(flight, 1)) - bob * (1 - flight);
      rot = flight * 4.5;
      bScale = 1 + 0.25 * Math.sin(Math.PI * Math.min(flight, 1));
    }
    // buket sapları + çiçekler (tek vurgu rengi: red)
    ctx.save();
    ctx.translate(bX, bY); ctx.rotate(rot); ctx.scale(bScale, bScale);
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 26); ctx.lineTo(0, 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, 22); ctx.lineTo(-2, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 22); ctx.lineTo(2, 4); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * k.TAU - Math.PI / 2;
      const fx = Math.cos(a) * 14, fy = Math.sin(a) * 14 - 6;
      disc(fx, fy, 11, 11, k.rgba('red'));
    }
    disc(0, -6, 10, 10, k.rgba('yellow'));
    // kurdele
    ctx.strokeStyle = k.rgba('red', 0.9); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-6, 20); ctx.quadraticCurveTo(-18, 30, -12, 38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, 20); ctx.quadraticCurveTo(18, 30, 12, 38); ctx.stroke();
    ctx.restore();

    // at anı: fırlatma parlaması + savrulan taç yapraklar
    if (d >= 0 && d < 0.9) {
      const f = 1 - d / 0.9;
      k.glow(30 + sway, -196 - bob, 50 * f, 'red', 0.35 * f);
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 3 + 11), h2 = k.hash(i * 5 + 13);
        const px = 30 + sway + (h1 - 0.5) * 160 * d;
        const py = -196 - bob - d * 120 * h2 - 20 * Math.sin(d * 8 + i);
        ctx.fillStyle = k.rgba('red', 0.85 * f);
        ctx.beginPath(); ctx.ellipse(px, py, 5, 3.5, h1 * k.TAU, 0, k.TAU); ctx.fill();
      }
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14 + sway, -306 - bob, 12, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-16 + sway, -220 - bob, 8, 26, 0.1, 0, k.TAU); ctx.fill();
  },
};
