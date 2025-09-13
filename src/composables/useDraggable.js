import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useDraggable(opts = {}) {
  const pos = ref(opts.initial ?? { x: 0, y: 0 })
  const dragEl = ref(null)

  let cleanup = []

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return
    const el = dragEl.value
    if (!el) return

    el.setPointerCapture?.(e.pointerId)

    const startX = e.clientX
    const startY = e.clientY
    const startPos = { ...pos.value }

    const onMove = ev => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      let x = startPos.x + dx
      let y = startPos.y + dy

      if (opts.constrainToParent && el.offsetParent instanceof HTMLElement) {
        const parent = el.offsetParent
        const pw = parent.clientWidth
        const ph = parent.clientHeight
        const ew = el.offsetWidth
        const eh = el.offsetHeight
        x = Math.max(0, Math.min(x, pw - ew))
        y = Math.max(0, Math.min(y, ph - eh))
      }

      pos.value = { x, y }
    }

    const onUp = ev => {
      try { el.releasePointerCapture?.(ev.pointerId) } catch {}
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  }

  onMounted(() => {
    const el = dragEl.value
    if (!el) return

    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'absolute'
    }

    const parent = el.offsetParent || el.parentElement
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative'
    }

    cleanup.push(() => {})
  })

  onBeforeUnmount(() => {
    cleanup.forEach(fn => fn())
    cleanup = []
  })

  return { pos, dragEl, onPointerDown }
}
