// medieval-fx/knight-march — zırhlı şövalye yürüyüşü, yandan görünüm (sağa bakar).
// Sürekli 1.2 sn'lik yürüme döngüsü + pelerin ve sancak dalgalanması;
// stomp anında (0.5 sn) yere basar, toz halkası çıkarır ve kalkanı kaldırır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'knight-march', category: 'medieval-fx',
  desc: 'Zırhlı şövalye yürüyüşü; stomp anında yere basar, toz çıkarır, sancak dalgalanır',
  tags: ['şövalye', 'zırh', 'yürüyüş', 'sancak', 'savaşçı', 'ortaçağ', 'knight', 'armor', 'march', 'banner'],
  box: [-140, -265, 140, 15],
  bleed: 45,
  anchor: 'ayaklar (0,0); boy ~245 birim',
  points: { head: [6, -205], banner: [34, -258], shield: [-46, -140], feet: [0, 0] },
  params: {
    stomp: { type: 'time', default: null, desc: 'yere basma (0.5 sn: çökme + toz halkası)' },
    color: { type: 'color', default: 'dim', desc: 'zırh rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const dark = k.rgba('ink', 0.8);
    const sd = p.stomp == null ? -1 : t - p.stomp;
    const stomping = sd >= 0 && sd < 0.5;
    const senv = stomping ? Math.sin((sd / 0.5) * Math.PI) : 0;

    // Yürüyüş döngüsü 1.2 sn; stomp'ta bacaklar kapanır, gövde 8 birim çöker
    const cyc = 1.2, ph0 = t * k.TAU / cyc;
    const bob = 4 * Math.sin(ph0 * 2) - 8 * senv;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Güvenlik: box+bleed içine kırp
    ctx.save();
    ctx.beginPath(); ctx.rect(-185, -310, 370, 365); ctx.clip();

    const seg = (x1, y1, x2, y2, w, c, lc) => {
      ctx.strokeStyle = lc; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    // bacak: kalça → diz → ayak (stomp'ta adımlar kısalır)
    const leg = (hx, hy, ph, far) => {
      const stride = 30 * (1 - 0.75 * senv);
      const fx = hx + stride * Math.sin(ph);
      const fy = -Math.max(0, 26 * Math.sin(ph + Math.PI / 2)) * (1 - 0.9 * senv);
      const kx = (hx + fx) / 2 + 9, ky = (hy + fy) / 2 + 5;
      const c = far ? k.rgba(p.color, 0.45) : body;
      const lc = far ? k.rgba('bg', 0.35) : line;
      seg(hx, hy, kx, ky, 15, c, lc);
      seg(kx, ky, fx, fy, 12, c, lc);
      // ayak (zırh pabuç): kısa yatay rrect
      ctx.fillStyle = far ? k.rgba('ink', 0.4) : dark;
      ctx.beginPath(); k.rrect(fx - 15, fy - 13, 32, 13, 6); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(2, -2, 62 + 6 * Math.sin(ph0 * 2 + 1), 9, 0, 0, k.TAU); ctx.fill();

    // arka (uzak) bacak
    leg(-9, -104 + bob, ph0 + Math.PI, true);

    // pelerin: omuzlardan geriye dalgalanır (kırmızı vurgu)
    ctx.fillStyle = k.rgba('red', 0.92);
    const flut = k.noise1(t * 3.2) * 10;
    ctx.beginPath();
    ctx.moveTo(-14, -172 + bob);
    ctx.quadraticCurveTo(-52, -150 + bob + flut * 0.5, -70, -96 + bob + flut);
    ctx.quadraticCurveTo(-48, -104 + bob, -40, -140 + bob);
    ctx.quadraticCurveTo(-30, -160 + bob, -14, -172 + bob);
    ctx.closePath(); ctx.fill();
    // pelerin parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-30, -158 + bob, 12, 7, -0.5, 0, k.TAU); ctx.fill();

    // gövde (göğüs zırhı): baş genişliği 50, gövde ~130 → 1:2.6 ailesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-36 - LW / 2, -172 + bob - LW / 2, 72 + LW, 74 + LW, 16); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-36, -172 + bob, 72, 74, 16); ctx.fill();
    // sağ alt gölge %12 (clip'li) + sol üst parlama
    ctx.save();
    ctx.beginPath(); k.rrect(-36, -172 + bob, 72, 74, 16); ctx.clip();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.fillRect(2, -172 + bob, 34, 74);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, -162 + bob, 20, 10, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();
    // göğüs bandı (iç ayrım, ink ince)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-30, -140 + bob); ctx.lineTo(30, -140 + bob); ctx.stroke();

    // baş: miğfer (baş = hafif basık daire, rx = ry×0.92)
    const hy = -192 + bob;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(6, hy, 27 + LW / 2, 24 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(6, hy, 27, 24, 0, 0, k.TAU); ctx.fill();
    // miğfer tepesi (sivri kubbe)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-20, hy - 8); ctx.lineTo(6, hy - 34); ctx.lineTo(32, hy - 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-16, hy - 9); ctx.lineTo(6, hy - 30); ctx.lineTo(28, hy - 9); ctx.closePath(); ctx.fill();
    // sorguç (kırmızı)
    const pw = k.noise1(t * 4.1) * 4;
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath();
    ctx.moveTo(2, hy - 32); ctx.quadraticCurveTo(16, hy - 44 + pw, 30, hy - 34); ctx.quadraticCurveTo(18, hy - 36 + pw * 0.4, 2, hy - 32);
    ctx.closePath(); ctx.fill();
    // göz yarığı (ink)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(8, hy - 6, 26, 7, 3.5); ctx.fill();

    // sol kol + kalkan (kalkan stomp'ta yukarı kalkar)
    const shx = -40, shy = -136 + bob - 10 * senv;
    seg(-10, -158 + bob, shx, shy, 13, body, line);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(shx, shy, 36 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(shx, shy, 36, 0, k.TAU); ctx.fill();
    // kalkan arması: kırmızı haç
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath(); k.rrect(shx - 7, shy - 26, 14, 52, 7); ctx.fill();
    ctx.beginPath(); k.rrect(shx - 26, shy - 7, 52, 14, 7); ctx.fill();
    // kalkan göbeği
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); ctx.arc(shx, shy, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(shx - 12, shy - 12, 12, 7, -0.5, 0, k.TAU); ctx.fill();

    // sağ kol: sancak direğini tutar
    const hndx = 30, hndy = -118 + bob;
    seg(14, -156 + bob, hndx, hndy, 13, body, line);
    // sancak direği
    const poleX = 34;
    seg(poleX, -20, poleX, -250, 6, body, line);
    // sancak bezi: üçgen flama, rüzgârda dalgalanır
    const fw = k.noise1(t * 5.3), fw2 = k.noise1(t * 5.3 + 2.7);
    ctx.fillStyle = k.rgba('red', 0.95);
    ctx.beginPath();
    ctx.moveTo(poleX, -250);
    ctx.quadraticCurveTo(poleX + 44, -242 + fw * 8, poleX + 78, -230 + fw2 * 10);
    ctx.quadraticCurveTo(poleX + 44, -224 + fw * 6, poleX, -214);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(poleX + 22, -240 + fw * 4, 14, 5, -0.3, 0, k.TAU); ctx.fill();

    // kılıç kında (sol kalçada)
    ctx.save();
    ctx.translate(-30, -104 + bob); ctx.rotate(0.5);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-8 - LW / 2, 0, 16 + LW, 46, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85); ctx.beginPath(); k.rrect(-8, 0, 16, 46, 8); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.9); ctx.fillRect(-12, -4, 24, 8);
    ctx.restore();

    // ön (yakın) bacak
    leg(9, -104 + bob, ph0, false);

    // stomp toz halkası: 0–0.5 sn genişler solar
    if (stomping) {
      const g = k.prog(sd, 0, 0.5), al = 1 - g;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * k.TAU + 0.4;
        const rr = (18 + g * 66) * (0.7 + k.hash(i * 3 + 1) * 0.6);
        ctx.fillStyle = k.rgba('dim', 0.45 * al);
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, -6 - g * 14, 6 + g * 9, 0, k.TAU); ctx.fill();
      }
      k.glow(0, -6, 30, 'yellow', 0.25 * al);
    }
    ctx.restore();
  },
};
