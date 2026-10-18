// sports/stadium — stadyum cephesi: tribün sıraları + saha yeşili + ışık direkleri
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) saha zemin ortasıdır.
export default {
  name: 'stadium', category: 'sports',
  desc: 'Stadyum cephesi: doluluğu ayarlanabilen tribünler, saha ve gece ışıkları',
  tags: ['stadyum', 'stadium', 'saha', 'tribün', 'arena', 'futbol', 'football', 'ışık', 'seyirci', 'crowd', 'spor'],
  box: [-180, -140, 180, 20],
  bleed: 20,
  anchor: 'saha zemin ortası (0,0)',
  points: { pitch: [0, -14] },
  params: {
    lights: { type: 'number', default: 0, desc: 'gece ışıkları şiddeti (0-1)' },
    crowd: { type: 'number', default: 0.7, desc: 'tribün doluluğu (0-1)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    const L = k.clamp(p.lights, 0, 1), C = k.clamp(p.crowd, 0, 1);

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // ışık direkleri (4 adet, arka katman): serbest çizgiler ink rengiyle
    const towers = [-150, -55, 55, 150];
    for (const x of towers) {
      // direk
      ctx.strokeStyle = line; ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, -118); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, -118); ctx.stroke();
      // ışık başlığı
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - 22, -136, 44, 18, 6); ctx.fill();
      ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(x - 19, -133, 38, 12, 5); ctx.fill();
      // lamba gözleri (lights'a göre yanar)
      for (let i = -1; i <= 1; i++) {
        const lx = x + i * 12;
        ctx.fillStyle = L > 0.05 ? k.rgba('yellow', 0.35 + 0.65 * L) : k.rgba('ink', 0.35);
        ctx.beginPath(); ctx.arc(lx, -127, 4.5, 0, k.TAU); ctx.fill();
      }
      // ışık hüzmesi (bleed içinde, gece)
      if (L > 0.05) {
        ctx.fillStyle = k.rgba('yellow', 0.10 * L);
        ctx.beginPath();
        ctx.moveTo(x - 19, -118); ctx.lineTo(x + 19, -118);
        ctx.lineTo(x + 60, 0); ctx.lineTo(x - 60, 0);
        ctx.closePath(); ctx.fill();
      }
    }

    // tribün: 3 sıra, doluluk = crowd (k.hash ile rastgele görünümlü ama deterministik)
    const rows = [-100, -78, -56];
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-172, -110, 344, 60, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(-168, -106, 336, 52, 8); ctx.fill();
    for (let r = 0; r < 3; r++) {
      const y = rows[r];
      // sıra zemini
      ctx.fillStyle = k.rgba('panel2');
      ctx.fillRect(-168, y, 336, 18);
      // seyirciler: doluluk kadar nokta
      for (let i = 0; i < 42; i++) {
        if (k.hash(r * 100 + i) > C) continue;
        const x = -160 + i * 7.8;
        const wob = k.noise1(r * 40 + i * 3) * 2;
        ctx.fillStyle = k.rgba('ink', 0.75);
        ctx.beginPath(); ctx.arc(x, y + 10 + wob, 4.6, 0, k.TAU); ctx.fill();
      }
    }
    // tribün çatısı çizgisi
    ctx.strokeStyle = line; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-172, -110); ctx.lineTo(172, -110); ctx.stroke();

    // saha yeşili: zemin şeridi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-178, -30, 356, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); k.rrect(-174, -27, 348, 24, 6); ctx.fill();
    // saha çizgileri (ink 0.75 ince)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-40, -27); ctx.lineTo(-40, -3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40, -27); ctx.lineTo(40, -3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, -15); ctx.lineTo(40, -15); ctx.stroke();
    // orta daire
    ctx.beginPath(); ctx.arc(0, -15, 14, 0, k.TAU); ctx.stroke();

    // sağ alt gölge: saha kenarı
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-174, -8, 348, 5, 3); ctx.fill();

    // premium parlama (sol üst, tribün çatısı)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, -106, 40, 5, 0, 0, k.TAU); ctx.fill();
  },
};
