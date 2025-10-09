// src/directives/draggable.js
export default {
  mounted(el, binding) {
    const opts = binding.value || {};
    const mods = binding.modifiers || {};
    const desktopOnly = !!mods.desktop;
    const mobileOnly = !!mods.mobile;
    // Default queries for modifiers
    const desktopMQ = '(min-width: 1025px)';
    const mobileMQ  = '(max-width: 1024px)';
    // Pick the controlling MQ (or null if always-on)
    const controlQuery = desktopOnly ? desktopMQ : (mobileOnly ? mobileMQ : null);

    // Ensure positioning; touchAction allows touch pointer events
    if (!el.style.position) el.style.position = 'absolute';
    el.style.touchAction = 'none';

    // ---- Breakpoint + resize reset wiring (default: 1024) -----------------
    const breakQuery = opts.breakQuery || '(max-width: 1024px)';
    const resetOnBreakpoint = opts.resetOnBreakpoint !== false; // default true
    const resetOnResize = !!opts.resetOnResize;                  // default false
    const resizeDebounceMs = Number(opts.resizeDebounceMs ?? 80);

    function resetToCssOrigin() {
      el.style.left = '';
      el.style.top = '';
      el.style.right = '';
      el.style.bottom = '';
      delete el.dataset.dragLocked;
    }

    // ---- Responsive helpers (used by debug + snap math) -------------------
    function getActiveConfig() {
      const base = { snapInto: opts.snapInto, coordsBase: opts.coordsBase };
      const resp = Array.isArray(opts.responsive) ? opts.responsive : null;
      if (!resp || !resp.length || typeof window === 'undefined') return base;

      let active = null;
      for (const r of resp) {
        if (!r || !r.query) continue;
        const m = window.matchMedia(r.query);
        if (m.matches) active = r; // last match wins
      }
      if (!active) return base;
      return {
        snapInto: active.snapInto != null ? active.snapInto : base.snapInto,
        coordsBase: active.coordsBase != null ? active.coordsBase : base.coordsBase,
      };
    }

    const resolveNode = (n) => {
      if (!n) return null;
      if (typeof n === 'string') return document.querySelector(n);
      if (n && n.nodeType === 1) return n;
      return null;
    };

    const getBaseEl = () =>
      resolveNode(getActiveConfig().coordsBase) ||
      el.offsetParent ||
      el.parentElement ||
      document.body;

    // ---- Debug boxes overlay ----------------------------------------------
    const dbg = {
      enabled: !!opts.debugBoxes,
      className: opts.debugClass || 'draggable-snapbox',
      z: String(opts.debugZ || 99999),
      container: null,
      baseEl: null,
    };

    function ensureDebugContainer() {
      if (!dbg.enabled) return;
      const base = getBaseEl();
      dbg.baseEl = base;

      // host must be positioned to contain absolute overlay
      const baseCS = getComputedStyle(base);
      if (baseCS.position === 'static') base.style.position = 'relative';

      // if base changed, rebuild container
      if (dbg.container && dbg.container.parentElement !== base) {
        dbg.container.remove();
        dbg.container = null;
      }
      if (!dbg.container) {
        const c = document.createElement('div');
        c.style.position = 'absolute';
        c.style.left = '0';
        c.style.top = '0';
        c.style.width = base.clientWidth + 'px';
        c.style.height = base.clientHeight + 'px';
        c.style.pointerEvents = 'none';
        c.style.zIndex = dbg.z;
        c.dataset.draggableDbg = '1';
        base.appendChild(c);
        dbg.container = c;
      }
    }

    function clearDebugBoxes() {
      if (dbg.container) dbg.container.innerHTML = '';
    }

    function drawBox(b, indexOneBased) {
      if (!dbg.container) return;
      const w = Math.max(0, (b.right ?? 0) - (b.left ?? 0));
      const h = Math.max(0, (b.bottom ?? 0) - (b.top ?? 0));
      const d = document.createElement('div');
      d.className = dbg.className;
      d.style.position = 'absolute';
      d.style.left = (b.left ?? 0) + 'px';
      d.style.top = (b.top ?? 0) + 'px';
      d.style.width = w + 'px';
      d.style.height = h + 'px';
      d.style.pointerEvents = 'none';

      // 1-based label
      const tag = document.createElement('div');
      tag.textContent = String(indexOneBased);
      tag.style.position = 'absolute';
      tag.style.left = '2px';
      tag.style.top = '0px';
      tag.style.font = '11px/1 monospace';
      tag.style.padding = '1px 3px';
      tag.style.pointerEvents = 'none';
      d.appendChild(tag);

      dbg.container.appendChild(d);
    }

    function renderDebugBoxes() {
      if (!dbg.enabled) return;
      ensureDebugContainer();
      if (!dbg.container || !dbg.baseEl) return;

      // keep overlay sized to base
      dbg.container.style.width = dbg.baseEl.clientWidth + 'px';
      dbg.container.style.height = dbg.baseEl.clientHeight + 'px';

      clearDebugBoxes();
      const boxes = getSnapBoxes();
      boxes.forEach((b, i) => drawBox(b, i + 1)); // start at 1
    }

    // --- Drag + snapInto ---------------------------------------------------
    let startX, startY, baseLeft, baseTop, moved = false;

    const getRelPos = () => {
      const base = getBaseEl();
      const er = el.getBoundingClientRect();
      const br = base.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ml = parseFloat(cs.marginLeft) || 0;
      const mt = parseFloat(cs.marginTop)  || 0;
      return { x: er.left - br.left - ml, y: er.top - br.top - mt };
    };

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // Support one or many snap boxes (selectors, elements, or rects)
    function specToBox(spec) {
      const base = getBaseEl();
      const br = base.getBoundingClientRect();

      if (typeof spec === 'string' || (spec && spec.nodeType === 1)) {
        const node = typeof spec === 'string' ? document.querySelector(spec) : spec;
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { left: r.left - br.left, top: r.top - br.top, right: r.right - br.left, bottom: r.bottom - br.top };
      }
      if (spec && typeof spec === 'object') {
        let { left = 0, top = 0, right, bottom, width, height } = spec;
        if (right == null && width  != null) right  = left + width;
        if (bottom== null && height != null) bottom = top + height;
        return { left, top, right, bottom };
      }
      return null;
    }

    function getSnapBoxes() {
      const { snapInto } = getActiveConfig();
      if (!snapInto) return [];
      const arr = Array.isArray(snapInto) ? snapInto : [snapInto];
      return arr.map(specToBox).filter(Boolean);
    }

    function pickNearestSnapTarget(pos) {
      const boxes = getSnapBoxes();
      if (!boxes.length) return null;
      const ew = el.offsetWidth, eh = el.offsetHeight;
      let best = null, bestD2 = Infinity;
      for (const b of boxes) {
        const minX = b.left, minY = b.top;
        const maxX = b.right  - ew, maxY = b.bottom - eh;
        const tx = clamp(pos.x, minX, Math.max(minX, maxX));
        const ty = clamp(pos.y, minY, Math.max(minY, maxY));
        const dx = pos.x - tx, dy = pos.y - ty, d2 = dx*dx + dy*dy;
        if (d2 < bestD2) { bestD2 = d2; best = { x: tx, y: ty }; }
      }
      return best;
    }

    // --- Overlap helpers ---------------------------------------------------
    const getRect = (node, pad = 0) => {
      const r = node.getBoundingClientRect();
      return {
        left: r.left + pad,
        top: r.top + pad,
        right: r.right - pad,
        bottom: r.bottom - pad,
        width: Math.max(0, r.width - pad * 2),
        height: Math.max(0, r.height - pad * 2),
      };
    };

    const rectsOverlap = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

    const overlapArea = (a, b) => {
      const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return x * y;
    };

    const resolveTargets = () => {
      const spec = opts.overlapWith;
      if (!spec) return [];
      const arr = Array.isArray(spec) ? spec : [spec];
      const nodes = [];
      for (const s of arr) {
        if (typeof s === 'string') {
          nodes.push(...document.querySelectorAll(s));
        } else if (s && s.nodeType === 1) {
          nodes.push(s);
        }
      }
      return nodes.filter(n => n !== el);
    };

    const resolveSubjectEl = () => {
      const sel = opts.overlapSubject;
      if (!sel) return el;
      if (typeof sel === 'string') return el.querySelector(sel) || el;
      if (sel && sel.nodeType === 1) return sel;
      return el;
    };

    const checkOverlapAndNotify = () => {
      const pad = Number(opts.overlapPadding ?? 4);
      const minRatio = Number(opts.minOverlapRatio ?? 0.15); // 15% of smaller area
      const targets = resolveTargets();
      if (!targets.length) return;

      const subjectEl = resolveSubjectEl();
      const er = getRect(subjectEl, pad);
      let hits = [];

      for (const t of targets) {
        const tr = getRect(t, pad);
        if (!rectsOverlap(er, tr)) continue;
        const area = overlapArea(er, tr);
        const minArea = Math.min(er.width * er.height, tr.width * tr.height) * minRatio;
        if (area >= minArea) {
          hits.push({ target: t, area, ratio: area / Math.min(er.width * er.height, tr.width * tr.height), rect: tr });
        }
      }

      if (hits.length) {
        hits.sort((a, b) => b.area - a.area);
        const detail = { element: el, subject: subjectEl, elementRect: er, hits };
        el.dispatchEvent(new CustomEvent('overlap', { detail, bubbles: true }));
        el.dispatchEvent(new CustomEvent('draggable:overlap', { detail, bubbles: true }));
        if (typeof opts.onOverlap === 'function') {
          try { opts.onOverlap(detail); } catch (err) { console.error('onOverlap error', err); }
        }
      }
    };

    // --- Pointer events ----------------------------------------------------
    let moveListener, upListener;
    let overlapRAF = null; // throttle overlap-on-move

    const onPointerDown = (e) => {
      // Extra guard if someone also passes { enabled:false }
      if (opts.enabled === false) return;
      if (e.button != null && e.button !== 0) return; // left click only

      el.setPointerCapture?.(e.pointerId);
      e.preventDefault(); e.stopPropagation();
      el.style.cursor = 'grabbing';

      const p = getRelPos();
      startX = e.clientX; startY = e.clientY;
      baseLeft = p.x; baseTop = p.y;
      moved = false;

      moveListener = (ev) => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;

        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          moved = true;
          el.dataset.dragging = 'true';
          el.dispatchEvent(new CustomEvent('draggable:dragstart', { bubbles: true }));
        }

        el.style.left = baseLeft + dx + 'px';
        el.style.top  = baseTop  + dy + 'px';

        if (moved && opts.overlapOnMove) {
          if (!overlapRAF) {
            overlapRAF = requestAnimationFrame(() => {
              overlapRAF = null;
              checkOverlapAndNotify();
            });
          }
        }
      };

      upListener = (ev) => {
        el.releasePointerCapture?.(ev.pointerId);
        el.style.cursor = 'grab';
        window.removeEventListener('pointermove', moveListener);
        window.removeEventListener('pointerup', upListener);
        if (overlapRAF) { cancelAnimationFrame(overlapRAF); overlapRAF = null; }

        if (el.dataset.dragging) {
          delete el.dataset.dragging;
          el.dispatchEvent(new CustomEvent('draggable:dragend', { bubbles: true }));
        }

        if (moved) {
          const target = pickNearestSnapTarget(getRelPos());
          let snapMs = opts.snapDurationMs ?? 120;
          if (target) {
            if (snapMs) {
              el.style.transition = `left ${snapMs}ms linear, top ${snapMs}ms linear`;
              requestAnimationFrame(() => {
                el.style.left = target.x + 'px';
                el.style.top  = target.y + 'px';
              });
              setTimeout(() => { el.style.transition = ''; }, snapMs);
            } else {
              el.style.left = target.x + 'px';
              el.style.top  = target.y + 'px';
            }
          } else {
            snapMs = 0;
          }

          el.dataset.dragged = 'true';
          setTimeout(() => { delete el.dataset.dragged; }, 0);

          const afterMs = Math.max(0, Number(snapMs));
          setTimeout(() => {
            const finalPos = getRelPos();
            el.dispatchEvent(new CustomEvent('draggable:dragstop', { detail: { pos: finalPos }, bubbles: true }));
            checkOverlapAndNotify();
            renderDebugBoxes(); // refresh overlays after movement/snap
          }, afterMs + 5);
        } else {
          renderDebugBoxes(); // still refresh
        }
      };

      window.addEventListener('pointermove', moveListener, { passive: false });
      window.addEventListener('pointerup', upListener, { passive: true });
    };

    // --- Enable/disable based on modifier-controlled media query -----------
    function enable() {
      if (el.__dragActive) return;
      el.addEventListener('pointerdown', onPointerDown, { passive: false });
      el.style.cursor = 'grab';
      el.__dragActive = true;
    }

    function disable() {
      if (!el.__dragActive) return;
      el.removeEventListener('pointerdown', onPointerDown);
      // safety: if disable happens mid-drag, clean listeners
      if (moveListener) window.removeEventListener('pointermove', moveListener);
      if (upListener) window.removeEventListener('pointerup', upListener);
      moveListener = upListener = null;
      el.style.cursor = '';
      delete el.__dragActive;
    }

    el.__drag_enable__ = enable;
    el.__drag_disable__ = disable;

    // Wire initial state + listener for media query changes
    if (typeof window !== 'undefined' && controlQuery) {
      const mql = window.matchMedia(controlQuery);
      const sync = () => (mql.matches ? enable() : disable());
      mql.addEventListener ? mql.addEventListener('change', sync)
                           : mql.addListener(sync);
      el.__drag_enable_mql__ = { mql, sync };
      sync(); // set initial state
    } else {
      // No modifier -> always on
      enable();
    }

    // ---- Wire breakpoint + responsive listeners (for reset/debug) ---------
    if (typeof window !== 'undefined' && resetOnBreakpoint) {
      const mql = window.matchMedia(breakQuery);
      const onChange = () => {
        resetToCssOrigin();   // let CSS for each side of 1024 take over
        renderDebugBoxes();   // and show the correct responsive boxes
      };
      mql.addEventListener ? mql.addEventListener('change', onChange)
                           : mql.addListener(onChange);
      el.__drag_mql__ = { mql, onChange };
    }

    if (Array.isArray(opts.responsive) && typeof window !== 'undefined') {
      const respMqls = [];
      for (const r of opts.responsive) {
        if (!r || !r.query) continue;
        const m = window.matchMedia(r.query);
        const on = () => renderDebugBoxes();
        m.addEventListener ? m.addEventListener('change', on) : m.addListener(on);
        respMqls.push({ m, on });
      }
      el.__drag_resp_mqls__ = respMqls;
    }

    // Window resize -> reset (optional) + refresh overlays
    if (typeof window !== 'undefined') {
      let tid;
      const onResize = () => {
        renderDebugBoxes();
        if (!resetOnResize) return;
        clearTimeout(tid);
        tid = setTimeout(() => resetToCssOrigin(), resizeDebounceMs);
      };
      window.addEventListener('resize', onResize);
      el.__drag_resize__ = onResize;
    }

    // Initial debug render
    if (dbg.enabled) {
      ensureDebugContainer();
      renderDebugBoxes();
    }
  },

  unmounted(el) {
    // Disable (removes pointerdown + cleans up in-flight listeners)
    el.__drag_disable__?.();

    // Media query toggler for .desktop/.mobile
    const emq = el.__drag_enable_mql__;
    if (emq) {
      const { mql, sync } = emq;
      mql.removeEventListener ? mql.removeEventListener('change', sync)
                              : mql.removeListener(sync);
      delete el.__drag_enable_mql__;
    }

    // Breakpoint reset MQL
    const m = el.__drag_mql__;
    if (m) {
      const { mql, onChange } = m;
      mql.removeEventListener ? mql.removeEventListener('change', onChange)
                              : mql.removeListener(onChange);
      delete el.__drag_mql__;
    }

    // Responsive debug MQLs
    if (el.__drag_resp_mqls__) {
      for (const { m, on } of el.__drag_resp_mqls__) {
        m.removeEventListener ? m.removeEventListener('change', on)
                              : m.removeListener(on);
      }
      delete el.__drag_resp_mqls__;
    }

    // Resize listener
    if (el.__drag_resize__) {
      window.removeEventListener('resize', el.__drag_resize__);
      delete el.__drag_resize__;
    }

    // remove debug container if we created it
    const base = el.offsetParent || el.parentElement || document.body;
    if (base) {
      const cands = base.querySelectorAll('[data-draggable-dbg="1"]');
      cands.forEach((n) => n.remove());
    }
  }
};
