// nature-fx/volcano — yanardağ konisi; boşta krater parlar + duman tüter, erupt anında lav püskürür.
// NOT: canvas y-aşağıdır; lav +y yönünde yükselip geri düşer, duman −y yönüne tüter.
export default {
  name: 'volcano',
  category: 'nature-fx',
  desc: 'Yanardağ konisi; erupt anında lav fışkırır ve duman bulutu yükselir, boşta krater parlar',
  tags: ['yanardağ', 'lav', 'püskürme', 'krater', 'duman', 'volcano', 'lava', 'eruption', 'crater', 'magma'],
  box: [-170, -190, 170, 160],
  bleed: 60,
  anchor: 'taban (0,140); krater (0,-110)',
  points: { crater: [0, -110], top: [0, -150], base: [0, 140] },
  params: {
    color: { type: 'color', default: 'dim' },
    lava: { type: 'color', default: 'red' },
    erupt: { type: 'time', default: null, desc: 'püskürme anı: lav fışkırması + duman (1.5 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.erupt == null ? -1 : t - p.erupt;
    const erupting = d >= 0 && d < 1.5;
    const ep = erupting ? k.E.outCubic(k.clamp(d / 0.5, 0, 1)) : 0;      // fışkırma yükselişi
    const fade = erupting ? k.clamp(1 - (d - 0.9) / 0.6, 0, 1) : 0;       // sönüm (0.9 sn'den sonra)

    // koni: gölge + gövde
    const cone = (ox, oy, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-150 + ox, 140 + oy);
      ctx.lineTo(-52 + ox, -100 + oy);
      ctx.quadraticCurveTo(-30 + ox, -118 + oy, 0 + ox, -118 + oy);
      ctx.quadraticCurveTo(30 + ox, -118 + oy, 52 + ox, -100 + oy);
      ctx.lineTo(150 + ox, 140 + oy);
      ctx.closePath(); ctx.fill();
    };
    cone(5, 6, line);
    cone(5, 6, darker(p.color));
    cone(0, 0, line);
    cone(0, 0, k.rgba(p.color));
    // koni parlama (sol üst yamacı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, 20, 34, 70, 0.35, 0, k.TAU); ctx.fill();

    // krater: boşta nabız gibi parlar
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    const craterA = erupting ? 0.9 : 0.35 + 0.3 * pulse;
    k.glow(0, -108, 40 + 14 * pulse + (erupting ? 40 : 0), p.lava, craterA * 0.55);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -108, 46, 16, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.lava, craterA);
    ctx.beginPath(); ctx.ellipse(0, -108, 40, 12, 0, 0, k.TAU); ctx.fill();

    // lav akıntısı: kraterden yamaca sızan lav (püskürme sırasında belirir)
    if (erupting || fade > 0) {
      const la = erupting ? 0.85 * fade + 0.15 : 0;
      if (la > 0.01) {
        ctx.strokeStyle = k.rgba(p.lava, la); ctx.lineWidth = 9;
        ctx.beginPath(); ctx.moveTo(-20, -96); ctx.quadraticCurveTo(-50, -20, -70, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(24, -96); ctx.quadraticCurveTo(56, -30, 74, 50); ctx.stroke();
      }
    }

    // lav fışkırması: kraterden yükselen damlalar
    if (erupting) {
      for (let i = 0; i < 22; i++) {
        const jp = k.clamp(d / (0.5 + k.hash(i * 3.3 + 9) * 0.4), 0, 1); // jet ilerlemesi
        const ex = (k.hash(i * 7.7 + 9) - 0.5) * 90;
        const up = (110 + k.hash(i * 5.1 + 9) * 70) * jp;
        const y = -108 - up + jp * jp * 60;                               // geri düşme eğrisi
        const x = ex * (0.4 + jp * 0.6) + k.noise1(t * 5 + i * 2) * 5;
        const a = 0.95 * fade;
        ctx.fillStyle = k.rgba(p.lava, a);
        ctx.beginPath(); ctx.arc(x, y, 4 + (1 - jp) * 6, 0, k.TAU); ctx.fill();
        if (jp > 0.25 && jp < 0.75) {
          ctx.strokeStyle = k.rgba(p.lava, 0.6 * a); ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(x - ex * 0.15, y + 24); ctx.lineTo(x, y); ctx.stroke();
        }
        // sıcak çekirdek parıltısı
        ctx.fillStyle = k.rgba('yellow', 0.7 * a * (1 - jp));
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, k.TAU); ctx.fill();
      }
      // püskürme flaşı
      k.glow(0, -140, 95 * fade, p.lava, 0.5 * fade);
    }

    // duman: boşta hafif tüter, püskürmede gürleşir
    const smokeN = erupting ? 16 : 7;
    for (let i = 0; i < smokeN; i++) {
      const cyc = 2.6;
      const ph = ((t * (0.7 + k.hash(i * 2.2 + 4) * 0.5) + k.hash(i * 6.6 + 4) * cyc) % cyc) / cyc;
      const sx = k.noise1(i * 3.7 + t * 1.6) * 40 + (erupting ? ph * 30 * (k.hash(i * 9.9 + 4) - 0.5) : 0);
      const sy = -130 - ph * (erupting ? 100 : 70);
      const r = (10 + ph * 22) * (erupting ? 1.2 : 1);
      ctx.fillStyle = k.rgba('dim', 0.55 * (1 - ph) * (erupting ? 1 : 0.7));
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, k.TAU); ctx.fill();
    }
  },
};
