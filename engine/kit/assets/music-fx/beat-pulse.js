// music-fx/beat-pulse — nabız gibi atan ritim halkaları: hoparlör kalbinden yayılan halka dalgaları.
// beat anında parlama + genişleyen halka (0.4 sn); boşta kalp atışı nabzı (2.4 sn periyot).
export default {
  name: 'beat-pulse', category: 'music-fx',
  desc: 'Speaker core radiating rhythm rings like a heartbeat, flashing on each beat',
  tags: ['ritim', 'nabız', 'beat', 'vuruş', 'halka', 'heartbeat', 'pulse', 'rhythm ring', 'kalp atışı'],
  box: [-170, -130, 170, 130],
  bleed: 45,
  anchor: '(0,0) hoparlör çekirdeği; halkalar merkezden dışa yayılır',
  points: { core: [0, 0], edge: [140, 0], top: [0, -120] },
  params: {
    beat: { type: 'time', default: null, desc: 'vuruş anı: parlama + genişleyen halka (0.4 sn)' },
    color: { type: 'color', default: 'yellow' },
    rings: { type: 'number', default: 3, desc: 'yayılan halka sayısı (2-4)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const n = Math.max(2, Math.min(4, Math.round(p.rings)));
    const d = p.beat == null ? -1 : t - p.beat;

    // 1) kalp atışı nabzı: 2.4 sn periyotta çift vuruş (lub-dub)
    const ph = (t % 2.4) / 2.4;
    const g1 = (ph * 2.4 - 0.30) / 0.14, g2 = (ph * 2.4 - 0.85) / 0.18;
    const env = Math.exp(-g1 * g1) + 0.65 * Math.exp(-g2 * g2);

    // 2) yayılan halkalar — sürekli dışa doğru, nabızla hafif şişer
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const g = ((t * 0.75 + i / n) % 1 + 1) % 1;
      const r = (46 + 118 * g) * (1 + 0.045 * env);
      ctx.strokeStyle = k.rgba(p.color, (1 - g) * (0.42 + 0.18 * env));
      ctx.lineWidth = 9 * (1 - g) + 2.5;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke();
    }

    // 3) çekirdek: küçük hoparlör — nabızla şişer
    const cs = 1 + 0.10 * env;
    const bw = 84 * cs, bh = 84 * cs;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    k.rrect(-bw / 2 + 6, -bh / 2 + 6, bw, bh, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 9;
    ctx.beginPath(); k.rrect(-bw / 2, -bh / 2, bw, bh, 18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-bw * 0.22, -bh * 0.26, 16 * cs, 10 * cs, -0.6, 0, k.TAU); ctx.fill();
    // koni
    const cr = 27 * cs;
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, cr, 0, k.TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color, 0.55 + 0.45 * env);
    ctx.beginPath(); ctx.arc(0, 0, 9 * cs, 0, k.TAU); ctx.fill();

    // 4) beat olayı: parlak halka fırlat + çekirdek parlar (0.4 sn)
    if (d >= 0 && d <= 0.4) {
      const g = k.prog(d, 0, 0.4);
      const pr = 28 + 100 * k.E.outExpo(g);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * (1 - g));
      ctx.lineWidth = 12 * (1 - g) + 3;
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, k.TAU); ctx.stroke();
      k.glow(0, 0, 62, p.color, 0.5 * (1 - g));
      ctx.strokeStyle = k.rgba('ink', 0.7 * (1 - g));
      ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * k.TAU + 0.39;
        const r0 = 58 + 26 * g, r1 = r0 + 16 * (1 - g);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
