// construction-fx/saw-dust — dönen daire testere + testere dişinden savrulan döngülü toz bulutları.
// NOT: canvas y-aşağıdır; (0,0) testere merkezi.
export default {
  name: 'saw-dust', category: 'construction-fx',
  desc: 'Circular saw with a spinning blade and looping dust puffs thrown off the cutting point',
  tags: ['testere', 'daire testere', 'toz', 'kesme', 'inşaat', 'saw', 'circular saw', 'dust', 'cutting'],
  box: [-120, -115, 120, 120],
  bleed: 50,
  anchor: 'testere merkezi (0,10)',
  points: { blade: [0, 10], contact: [0, 88] },
  params: {
    spin: { type: 'number', default: 1, desc: 'testere dönüş hızı çarpanı (0 = durur)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 6;
    const rot = t * 7 * p.spin;
    const cx = 0, cy = 10, R = 76;

    // 1) testere dişleri — döner
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.beginPath();
    const teeth = 26;
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * k.TAU, a1 = ((i + 0.55) / teeth) * k.TAU, a2 = ((i + 1) / teeth) * k.TAU;
      const x0 = Math.cos(a0) * R, y0 = Math.sin(a0) * R;
      const x1 = Math.cos(a1) * (R + 11), y1 = Math.sin(a1) * (R + 11);
      const x2 = Math.cos(a2) * R, y2 = Math.sin(a2) * R;
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // 2) bıçak diski
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, k.TAU); ctx.fill();
    // 3) dönüşü gösteren yuvalar — döner
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 7;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.arc(0, 0, 44, (i / 4) * k.TAU, (i / 4) * k.TAU + 1.1); ctx.stroke();
    }
    ctx.restore();
    // 4) mil + sarı vurgu halkası (tek vurgu rengi)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.arc(cx + 6, cy + 6, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.arc(cx, cy, 15, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('yellow', 0.9); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, 15, 0, k.TAU); ctx.stroke();
    // 5) koruyucu kapak — bıçağın üst yarısı
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 30;
    ctx.beginPath(); ctx.arc(cx, cy, R + 12, Math.PI, k.TAU); ctx.stroke();
    ctx.strokeStyle = ol; ctx.lineWidth = OW;
    ctx.beginPath(); ctx.arc(cx, cy, R + 26, Math.PI, k.TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R - 2, Math.PI, k.TAU); ctx.stroke();
    // 6) tutamak
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(26, -108, 58, 34, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(20, -114, 58, 34, 12); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(38, -106, 12, 5, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = OW;
    ctx.beginPath(); k.rrect(20, -114, 58, 34, 12); ctx.stroke();
    // 7) döngülü toz bulutları — kesim noktasından savrulur
    for (let i = 0; i < 5; i++) {
      const cyc = (t * 0.45 + k.hash(i * 11 + 1)) % 1;
      const px = -8 - cyc * 56 + k.noise1(i * 3 + t * 3) * 8;
      const py = 86 - cyc * 72;
      const r = 6 + cyc * 15;
      ctx.fillStyle = k.rgba('dim', 0.35 * (1 - cyc));
      ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
