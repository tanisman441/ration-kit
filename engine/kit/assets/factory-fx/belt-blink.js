// factory-fx/belt-blink — bant sinyal ışığı.
// ANIMASYON: lambalar `cycle` açıkken 3.6 sn döngüyle yeşil→sarı→kırmızı döner;
// `alarm` anında kırmızı 1 sn boyunca strobo yapar. Vurgu: aktif lamba rengi.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'belt-blink',
  category: 'factory-fx',
  desc: 'Üç lambalı bant sinyal ışığı; lambalar döngüyle yanar, alarm anında kırmızı strobo',
  tags: ['sinyal', 'lamba', 'trafik', 'bant', 'fabrika', 'ikaz', 'alarm', 'signal', 'lamp', 'traffic', 'belt', 'factory', 'warning', 'alarm'],
  box: [-60, -140, 60, 112],
  bleed: 20,
  anchor: 'direk tabanı (0,105)',
  points: { top: [0, -100], base: [0, 105], lamp_red: [0, -76], lamp_yellow: [0, -54], lamp_green: [0, -32] },
  params: {
    state: { type: 'enum', values: ['green', 'yellow', 'red'], default: 'green', desc: 'aktif lamba (mode=fixed iken)' },
    mode: { type: 'enum', values: ['auto', 'fixed'], default: 'auto', desc: 'auto: lambalar 3.6 sn döngüyle değişir; fixed: state’teki lamba yanar' },
    alarm: { type: 'time', default: null, desc: 'alarm anı: kırmızı 1 sn strobo yapar' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.alarm == null ? -1 : t - p.alarm;
    const alarming = d >= 0 && d < 1.0;

    // aktif lamba: alarm > mode=auto döngüsü > state
    let active = p.state;
    if (p.mode === 'auto') {
      const ph = t % 3.6;
      active = ph < 2.0 ? 'green' : ph < 2.8 ? 'yellow' : 'red';
    }
    if (alarming) active = 'red';

    // --- direk ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-8 + 6, -8 + 6, 16, 113, 6); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-8, -8, 16, 113, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(-8, -8, 16, 113, 6); ctx.stroke();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-20, 96, 40, 12, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); k.rrect(-20, 96, 40, 12, 6); ctx.stroke();

    // --- lamba gövdesi ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-34 + 6, -100 + 6, 68, 92, 14); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-34, -100, 68, 92, 14); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-20, -92, 10, 6, 0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-34, -100, 68, 92, 14); ctx.stroke();

    // --- lambalar ---
    const lamps = [['red', -76], ['yellow', -54], ['green', -32]];
    for (const [cname, ly] of lamps) {
      const isOn = active === cname;
      let bright = isOn ? 1 : 0.18;
      if (alarming && isOn) bright = Math.sin(t * 40) > 0 ? 1 : 0.12; // strobo
      else if (isOn && p.mode === 'auto' && cname === 'yellow') {
        bright = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 14)); // sarı geçişte hızlı yanıp söner
      }
      // siperlik
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); k.rrect(-20, ly - 13, 40, 10, 5); ctx.fill();
      // lamba
      if (isOn) k.glow(0, ly, 20, cname, 0.5 * bright);
      ctx.fillStyle = k.rgba(cname, 0.25 + 0.75 * bright);
      ctx.beginPath(); ctx.arc(0, ly, 12, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.25 * bright);
      ctx.beginPath(); ctx.ellipse(-4, ly - 5, 4, 5, 0.4, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(0, ly, 12, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
