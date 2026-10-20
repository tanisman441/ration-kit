// door-fx/lock-click — kilitlenme: at anında sürgü kapıdan kasaya kayar,
// 0.12 sn'lik "klik" flaşı (sarı yıldız parıltısı) çakar; boşta sürgüde hafif parlama.
// NOT: canvas y-aşağıdır; taban (0,0), yukarı NEGATİF y'dir.
export default {
  name: 'lock-click',
  category: 'door-fx',
  desc: 'Kilitlenme: sürgü kapıdan kasaya kayar, klik anında sarı yıldız parıltısı çakar',
  tags: ['kilit', 'sürgü', 'klik', 'anahtar', 'güvenlik', 'lock', 'bolt', 'deadbolt', 'click', 'keyhole'],
  box: [-150, -130, 150, 70],
  bleed: 50,
  anchor: 'taban (0,0): kapı diliminin alt kenarının merkezi',
  points: { keyhole: [-95, 10], bolt: [80, -60] },
  params: {
    at: { type: 'time', default: null, desc: 'sürgünün kaymaya başladığı an (0.22 sn kayar, sonunda klik)' },
    color: { type: 'color', default: 'dim', desc: 'kapı dilimi rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const dark = (name, f = 0.88) => {
      const c = k.col(name);
      return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`;
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const shine = (x, y, rx, ry, a = 0.10, rot = -0.4) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, k.TAU); ctx.fill();
    };
    const star4 = (x, y, r, rot = 0) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rr = i % 2 === 0 ? r : r * 0.32;
        const a = rot + (i / 8) * k.TAU;
        const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    const d = p.at == null ? -1 : t - p.at;

    // ---- 1) kapı dilimi (sol) + anahtar deliği ----
    ctx.fillStyle = dark(p.color); ctx.fillRect(-145, -113, 110, 180);   // sağ alt gölge
    ctx.fillStyle = k.rgba(p.color); ctx.fillRect(-150, -120, 110, 180);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(-150, -120, 110, 180);
    shine(-122, -102, 22, 10);
    // anahtar deliği
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.arc(-95, 4, 9, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-99, 8, 8, 20, 4); ctx.fill();

    // ---- 2) kasa karşılığı (sağ): sürgünün girdiği yuva ----
    ctx.fillStyle = dark('panel2'); ctx.fillRect(55, -103, 60, 100);
    ctx.fillStyle = k.rgba('panel2'); ctx.fillRect(50, -110, 60, 100);
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.strokeRect(50, -110, 60, 100);
    ctx.fillStyle = k.rgba('bg'); ctx.fillRect(50, -80, 22, 40);            // yuva ağzı (sürgü hizasında)
    shine(72, -98, 14, 7);

    // ---- 3) sürgü: at anında kapıdan kasaya kayar ----
    let slide = 0; // 0 = çekili, 1 = kilitli
    if (d >= 0) slide = k.E.inOutCubic(k.prog(d, 0, 0.22));
    const tipX = -40 + slide * 120;                                      // -40 (içerde) → 80 (yuvada)
    const bx = tipX - 100, by = -78, bw = 100, bh = 36;
    ctx.fillStyle = dark('panel2'); ctx.beginPath(); k.rrect(bx + 5, by + 7, bw, bh, 12); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(bx - LW / 2, by - LW / 2, bw + LW, bh + LW, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); k.rrect(bx, by, bw, bh, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;             // sürgü çizgisi
    ctx.beginPath(); ctx.moveTo(bx + 12, by + bh / 2); ctx.lineTo(tipX - 14, by + bh / 2); ctx.stroke();
    // idle: sürgü üstünde hafif parlama nabzı
    shine(bx + 34, by + 8, 20, 6, 0.07 + 0.03 * Math.sin(t * 2.4));

    // ---- 4) klik flaşı: kayma bitince 0.12 sn yıldız parıltısı ----
    const dd = d - 0.22;
    if (dd >= 0 && dd < 0.12) {
      const f = 1 - dd / 0.12;
      k.glow(85, -60, 44 * f, 'yellow', 0.5 * f);
      star4(85, -60, 26 * f + 4, dd * 6);
      ctx.fillStyle = k.rgba('yellow', 0.9 * f); ctx.fill();
      star4(60, -86, 12 * f + 2, -dd * 8);
      ctx.fillStyle = k.rgba('yellow', 0.7 * f); ctx.fill();
    }
  },
};
