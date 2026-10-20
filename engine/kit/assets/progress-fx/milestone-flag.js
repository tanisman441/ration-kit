// progress-fx/milestone-flag — kilometre taşı bayrağı: at anında bayrak coşkuyla dalgalanır, konfeti patlar (1.2 sn).
// Boşta bayrak hafifçe esner. (0,0) = direk tabanı.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'milestone-flag', category: 'progress-fx',
  desc: 'Kilometre taşı bayrağı: ulaşma anında bayrak dalgalanır, konfeti patlar',
  tags: ['bayrak', 'flag', 'kilometre taşı', 'milestone', 'başarı', 'achievement', 'hedef', 'goal', 'konfeti', 'confetti'],
  box: [-120, -170, 120, 120],
  bleed: 80,
  anchor: 'direk tabanı (0,0)',
  points: { base: [0, 100], tip: [98, -120], pole: [0, -60] },
  params: {
    at: { type: 'time', default: null, desc: 'ulaşma anı: güçlü dalgalanma + konfeti patlaması (1.2 sn)' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const line = k.rgba('bg', 0.55);
    const ev = d >= 0 && d <= 1.2;
    const g = ev ? k.prog(d, 0, 1.2) : 1;

    // direk + top + taban
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-7 + 5, -150 + 6, 14, 250, 7); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-9, -152, 18, 252, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-6, -149, 12, 246, 6); ctx.fill();
    ctx.fillStyle = k.rgba(col);
    ctx.beginPath(); ctx.arc(0, -156, 11, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -156, 11, 0, k.TAU); ctx.stroke();
    // taban
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-38 + 5, 92 + 6, 76, 18, 9); ctx.fill();
    ctx.fillStyle = line;
    k.rrect(-40, 90, 80, 18, 9); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    k.rrect(-37, 93, 74, 12, 6); ctx.fill();

    // bayrak: üst kenar direğe asılı; dalga = sinüs yer değiştirmesi
    const FW = 96, FH = 52, fy = -146;
    const amp = ev ? 6 + 12 * (1 - g) : 5;          // at anında güçlü, sonra sakinler
    const spd = ev ? 9 : 3.2;
    const wob = ev ? 3 * Math.sin(d * 22) * (1 - g) : 0;   // coşkulu sallanma
    ctx.save();
    ctx.translate(6, fy); ctx.rotate(0.06 + wob * 0.03);
    const wave = (x) => Math.sin(x * 0.09 - t * spd) * amp * (x / FW);
    // gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * FW;
      const y = wave(x) + 5;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    for (let i = 12; i >= 0; i--) {
      const x = (i / 12) * FW;
      ctx.lineTo(x, wave(x) + FH + 5);
    }
    ctx.closePath(); ctx.fill();
    // dış hat + kumaş
    ctx.fillStyle = line;
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * FW;
      const y = wave(x);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    for (let i = 12; i >= 0; i--) {
      const x = (i / 12) * FW;
      ctx.lineTo(x, wave(x) + FH);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(col);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * FW;
      const y = wave(x);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    for (let i = 12; i >= 0; i--) {
      const x = (i / 12) * FW;
      ctx.lineTo(x, wave(x) + FH - 5);
    }
    ctx.closePath(); ctx.fill();
    // sol üst parlama (kumaş üstü)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(FW * 0.28, 12, FW * 0.2, 6, -0.15, 0, k.TAU); ctx.fill();
    // bayrak iç yıldızı
    const pulse = 0.9 + 0.1 * Math.sin(t * 3.3);
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.save();
    ctx.translate(FW * 0.52, FH / 2 - 2); ctx.scale(pulse, pulse);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 7 : 15;
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();

    // konfeti: bayrak ucundan patlar
    if (ev) {
      const cg = k.prog(d, 0, 1.0);
      const cols = [col, 'yellow', 'cyan', 'red', 'purple'];
      for (let i = 0; i < 22; i++) {
        const a = -Math.PI / 2 + (k.hash(i) - 0.5) * 2.8;
        const dist = (40 + k.hash(i + 25) * 110) * k.E.outExpo(cg);
        const cx = 90 + Math.cos(a) * dist, cy = -120 + Math.sin(a) * dist + 40 * cg;
        const cw = 5 + k.hash(i + 55) * 5;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(k.hash(i + 85) * k.TAU + d * 6);
        ctx.fillStyle = k.rgba(cols[i % 5], 1 - cg * 0.8);
        ctx.fillRect(-cw / 2, -cw / 4, cw, cw / 2);
        ctx.restore();
      }
    }
    ctx.restore();
  },
};
