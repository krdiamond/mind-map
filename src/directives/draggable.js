import { isRef } from 'vue'

export default {
  mounted(el, binding) {
    // Accept either a Ref({x,y}) or an options object
    // v-draggable="posRef"  OR  v-draggable="{ pos: posRef, initial: {x,y}, constrainToParent: true, rotate: '20deg' }"
    const opts = isRef(binding.value)
      ? { pos: binding.value }
      : (binding.value || {})

    // Setup initial position state
    let posRef = opts.pos && isRef(opts.pos) ? opts.pos : null
    let pos = posRef
      ? { ...(posRef.value || { x: 0, y: 0 }) }
      : (opts.initial || { x: 0, y: 0 })

    // Ensure absolute positioning
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'absolute'
    }
    // Ensure parent can anchor abspos children
    const parent = el.offsetParent || el.parentElement
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative'
    }

    // Apply initial styles
    el.style.left = pos.x + 'px'
    el.style.top  = pos.y + 'px'
    if (opts.rotate) {
      el.style.transform = `rotate(${opts.rotate})`
    }
    el.style.touchAction = 'none'   // avoid browser panning on touch

    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return
      el.setPointerCapture?.(e.pointerId)
      const startX = e.clientX
      const startY = e.clientY
      const start = { x: pos.x, y: pos.y }

      const onMove = (ev) => {
        let x = start.x + (ev.clientX - startX)
        let y = start.y + (ev.clientY - startY)

        if (opts.constrainToParent && el.offsetParent instanceof HTMLElement) {
          const p = el.offsetParent
          const pw = p.clientWidth
          const ph = p.clientHeight
          const ew = el.offsetWidth
          const eh = el.offsetHeight
          x = Math.max(0, Math.min(x, pw - ew))
          y = Math.max(0, Math.min(y, ph - eh))
        }

        pos = { x, y }
        el.style.left = x + 'px'
        el.style.top  = y + 'px'
        if (posRef) posRef.value = { x, y }
      }

      const onUp = (ev) => {
        try { el.releasePointerCapture?.(ev.pointerId) } catch {}
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    }

    el.addEventListener('pointerdown', onDown)
    el._draggableCleanup = () => el.removeEventListener('pointerdown', onDown)
  },
  unmounted(el) {
    el._draggableCleanup?.()
  }
}
