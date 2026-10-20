// door-fx/knock-wave — kapı vurma: at anında tokmak 3 kez vurur (t, t+0.18, t+0.36),
// her vuruşta halka dalgası yayılır; boşta tokmakta hafif parlama nabzı.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'knock-wave',
  category: 'door-fx',
  desc: 'Kapı vurma: tokmak 3 kez vurur, her vuruşta halka dalgası yayılır, tokmakta parlama nabzı',
  tags: ['kapı', 'vurmak', 'tokmak', 'tık', 'halka', 'dalga', 'knock', 'door', 'knocker', 'tap', 'wave'],
  box: [-150, -230, 150, 12],
  bleed: 80,
  anchor: 'taban (0,0): kapı kasasının alt merkezi',
  points: { knocker: [0, -120], center: [0, -110] },
  params: {
    at: { type: 'time', default: null, desc: 'ilk vuruş anı; 2. ve 3. vuruş +0.18 / +0.36 sn' },
    color: { type: 'color', default: 'dim', desc: 'kapı kanadı rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const shine = (x, y, rx, ry, rot = -0.4) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const d = p.at == null ? -1 : t - p.at;

    // ---- 1) kasa + kapalı kanat (statik) ----
    ctx.fillStyle = dark('panel2'); ctx.fillRect(-95, -213, 200, 220);   // sağ alt gölge
    ctx.fillStyle = k.rgba('panel2'); ctx.fillRect(-100, -220, 200, 220);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-100, -220, 200, 220);
    ctx.fillStyle = dark(p.color); ctx.fillRect(-83, -201, 176, 208);    // kanat gölgesi
    ctx.fillStyle = k.rgba(p.color); ctx.fillRect(-88, -208, 176, 208);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-88, -208, 176, 208);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;            // iç paneller
    ctx.strokeRect(-66, -184, 132, 76);
    ctx.strokeRect(-66, -96, 132, 76);
    shine(-58, -192, 30, 14);

    // ---- 2) tokmak: vuruş anında halka eğilir ----
    let tilt = 0;
    if (d >= 0) {
      for (let i = 0; i < 3; i++) {
        const di = d - i * 0.18;
        if (di >= 0 && di < 0.2) tilt = Math.max(tilt, Math.sin((di / 0.2) * Math.PI) * 0.35);
      }
    }
    const kx = 0, ky = -120;
    ctx.fillStyle = dark('panel2'); ctx.beginPath(); k.rrect(kx - 13 + 3, ky - 52 + 4, 26, 34, 8); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(kx - 16, ky - 55, 32, 40, 9); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(kx - 13, ky - 52, 26, 34, 8); ctx.fill();
    ctx.save();
    ctx.translate(kx, ky - 20); ctx.rotate(tilt);
    ctx.strokeStyle = dark('panel2'); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(2, 4, 20, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.stroke();
    ctx.restore();
    // idle: tokmakta hafif parlama nabzı
    const pulse = 0.06 + 0.04 * Math.sin(t * 2.2);
    ctx.fillStyle = `rgba(255,255,255,${pulse.toFixed(3)})`;
    ctx.beginPath(); ctx.ellipse(kx - 7, ky - 32, 7, 5, -0.4, 0, k.TAU); ctx.fill();

    // ---- 3) vuruş dalgaları: 3 vuruş, her biri yayılan halka ----
    if (d >= 0) {
      for (let i = 0; i < 3; i++) {
        const di = d - i * 0.18;
        if (di < 0 || di > 0.65) continue;
        const g = di / 0.65;
        const r = 28 + di * 200;
        ctx.strokeStyle = k.rgba('accent', 0.55 * (1 - g));
        ctx.lineWidth = 6 * (1 - g) + 2;
        ctx.beginPath(); ctx.arc(kx, ky, r, 0, k.TAU); ctx.stroke();
        if (di < 0.12) k.glow(kx, ky, 34 * (1 - di / 0.12), 'accent', 0.45 * (1 - di / 0.12));
      }
    }
  },
};
