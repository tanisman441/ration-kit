// classroom-fx/hand-raise — parmak kaldıran basit figür (karakter ailesi oranları: baş:gövde 1:2.6):
// at anında kol yaylanarak yukarı kalkar (0.55 sn, outBack), sonra 1.5 sn el sallar;
// idle'da nefes (gövde ±2) ve kol hafif sallanır. Yüz: kalkışta şaşkın, sonra nötr.
// canvas y-aşağı; (0,0) gövde merkezi.
export default {
  name: 'hand-raise', category: 'classroom-fx',
  desc: 'Parmak kaldıran figür: at anında kol yukarı fırlar ve el sallar',
  tags: ['parmak kaldır', 'el kaldır', 'kol', 'söz hakkı', 'raise hand', 'hand up', 'sınıf', 'class', 'öğrenci', 'student'],
  box: [-120, -140, 120, 76],
  bleed: 16,
  anchor: 'gövde merkezi',
  points: { hand: [58, -128], head: [0, -100] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'gövde rengi' },
    at: { type: 'time', default: null, desc: 'kolun kalkma anı (0.55 sn fırlama + el sallama)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    // nefes: gövde ±2 (2.4 sn periyot)
    const breathe = 2 * Math.sin(t * 2.6);
    ctx.translate(0, breathe);

    const HW = 44;                       // baş genişliği
    const shR = [30, -52];               // sağ omuz
    const ARM = 78;

    // kol açısı: 1.2 = aşağıda (sağda), -1.2 = yukarıda (sağ üst)
    let ang = 1.2 + 0.06 * Math.sin(t * 2.1);   // idle sallanma
    let raised = false;
    if (d >= 0) {
      raised = true;
      const g = k.prog(d, 0, 0.55);
      ang = k.lerp(1.2, -1.2, k.E.outBack(g, 1.6));
      if (d > 0.55) {                     // el sallama: 1.5 sn sönümlü
        const w = Math.max(0, 1 - (d - 0.55) / 1.5);
        ang += 0.24 * Math.sin((d - 0.55) * 8) * w + 0.05 * Math.sin(t * 2.1) * (1 - w);
      }
    }
    const hx = shR[0] + ARM * Math.cos(ang), hy = shR[1] + ARM * Math.sin(ang);

    // gölge (sağ alt)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-26, -46, 60, 110, 18); ctx.fill();

    // gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-34, -50, 68, 122, 20); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-30, -46, 60, 114, 18); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -30, 14, 22, 0.2, 0, k.TAU); ctx.fill();

    // sol kol (sabit, aşağıda)
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = HW * 0.28; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-30, -52);
    ctx.lineTo(-30 + 62 * Math.cos(1.35), -52 + 62 * Math.sin(1.35));
    ctx.stroke();

    // sağ kol (hareketli)
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = HW * 0.28 + 4;
    ctx.beginPath(); ctx.moveTo(shR[0], shR[1]); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = HW * 0.28;
    ctx.beginPath(); ctx.moveTo(shR[0], shR[1]); ctx.lineTo(hx, hy); ctx.stroke();

    // baş (hafif basık daire, rx = ry × 0.92)
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.ellipse(0, -96, 24, 26, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.ellipse(0, -100, 22, 24, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-8, -110, 8, 6, -0.4, 0, k.TAU); ctx.fill();

    // yüz: kalkışta şaşkın (büyük göz + O ağız), yoksa nötr
    const exc = d >= 0 && d < 1.4;
    const er = HW * 0.055 * (exc ? 1.5 : 1), gap = HW * 0.22;
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(-gap, -102, er, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(gap, -102, er, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    if (exc) { ctx.arc(0, -88, 5, 0, k.TAU); }
    else { ctx.moveTo(-7, -89); ctx.quadraticCurveTo(0, -87, 7, -89); }
    ctx.stroke();
    ctx.restore();
  },
};
