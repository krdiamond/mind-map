// src/directives/draggable.js
export default {
  mounted(el, binding) {
    // Accept { initial: { desktop:{x,y}, mobile:{x,y} }, enabled: boolean }
    const opts = binding.value || {}
    const initial = opts.initial || {}
    const isDesktop = window.matchMedia('(min-width: 400px)').matches
    const start = isDesktop
      ? (initial.desktop || initial || { x: 0, y: 0 })
      : (initial.mobile  || initial || { x: 0, y: 0 })

    // seed initial position from options if element has no inline pos yet
    if (!el.style.left && !el.style.top) {
      el.style.left = (start.x ?? 0) + 'px'
      el.style.top  = (start.y ?? 0) + 'px'
    }

    el.style.position = el.style.position || 'absolute'
    el.style.cursor = 'grab'

    let startX, startY, initialX, initialY

    const onMouseDown = (e) => {
      if (opts.enabled === false) return
      e.preventDefault()
      e.stopPropagation()
      el.style.cursor = 'grabbing'
      startX = e.clientX
      startY = e.clientY
      initialX = parseInt(el.style.left || 0, 10)
      initialY = parseInt(el.style.top || 0, 10)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      el.style.left = initialX + dx + 'px'
      el.style.top  = initialY + dy + 'px'
    }

    const onMouseUp = () => {
      el.style.cursor = 'grab'
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    const stopClick = (e) => e.stopPropagation()

    el.addEventListener('mousedown', onMouseDown, { passive: false })
    el.addEventListener('click', stopClick)
  }
}