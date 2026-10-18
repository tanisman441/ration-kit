// sports/goal — futbol kalesi: iki direk + üst direk + arkada file
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) kale ağzı zemin ortasıdır.
export default {
  name: 'goal', category: 'sports',
  desc: 'Futbol kalesi: renkli direkler ve gösterilip gizlenebilen arka file',
  tags: ['kale', 'goal', 'direk', 'file', 'net', 'futbol', 'soccer', 'goalpost', 'spor'],
  box: [-160, -130, 160, 50],
  bleed: 8,
  anchor: 'kale ağzı zemin ortası (0,0)',
  points: { bar: [0, -115] },
  params: {
    color: { type: 'color', default: 'ink' },
    net: { type: 'enum', values: ['on', 'off'], default: 'on', desc: 'arka file göster/gizle' },
  },
  draw(ctx, t, p, k) {
    const post = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const PW = 120, PH = 115, DD = 40; // ağız genişliği, yükseklik, file derinliği

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // arka file (ön çerçevenin gerisinde, yukarı kaymış dikdörtgen + örgü)
    if (p.net === 'on') {
      const bx0 = -PW / 2 - 15, bx1 = PW / 2 + 15, by0 = -PH + DD, by1 = DD;
      // file örgüsü
      ctx.strokeStyle = k.rgba('ink', 0.32); ctx.lineWidth = 2;
      for (let x = bx0; x <= bx1 + 0.5; x += 14) {
        ctx.beginPath(); ctx.moveTo(x, by0); ctx.lineTo(x, by1); ctx.stroke();
      }
      for (let y = by0; y <= by1 + 0.5; y += 14) {
        ctx.beginPath(); ctx.moveTo(bx0, y); ctx.lineTo(bx1, y); ctx.stroke();
      }
      // fileyi ön çerçeveye bağlayan serbest çizgiler (ink)
      ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-PW / 2, -PH); ctx.lineTo(bx0, by0);
      ctx.moveTo(PW / 2, -PH); ctx.lineTo(bx1, by0);
      ctx.moveTo(-PW / 2, 0); ctx.lineTo(bx0, by1);
      ctx.moveTo(PW / 2, 0); ctx.lineTo(bx1, by1);
      ctx.stroke();
    }

    // direkler: önce dış hat (bg 0.55), sonra renkli gövde, sonra sağ alt gölge
    const bar = (x1, y1, x2, y2) => {
      ctx.strokeStyle = line; ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = post; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x1 + 3, y1 + 4); ctx.lineTo(x2 + 3, y2 + 4); ctx.stroke();
    };
    bar(-PW / 2, 0, -PW / 2, -PH);   // sol direk
    bar(PW / 2, 0, PW / 2, -PH);     // sağ direk
    bar(-PW / 2, -PH, PW / 2, -PH);  // üst direk

    // premium parlama: üst direk sol kısmı
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-PW / 4, -PH, 26, 5, 0, 0, k.TAU); ctx.fill();
  },
};
