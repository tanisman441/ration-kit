// vehicles-2/bicycle — yandan görünüm bisiklet (sağa bakar); pedal çevrilince bir tur pedal + dönen tekerlek.
// Orijinal tasarım. NOT: canvas y-aşağıdır; (0,0) zemin merkezi, tekerlekler yerde durur.
export default {
  name: 'bicycle',
  category: 'vehicles-2',
  desc: 'Yandan görünüm sade bisiklet; pedal anında bir tur çevirir, tekerlekler iki tur döner',
  tags: ['bisiklet', 'bisiklet sürmek', 'bicycle', 'bike', 'cycling', 'taşıt', 'spor'],
  box: [-112, -102, 112, 14],
  bleed: 45,
  anchor: 'zemin merkezi (0,0); tekerlekler yerde',
  points: { crank: [-5, -48], seat: [-25, -80], handlebar: [58, -88], wheelF: [58, -22], wheelR: [-58, -22] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kadro rengi' },
    pedal: { type: 'time', default: null, desc: 'pedal çevirme anı: bir tur pedal + dönen tekerlek (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color);
    const tire = k.col('ink');
    const darkTire = `rgb(${tire.map(v => Math.max(0, Math.round(v * 0.6))).join(',')})`;

    // çizgi helper: dış hat + renk
    const rod = (x1, y1, x2, y2, w, c = col) => {
      ctx.strokeStyle = O; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // ANIMASYON — pedal olayı: 0.8 sn'de bir tur pedal, iki tur tekerlek
    const d = p.pedal == null ? -1 : t - p.pedal;
    const g = d < 0 ? 0 : d > 0.8 ? 1 : d / 0.8;
    const crankAng = -Math.PI / 2 + g * k.TAU;
    const wheelAng = g * k.TAU * 2;

    // kadro üçgeni
    const crank = [-5, -48], rearA = [-58, -22], frontA = [58, -22], seatT = [-25, -74], headT = [52, -68];
    rod(rearA[0], rearA[1], crank[0], crank[1], 7);          // arka çatal
    rod(crank[0], crank[1], seatT[0], seatT[1], 7);         // sele borusu
    rod(seatT[0], seatT[1], headT[0], headT[1], 7);         // üst boru
    rod(crank[0], crank[1], headT[0], headT[1], 6);         // alt boru
    rod(headT[0], headT[1], frontA[0], frontA[1], 7);       // ön çatal
    rod(rearA[0], rearA[1], seatT[0], seatT[1], 5);         // arka üst çatal

    // sele
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(-42, -90, 34, 11, 5.5); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); k.rrect(-39, -87, 28, 8, 4); ctx.fill();

    // gidon
    rod(52, -68, 56, -88, 6);
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(44, -98, 28, 10, 5); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); k.rrect(47, -95, 22, 7, 3.5); ctx.fill();

    // aynakol (zincir dişlisi) + zincir
    ctx.fillStyle = O; ctx.beginPath(); ctx.arc(crank[0], crank[1], 12, 0, k.TAU); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(crank[0], crank[1], 9.5, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(crank[0], crank[1] - 9); ctx.lineTo(rearA[0], rearA[1] - 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(crank[0], crank[1] + 9); ctx.lineTo(rearA[0], rearA[1] + 9); ctx.stroke();

    // pedal kolu (döner)
    const px = crank[0] + Math.cos(crankAng) * 17, py = crank[1] + Math.sin(crankAng) * 17;
    rod(crank[0], crank[1], px, py, 5, darkTire);
    ctx.fillStyle = O; ctx.beginPath(); k.rrect(px - 9, py - 4, 18, 8, 4); ctx.fill();
    ctx.fillStyle = darkTire; ctx.beginPath(); k.rrect(px - 6.5, py - 2.5, 13, 5, 2.5); ctx.fill();

    // tekerlekler
    for (const [wx, wy] of [rearA, frontA]) {
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(wx, wy, 22 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = darkTire; ctx.beginPath(); ctx.arc(wx, wy, 22, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.85); ctx.beginPath(); ctx.arc(wx, wy, 14, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const a = wheelAng + i * k.TAU / 3;
        ctx.beginPath(); ctx.moveTo(wx, wy);
        ctx.lineTo(wx + Math.cos(a) * 12, wy + Math.sin(a) * 12); ctx.stroke();
      }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(wx, wy, 4.5, 0, k.TAU); ctx.fill();
    }

    // pedal olayı: hız çizgileri (arkada)
    if (d >= 0 && d < 0.8) {
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -30 - i * 16 + k.noise1(t * 4 + i * 9) * 4;
        const len = 26 + k.hash(i * 7 + 2) * 30;
        ctx.beginPath(); ctx.moveTo(-90 - len, yy); ctx.lineTo(-90, yy); ctx.stroke();
      }
    }

    // premium parlama (üst boru sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -76, 16, 6, -0.25, 0, k.TAU); ctx.fill();
  },
};
