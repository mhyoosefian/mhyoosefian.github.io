// WALL·E footer animation (homepage only; enabled with `walle: true` in a page's front matter).
// He rolls in from the right along the footer divider, stops in the middle to look at the reader and
// wave, then continues left and lowers his head to pass beneath the sidebar's YouTube link. He plays
// once; afterwards his eyes peek from the right edge and replay the animation when clicked.
// The model and materials (robot.js, materials.js) come from the standalone study in
// myWebsite/animation-demo/three-d/.
import * as T from 'three';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createRobot} from './robot.js?v=9';

const footer = document.querySelector('.site-footer');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (footer && !reduceMotion.matches) start();

function start() {
  const BELOW = 10;                       // px of the strip below the divider (for the shadow)
  const ELEV = 8.5 * Math.PI / 180;       // camera elevation, as in the study
  const DIR = -1;                         // travel right-to-left
  // SPEED: rolling speed (world units/s; 5.1 is roughly 115 px/s). DECEL/ACCEL: distance over which
  // he slows before the middle and speeds up after waving.
  const SPEED = 5.1, DECEL = 3, ACCEL = 2.5;
  const ease = (a, b, t) => { const p = T.MathUtils.clamp((t - a) / (b - a), 0, 1); return p * p * (3 - 2 * p); };

  const wrap = document.createElement('span');   // not a div: `.site-footer > div` styles the footer text row
  wrap.className = 'walle-strip';
  wrap.setAttribute('aria-hidden', 'true');
  // Positioning is set here as well as in academic.css, so a stale cached stylesheet can never
  // drop the strip below the footer: its bottom edge rests on the footer's top border.
  if (getComputedStyle(footer).position === 'static') footer.style.position = 'relative';
  Object.assign(wrap.style, {display: 'block', position: 'absolute', left: '0', right: '0', bottom: `calc(100% - ${BELOW}px)`, pointerEvents: 'none', zIndex: '3'});
  footer.appendChild(wrap);

  let renderer;
  try { renderer = new T.WebGLRenderer({antialias: true, alpha: true}); } catch (e) { wrap.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.VSMShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
  wrap.appendChild(renderer.domElement);

  const scene = new T.Scene();
  const camera = new T.OrthographicCamera();
  camera.position.set(0, 29 * Math.tan(ELEV), 29); camera.lookAt(0, 0, 0);
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, .04).texture; room.dispose(); pmrem.dispose(); scene.environmentIntensity = .62;
  scene.add(new T.HemisphereLight(0xffffff, 0x5d4c37, .65));
  const key = new T.DirectionalLight(0xffe8cc, 3.0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {left: -6, right: 6, top: 6, bottom: -6, near: .1, far: 35});
  key.shadow.normalBias = .025; key.shadow.bias = -.0001; key.shadow.radius = 3; key.shadow.blurSamples = 8;
  scene.add(key, key.target);
  const rim = new T.DirectionalLight(0xc0d9ff, 1.7); rim.position.set(6, 7, -5); scene.add(rim);
  const floor = new T.Mesh(new T.PlaneGeometry(400, 60), new T.ShadowMaterial({opacity: .10}));
  floor.rotation.x = -Math.PI / 2; floor.position.y = .08; floor.receiveShadow = true; scene.add(floor);

  const model = createRobot(); scene.add(model.root);
  model.root.position.y = -.08;           // tread shoes sit exactly on the divider line

  // Measure the head in camera "up" units: standing vs. lowered, and its front/back reach.
  const up = new T.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  function headBox(duck) {
    model.animate({x: 0, face: 0, duck, wave: 0, t: 0, closeup: false, dir: DIR});
    model.root.updateMatrixWorld(true);
    return new T.Box3().setFromObject(model.parts.head, true);
  }
  const topOf = b => { let m = -1e9; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) m = Math.max(m, new T.Vector3(x, y, z).dot(up)); return m; };
  // Exact highest point of a part on screen (its vertices, not its bounding box).
  const vtx = new T.Vector3();
  const partTop = obj => { let m = -1e9; obj.traverse(o => { if (!o.isMesh) return; const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i++) m = Math.max(m, vtx.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).dot(up)); }); return m; };
  // Head height for 21 duck levels (the neck folds first, then the body squats), so he can lower
  // his head exactly as much as each obstacle needs.
  const TOPS = Array.from({length: 21}, (_, i) => { headBox(i / 20); return partTop(model.parts.head); });
  const standBox = headBox(0);
  const STAND = TOPS[0], DUCK = TOPS[20];
  const duckFor = h => {                  // smallest duck that brings the head top down to height h
    if (h >= STAND) return 0;
    for (let i = 1; i <= 20; i++) if (TOPS[i] <= h) return (i - 1 + (TOPS[i - 1] - h) / (TOPS[i - 1] - TOPS[i])) / 20;
    return 1;                             // lower than his deepest duck: duck all the way and pass anyway
  };
  const HEAD_LEAD = DIR > 0 ? standBox.max.x : standBox.min.x, HEAD_TRAIL = DIR > 0 ? standBox.min.x : standBox.max.x;
  // Greeting pose: highest point of the raised, waving arm and half-width of the whole robot.
  let WAVE_TOP = 0, FACE_HALF = 0;
  for (let tt = 0; tt < 1.2; tt += .05) {
    model.animate({x: 0, face: 1, duck: 0, wave: 1, t: tt, closeup: false, dir: DIR}); model.root.updateMatrixWorld(true);
    const b = new T.Box3().setFromObject(model.root, true);
    WAVE_TOP = Math.max(WAVE_TOP, topOf(b)); FACE_HALF = Math.max(FACE_HALF, Math.abs(b.min.x), Math.abs(b.max.x));
  }

  // Timeline (world units / seconds), rebuilt whenever the layout changes. `stop` is where he
  // greets the reader (null: he just rolls through); `obstacles` are {a, b, r}: a world-x interval
  // and the fraction of his full duck needed to pass beneath it.
  let plan = null;
  function makePlan(halfW, obstacles, stop, canWave) {
    const pS = -halfW - 3, pE = halfW + 3, pStop = stop == null ? null : DIR * stop;
    const ta = 2 * ACCEL / SPEED;
    let progress, faceAt = () => 0, waveAt = () => 0, lookAt = () => 0, end;
    if (pStop == null) { progress = t => pS + SPEED * t; end = (pE - pS) / SPEED; }
    else {
      const tc = Math.max(0, (pStop - DECEL - pS) / SPEED), td = 2 * DECEL / SPEED, tB = tc + td, tC = tB + 9.5;
      end = tC + ta + (pE - pStop - ACCEL) / SPEED;
      progress = t => {                   // signed distance along the direction of travel
        if (t < tc) return pS + SPEED * t;
        if (t < tB) { const s = t - tc; return pStop - DECEL + SPEED * s - SPEED / (2 * td) * s * s; }
        if (t < tC) return pStop;
        const s = t - tC; return pStop + (s < ta ? SPEED / (2 * ta) * s * s : ACCEL + SPEED * (s - ta));
      };
      // At the stop he turns to the reader, looks to his right, then to his left, back at the
      // reader, opens his right arm and waves, folds it back, turns and rolls on.
      faceAt = t => ease(tB + .3, tB + 1.5, t) * (1 - ease(tB + 8.0, tB + 9.2, t));
      lookAt = t => ease(tB + 1.6, tB + 2.0, t) - 2 * ease(tB + 2.4, tB + 3.1, t) + ease(tB + 3.5, tB + 3.9, t);
      if (canWave) waveAt = t => ease(tB + 4.1, tB + 4.7, t) * (1 - ease(tB + 6.9, tB + 7.7, t));
    }
    const xAt = t => DIR * progress(t);
    // For each obstacle the head is lowered (just enough) before its leading edge reaches the near
    // side, and rises only after its trailing edge (the eye barrels) has passed the far side.
    const windows = obstacles.map(({a, b, r}) => {
      const near = DIR > 0 ? a : b, far = DIR > 0 ? b : a;
      return x => r * ease(near - HEAD_LEAD - DIR * 2.4, near - HEAD_LEAD - DIR * .5, x) * (1 - ease(far - HEAD_TRAIL + DIR * .3, far - HEAD_TRAIL + DIR * 1.8, x));
    });
    const duckAt = x => { let d = 0; for (const w of windows) d = Math.max(d, w(x)); return d; };
    return {xAt, faceAt, waveAt, lookAt, duckAt, end};
  }

  // Spring "give" in the joints (same model as the study; re-simulates the last 1.6 s).
  const SPRINGS = {body: {f: 2.4, z: .22, k: .018, b: .9}, neck: {f: 1.7, z: .16, k: .036, b: 1}, armL: {f: 1.25, z: .16, k: .045, b: 1.2}, armR: {f: 1.4, z: .16, k: .045, b: 1.2}, handL: {f: 2.2, z: .14, k: .035, b: 1.5}, handR: {f: 2.5, z: .14, k: .035, b: 1.5}, bob: {f: 3.1, z: .25, k: .0075, b: 1}};
  const PITCH = (1.24 * Math.PI * 2 + 4) / 38;
  function vibration(t) {
    const {xAt, faceAt} = plan, h = 1 / 240, t0 = Math.max(0, t - 1.6), st = {};
    for (const k in SPRINGS) st[k] = [0, 0];
    const vel = u => (xAt(u + .004) - xAt(u - .004)) / .008;
    const turn = u => Math.abs(faceAt(u + .004) - faceAt(u - .004)) / .008 * Math.PI / 2 * 1.15;
    for (let u = t0; u < t; u += h) {
      const acc = DIR * (vel(u + .01) - vel(u - .01)) / .02, speed = Math.abs(vel(u)) + turn(u);  // forward acceleration
      const bump = speed * Math.sin(2 * Math.PI * (Math.abs(xAt(u)) + faceAt(u) * 1.8) / PITCH * .5);
      for (const [k, {f, z, k: gain, b}] of Object.entries(SPRINGS)) {
        const w = 2 * Math.PI * f, drive = k === 'bob' ? bump : -acc + b * bump, [q, qd] = st[k];
        const qdd = -w * w * q - 2 * z * w * qd + gain * w * w * drive / (k === 'bob' ? 1 : 4);
        st[k] = [q + qd * h, qd + qdd * h];
      }
    }
    const out = {}; for (const k in st) out[k] = st[k][0];
    const travel = Math.abs(xAt(t)) + faceAt(t) * 1.8, spd = Math.min(Math.abs(vel(t)) + turn(t), 1.5);
    out.rattle = .008 * spd * (Math.sin(2 * Math.PI * travel / PITCH) * .6 + Math.sin(2 * Math.PI * travel / (PITCH * .43) + 1.3) * .4);
    return out;
  }

  // Everything visible above the footer line within reach of his height: text (measured line by
  // line, not by container boxes), icons, images and form controls. Rects are in viewport px.
  function findObstacles(lineY, bandH) {
    const top = lineY - bandH, out = [], range = document.createRange();
    const keep = r => r.width > 2 && r.height > 2 && r.bottom > top && r.top < lineY;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: n => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT});
    for (let n; (n = walker.nextNode());) {
      const el = n.parentElement;
      if (!el || el.closest('.site-footer, script, style, noscript')) continue;
      const er = el.getBoundingClientRect();
      if (er.bottom <= top || er.top >= lineY || !el.getClientRects().length) continue;
      if (getComputedStyle(el).visibility === 'hidden') continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (keep(r)) out.push(r);
    }
    for (const el of document.querySelectorAll('img, svg, video, canvas, iframe, input, button, select, textarea')) {
      if (el.closest('.site-footer')) continue;
      const r = el.getBoundingClientRect(); if (keep(r)) out.push(r);
    }
    return out;
  }

  // Size: relative to the screen (about 12.8% of the window height on desktops and tablets, 15% of
  // the width on phones), but never so tall that some obstacle on his path is lower than his fully
  // lowered head. He then ducks under each obstacle only as much as it requires.
  const MARGIN = 3, MIN_PX = 36;      // MARGIN: clearance (px) kept between his head and an obstacle
  const enabled = true;
  const view = {ppu: 1, halfW: 1};
  function layout() {
    const W = footer.clientWidth, fr = footer.getBoundingClientRect(), lineY = fr.top;
    const preferred = innerWidth < 640 ? T.MathUtils.clamp(.15 * innerWidth, 48, 80) : T.MathUtils.clamp(.128 * innerHeight, 56, 120);
    const rects = findObstacles(lineY, Math.max(preferred, 120) * WAVE_TOP / STAND + 20);
    const gaps = rects.map(r => lineY - r.bottom);
    let standPx = preferred;
    for (const g of gaps) standPx = Math.min(standPx, (g - MARGIN) * STAND / DUCK);
    // Safety net: he never gets smaller than MIN_PX. If something is lower than even his deepest
    // squat, he squats as far as he can (duck is capped at 1) and passes anyway, brushing it.
    standPx = Math.max(standPx, MIN_PX);
    const ppu = standPx / STAND, H = Math.ceil(Math.max(standPx, WAVE_TOP * ppu) + 18) + BELOW;
    wrap.style.height = H + 'px'; renderer.setSize(W, H);
    Object.assign(camera, {left: -W / 2 / ppu, right: W / 2 / ppu, top: (H - BELOW) / ppu, bottom: -BELOW / ppu});
    camera.updateProjectionMatrix();
    const toWorld = px => (px - fr.left - W / 2) / ppu, halfW = W / 2 / ppu;
    Object.assign(view, {ppu, halfW});
    peek.style.width = Math.round(1.5 * ppu) + 'px'; peek.style.height = Math.round(2.3 * ppu) + 'px';
    const obstacles = rects.map((r, i) => ({a: toWorld(r.left), b: toWorld(r.right), g: gaps[i],
      r: duckFor((gaps[i] - MARGIN) / ppu)})).filter(o => o.r > 0);
    // Greeting spot: the middle if there is headroom for the raised arm; otherwise the nearest spot
    // that has it; failing that, a spot where he can at least face the reader; else no stop.
    const clearAt = (x, needPx) => rects.every((r, i) => toWorld(r.right) < x - FACE_HALF || toWorld(r.left) > x + FACE_HALF || gaps[i] - MARGIN >= needPx);
    const findSpot = needPx => { for (let d = 0; d <= halfW - FACE_HALF - 1; d += .25) for (const x of [d, -d]) if (clearAt(x, needPx)) return x; return null; };
    let stop = findSpot(WAVE_TOP * ppu), canWave = stop != null;
    if (!canWave) stop = findSpot(standPx);
    plan = makePlan(halfW, obstacles, stop, canWave);
    debug = {standPx: Math.round(standPx), preferred: Math.round(preferred), obstacles: rects.length, ducksFor: obstacles.length, maxDuck: +Math.max(0, ...obstacles.map(o => o.r)).toFixed(2), stop: stop == null ? null : +stop.toFixed(2), canWave};
  }
  let debug = {};
  // Debug check: step through the pass with the real geometry and report the smallest clearance (px)
  // between his head or raised arm and any obstacle above him.
  function verify() {
    if (!plan) return {enabled};
    const fr = footer.getBoundingClientRect(), W = footer.clientWidth, ppu = (camera.right - camera.left) > 0 ? W / (camera.right - camera.left) : 1;
    const rects = findObstacles(fr.top, 400); let minClear = Infinity, worst = null;
    for (let tt = 0; tt <= plan.end; tt += .05) {
      const x = plan.xAt(tt);
      model.animate({x, face: plan.faceAt(tt), duck: plan.duckAt(x), wave: plan.waveAt(tt), look: plan.lookAt(tt), t: tt, closeup: false, dir: DIR, vib: vibration(tt)});
      model.root.updateMatrixWorld(true);
      for (const part of [model.parts.head, ...model.parts.arms.map(a => a.shoulder)]) {
        const b = new T.Box3().setFromObject(part, true), topPx = (partTop(part) - camera.bottom) * ppu - BELOW;
        const l = fr.left + W / 2 + b.min.x * ppu, r = fr.left + W / 2 + b.max.x * ppu;
        for (const o of rects) if (o.right > l && o.left < r) { const c = (fr.top - o.bottom) - topPx; if (c < minClear) { minClear = c; worst = {t: +tt.toFixed(2), text: Math.round(o.left) + '-' + Math.round(o.right) + 'px'}; } }
      }
    }
    return {minClearancePx: +minClear.toFixed(1), worst};
  }

  function draw(t) {
    const {xAt, faceAt, waveAt, lookAt, duckAt} = plan, x = xAt(t);
    model.animate({x, face: faceAt(t), duck: duckAt(x), wave: waveAt(t), look: lookAt(t), t, closeup: false, vib: vibration(t), dir: DIR});
    model.root.rotation.z = 0; model.root.position.y = -.08; floor.visible = true;
    key.position.set(x - 2, 12, 5); key.target.position.set(x, 0, 0);  // high key light that follows him: a short, soft shadow
    renderer.render(scene, camera);
  }

  // Playback: he rolls through once when the footer first comes into view. Afterwards (or if the
  // pass is interrupted) he peeks out from behind the right edge of the screen: the real model is
  // turned 90° so that only his head and neck lean into view, eyes stacked vertically as when
  // peeking around a corner, looking at the visitor. His body stays hidden beyond the edge.
  // Clicking him starts the animation again.
  const peek = document.createElement('button');
  peek.type = 'button'; peek.className = 'walle-peek'; peek.hidden = true;
  peek.setAttribute('aria-label', 'Play the WALL·E animation again');
  peek.title = 'Play again';
  Object.assign(peek.style, {position: 'absolute', right: '0', bottom: '100%'});
  footer.appendChild(peek);
  const PEEK_Y = 1.15;                    // height of the head's centre line above the divider
  const PEEK_OUT = 1.85, PEEK_IN = 4.4;   // root offset beyond the right edge: leaning out / hidden
  let peeking = false, peekStart = 0, peekRaf = 0, peekLast = 0;
  function drawPeek(time) {
    const {halfW} = view, out = ease(0, 1.1, time);
    const lean = .16 * Math.sin(time * .9) + .07 * Math.sin(time * 2.3 + 1);   // leaning in and out
    model.animate({x: 0, face: 1, duck: 0, wave: 0, t: time, closeup: false, dir: DIR});
    model.root.rotation.z = Math.PI / 2;  // his "up" now points left, toward the page
    model.root.position.set(halfW + PEEK_IN - (PEEK_IN - PEEK_OUT) * out - lean * out, PEEK_Y, 0);
    model.parts.head.rotation.y += .28 * Math.sin(time * .55);                  // looking around
    model.parts.head.rotation.x += .10 * Math.sin(time * .8 + .5);
    floor.visible = false;
    key.position.set(halfW - 3, 12, 6); key.target.position.set(halfW - 1, 1, 0);
    renderer.render(scene, camera);
  }
  function peekTick(now) {
    if (!peeking) return;
    if (now - peekLast >= 33) { peekLast = now; drawPeek((now - peekStart) / 1000); }   // ~30 fps
    peekRaf = requestAnimationFrame(peekTick);
  }
  const showPeek = () => {
    if (peeking) return;
    peeking = true; peek.hidden = false; peekStart = performance.now(); peekLast = 0;
    if (!document.hidden) peekRaf = requestAnimationFrame(peekTick); else drawPeek(2);
  };
  const hidePeek = () => { peeking = false; cancelAnimationFrame(peekRaf); peek.hidden = true; renderer.clear(); };

  let visible = false, running = false, held = false, played = false, t = 0, last = 0, raf = 0, timer = 0;
  function tick(now) {
    if (!running) return;
    t += Math.min((now - last) / 1000, .08); last = now;
    if (t >= plan.end) { running = false; renderer.clear(); showPeek(); return; }
    draw(t); raf = requestAnimationFrame(tick);
  }
  function play() {
    clearTimeout(timer);
    if (held || !enabled || !plan || !visible || document.hidden || running) return;
    played = true; hidePeek();
    running = true; t = 0; last = performance.now(); raf = requestAnimationFrame(tick);
  }
  function stop() { const was = running; running = false; cancelAnimationFrame(raf); clearTimeout(timer); if (was) renderer.clear(); if (was || played) showPeek(); }
  peek.addEventListener('click', () => { held = false; play(); });

  layout();
  document.fonts?.ready.then(() => { if (!running) layout(); });   // web fonts can shift the text
  let resizeTimer = 0;
  let settleTimer = 0;
  const relayout = () => { clearTimeout(resizeTimer); clearTimeout(settleTimer); resizeTimer = setTimeout(() => { if (running) { running = false; cancelAnimationFrame(raf); renderer.clear(); showPeek(); } layout(); if (peeking) drawPeek((performance.now() - peekStart) / 1000); settleTimer = setTimeout(() => { if (!running) layout(); }, 500); }, 150); };  // measure again once the new size has settled
  new ResizeObserver(relayout).observe(document.body);
  addEventListener('resize', relayout);              // window size, rotation and browser zoom
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !played) timer = setTimeout(play, 1200); else if (!visible && running) stop(); }).observe(footer);
  // A page opened in a background tab gets its first pass once it is actually looked at.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (running) stop(); cancelAnimationFrame(peekRaf); }
    else { if (peeking) peekRaf = requestAnimationFrame(peekTick); if (visible && !played) timer = setTimeout(play, 1200); }
  });
  reduceMotion.addEventListener?.('change', e => { if (e.matches) { hidePeek(); stop(); wrap.remove(); peek.remove(); } });
  window.__walleFooter = {model, vibration: tt => vibration(tt), showPeek, drawPeek: tt => { held = true; drawPeek(tt); }, verify, info: () => debug, state: () => ({running, played, visible, enabled, t: +t.toFixed(2), end: plan ? +plan.end.toFixed(2) : null}), draw: tt => { held = true; stop(); draw(tt); }, resume: () => { held = false; play(); }, plan: () => plan, layout, sizes: {STAND, DUCK, HEAD_LEAD, HEAD_TRAIL}};
}
