// pirate-fx/cannon-fire — Eski kara topu: at anında namlu flaşı, geri tepme ve duman bulutu;
// boşta fitil ateşi hafifçe titrer.
// NOT: canvas y-aşağıdır; (0,0) kızak tabanı merkezidir, namlu ağzı [120,-34]'tür.
export default {
  name: 'cannon-fire', category: 'pirate-fx',
  desc: 'Eski kara topu: at anında namlu flaşı, geri tepme ve yayılan duman bulutu; boşta fitil parlıyor',
  tags: ['top', 'ateş', 'korsan', 'gülle', 'duman', 'namlu', 'savaş', 'cannon', 'fire', 'pirate', 'smoke', 'muzzle', 'ship'],
  box: [-170, -110, 200, 100],
  bleed: 70,
  anchor: 'kızak tabanı merkezi (tekerleklerin yere değdiği nokta)',
  points: { muzzle: [120, -34], breech: [-105, -34] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'namlu rengi (demir)' },
    at: { type: 'time', default: null, desc: 'ateş anı: flaş (0–0.18 sn), geri tepme, duman (0–1.1 sn)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // yer gölgesi (geri tepmez)
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath(); ctx.ellipse(2, 68, 105, 12, 0, 0, k.TAU); ctx.fill();

    // geri tepme: 0–0.28 sn sola kay, 0.28–0.9 sn yumuşak dönüş
    let rec = 0;
    if (d >= 0) {
      if (d < 0.28) rec = -26 * k.E.outCubic(k.prog(d, 0, 0.28));
      else rec = -26 * (1 - k.E.inOutCubic(k.prog(d, 0.28, 0.9)));
    }
    ctx.save();
    ctx.translate(rec, 0);

    // tekerlekler
    for (const wx of [-50, 55]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(wx, 34, 30, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(wx, 34, 24, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.7);
      ctx.lineWidth = 4;
      for (let s = 0; s < 6; s++) {
        const a = s * k.TAU / 6 + 0.3;
        ctx.beginPath();
        ctx.moveTo(wx, 34);
        ctx.lineTo(wx + 21 * Math.cos(a), 34 + 21 * Math.sin(a));
        ctx.stroke();
      }
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); ctx.arc(wx, 34, 7, 0, k.TAU); ctx.fill();
    }
    // dingil
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(-50, 34); ctx.lineTo(55, 34); ctx.stroke();

    // kızak (ahşap)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-96 - LW / 2, -22 - LW / 2, 186 + LW, 56 + LW, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-96, -22, 186, 56, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-96, 6); ctx.lineTo(90, 6); ctx.stroke();
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-88, -16, 16, 40, 8); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(52, 2, 34, 30, 10); ctx.fill();

    // namlu (kuyruktan ağıza incelir)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-102, -62); ctx.lineTo(116, -52); ctx.lineTo(116, -16); ctx.lineTo(-102, -6);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(-102, -56); ctx.lineTo(116, -46); ctx.lineTo(116, -22); ctx.lineTo(-102, -12);
    ctx.closePath(); ctx.fill();
    // namlu bantları
    for (const [bx, br] of [[-78, 26], [-28, 24], [22, 22], [72, 20], [108, 19]]) {
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(bx - 7 - LW / 2, -34 - br - LW / 2, 14 + LW, (br * 2) + LW, 6); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); k.rrect(bx - 7, -34 - br, 14, br * 2, 6); ctx.fill();
    }
    // kuyruk topuzu
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(-114, -34, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(-114, -34, 12, 0, k.TAU); ctx.fill();
    // premium parlama: namlu sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, -46, 34, 7, -0.06, 0, k.TAU); ctx.fill();
    // fitil deliği: boşta titreyen küçük ateş
    const flick = 0.22 + 0.18 * k.noise1(t * 9);
    k.glow(-88, -66, 12, 'yellow', flick);
    ctx.fillStyle = k.rgba('yellow', 0.75);
    ctx.beginPath(); ctx.arc(-88, -66, 3.5, 0, k.TAU); ctx.fill();
    ctx.restore(); // geri tepme sonu

    // --- ateş efektleri (geri tepmez, namlu ağzında sabit) ---
    if (d >= 0 && d < 0.18) {
      // namlu flaşı: 8 köşeli yıldız
      const f = 1 - d / 0.18;
      const R = 40 * (0.7 + 0.3 * f) + 8 * d * 60;
      k.glow(122, -34, 90 * f, 'yellow', 0.5 * f);
      ctx.fillStyle = k.rgba('yellow', 0.95 * f);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = i * k.TAU / 16;
        const rr = (i % 2 === 0 ? R : R * 0.42);
        const x = 122 + rr * Math.cos(a), y = -34 + rr * Math.sin(a) * 0.8;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.7 * f);
      ctx.beginPath(); ctx.arc(122, -34, 14 * f + 4, 0, k.TAU); ctx.fill();
    }
    if (d >= 0 && d < 0.32) {
      // gülle izi: ağızdan sağa fırlayan gülle
      const bd = k.prog(d, 0, 0.32);
      const bx = 130 + 120 * k.E.outExpo(bd);
      ctx.strokeStyle = k.rgba('dim', 0.5 * (1 - bd));
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(126, -34); ctx.lineTo(bx, -34); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.95 * (1 - bd * 0.5));
      ctx.beginPath(); ctx.arc(bx, -34, 11, 0, k.TAU); ctx.fill();
    }
    if (d >= 0 && d < 1.15) {
      // duman bulutu: ağızdan yükselip dağılan topaklar
      for (let i = 0; i < 9; i++) {
        const h1 = k.hash(i * 17 + 11), h2 = k.hash(i * 31 + 47), h3 = k.hash(i * 53 + 83);
        const dd = d - h3 * 0.3;
        if (dd < 0) continue;
        const fade = 1 - k.prog(dd, 0.15, 1.05);
        if (fade <= 0) continue;
        const x = 132 + dd * (40 + h1 * 30);
        const y = -44 - dd * (40 + h2 * 46) + dd * dd * 26;
        const r = 11 + dd * 30;
        ctx.fillStyle = k.rgba('dim', 0.6 * fade);
        ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
