// src/directives/draggable.js
export default {
  mounted(el, binding) {
    const opts = binding.value || {};
    if (!el.style.position) el.style.position = 'absolute';
    el.style.cursor = 'grab';

    let startX, startY, baseLeft, baseTop;
    let moved = false;

    // --- Helpers ------------------------------------------------------------
    function getRelPos() {
      const parent = el.offsetParent || el.parentElement || document.body;
      const er = el.getBoundingClientRect();
      const pr = parent.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ml = parseFloat(cs.marginLeft) || 0;
      const mt = parseFloat(cs.marginTop)  || 0;
      return { x: er.left - pr.left - ml, y: er.top - pr.top - mt };
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    // Compute the bounding box (in offsetParent coordinates)
    // Supports:
    //  - bounds: 'parent'
    //  - bounds: { left, top, right, bottom }  (absolute edges)
    //  - boundsEl: CSS selector or Element (we'll use its rect)
    //  - inset: { x, y } optional inner padding
    function getBounds() {
      const parent = el.offsetParent || el.parentElement || document.body;
      const pr = parent.getBoundingClientRect();

      // Option 1: another element defines the box
      if (opts.boundsEl) {
        const node =
          typeof opts.boundsEl === 'string'
            ? document.querySelector(opts.boundsEl)
            : opts.boundsEl;
        if (node) {
          const br = node.getBoundingClientRect();
          return {
            left: br.left - pr.left + (opts.inset?.x || 0),
            top:  br.top  - pr.top  + (opts.inset?.y || 0),
            right: br.right - pr.left - (opts.inset?.x || 0),
            bottom: br.bottom - pr.top - (opts.inset?.y || 0),
          };
        }
      }

      // Option 2: explicit edges
      if (opts.bounds && typeof opts.bounds === 'object') {
        const b = opts.bounds;
        return {
          left:   b.left   ?? 0,
          top:    b.top    ?? 0,
          right:  b.right  ?? pr.width,
          bottom: b.bottom ?? pr.height,
        };
      }

      // Option 3: whole parent
      return { left: 0, top: 0, right: pr.width, bottom: pr.height };
    }

    // Clamp the element's top-left so the whole box stays inside bounds
    function applyBounds(x, y) {
      const b = getBounds();
      const ew = el.offsetWidth;
      const eh = el.offsetHeight;
      const minX = b.left;
      const minY = b.top;
      const maxX = b.right  - ew;
      const maxY = b.bottom - eh;
      return { x: clamp(x, minX, Math.max(minX, maxX)),
               y: clamp(y, minY, Math.max(minY, maxY)) };
    }

    // --- Events -------------------------------------------------------------
    const onMouseDown = (e) => {
      if (opts.enabled === false) return;
      e.preventDefault();
      e.stopPropagation();
      el.style.cursor = 'grabbing';

      // read visual position (robust across breakpoints)
      const pos = getRelPos();
      baseLeft = pos.x;
      baseTop  = pos.y;
      startX = e.clientX;
      startY = e.clientY;
      moved = false;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let x = baseLeft + dx;
      let y = baseTop  + dy;

      // clamp during drag
      ({ x, y } = applyBounds(x, y));

      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    };

    const onMouseUp = () => {
      el.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (moved) {
        // tiny flag to ignore the post-drag click if you use that pattern
        el.dataset.dragged = 'true';
        setTimeout(() => { delete el.dataset.dragged; }, 0);
      }
    };

    el.addEventListener('mousedown', onMouseDown, { passive: false });
  }
};
