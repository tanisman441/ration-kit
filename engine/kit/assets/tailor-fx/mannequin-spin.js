// tailor-fx/mannequin-spin — terzi mankeni döngüsel döner; elbise eteği salınır, dönüşte yan görünüm belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi, taban y ~95.
export default {
  name: 'mannequin-spin', category: 'tailor-fx',
  desc: 'Elbiseli terzi mankeni standında döner; dönüşte elbise salınır, yan görünümde siluet incelir',
  tags: ['terzi', 'manken', 'elbise', 'dönmek', 'moda', 'dikiş', 'tailor', 'mannequin', 'dress', 'spin', 'fashion', 'sewing'],
  box: [-120, -115, 120, 115],
  bleed: 30,
  anchor: 'gövde merkezi (0,0); taban y ~95',
  points: { mannequin: [0, -10], dress: [0, 30], base: [0, 95] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // dönüş: 3.6 sn'de tam tur; x ölçeği cos ile döner (yan görünümde siluet incelir)
    const spin = t * k.TAU / 3.6;
    const sx = Math.cos(spin);
    const facing = sx >= 0; // ön yüz mü arka yüz mü
    const hemSway = Math.sin(t * k.TAU / 1.8) * 6;

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi + stand tabanı
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(0, 98, 52, 7, 0, 0, k.TAU); ctx.fill();
    blob(-46, 90, 92, 12, 6, k.rgba('panel2'));
    // stand direği
    ctx.strokeStyle = line; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, 92); ctx.lineTo(0, 52); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 92); ctx.lineTo(0, 52); ctx.stroke();

    // manken + elbise (dönüş ölçeğiyle)
    ctx.save();
    ctx.translate(0, 0);
    ctx.scale(Math.max(Math.abs(sx), 0.12) * (sx < 0 ? -1 : 1), 1);
    // elbise eteği: belden diz altına açılan çan; etek ucu salınır
    ctx.beginPath();
    ctx.moveTo(-24, -6);
    ctx.quadraticCurveTo(-30, 26, -44 - Math.abs(hemSway) * 0.4, 52 + hemSway * 0.4);
    ctx.quadraticCurveTo(0, 62 + hemSway * 0.4, 44 + Math.abs(hemSway) * 0.4, 52 + hemSway * 0.4);
    ctx.quadraticCurveTo(30, 26, 24, -6);
    ctx.closePath();
    ctx.fillStyle = line; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-21, -6);
    ctx.quadraticCurveTo(-27, 26, -40 - Math.abs(hemSway) * 0.4, 50 + hemSway * 0.4);
    ctx.quadraticCurveTo(0, 59 + hemSway * 0.4, 40 + Math.abs(hemSway) * 0.4, 50 + hemSway * 0.4);
    ctx.quadraticCurveTo(27, 26, 21, -6);
    ctx.closePath();
    ctx.fillStyle = body; ctx.fill();
    // etek kıvrım çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-16, 26, -24, 50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.quadraticCurveTo(16, 26, 24, 50); ctx.stroke();
    // gövde (korse üst): omuzdan bele
    ctx.beginPath();
    ctx.moveTo(-26, -58);
    ctx.quadraticCurveTo(-30, -30, -24, -6);
    ctx.lineTo(24, -6);
    ctx.quadraticCurveTo(30, -30, 26, -58);
    ctx.quadraticCurveTo(0, -66, -26, -58);
    ctx.closePath();
    ctx.fillStyle = line; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-23, -56);
    ctx.quadraticCurveTo(-27, -30, -21, -8);
    ctx.lineTo(21, -8);
    ctx.quadraticCurveTo(27, -30, 23, -56);
    ctx.quadraticCurveTo(0, -63, -23, -56);
    ctx.closePath();
    ctx.fillStyle = facing ? body : k.rgba('panel2'); ctx.fill();
    // arka yüzde fermuar çizgisi
    if (!facing) {
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(0, -10); ctx.stroke();
      ctx.setLineDash([]);
    }
    // bel kuşağı (vurgu)
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); k.rrect(-25, -12, 50, 9, 4); ctx.fill();
    // premium parlama (sol üst) — ön yüzde
    if (facing) {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-14, -46, 9, 5, -0.4, 0, k.TAU); ctx.fill();
    }
    // boyun + kapak
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-6, -72, 12, 16, 5); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-4, -72, 8, 14, 4); ctx.fill();
    ctx.fillStyle = k.rgba('accent');
    ctx.beginPath(); ctx.arc(0, -74, 6, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
