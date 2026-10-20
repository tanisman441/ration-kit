// progress-fx/rank-badge — dereceli rozet: rank'e göre metal rengi; at anında overshoot ile pop belirir.
// Boşta hafif sallanma (salınım). (0,0) = rozet merkezi.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır.
export default {
  name: 'rank-badge', category: 'progress-fx',
  desc: 'Derece rozeti: bronze/silver/gold metali, belirme anında pop ile büyür',
  tags: ['rozet', 'badge', 'madalya', 'medal', 'derece', 'rank', 'altın', 'gümüş', 'bronz', 'gold', 'sıralama', 'başarı'],
  box: [-95, -125, 95, 105],
  bleed: 50,
  anchor: 'rozet merkezi (0,0)',
  points: { center: [0, 0], ribbon: [0, -105] },
  params: {
    rank: { type: 'enum', values: ['bronze', 'silver', 'gold'], default: 'gold', desc: 'rozetin metali (renk değiştirir)' },
    at: { type: 'time', default: null, desc: 'belirme anı: overshoot pop ile belirme (0.7 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    const metals = { bronze: 'dim', silver: 'panel2', gold: 'yellow' };
    const metal = metals[p.rank] ?? 'yellow';
    const R = 50;

    // at öncesi gizli; at anında 0.7 sn pop, sonrası idle sallanma
    if (d >= 0 && d <= 0.7) {
      const g = k.prog(d, 0, 0.7);
      const s = k.E.outBack(g, 2.2);
      ctx.scale(s, s);
      ctx.globalAlpha = Math.min(1, g * 2.5);
    } else if (d > 0.7 || p.at == null) {
      const sway = 0.045 * Math.sin(t * 1.8);            // idle: hafif salınım
      ctx.rotate(sway);
    }
    // at öncesi idle görünür; at anında pop ile belirir

    const star = (cx, cy, r, fill) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    };

    // kurdele (V bant, arkada)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(-36 + 5, -30); ctx.lineTo(-8 + 5, -118);
    ctx.lineTo(12 + 5, -118); ctx.lineTo(-16 + 5, -30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(metal, 0.55);
    ctx.beginPath();
    ctx.moveTo(-34, -32); ctx.lineTo(-6, -116);
    ctx.lineTo(14, -116); ctx.lineTo(-14, -32);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.stroke();

    // rozet: tırtıklı dış kenar
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * k.TAU, rr = R + 8 + (i % 2 ? 7 : 0) + 5;
      const x = Math.cos(a) * rr + 5, y = Math.sin(a) * rr + 6;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * k.TAU, rr = R + 11 + (i % 2 ? 7 : 0);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(metal);
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * k.TAU, rr = R + 6 + (i % 2 ? 7 : 0);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fill();

    // iç disk + sol üst parlama
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R - 8, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(metal);
    ctx.beginPath(); ctx.arc(0, 0, R - 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-R * 0.3, -R * 0.42, R * 0.34, R * 0.18, -0.5, 0, k.TAU); ctx.fill();

    // merkez yıldız + sıra numarası (1/2/3)
    const nums = { gold: '1', silver: '2', bronze: '3' };
    const pulse = 0.92 + 0.08 * Math.sin(t * 3);
    star(0, -4, 24 * pulse, k.rgba('bg', 0.9));
    ctx.fillStyle = k.rgba('bg', 0.95);
    ctx.font = `700 22px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(nums[p.rank] ?? '1', 0, 20);
    ctx.restore();
  },
};
