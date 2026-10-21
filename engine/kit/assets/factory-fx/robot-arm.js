// factory-fx/robot-arm — kolun yakalama anı.
// ANIMASYON: `grab` anında kol parçaya uzanır (0.45 sn), kıskaç kapanır (0.55 sn),
// parçayı kaldırıp yerine döner (1.15 sn). Idle'da eklem LED'i nabız atar,
// kol hafifçe salınır. Tek vurgu: cyan.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'robot-arm',
  category: 'factory-fx',
  desc: 'Endüstriyel robot kolu; grab anında parçayı yakalayıp kaldırır',
  tags: ['robot', 'kol', 'fabrika', 'otomasyon', 'kıskaç', 'yakalama', 'robot', 'arm', 'factory', 'automation', 'gripper', 'grab'],
  box: [-130, -120, 130, 196],
  bleed: 25,
  anchor: 'taban (0,150)',
  points: { base: [0, 150], column: [0, 28], claw_home: [98, 56] },
  params: {
    grab: { type: 'time', default: null, desc: 'kolun yakalama anı (uzanma 0.45 sn, kaldırma 1.15 sn)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const S = [0, 28], L1 = 86, L2 = 72;
    const rest = [1.05, -1.75], gp = [1.30, -0.60];
    const d = p.grab == null ? -1 : t - p.grab;
    const striking = d >= 0;
    const reach = striking ? k.E.inOutCubic(k.prog(d, 0, 0.45)) : 0;
    const back = striking ? k.E.inOutCubic(k.prog(d, 0.6, 1.15)) : 0;
    const blend = Math.max(reach - back, 0);
    const closed = striking ? k.prog(d, 0.35, 0.55) : 0;
    const sway = k.noise1(t * 1.5) * 0.03;
    const a1 = k.lerp(rest[0], gp[0], blend) + sway;
    const a2 = k.lerp(rest[1], gp[1], blend) + sway * 0.6;
    const J = [S[0] + L1 * Math.cos(a1), S[1] + L1 * Math.sin(a1)];
    const W = [J[0] + L2 * Math.cos(a1 + a2), J[1] + L2 * Math.sin(a1 + a2)];
    const wd = [Math.cos(a1 + a2), Math.sin(a1 + a2)];
    const tip = [W[0] + wd[0] * 20, W[1] + wd[1] * 20];
    // yakalama hedefi: grab pozu ucunun altındaki zemin
    const gW = [S[0] + L1 * Math.cos(gp[0]) + L2 * Math.cos(gp[0] + gp[1]),
                S[1] + L1 * Math.sin(gp[0]) + L2 * Math.sin(gp[0] + gp[1])];
    const gTip = [gW[0] + Math.cos(gp[0] + gp[1]) * 20, gW[1] + Math.sin(gp[0] + gp[1]) * 20];
    const floorCube = [gTip[0], gTip[1] + 34];

    // --- zemin gölgesi ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 158, 96, 12, 0, 0, k.TAU); ctx.fill();

    // --- küp parça: yakalanmadan önce yerde, sonra kıskaçta ---
    const cubeAt = (closed > 0.6 && striking) ? [tip[0] + wd[0] * 8, tip[1] + wd[1] * 8 + 10] : floorCube;
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(cubeAt[0] - 14 + 5, cubeAt[1] - 14 + 5, 28, 28, 7); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.85);
    ctx.beginPath(); k.rrect(cubeAt[0] - 14, cubeAt[1] - 14, 28, 28, 7); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.12);
    ctx.beginPath(); ctx.ellipse(cubeAt[0] - 6, cubeAt[1] - 8, 5, 6, 0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(cubeAt[0] - 14, cubeAt[1] - 14, 28, 28, 7); ctx.stroke();

    // --- taban + kolon ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-40 + 6, 120 + 6, 80, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-40, 120, 80, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-20, 127, 12, 5, -0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-40, 120, 80, 30, 8); ctx.stroke();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-16, 24, 32, 100, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-16, 24, 32, 100, 8); ctx.stroke();

    // --- kolon LED'i (idle nabız) ---
    const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 3.1));
    k.glow(0, 66, 12, p.color, 0.35 * pulse);
    ctx.fillStyle = k.rgba(p.color, pulse);
    ctx.beginPath(); ctx.arc(0, 66, 5, 0, k.TAU); ctx.fill();

    // --- kol segmentleri ---
    ctx.lineCap = 'round';
    const seg = (x1, y1, x2, y2, w) => {
      ctx.strokeStyle = k.rgba('bg', 0.12); ctx.lineWidth = w + 6;
      ctx.beginPath(); ctx.moveTo(x1 + 3, y1 + 5); ctx.lineTo(x2 + 3, y2 + 5); ctx.stroke();
      ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    seg(S[0], S[1], J[0], J[1], 24);
    seg(J[0], J[1], W[0], W[1], 20);
    // parlama: üst segment üzerinde
    const m1x = (S[0] + J[0]) / 2 - 6, m1y = (S[1] + J[1]) / 2 - 6;
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(m1x, m1y, 12, 6, a1, 0, k.TAU); ctx.fill();

    // --- eklemler ---
    for (const [jx, jy, jr] of [[S[0], S[1], 15], [J[0], J[1], 13]]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.arc(jx + 3, jy + 3, jr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(jx, jy, jr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.12);
      ctx.beginPath(); ctx.ellipse(jx - 5, jy - 6, 4, 5, 0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(jx, jy, jr, 0, k.TAU); ctx.stroke();
    }

    // --- bilek + kıskaç parmakları ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(W[0] + 3, W[1] + 3, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(W[0], W[1], 9, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(W[0], W[1], 9, 0, k.TAU); ctx.stroke();
    const spread = k.lerp(0.55, 0.15, closed);
    const perp = [-wd[1], wd[0]];
    for (const sgn of [-1, 1]) {
      const fa = a1 + a2 + sgn * spread;
      const f0 = [W[0] + perp[0] * sgn * 7, W[1] + perp[1] * sgn * 7];
      const f1 = [f0[0] + Math.cos(fa) * 26, f0[1] + Math.sin(fa) * 26];
      ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(f0[0], f0[1]); ctx.lineTo(f1[0], f1[1]); ctx.stroke();
      ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(f1[0] - Math.cos(fa) * 8, f1[1] - Math.sin(fa) * 8);
      ctx.lineTo(f1[0], f1[1]);
      ctx.stroke();
    }
    // yakalama flaşı
    if (closed > 0 && closed < 1 && striking) {
      k.glow(tip[0], tip[1], 18, p.color, 0.4 * (1 - closed));
    }
    ctx.restore();
  },
};
