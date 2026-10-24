// art-fx/canvas-flip — tuval: at anında (0.7 sn) dikey eksende takla atar,
// ortada kenar görünür; boştayken hafifçe süzülür, altında yumuşak gölge.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = tuval merkezi.
export default {
  name: 'canvas-flip', category: 'art-fx',
  desc: 'Ahşap çerçeveli tuval; flip anında dikey eksende döner, boştayken süzülür',
  tags: ['tuval', 'kanvas', 'resim', 'tablo', 'çerçeve', 'sanat', 'canvas', 'painting', 'frame', 'art', 'flip'],
  box: [-130, -150, 130, 150],
  bleed: 0,
  anchor: 'tuval merkezi (0,0)',
  points: { topleft: [-95, -120], center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'flip anı (0.7 sn: dikey eksende tam tur)' },
  },
  draw(ctx, t, p, k) {
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const g = k.prog(d, 0, 0.7);
    const flying = d >= 0 && d < 0.7;
    const lift = flying ? Math.sin(g * Math.PI) * 28 : 0;
    const bob = flying ? 0 : Math.sin(t * 1.6) * 3; // idle süzülüş
    const sx = Math.cos(g * Math.PI);               // dikey eksende dönüş

    ctx.save();
    ctx.beginPath(); ctx.rect(-135, -155, 270, 310); ctx.clip();

    // yumuşak zemin gölgesi (kalkışta küçülür)
    const shS = 1 - lift / 90;
    ctx.fillStyle = k.rgba('ink', 0.13);
    ctx.beginPath(); ctx.ellipse(6, 140, 80 * shS, 10 * shS, 0, 0, k.TAU); ctx.fill();

    ctx.save();
    ctx.translate(0, -lift + bob);
    if (Math.abs(sx) < 0.15) {
      // kenar görünüm (dönüşün ortası)
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-8 - LW / 2, -120 - LW / 2, 16 + LW, 240 + LW, 6); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(-8, -120, 16, 240, 6); ctx.fill();
    } else {
      ctx.scale(sx, 1);
      // ahşap çerçeve
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-95 - LW / 2, -120 - LW / 2, 190 + LW, 240 + LW, 10); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(-95, -120, 190, 240, 10); ctx.fill();
      // iç resim: gökyüzü + güneş + dağlar
      ctx.fillStyle = k.rgba('panel2', 1);
      ctx.beginPath(); k.rrect(-78, -103, 156, 206, 6); ctx.fill();
      ctx.fillStyle = k.rgba('accent', 1);
      ctx.beginPath(); ctx.arc(-30, -52, 27, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath();
      ctx.moveTo(-78, 20); ctx.lineTo(-30, -38); ctx.lineTo(18, 20); ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath();
      ctx.moveTo(-10, 20); ctx.lineTo(38, -24); ctx.lineTo(78, 20); ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.beginPath(); k.rrect(-78, 20, 156, 83, 6); ctx.fill();
      // premium parlama: çerçevenin sol üstü
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-62, -88, 30, 12, -0.4, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    ctx.restore();
  },
};
