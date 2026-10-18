// home/bed — yandan tek kişilik yatak; yorgan nefes alır, yastık hafif oynar
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) yatağın merkezidir.
export default {
  name: 'bed', category: 'home',
  desc: 'Yandan tek kişilik yatak: başlık, yastık ve nefes alan yorgan',
  tags: ['yatak', 'uyku', 'bed', 'sleep', 'yorgan', 'blanket', 'yastık', 'pillow', 'ev', 'home'],
  box: [-135, -85, 135, 95],
  bleed: 20,
  anchor: 'yatağın merkezi (0,0); zemin y=95',
  points: { pillow: [-82, -34], blanket: [30, -30], foot: [120, 40] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'yorgan rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)', gloss = 'rgba(255,255,255,0.10)';
    // idle: yorgan nefesi (±2.5 units, ~3.9 sn periyot) + yastık hafif oynar
    const breathe = Math.sin(t * 1.6) * 2.5;
    const pillowW = Math.sin(t * 1.6 + 1.1) * 1.2;

    ctx.save();

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-128, 88); ctx.lineTo(128, 88); ctx.stroke();

    // ayaklar (yandan 2 görünür)
    ctx.fillStyle = shadow; ctx.fillRect(-102, 44, 14, 44); ctx.fillRect(102, 44, 14, 44);
    ctx.fillStyle = k.rgba('ink');
    k.rrect(-108, 38, 14, 50, 5); ctx.fill();
    k.rrect(96, 38, 14, 50, 5); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-108, 38, 14, 50, 5); ctx.stroke();
    k.rrect(96, 38, 14, 50, 5); ctx.stroke();

    // karyola çerçevesi
    ctx.fillStyle = shadow; k.rrect(-114, 30, 240, 24, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    k.rrect(-120, 24, 240, 24, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-120, 24, 240, 24, 8); ctx.stroke();

    // başlık (sol)
    ctx.fillStyle = shadow; k.rrect(-124, -62, 26, 94, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    k.rrect(-130, -68, 26, 94, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-130, -68, 26, 94, 10); ctx.stroke();
    // başlık parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-122, -52, 5, 14, 0.2, 0, k.TAU); ctx.fill();

    // şilte
    ctx.fillStyle = shadow; k.rrect(-98, -22, 222, 44, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    k.rrect(-104, -28, 222, 44, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-104, -28, 222, 44, 14); ctx.stroke();

    // yastık (başucunda, hafif oynar)
    ctx.save();
    ctx.translate(-82 + pillowW * 0.4, -36 + pillowW * 0.6); ctx.rotate(-0.06);
    ctx.fillStyle = shadow; k.rrect(-24, -14, 52, 30, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    k.rrect(-28, -16, 52, 30, 14); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-28, -16, 52, 30, 14); ctx.stroke();
    // yastık parlama
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-20, -8, 5, 8, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // yorgan (nefes alır — üst kenar sinüsle kalkar)
    const bx0 = -48, bx1 = 118, bw = bx1 - bx0, topY = -26 + breathe;
    ctx.save();
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(bx0 + 6, 18); ctx.lineTo(bx1, 18); ctx.lineTo(bx1, -6);
    ctx.quadraticCurveTo(bx1 - 10, topY + 2, bx0 + bw * 0.6, topY + 2);
    ctx.quadraticCurveTo(bx0 + bw * 0.2, topY + 3, bx0, -8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(bx0, 12); ctx.lineTo(bx1 - 6, 12);
    ctx.quadraticCurveTo(bx1, 12, bx1, -4);
    ctx.quadraticCurveTo(bx1 - 12, topY, bx0 + bw * 0.55, topY);
    ctx.quadraticCurveTo(bx0 + bw * 0.2, topY + 1, bx0, -10);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.stroke();
    // yorgan kıvrım çizgisi (iç detay, ink alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx0 + 20, topY + 16);
    ctx.quadraticCurveTo(bx0 + bw * 0.4, topY + 22, bx1 - 24, topY + 14);
    ctx.stroke();
    // premium parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(bx0 + 22, topY + 8, 8, 12, 0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // serbest kablo (priz kablosu, ink rengiyle — havai çizgi)
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(120, 60); ctx.quadraticCurveTo(132, 74, 128, 88);
    ctx.stroke();

    ctx.restore();
  },
};
