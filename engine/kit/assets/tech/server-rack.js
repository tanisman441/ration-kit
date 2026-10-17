// tech/server-rack — LED'li sunucu kabini: 4 ünite, yük arttıkça yeşil LED'ler yanar,
// alert anında kabin kırmızı yanıp söner. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), kabin negatif y yönünde yukarı uzar.
export default {
  name: 'server-rack', category: 'tech',
  desc: 'LEDli sunucu kabini; 4 ünite, yük arttıkça LED yanar, alert anında kırmızı yanıp söner',
  tags: ['sunucu', 'server', 'veri merkezi', 'rack', 'kabine', 'bilgisayar', 'server rack', 'data center', 'ağ'],
  box: [-95, -240, 95, 12],
  bleed: 10,
  anchor: 'taban (0,0); kabin yukarı uzar, boy ~225 birim',
  points: { top: [0, -230], front: [82, -115] },
  params: {
    color: { type: 'color', default: 'panel2' },
    load: { type: 'number', default: 0.4, desc: 'yanan LED oranı (0-1)' },
    alert: { type: 'time', default: null, desc: 'uyarı anı: kabin 1.2 sn kırmızı yanıp söner' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const cab = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -5, 88, 10, 0, 0, k.TAU); ctx.fill();

    // alert zamanlaması: 1.2 sn, ~8 Hz yanıp sönme
    const d = p.alert == null ? -1 : t - p.alert;
    const alarming = d >= 0 && d < 1.2;
    const flash = alarming ? (Math.sin(d * 50) > 0 ? 1 : 0.2) : 0;

    // kabin gövdesi
    blob(-78, -226, 156, 218, 12, cab);

    // üst havalandırma ızgarası
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = k.rgba('bg', 0.5);
      ctx.beginPath(); k.rrect(-52 + i * 22, -218, 12, 8, 3); ctx.fill();
    }
    // güç göstergesi (sürekli yanar)
    const pw = alarming ? k.rgba('red', 0.4 + flash * 0.6) : k.rgba('green', 0.9);
    dot(64, -213, 5, pw);
    if (!alarming) k.glow(64, -213, 15, 'green', 0.25);

    // 4 sunucu ünitesi
    const rows = 4, per = 3, total = rows * per;
    const lit = Math.round(k.clamp(p.load, 0, 1) * total);
    let li = 0;
    for (let r = 0; r < rows; r++) {
      const y = -204 + r * 50;
      blob(-66, y, 132, 42, 8, k.rgba('panel'));
      // ünite tutamağı (iç ayrım çizgisi)
      ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-56, y + 21); ctx.lineTo(14, y + 21); ctx.stroke();
      // LED'ler
      for (let cix = 0; cix < per; cix++) {
        const x = 32 + cix * 15, ly = y + 21;
        let cc;
        if (alarming) {
          cc = k.rgba('red', 0.3 + flash * 0.7);
          if (flash > 0.5) k.glow(x, ly, 16, 'red', 0.4);
        } else if (li < lit) {
          const tw = 0.72 + 0.28 * Math.sin(t * 3 + k.hash(li * 3 + 1) * k.TAU);
          cc = k.rgba('green', tw);
          if (k.hash(li * 7 + 2) > 0.55) k.glow(x, ly, 15, 'green', 0.28);
        } else {
          cc = k.rgba('dim', 0.45);
        }
        dot(x, ly, 4.5, cc);
        li++;
      }
    }

    // alert anında kabin çerçevesi kırmızı parlar
    if (alarming) {
      ctx.strokeStyle = k.rgba('red', flash); ctx.lineWidth = 6;
      ctx.beginPath(); k.rrect(-78, -226, 156, 218, 12); ctx.stroke();
    }
  },
};
