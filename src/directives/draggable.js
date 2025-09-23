// src/directives/draggable.js
export default {
  mounted(el, binding) {
    const opts = binding.value || {};
    if (!el.style.position) el.style.position = 'absolute';
    el.style.cursor = 'grab';

    // --- Reset-to-origin wiring -------------------------------------------
    const breakQuery = opts.breakQuery || '(min-width: 600px)';
    const resetOnBreakpoint = opts.resetOnBreakpoint !== false; // default true
    const resetOnResize = !!opts.resetOnResize;                  // default false

    function resetToCssOrigin() {
      el.style.left = '';
      el.style.top = '';
      el.style.right = '';
      el.style.bottom = '';
      delete el.dataset.dragLocked;
    }

    // Watch a breakpoint flip
    if (typeof window !== 'undefined' && resetOnBreakpoint) {
      const mql = window.matchMedia(breakQuery);
      const onChange = () => resetToCssOrigin();
      mql.addEventListener ? mql.addEventListener('change', onChange)
                           : mql.addListener(onChange);
      el.__drag_mql__ = { mql, onChange };
    }

    // (Optional) also reset on any window resize
    if (typeof window !== 'undefined' && resetOnResize) {
      let tid;
      const onResize = () => { clearTimeout(tid); tid = setTimeout(resetToCssOrigin, 60); };
      window.addEventListener('resize', onResize);
      el.__drag_resize__ = onResize;
    }

    // --- Drag + snapInto ---------------------------------------------------
    let startX, startY, baseLeft, baseTop, moved = false;

    const getRelPos = () => {
      const parent = el.offsetParent || el.parentElement || document.body;
      const er = el.getBoundingClientRect();
      const pr = parent.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ml = parseFloat(cs.marginLeft) || 0;
      const mt = parseFloat(cs.marginTop)  || 0;
      return { x: er.left - pr.left - ml, y: er.top - pr.top - mt };
    };

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // Support one or many snap boxes (selectors, elements, or rects)
    function specToBox(spec) {
      const parent = el.offsetParent || el.parentElement || document.body;
      const pr = parent.getBoundingClientRect();
      if (typeof spec === 'string' || (spec && spec.nodeType === 1)) {
        const node = typeof spec === 'string' ? document.querySelector(spec) : spec;
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { left: r.left - pr.left, top: r.top - pr.top, right: r.right - pr.left, bottom: r.bottom - pr.top };
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
      const spec = opts.snapInto;
      if (!spec) return [];
      const arr = Array.isArray(spec) ? spec : [spec];
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
      // exclude self if matched by selector
      return nodes.filter(n => n !== el);
    };

    const checkOverlapAndNotify = () => {
      const pad = Number(opts.overlapPadding ?? 4);
      const minRatio = Number(opts.minOverlapRatio ?? 0.15); // 15% of smaller area
      const targets = resolveTargets();
      if (!targets.length) return;

      const er = getRect(el, pad);
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
        // Sort biggest overlap first
        hits.sort((a, b) => b.area - a.area);

        const detail = {
          element: el,
          elementRect: er,
          hits, // array of { target, area, ratio, rect }
        };

        // 1) Fire DOM events so you can do @overlap / @draggable:overlap in template
        el.dispatchEvent(new CustomEvent('overlap', { detail, bubbles: true }));
        el.dispatchEvent(new CustomEvent('draggable:overlap', { detail, bubbles: true }));

        // 2) If a callback is supplied, call it
        if (typeof opts.onOverlap === 'function') {
          try { opts.onOverlap(detail); } catch (err) { console.error('onOverlap error', err); }
        }
      }
    };

    // --- Pointer events ----------------------------------------------------
    let moveListener, upListener;

    const onPointerDown = (e) => {
      if (opts.enabled === false) return;
      // Only left-click or touch/pen
      if (e.button != null && e.button !== 0) return;

      el.setPointerCapture?.(e.pointerId);
      e.preventDefault(); e.stopPropagation();
      el.style.cursor = 'grabbing';

      const p = getRelPos();
      startX = e.clientX; startY = e.clientY;
      baseLeft = p.x; baseTop = p.y;
      moved = false;

      moveListener = (ev) => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        el.style.left = baseLeft + dx + 'px';
        el.style.top  = baseTop  + dy + 'px';
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      };
      upListener = (ev) => {
        el.releasePointerCapture?.(ev.pointerId);
        el.style.cursor = 'grab';
        window.removeEventListener('pointermove', moveListener);
        window.removeEventListener('pointerup', upListener);

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
            snapMs = 0; // no snap happened
          }

          // mark drag to suppress the post-drag click (if you use that check)
          el.dataset.dragged = 'true';
          setTimeout(() => { delete el.dataset.dragged; }, 0);

          // Emit a dragstop event with final pos (after snap)
          const afterMs = Math.max(0, Number(snapMs));
          setTimeout(() => {
            const finalPos = getRelPos();
            el.dispatchEvent(new CustomEvent('draggable:dragstop', { detail: { pos: finalPos }, bubbles: true }));
            // Now check overlaps
            checkOverlapAndNotify();
          }, afterMs + 5);
        }
      };

      window.addEventListener('pointermove', moveListener, { passive: false });
      window.addEventListener('pointerup', upListener, { passive: true });
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: false });
    el.__drag_pdown__ = onPointerDown; // save for cleanup
  },

  unmounted(el) {
    if (el.__drag_pdown__) {
      el.removeEventListener('pointerdown', el.__drag_pdown__);
      delete el.__drag_pdown__;
    }
    const m = el.__drag_mql__;
    if (m) {
      const { mql, onChange } = m;
      mql.removeEventListener ? mql.removeEventListener('change', onChange)
                              : mql.removeListener(onChange);
      delete el.__drag_mql__;
    }
    if (el.__drag_resize__) {
      window.removeEventListener('resize', el.__drag_resize__);
      delete el.__drag_resize__;
    }
  }
};
