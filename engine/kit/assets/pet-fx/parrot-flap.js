// pet-fx/parrot-flap — kanat çırpan papağan; squawk anında öter. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) tünektir, papağan negatif y yönünde yukarı uzar.
export default {
  name: 'parrot-flap', category: 'pet-fx',
  desc: 'Tünekte kanat çırpan papağan; squawk anında gagasını açıp ses dalgaları yayar',
  tags: ['papağan', 'kuş', 'evcil hayvan', 'kanat', 'ötme', 'tüy', 'parrot', 'bird', 'pet', 'wings', 'squawk'],
  box: [-140, -240, 140, 10],
  bleed: 80,
  anchor: 'tünek (0,0); boy ~230 birim',
  points: { head: [42, -168], beak: [78, -160], wing: [-30, -110] },
  params: {
    color: { type: 'color', default: 'green' },
    squawk: { type: 'time', default: null, desc: 'ötme anı — gaga açılır, baş geriye atılır, ses dalgaları (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const plum = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const beakC = k.rgba('yellow');
    const ds = p.squawk == null ? -1 : t - p.squawk;
    const squawking = ds >= 0 && ds < 0.8;
    const sEnv = squawking ? Math.sin(Math.min(ds / 0.8, 1) * Math.PI) : 0;
    const flap = Math.sin(t * 6) * (squawking ? 0.95 : 0.62);   // kanat çırpma (canlı idle)
    const headBob = Math.sin(t * 2.6) * 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // tünek (havada duran ince çizgi — ink rengi)
    ctx.strokeStyle = line; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(130, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(130, 0); ctx.stroke();

    // kuyruk tüyleri (sallanır)
    const tailSway = Math.sin(t * 3.4) * 5;
    for (let i = -1; i <= 1; i++) {
      ctx.save(); ctx.translate(-38, -46); ctx.rotate(0.5 + i * 0.22 + tailSway * 0.01);
      blob(-7, 0, 14, 64, 7, plum); ctx.restore();
    }

    // ayaklar tüneği kavrar
    limb(-14, -52, -18, -6, 9, beakC);
    limb(6, -52, 10, -6, 9, beakC);

    // gövde sağ alt gölgesi
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.ellipse(6, -94 + headBob * 0.3, 42, 58, 0.15, 0, k.TAU); ctx.fill();

    // kanatlar: çırpma (önce arka kanat)
    for (const s of [0, 1]) {
      ctx.save();
      ctx.translate(-6, -108 + headBob * 0.3);
      ctx.rotate((s === 0 ? 1 : -1) * (0.55 + flap * (s === 0 ? 0.7 : 1)));
      ctx.scale(s === 0 ? -1 : 1, 1);
      blob(0, -18, 84, 40, 20, plum);
      // kanat tüyü çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(14 + i * 20, -8); ctx.lineTo(24 + i * 20, 14); ctx.stroke();
      }
      ctx.restore();
    }

    // gövde
    disc(0, -100 + headBob * 0.3, 42, 56, plum);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -126, 14, 20, -0.3, 0, k.TAU); ctx.fill();

    // baş (ötmede geriye atılır)
    const hx = 42, hy = -168 + headBob - sEnv * 14;
    const tilt = -sEnv * 0.35;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
    disc(0, 0, 32, 30, plum);
    // göz (aile dili)
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(8, -6, 4.4, 4.4, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.ellipse(9.5, -7.5, 1.6, 1.6, 0, 0, k.TAU); ctx.fill();
    // gaga: ötmede alt gaga açılır
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(24, -12); ctx.lineTo(46, -2); ctx.lineTo(24, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = beakC;
    ctx.beginPath(); ctx.moveTo(26, -9); ctx.lineTo(42, -2); ctx.lineTo(26, 5); ctx.closePath(); ctx.fill();
    if (squawking) {
      const jawOpen = sEnv * 16;
      ctx.save(); ctx.translate(26, 4); ctx.rotate(jawOpen * 0.035);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, 4); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = beakC;
      ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(15, 5); ctx.lineTo(2, 8); ctx.closePath(); ctx.fill();
      ctx.restore();
      // ağız içi
      ctx.fillStyle = k.rgba('bg', 0.8);
      ctx.beginPath(); ctx.ellipse(34, 4, 5, 3 + jawOpen * 0.4, 0, 0, k.TAU); ctx.fill();
    }
    // tepe tüyü
    ctx.strokeStyle = line; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-6, -28); ctx.quadraticCurveTo(-10, -42, -20, -46); ctx.stroke();
    ctx.strokeStyle = plum; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-6, -28); ctx.quadraticCurveTo(-10, -42, -20, -46); ctx.stroke();
    // premium parlama (baş sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-13, -15, 10, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // ötme ses dalgaları
    if (squawking) {
      for (let i = 0; i < 3; i++) {
        const rr = 30 + ds * 160 + i * 22;
        const a = 0.65 * (1 - ds / 0.8) * (1 - i * 0.2);
        ctx.strokeStyle = k.rgba('ink', Math.max(a, 0)); ctx.lineWidth = 5 - i;
        ctx.beginPath(); ctx.arc(hx + 40, hy - 10, Math.max(rr, 1), -1.0, 1.0); ctx.stroke();
      }
    }

    // göz kırpma
    const tb = t % 3.2;
    if (tb < 0.12 && !squawking) {
      ctx.fillStyle = plum;
      ctx.beginPath(); ctx.ellipse(hx + 8, hy - 6 + headBob * 0, 9, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
