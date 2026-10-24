// birthday-fx/present-open — kurdeleli hediye kutusu; at anında kapak uçar, içinden ışık ve kıvılcımlar çıkar.
// NOT: canvas y-aşağıdır; (0,0) kutu tabanıdır, kapak negatif y yönünde yukarıdadır.
export default {
  name: 'present-open', category: 'birthday-fx',
  desc: 'Kurdeleli hediye kutusu; açılış anında kapağı uçar, içinden ışık ve kıvılcımlar saçılır',
  tags: ['hediye', 'kutu', 'açmak', 'sürpriz', 'doğum günü', 'kurdele', 'present', 'gift', 'open', 'surprise', 'birthday', 'ribbon'],
  box: [-140, -150, 140, 60],
  bleed: 60,
  anchor: 'kutu tabanı (0,0)',
  points: { lid: [0, -53], inside: [0, -30], bow: [0, -80] },
  params: {
    color: { type: 'color', default: 'purple', desc: 'kutu rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'açılış anı — 0.35 sn kapak uçuşu, 0.9 sn ışık ve kıvılcım' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const body = k.rgba(p.color), ribbon = k.rgba('ink');
    const d = p.at == null ? -1 : t - p.at;
    const open = d >= 0;
    const lift = open ? k.clamp(d / 0.35, 0, 1) : 0; // kapak kalkışı
    const bowSway = Math.sin(t * k.TAU / 2.6) * 0.06; // fiyonk salınımı (canlı idle)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const star4 = (x, y, r, a, c) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = i * Math.PI / 4 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.28;
        const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 52, 96, 10, 0, 0, k.TAU); ctx.fill();

    // kutu gövdesi + sağ alt gölge (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-84, -34, 180, 86, 14); ctx.fill();
    blob(-90, -40, 180, 86, 14, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -28, 26, 10, -0.25, 0, k.TAU); ctx.fill();
    // dikey kurdele
    ctx.fillStyle = ribbon;
    ctx.beginPath(); ctx.rect(-13, -40, 26, 86); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-13, -40); ctx.lineTo(-13, 46); ctx.moveTo(13, -40); ctx.lineTo(13, 46); ctx.stroke();

    // iç ışık: kapak kalkınca kutudan ışık huzmeleri yükselir
    if (open && d < 1.0) {
      const glowA = 0.45 * (1 - k.prog(d, 0.4, 1.0));
      k.glow(0, -40, 70, 'yellow', Math.max(glowA, 0));
      for (let i = -2; i <= 2; i++) {
        const fade = 1 - k.prog(d, 0.3, 0.9);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba('yellow', 0.35 * fade);
        ctx.beginPath();
        ctx.moveTo(i * 16 - 4, -38);
        ctx.lineTo(i * 30 - 6, -38 - 62 - Math.abs(i) * -8);
        ctx.lineTo(i * 30 + 6, -38 - 62 - Math.abs(i) * -8);
        ctx.lineTo(i * 16 + 4, -38);
        ctx.closePath(); ctx.fill();
      }
      // kıvılcımlar: kutudan yükselip söner
      for (let i = 0; i < 10; i++) {
        const h1 = k.hash(i * 7 + 2), h2 = k.hash(i * 13 + 17), h3 = k.hash(i * 19 + 31);
        const u = k.clamp((d - h3 * 0.15) / 0.7, 0, 1);
        if (u <= 0) continue;
        const x = (h1 - 0.5) * 110 * (0.4 + u);
        const y = -40 - u * (50 + h2 * 60);
        star4(x, y, 4 + h2 * 5, 0, k.rgba('yellow', 0.9 * (1 - u)));
      }
    }

    // kapak: açılınca yukarı uçar, eğilip havada asılı kalır
    const lidY = -66 - lift * 62 + (open ? Math.sin(t * 2.2) * 3 * lift : 0);
    const lidX = lift * 26;
    const lidRot = lift * 0.45;
    ctx.save();
    ctx.translate(lidX, lidY);
    ctx.rotate(lidRot);
    blob(-98, 0, 196, 26, 10, body);
    ctx.fillStyle = ribbon;
    ctx.beginPath(); ctx.rect(-13, 0, 26, 26); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-62, 8, 22, 6, -0.2, 0, k.TAU); ctx.fill();
    ctx.restore();

    // fiyonk: kapakla birlikte uçar, salınır
    ctx.save();
    ctx.translate(lidX, lidY - 2);
    ctx.rotate(lidRot + bowSway);
    disc(-20, -12, 18, 12, body);
    disc(20, -12, 18, 12, body);
    disc(0, -6, 9, 9, ribbon);
    ctx.restore();
  },
};
