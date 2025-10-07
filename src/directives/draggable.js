// src/directives/draggable.js
export default {
  mounted(el, binding) {
    // Keep latest options on the element
    el.__drag_opts__ = binding.value || {};
    const O = () => el.__drag_opts__ || {};

    // Always draggable, all viewports
    if (!el.style.position) el.style.position = 'absolute';
    el.style.cursor = 'grab';
    el.style.touchAction = 'none'; // smooth touch dragging

    // ---------- Responsive config (media queries) --------------------------
    // O().responsive: [{ query: '(max-width:1024px)', snapInto: [...], coordsBase: '...' }, ...]
    // Fallback: top-level snapInto / coordsBase.
    const mqls = [];
    function getActiveConfig() {
      const base = { snapInto: O().snapInto, coordsBase: O().coordsBase };
      const resp = Array.isArray(O().responsive) ? O().responsive : null;
      if (!resp || !resp.length || typeof window === 'undefined') return base;

      // Pick the LAST matching query (so later entries can override earlier ones)
      let active = null;
      for (const r of resp) {
        if (!r || !r.query) continue;
        const m = window.matchMedia(r.query);
        if (m.matches) active = r;
      }
      if (!active) return base;
      return {
        snapInto: active.snapInto != null ? active.snapInto : base.snapInto,
        coordsBase: active.coordsBase != null ? active.coordsBase : base.coordsBase,
      };
    }

    // Setup listeners to react to responsive query changes
    function wireResponsiveListeners() {
      const resp = Array.isArray(O().responsive) ? O().responsive : null;
      if (!resp || !resp.length || typeof window === 'undefined') return;
      // Clear previous
      for (const { m, on } of mqls) {
        m.removeEventListener ? m.removeEventListener('change', on) : m.removeListener(on);
      }
      mqls.length = 0;

      // Add new
      for (const r of resp) {
        if (!r || !r.query) continue;
        const m = window.matchMedia(r.query);
        const on = () => {
          // On breakpoint flip, just re-render debug boxes so you can see new rectangles.
          renderDebugBoxes();
        };
        m.addEventListener ? m.addEventListener('change', on) : m.addListener(on);
        mqls.push({ m, on });
      }
    }
    wireResponsiveListeners();

    // ---------- Debug overlay ---------------------------------------------
    const dbg = {
      enabled: !!O().debugBoxes,
      baseEl: null,
      container: null,
      boxes: [],
      className: O().debugClass || 'draggable-snapbox',
      z: O().debugZ || 99999,
    };

    const resolveNode = (n) => {
      if (!n) return null;
      if (typeof n === 'string') return document.querySelector(n);
      if (n && n.nodeType === 1) return n;
      return null;
    };

    // Coordinate base: responsive can override coordsBase
    const getBaseEl = () => {
      const active = getActiveConfig();
      return (
        resolveNode(active.coordsBase) ||
        el.offsetParent ||
        el.parentElement ||
        document.body
      );
    };

    function ensureDebugContainer() {
      if (!dbg.enabled) return;
      const base = getBaseEl();
      dbg.baseEl = base;
      const baseCS = getComputedStyle(base);
      if (baseCS.position === 'static') base.style.position = 'relative';

      // If we already have a container and it belongs to a different base, move it
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
        c.style.zIndex = String(dbg.z);
        c.dataset.draggableDbg = '1';
        base.appendChild(c);
        dbg.container = c;
      }
    }

    function clearDebugBoxes() {
      if (!dbg.container) return;
      dbg.container.innerHTML = '';
      dbg.boxes = [];
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

      // Label (1-based index)
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
      dbg.boxes.push(d);
    }

    function renderDebugBoxes() {
      if (!dbg.enabled) return;
      ensureDebugContainer();
      if (!dbg.container) return;

      // keep container sized to base
      dbg.container.style.width = dbg.baseEl.clientWidth + 'px';
      dbg.container.style.height = dbg.baseEl.clientHeight + 'px';

      clearDebugBoxes();
      const boxes = getSnapBoxes();
      boxes.forEach((b, i) => drawBox(b, i + 1)); // start counting at 1
    }

    // ---------- Drag + snapInto -------------------------------------------
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

    // Convert spec to box relative to current base (responsive-aware)
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
        if (right == null) right = left;     // show as zero-width (debug will reveal)
        if (bottom == null) bottom = top;    // show as zero-height
        return { left, top, right, bottom };
      }
      return null;
    }

    function getSnapBoxes() {
      const active = getActiveConfig();
      const spec = active.snapInto;
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
        const maxX = (b.right  ?? b.left)  - ew;
        const maxY = (b.bottom ?? b.top)   - eh;
        const tx = clamp(pos.x, minX, Math.max(minX, maxX));
        const ty = clamp(pos.y, minY, Math.max(minY, maxY));
        const dx = pos.x - tx, dy = pos.y - ty, d2 = dx*dx + dy*dy;
        if (d2 < bestD2) { bestD2 = d2; best = { x: tx, y: ty }; }
      }
      return best;
    }

    // ---------- Overlap helpers (unchanged) -------------------------------
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
      const spec = O().overlapWith;
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
      const sel = O().overlapSubject;
      if (!sel) return el;
      if (typeof sel === 'string') return el.querySelector(sel) || el;
      if (sel && sel.nodeType === 1) return sel;
      return el;
    };

    const checkOverlapAndNotify = () => {
      const pad = Number(O().overlapPadding ?? 4);
      const minRatio = Number(O().minOverlapRatio ?? 0.15); // 15% of smaller area
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
        if (typeof O().onOverlap === 'function') {
          try { O().onOverlap(detail); } catch (err) { console.error('onOverlap error', err); }
        }
      }
    };

    // ---------- Pointer events --------------------------------------------
    let moveListener, upListener;
    let overlapRAF = null;

    const onPointerDown = (e) => {
      if (O().enabled === false) return;
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

        // When we first exceed the tiny threshold, mark as actively dragging
        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          moved = true;
          el.dataset.dragging = 'true'; // attribute for CSS (rotation/swing)
          el.dispatchEvent(new CustomEvent('draggable:dragstart', { bubbles: true })); // optional
        }

        // Update position while moving
        el.style.left = baseLeft + dx + 'px';
        el.style.top  = baseTop  + dy + 'px';

        // while dragging, optionally check overlap continuously (hover)
        if (moved && O().overlapOnMove) {
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

        // Always clear the dragging attribute on release
        if (el.dataset.dragging) {
          delete el.dataset.dragging;
          el.dispatchEvent(new CustomEvent('draggable:dragend', { bubbles: true })); // optional
        }

        const target = pickNearestSnapTarget(getRelPos());
        let snapMs = O().snapDurationMs ?? 120;
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

        // mark drag to suppress the post-drag click (if you use that check)
        el.dataset.dragged = 'true';
        setTimeout(() => { delete el.dataset.dragged; }, 0);

        // Finalize
        const afterMs = Math.max(0, Number(snapMs));
        setTimeout(() => {
          const finalPos = getRelPos();
          el.dispatchEvent(new CustomEvent('draggable:dragstop', { detail: { pos: finalPos }, bubbles: true }));
          // Final overlap check on drop
          checkOverlapAndNotify();
          renderDebugBoxes(); // refresh overlays for the active config
        }, afterMs + 5);
      };

      window.addEventListener('pointermove', moveListener, { passive: false });
      window.addEventListener('pointerup', upListener, { passive: true });
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: false });
    el.__drag_pdown__ = onPointerDown; // save for cleanup

    // Initial debug render + on resize
    if (dbg.enabled) {
      ensureDebugContainer();
      renderDebugBoxes();
      const onResize = () => renderDebugBoxes();
      window.addEventListener('resize', onResize);
      el.__drag_dbg_resize__ = onResize;
    }
  },

  // Make changes reactive (including responsive array)
  updated(el, binding) {
    el.__drag_opts__ = binding.value || {};
  },

  unmounted(el) {
    if (el.__drag_pdown__) {
      el.removeEventListener('pointerdown', el.__drag_pdown__);
      delete el.__drag_pdown__;
    }
    if (el.__drag_dbg_resize__) {
      window.removeEventListener('resize', el.__drag_dbg_resize__);
      delete el.__drag_dbg_resize__;
    }
    // remove any debug container we added
    const base = el.offsetParent || el.parentElement || document.body;
    if (base) {
      const cands = base.querySelectorAll('[data-draggable-dbg="1"]');
      cands.forEach((n) => n.remove());
    }
  }
};
