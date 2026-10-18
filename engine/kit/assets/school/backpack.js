// school/backpack — ön cepli okul çantası; bounce anında zıplayıp esner
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) çanta merkezidir.
export default {
  name: 'backpack', category: 'school',
  desc: 'Ön cepli, askılı okul çantası; bounce anında havaya zıplayıp esneyerek iner',
  tags: ['çanta', 'okul çantası', 'backpack', 'sırt çantası', 'okul', 'school'],
  box: [-100, -135, 100, 105],
  bleed: 50,
  anchor: 'çanta merkezi (0,0)',
  points: { top: [0, -95], pocket: [0, 45] },
  params: {
    bounce: { type: 'time', default: null, desc: 'zıplama anı (havaya kalkıp esneyerek iner, ~0.55 sn)' },
    color: { type: 'color', default: 'accent' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba(p.color);
    const d = p.bounce == null ? -1 : t - p.bounce;

    // bounce: havaya kalkış + inişte esneme
    let yoff = 0, sx = 1, sy = 1;
    if (d >= 0 && d < 0.55) {
      const q = d / 0.55;
      yoff = -Math.sin(q * Math.PI) * 40;
      const air = Math.sin(q * Math.PI);
      sy = 1 + 0.07 * air - 0.10 * Math.pow(Math.max(0, 1 - q * 3), 2); // inişte basık
      sx = 1 - 0.06 * air + 0.08 * Math.pow(Math.max(0, 1 - q * 3), 2);
    } else {
      yoff = Math.sin(t * (k.TAU / 2.4)) * 3; // nefes (idle)
    }
    const sway = Math.sin(t * 1.3) * 0.025; // hafif salınım (idle)

    ctx.save();
    ctx.translate(0, yoff);
    ctx.rotate(sway);
    ctx.scale(sx, sy);

    // askılar (arkada, üstten çıkar)
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 14; ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * 52, -80);
      ctx.quadraticCurveTo(s * 60, -118, s * 30, -128);
      ctx.stroke();
    }

    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-85 - LW / 2, -95 - LW / 2, 170 + LW, 180 + LW, 34); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-85, -95, 170, 180, 34); ctx.fill();
    // sağ alt gölge + sol üst parlama (premium)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(10, -10, 75, 95, 30); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -62, 34, 18, -0.35, 0, k.TAU); ctx.fill();

    // üst fermuar çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-62, -52); ctx.quadraticCurveTo(0, -38, 62, -52);
    ctx.stroke();

    // ön cep
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-58 - LW / 2, 8 - LW / 2, 116 + LW, 68 + LW, 20); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-58, 8, 116, 68, 20); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-58, 48, 116, 28, 16); ctx.fill();
    // cep fermuarı
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-44, 24); ctx.quadraticCurveTo(0, 34, 44, 24);
    ctx.stroke();
    // cep kulpu
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); k.rrect(-6, 26, 12, 16, 6); ctx.fill();

    // tutma sapı
    ctx.strokeStyle = line; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.arc(0, -88, 26, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(0, -88, 26, Math.PI, 0); ctx.stroke();

    ctx.restore();
  },
};
