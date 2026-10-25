// airport-fx/plane-taxi — uçak pistte taksi yapar; tekerlekler döner, gövde hafif sallanır. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) uçağın gövde merkezidir (taksi ortası), zemin y=58'dedir.
export default {
  name: 'plane-taxi', category: 'airport-fx',
  desc: 'Yolcu uçağı pistte taksi yapar: olay anında soldan sağa ilerler, tekerlekler ilerlemeyle döner',
  tags: ['uçak', 'taksi', 'pist', 'havalimanı', 'yolcu uçağı', 'tekerlek', 'plane', 'taxi', 'runway', 'aircraft', 'airport', 'airplane'],
  box: [-165, -75, 165, 75],
  bleed: 30,
  anchor: 'uçağın gövde merkezi (taksi ortası, 0,0); zemin y=58 çizgisindedir; nose/tail noktaları taksi ortasındaki konuma göredir',
  points: { nose: [75, -18], tail: [-95, -40], wheel: [45, 50] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'taksi anı: uçak 1.2 sn içinde soldan sağa ilerler' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin + taksi yolu çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-165, 58); ctx.lineTo(165, 58); ctx.stroke();
    ctx.fillStyle = k.rgba('ink', 0.4);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); k.rrect(-156 + i * 42, 63, 22, 4, 2); ctx.fill();
    }

    // taksi ilerlemesi
    const d = p.at == null ? -1 : t - p.at;
    const prog = d < 0 ? 0 : k.clamp(d / 1.2, 0, 1);
    const ease = prog * prog * (3 - 2 * prog);
    const px = -55 + ease * 110;
    const bob = (d < 0 || prog >= 1 ? 1.2 : 2.2) * Math.sin(t * k.TAU / 2.4);
    const wheelAng = px * 0.09;

    ctx.save();
    ctx.translate(px, bob);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // kuyruk (dikey stabilizatör)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-88, -28); ctx.lineTo(-98, -62); ctx.lineTo(-72, -62); ctx.lineTo(-64, -28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.moveTo(-85, -30); ctx.lineTo(-94, -58); ctx.lineTo(-74, -58); ctx.lineTo(-67, -30); ctx.closePath(); ctx.fill();
    // kuyruk vurgu şeridi
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.moveTo(-88, -46); ctx.lineTo(-91, -58); ctx.lineTo(-82, -58); ctx.lineTo(-79, -46); ctx.closePath(); ctx.fill();

    // gövde
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, -18, 88, 23, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2'); ctx.beginPath(); ctx.ellipse(0, -18, 85, 20, 0, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-45, -30, 26, 6, -0.15, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(45, -6, 30, 5, 0, 0, k.TAU); ctx.fill();

    // gövde şeridi (vurgu)
    ctx.fillStyle = k.rgba('cyan', 0.85);
    ctx.fillRect(-70, -10, 140, 4);

    // kanat
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-25, -4); ctx.lineTo(5, 22); ctx.lineTo(28, 22); ctx.lineTo(8, -4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.moveTo(-22, -4); ctx.lineTo(4, 19); ctx.lineTo(24, 19); ctx.lineTo(7, -4); ctx.closePath(); ctx.fill();

    // motor
    ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(8, 24, 14, 7, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.ellipse(8, 24, 11, 5, 0, 0, k.TAU); ctx.fill();

    // pencereler
    ctx.fillStyle = k.rgba('ink', 0.75);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(-58 + i * 18, -26, 3.5, 0, k.TAU); ctx.fill();
    }
    // kokpit camı
    ctx.fillStyle = k.rgba('ink', 0.8);
    ctx.beginPath(); ctx.ellipse(66, -26, 10, 5, -0.25, 0, k.TAU); ctx.fill();

    // iniş takımı: dikmeler + dönen tekerlekler
    const wheel = (wx) => {
      ctx.strokeStyle = line; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(wx, 2); ctx.lineTo(wx, 42); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(wx, 2); ctx.lineTo(wx, 42); ctx.stroke();
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(wx, 50, 11, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(wx, 50, 8, 0, k.TAU); ctx.fill();
      // dönen jant çizgisi
      ctx.strokeStyle = k.rgba('panel2', 0.9); ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wx + 6 * Math.cos(wheelAng), 50 + 6 * Math.sin(wheelAng));
      ctx.lineTo(wx - 6 * Math.cos(wheelAng), 50 - 6 * Math.sin(wheelAng));
      ctx.stroke();
    };
    wheel(-50);
    wheel(45);
    ctx.restore();

    ctx.restore();
  },
};
