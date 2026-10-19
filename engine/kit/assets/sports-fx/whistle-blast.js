// sports-fx/whistle-blast — düdük ve patlama anında sağa yayılan ses dalgası yayları.
// NOT: canvas y-aşağıdır; düdük sola bakar, ses dalgaları sağa (+x) genişler.
export default {
  name: 'whistle-blast',
  category: 'sports-fx',
  desc: 'Hakem düdüğü: patlama anında sağa doğru genişleyen ses dalgası yayları',
  tags: ['düdük', 'ses', 'hakem', 'ıslık', 'whistle', 'sound', 'referee', 'blast', 'ses dalgası'],
  box: [-240, -150, 200, 150],
  bleed: 40,
  anchor: 'düdük gövdesi merkezi (-75,0); ses kaynağı noktası bell (0,0)',
  points: { mouth: [-224, 0], bell: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'ıslık anı: ses dalgası yayları fırlar' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const bob = Math.sin(t * 2.1) * 4;                    // idle: hafif süzülme
    const C = k.rgba(p.color), line = k.rgba('bg', 0.55), inkC = k.rgba('ink');
    const sx = 0;                                        // ses kaynağı (gövde sağ kenarı)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.translate(0, bob);

    // ağızlık (sol): ince boru
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-228, -24, 108, 48, 17); ctx.fill();
    ctx.fillStyle = C;
    ctx.beginPath(); k.rrect(-222, -18, 96, 36, 13); ctx.fill();
    // gövde: yuvarlak düdük başı
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(-75, 0, 64, 0, k.TAU); ctx.fill();
    ctx.fillStyle = C;
    ctx.beginPath(); ctx.arc(-75, 0, 58, 0, k.TAU); ctx.fill();
    // ses penceresi (üst çentik)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-45, -70, 42, 36, 11); ctx.fill();
    ctx.fillStyle = inkC;
    ctx.beginPath(); k.rrect(-39, -64, 30, 24, 8); ctx.fill();
    // bezelye deliği detayı
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(-75, 17, 12, 0, k.TAU); ctx.fill();
    // premium parlama: sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-104, -32, 23, 14, -0.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(-50, 35, 22, 13, -0.5, 0, k.TAU); ctx.fill();

    // ses dalgası yayları — patlamada 3 yay kademeli fırlar (0.8 sn)
    const blasting = d >= 0 && d < 0.8;
    for (let i = 0; i < 3; i++) {
      const dd = blasting ? d - i * 0.14 : -1;
      if (dd >= 0 && dd < 0.62) {
        const e = k.E.outExpo(k.clamp(dd / 0.62, 0, 1));
        const r = 30 + 150 * e;
        const a = 0.85 * (1 - dd / 0.62);
        ctx.strokeStyle = k.rgba(p.color, a);
        ctx.lineWidth = 12 - i * 2;
        ctx.beginPath(); ctx.arc(sx, 0, r, -0.85, 0.85); ctx.stroke();
      } else if (!blasting) {
        // beklemede tek sönük yay (hazırda hissi)
        ctx.strokeStyle = k.rgba(p.color, 0.18);
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(sx, 0, 62 + i * 26, -0.85, 0.85); ctx.stroke();
      }
    }
    // patlama yıldızı — gövde ağzında kısa flaş
    if (blasting && d < 0.18) {
      const f = 1 - d / 0.18;
      k.glow(sx, 0, 100 * f, 'yellow', 0.45 * f);
      ctx.fillStyle = k.rgba('yellow', 0.85 * f);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * k.TAU + 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.15) * 22, Math.sin(a - 0.15) * 22);
        ctx.lineTo(Math.cos(a) * (48 * f + 22), Math.sin(a) * (48 * f + 22));
        ctx.lineTo(Math.cos(a + 0.15) * 22, Math.sin(a + 0.15) * 22);
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
  },
};
