// pet-fx/dog-tail-wag — kuyruk sallayan oturan köpek; excite anında sevinçle zıplar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) patilerdir, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'dog-tail-wag', category: 'pet-fx',
  desc: 'Oturan köpek, kuyruğunu sürekli sallar; excite anında sevinçle havaya zıplar',
  tags: ['köpek', 'evcil hayvan', 'kuyruk sallama', 'sevinç', 'mutlu', 'pati', 'dog', 'tail wag', 'puppy', 'pet', 'happy'],
  box: [-135, -260, 170, 10],
  bleed: 70,
  anchor: 'patiler (0,0); boy ~250 birim',
  points: { head: [58, -178], nose: [124, -184], tail: [-98, -100] },
  params: {
    color: { type: 'color', default: 'dim' },
    excite: { type: 'time', default: null, desc: 'heyecan anı — sevinçle zıplar, kuyruk çılgınca sallanır (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const tongueC = k.rgba('red');
    const de = p.excite == null ? -1 : t - p.excite;
    const exciting = de >= 0 && de < 1.2;
    const eEnv = exciting ? Math.sin(Math.min(de / 1.2, 1) * Math.PI) : 0; // zıplama zarfı
    const jump = eEnv * 78;
    const br = Math.sin(t * k.TAU / 2.4) * 2;                            // nefes
    const pant = (Math.sin(t * k.TAU * 3.2) * 0.5 + 0.5) * 7;           // dilde hızlı soluma
    const wagSpd = exciting ? 22 : 7;                                    // heyecanda kuyruk hızlı
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 78, 11, 0, 0, k.TAU); ctx.fill();

    // heyecan hareket çizgileri (zıplarken)
    if (exciting) {
      ctx.strokeStyle = k.rgba('ink', 0.55 * (1 - eEnv)); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const mx = -80 + i * 52;
        ctx.beginPath(); ctx.moveTo(mx, -10 - eEnv * 30); ctx.lineTo(mx, -34 - eEnv * 44); ctx.stroke();
      }
    }

    ctx.save();
    ctx.translate(0, -jump);
    ctx.rotate(exciting ? -eEnv * 0.08 : 0);

    // gövde sağ alt gölgesi (premium)
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-52 + 6, -168 + 6 + br * 0.4, 112, 118, 46); ctx.fill();

    // kuyruk: sürekli sallanma (canlı idle)
    const wag = -0.7 + Math.sin(t * wagSpd) * (exciting ? 0.65 : 0.5);
    limb(-88, -96, -88 - Math.cos(wag) * 66, -96 - Math.sin(wag) * 66, 14, body);

    // kalça + arka patiler (oturan duruş)
    disc(-48, -58, 44, 50, body);
    blob(-84, -16, 46, 16, 8, body);
    blob(-48, -16, 46, 16, 8, body);

    // gövde
    blob(-58, -174 + br * 0.4, 112, 118, 46, body);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-40, -140, 20, 12, -0.3, 0, k.TAU); ctx.fill();

    // ön bacaklar + patiler
    limb(28, -92, 30, -14, 16, body);
    limb(52, -92, 54, -14, 16, body);
    blob(16, -16, 28, 15, 7, body);
    blob(42, -16, 28, 15, 7, body);

    // baş (heyecanda yukarı kalkar)
    const hx = 58, hy = -178 - br * 0.5 - eEnv * 16;
    // dik kulaklar (heyecanda daha dik)
    for (const s of [-1, 1]) {
      ctx.save(); ctx.translate(hx - 16 + s * 16, hy - 22);
      ctx.rotate(s * (0.5 - eEnv * 0.25));
      blob(-11, -34, 22, 38, 11, body); ctx.restore();
    }
    disc(hx, hy, 35, 33, body);
    // burun
    blob(hx + 12, hy - 18, 46, 32, 15, body);
    disc(hx + 66, hy - 6, 7, 6, inkC);
    // gözler (mutlu ^ gözler heyecanda)
    ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    if (exciting) {
      for (const ex of [hx - 12, hx + 12]) {
        ctx.beginPath(); ctx.arc(ex, hy - 8, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
    } else {
      ctx.fillStyle = inkC;
      ctx.beginPath(); ctx.ellipse(hx - 12, hy - 8, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx + 12, hy - 8, 4.5, 4.5, 0, 0, k.TAU); ctx.fill();
    }
    // ağız: heyecanda geniş gülümseme
    const smile = 10 + eEnv * 10;
    ctx.beginPath(); ctx.arc(hx + 30, hy + 6, smile, 0.35, Math.PI - 0.35); ctx.stroke();
    // dil: sarkar, hızlı soluma ile oynar
    const tl = 16 + pant + eEnv * 8;
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(hx + 16, hy + 10, 22, tl + LW, 9); ctx.fill();
    ctx.fillStyle = tongueC; ctx.beginPath(); k.rrect(hx + 18, hy + 12, 18, tl, 8); ctx.fill();

    // premium parlama (baş sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hx - 16, hy - 16, 12, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // göz kırpma
    const tb = t % 4.1;
    if (tb < 0.12 && !exciting) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(46, -186 - br * 0.5 - jump * 0, 9, 3, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(70, -186 - br * 0.5, 9, 3, 0, 0, k.TAU); ctx.fill();
    }
  },
};
