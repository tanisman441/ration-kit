// sports-action/dive-roll — kalecinin yana dalışı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) dalış öncesi kalecinin ayakları, dalış +x yönüne sağadır.
export default {
  name: 'dive-roll',
  category: 'sports-action',
  desc: 'Topa uzanmak için yana dalan kaleci; time-param at anında vücut yataylaşır, top çelir',
  tags: ['dalış', 'kaleci', 'uzanma', 'kurtarış', 'save', 'dive', 'goalkeeper', 'save', 'kaleci dalışı', 'uzanış', 'deflect'],
  box: [-160, -302, 250, 24],
  bleed: 50,
  anchor: 'dalış öncesi kalecinin ayakları (0,0); dalış +x yönüne sağa',
  points: { hands: [155, -140] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'dalış anı: kaleci yana fırlar, topu çeler' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    const olimb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const oblob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const odisc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;

    // --- top ---
    // dalıştan önce sağdan kaleciye yaklaşır (at-1.2 → at), dalışta yukarı-sola çelir
    let bx = 230, by = -152, flying = false;
    if (d < -1.2) { bx = 230; by = -152; }
    else if (d < 0) {
      const q = k.clamp((d + 1.2) / 1.2, 0, 1);
      bx = k.lerp(230, 120, q); by = k.lerp(-152, -135, q) - 12 * Math.sin(Math.PI * q);
    } else {
      const dt = d;
      bx = 120 - 170 * dt; by = -135 - 300 * dt + 520 * dt * dt;   // çelme: sola-yukarı
      flying = dt < 0.8;
    }
    // çelme flaşı
    if (d >= 0 && d < 0.16) k.glow(120, -135, 50, 'cyan', 0.55 * (1 - d / 0.16));

    // --- zemin ---
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(-50, -5, 58, 9, 0, 0, k.TAU); ctx.fill();

    // --- kaleci (dalış grubu: ötelenir + gövde merkezi etrafında yataylaşır) ---
    const dp = d < 0 ? 0 : easeOut(k.clamp(d / 0.45, 0, 1));   // dalış ilerlemesi
    const tx = dp * 30, ty = -dp * 70, rot = dp * 1.15;        // sağa fırlayış + yatma
    const bob = d < 0 ? 2 * Math.sin((k.TAU * t) / 2.4) : 0;   // nefes (dalış öncesi)
    const crouch = d < 0 ? 8 * (0.5 + 0.5 * Math.sin((k.TAU * t) / 1.6)) : 0; // hazır çömelme

    ctx.save();
    ctx.translate(tx, ty);
    ctx.translate(0, -140); ctx.rotate(rot); ctx.translate(0, 140);  // gövde merkezi pivot
    // figür lokal koordinatları: ayaklar (0,0), gövde yukarı
    // bacaklar (dalışta geride uzanmış)
    const legTuck = 0.35 * (1 - dp);
    for (const s of [-1, 1]) {
      const hx = s * 12, hy = -128 + crouch * 0.5;
      const a = 0.25 + s * 0.12 - dp * 0.9;   // dalışta geriye açılır
      const kx = hx + 58 * Math.sin(a), ky = hy + 58 * Math.cos(a);
      const fx = kx + 54 * Math.sin(a - legTuck), fy = ky + 54 * Math.cos(a - legTuck);
      olimb(hx, hy, kx, ky, 20, body);
      olimb(kx, ky, fx, fy, 17, body);
      oblob(fx - 14, fy - 13, 28, 13, 6, body);
    }
    // gövde
    oblob(-31, -238 + bob + crouch * 0.5, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(16, -158 + bob + crouch * 0.5, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    // kollar: hazırda aşağıda, dalışta topa uzanmış
    const armUp = k.lerp(2.7, 1.1, dp);            // kol kaldırma açısı
    for (const s of [-1, 1]) {
      const sx = 22, sy = -198 + bob + crouch * 0.5;
      const ex = sx + 52 * Math.sin(armUp + s * 0.14), ey = sy - 52 * Math.cos(armUp + s * 0.14);
      const wx = ex + 46 * Math.sin(armUp + s * 0.18), wy = ey - 46 * Math.cos(armUp + s * 0.18);
      olimb(sx, sy, ex, ey, 17, body);
      olimb(ex, ey, wx, wy, 15, body);
      odisc(wx, wy, 10, 10, body);             // eller
    }
    // baş
    const hbx = 6, hby = -246 + bob + crouch * 0.5;
    odisc(hbx, hby, 36, 34, body);
    const blink = (t % 3.8) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 10 + hbx, hby - 2, 4, 4 * blink, 0, 0, k.TAU); ctx.fill(); }
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    if (dp > 0.4) { ctx.beginPath(); ctx.ellipse(hbx, hby + 12, 6, 9, 0, 0, k.TAU); ctx.fill(); }  // efor "O" ağzı
    else { ctx.beginPath(); ctx.moveTo(hbx - 8, hby + 12); ctx.lineTo(hbx + 8, hby + 12); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.10)';  // premium parlama
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-14, -212 + bob + crouch * 0.5, 9, 26, 0.12, 0, k.TAU); ctx.fill();
    // kaleci eldiveni vurgusu (cyan, tek vurgu)
    if (dp > 0.3) {
      ctx.strokeStyle = k.rgba('cyan', 0.8); ctx.lineWidth = 3;
      for (const s of [-1, 1]) {
        const sx = 22, sy = -198 + bob;
        const ex = sx + 52 * Math.sin(armUp + s * 0.14), ey = sy - 52 * Math.cos(armUp + s * 0.14);
        const wx = ex + 46 * Math.sin(armUp + s * 0.18), wy = ey - 46 * Math.cos(armUp + s * 0.18);
        ctx.beginPath(); ctx.arc(wx, wy, 11, 0, k.TAU); ctx.stroke();
      }
    }
    ctx.restore();

    // --- top çizimi (figürün üstünde) ---
    if (flying) k.glow(bx, by, 28, 'accent', 0.35 * (1 - d / 0.8));
    odisc(bx, by, 13, 13, k.rgba('panel'));
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, k.TAU); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const a2 = (k.TAU * i) / 4 + 0.5;
      ctx.beginPath(); ctx.arc(bx + 8 * Math.cos(a2), by + 8 * Math.sin(a2), 2, 0, k.TAU); ctx.fill();
    }
    // dalış toz bulutu
    if (d >= 0 && d < 0.6) {
      const g = d / 0.6;
      for (let j = 0; j < 4; j++) {
        const h1 = k.hash(j * 3 + 7), h2 = k.hash(j * 5 + 11);
        ctx.fillStyle = k.rgba('dim', 0.45 * (1 - g));
        ctx.beginPath(); ctx.ellipse(-40 + g * (30 + h1 * 60), -8 - g * (10 + h2 * 26), 6 + g * 8, 5 + g * 6, 0, 0, k.TAU); ctx.fill();
      }
    }
  },
};
