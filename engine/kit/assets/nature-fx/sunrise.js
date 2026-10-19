// nature-fx/sunrise — ufuk çizgisinden doğan güneş; rise anında yükselir, renk sıcaktan soğuğa döner.
// NOT: canvas y-aşağıdır; güneş rise anında y artışı yönünün tersine (yukarı) yükselir.
export default {
  name: 'sunrise',
  category: 'nature-fx',
  desc: 'Ufuk çizgisinden doğan güneş; rise anında yükselip turuncudan beyaza renk geçişi yapar',
  tags: ['güneş', 'doğuş', 'sabah', 'ufuk', 'ışın', 'sunrise', 'sun', 'dawn', 'horizon', 'morning'],
  box: [-160, -170, 160, 130],
  bleed: 40,
  anchor: 'ufuk çizgisi (0,80); güneş onun üstünde doğar',
  points: { sun: [0, -30], horizon: [0, 80] },
  params: {
    sun: { type: 'color', default: 'yellow' },
    ground: { type: 'color', default: 'dim' },
    rise: { type: 'time', default: null, desc: 'doğuş anı: güneş 1.2 sn\'de ufuktan yükselir, renk geçişi' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.rise == null ? -1 : t - p.rise;
    // ilerleme: rise verilmemişse güneş dinlenme yüksekliğinde
    const prog = d < 0 ? 1 : k.clamp(d / 1.2, 0, 1);
    const e = k.E.outCubic(prog);
    const sunY = 130 - e * 165;             // ufuk altı -> -35 civarı
    // renk geçişi: turuncu (altta) -> sarı-beyaz (yukarıda)
    const warm = d >= 0 && d < 1.4 ? 1 - d / 1.4 : 0;

    // ışınlar: yükselirken genişler ve belirir (ufuk altındayken gizli)
    const rayA = (0.25 + 0.65 * e + (d >= 0 && d < 0.3 ? 0.35 : 0)) * e;
    const r0 = (58 + e * 10) * (0.3 + 0.7 * e), r1 = (96 + e * 30) * (0.3 + 0.7 * e);
    if (e > 0.05) {
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * k.TAU + 0.2 + k.noise1(t * 0.5 + i * 3) * 0.06;
      ctx.beginPath();
      ctx.moveTo(sunY * 0 + Math.cos(a) * r0, sunY + Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * r1, sunY + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.strokeStyle = k.rgba(p.sun, rayA); ctx.lineWidth = 7;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * k.TAU + 0.2 + k.noise1(t * 0.5 + i * 3) * 0.06;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, sunY + Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * r1, sunY + Math.sin(a) * r1);
      ctx.stroke();
    }
    }

    // güneş diski: sıcak renk karışımı (red->sun), ışıma (ufuk altındayken gizli)
    const glowA = (0.3 + 0.35 * e + warm * 0.25) * e;
    k.glow(0, sunY, 95 * (0.3 + 0.7 * e), warm > 0.5 ? 'red' : p.sun, glowA);
    const sr = 46 * (0.25 + 0.75 * e);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, sunY, sr + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', warm * 0.9 * e);
    ctx.beginPath(); ctx.arc(0, sunY, sr, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.sun, (1 - warm * 0.35) * e);
    ctx.beginPath(); ctx.arc(0, sunY - warm * 8, Math.max(0.1, sr - warm * 10), 0, k.TAU); ctx.fill();
    // parlama (sol üst)
    ctx.fillStyle = `rgba(255,255,255,${0.10 * e})`;
    ctx.beginPath(); ctx.ellipse(-16, sunY - 18, 22, 13, -0.5, 0, k.TAU); ctx.fill();

    // ufuk + zemin silueti (önde, güneşin üstüne gelmez)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-170, 130);
    ctx.lineTo(-170, 88);
    ctx.quadraticCurveTo(-100, 66, -40, 84);
    ctx.quadraticCurveTo(20, 98, 80, 76);
    ctx.quadraticCurveTo(130, 62, 170, 84);
    ctx.lineTo(170, 130);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darker(p.ground);
    ctx.beginPath();
    ctx.moveTo(-164, 130);
    ctx.lineTo(-164, 90);
    ctx.quadraticCurveTo(-100, 69, -40, 86);
    ctx.quadraticCurveTo(20, 100, 80, 79);
    ctx.quadraticCurveTo(130, 65, 164, 86);
    ctx.lineTo(164, 130);
    ctx.closePath(); ctx.fill();
    // güneş ufuk altında kaldığında onu gizle: zemin güneşi kapatır (zaten altta çizildi)
    // ufuk çizgisi vurgusu
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-164, 90);
    ctx.quadraticCurveTo(-100, 69, -40, 86);
    ctx.quadraticCurveTo(20, 100, 80, 79);
    ctx.quadraticCurveTo(130, 65, 164, 86);
    ctx.stroke();

    // boşta: güneş hafif nefes alır (parlama nabzı; ufuk altındayken gizli)
    k.glow(0, sunY, (70 + k.noise1(t * 1.2) * 8) * (0.3 + 0.7 * e), p.sun, 0.18 * e);
  },
};
