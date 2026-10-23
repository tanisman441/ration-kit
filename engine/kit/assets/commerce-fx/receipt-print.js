// commerce-fx/receipt-print — fiş yazıcısı; `print` fişin çıkış uzunluğunu, yazıcı başlığı sürekli mekik hareketi yapar.
// NOT: canvas y-aşağıdır. Idle: başlık 0.9 sn periyotlu mekik + fiş ucunda hafif dalgalanma.
export default {
  name: 'receipt-print', category: 'commerce-fx',
  desc: 'Üstten fiş çıkaran yazıcı; başlık mekik hareketi yapar, fiş uzunluğu print ile ayarlanır',
  tags: ['fiş', 'yazıcı', 'fatura', 'kasa', 'baskı', 'receipt', 'printer', 'invoice', 'print', 'checkout', 'bill'],
  box: [-125, -270, 125, 105],
  bleed: 40,
  anchor: 'yazıcının tabanı (0,72)',
  points: { slot: [0, -38], paper_top: [0, -190] },
  params: {
    color: { type: 'color', default: 'ink' },
    print: { type: 'number', default: 0.6, desc: 'fişin çıkış ilerlemesi (0-1)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const pr = k.clamp(p.print ?? 0.6, 0, 1);

    // fiş kağıdı (zigzag üst kenarlı tek path)
    const paperLen = 30 + pr * 200;
    const pw = 124;
    const topY = -38 - paperLen;
    const flut = k.noise1(t * 3) * 3; // fiş ucunda hafif dalgalanma
    const zigPath = (half, dy) => {
      ctx.beginPath();
      ctx.moveTo(-half, -28);
      ctx.lineTo(-half, topY + dy);
      for (let i = 0; i <= 8; i++) {
        const zx = -half + (i / 8) * half * 2;
        ctx.lineTo(zx, topY + dy + (i % 2 === 0 ? 0 : 9) + flut * (i / 8));
      }
      ctx.lineTo(half, -28);
      ctx.closePath();
    };
    zigPath(pw / 2 + 5, -5); ctx.fillStyle = line; ctx.fill();
    zigPath(pw / 2, 0); ctx.fillStyle = k.rgba('panel2'); ctx.fill();
    // sol üst parlama (kağıt üstünde)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-pw / 2 + 26, -38 - paperLen + 18, 22, 7, -0.3, 0, k.TAU); ctx.fill();
    // fiş satırları (yazdırılmış mürekkep çizgileri)
    const rows = Math.floor(pr * 9);
    for (let i = 0; i < rows; i++) {
      const ry = -38 - paperLen + 26 + i * 20;
      const rw = pw - 34 - k.hash(i * 4.3) * 30;
      ctx.fillStyle = k.rgba('ink', 0.55);
      ctx.fillRect(-pw / 2 + 16, ry, rw, 6);
    }
    // toplam satırı (vurgu rengi)
    if (rows >= 3) {
      const ty = -38 - paperLen + 26 + (rows - 1) * 20;
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.fillRect(-pw / 2 + 16, ty + 4, pw - 40, 8);
    }
    // yırtık alt kenar yerine: kağıt parlama üstte kaldı, satırlar aşağıda

    // yazıcı gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-118, -38, 236, 110, 24); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-110, -30, 220, 94, 20); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); k.rrect(-110 + 96, -30 + 52, 114, 42, 16); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-64, -16, 44, 10, -0.25, 0, k.TAU); ctx.fill();
    // başlık penceresi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); k.rrect(-88, -22, 176, 30, 12); ctx.fill();
    // yazıcı başlığı (mekik: 0.9 sn periyot)
    const hx = Math.sin(t * k.TAU / 0.9) * 58;
    k.glow(hx, -7, 22, 'green', 0.25);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(hx - 26, -18, 52, 22, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(hx - 20, -13, 40, 12, 6); ctx.fill();
    // kağıt çıkış yuvası
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); k.rrect(-pw / 2 - 8, -42, pw + 16, 12, 6); ctx.fill();
    // güç LED'i (yanıp söner)
    const led = k.hash(Math.floor(t / 0.8)) > 0.3 ? 0.9 : 0.25;
    k.glow(92, 34, 14, 'green', 0.4 * led);
    ctx.fillStyle = k.rgba('green', led);
    ctx.beginPath(); ctx.arc(92, 34, 6, 0, k.TAU); ctx.fill();
    // zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.ellipse(0, 78, 105, 9, 0, 0, k.TAU); ctx.fill();
  },
};
