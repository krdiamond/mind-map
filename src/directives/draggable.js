// src/directives/draggable.js
export default {
  mounted(el, binding) {
    const opts = binding.value || {};
    if (!el.style.position) el.style.position = 'absolute';
    el.style.cursor = 'grab';

    // --- Reset-to-origin wiring -------------------------------------------
    // Defaults: reset on breakpoint change; optional: also on any resize.
    const breakQuery = opts.breakQuery || '(min-width: 600px)';
    const resetOnBreakpoint = opts.resetOnBreakpoint !== false; // default true
    const resetOnResize = !!opts.resetOnResize;                  // default false

    function resetToCssOrigin() {
      // Clear any inline positioning so CSS (your media queries) takes over
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

    // --- Drag + snapInto (what you already have) --------------------------
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

    const onMouseDown = (e) => {
      if (opts.enabled === false) return;
      e.preventDefault(); e.stopPropagation();
      el.style.cursor = 'grabbing';
      const p = getRelPos();
      startX = e.clientX; startY = e.clientY;
      baseLeft = p.x; baseTop = p.y;
      moved = false;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      el.style.left = baseLeft + dx + 'px';
      el.style.top  = baseTop  + dy + 'px';
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    };

    const onMouseUp = () => {
      el.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // ❗ Only snap if there was a real drag
      if (moved) {
        const target = pickNearestSnapTarget(getRelPos());
        if (target) {
          const ms = opts.snapDurationMs ?? 120;
          if (ms) {
            el.style.transition = `left ${ms}ms linear, top ${ms}ms linear`;
            requestAnimationFrame(() => {
              el.style.left = target.x + 'px';
              el.style.top  = target.y + 'px';
            });
            setTimeout(() => { el.style.transition = ''; }, ms);
          } else {
            el.style.left = target.x + 'px';
            el.style.top  = target.y + 'px';
          }
        }

        // mark drag to suppress the post-drag click (if you use that check)
        el.dataset.dragged = 'true';
        setTimeout(() => { delete el.dataset.dragged; }, 0);
      }
    };

    el.addEventListener('mousedown', onMouseDown, { passive: false });
  },

  unmounted(el) {
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
