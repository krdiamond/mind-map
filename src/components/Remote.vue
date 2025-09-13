<template>
  <div
    class="draggable"
    :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
    @pointerdown.stop.prevent="onPointerDown"
    @click.stop
    ref="dragEl"
  >
    <img :src="Remote" alt="Remote" class="remote w-100" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Remote from '../assets/remote.png'


/**
 * Position is relative to the nearest positioned ancestor.
 * Ensure the parent wrapper has `position: relative`.
 */
const pos = ref({ x: 415, y: 420 })
const dragEl = ref(null)

function onPointerDown(e) {
  // Only primary pointer (left click / single touch)
  if (e.button !== undefined && e.button !== 0) return

  const el = dragEl.value
  if (!el) return

  // Capture pointer so all move/up events are delivered to this element
  el.setPointerCapture(e.pointerId)

  const startX = e.clientX
  const startY = e.clientY
  const startPos = { ...pos.value }

  function onMove(ev) {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    pos.value = {
      x: startPos.x + dx,
      y: startPos.y + dy
    }
  }

  function onUp(ev) {
    try { el.releasePointerCapture(ev.pointerId) } catch (_) {}
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointercancel', onUp)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
  el.addEventListener('pointercancel', onUp)
}

onMounted(() => {
  // Safety: if parent isn't positioned, make it so (prevents viewport-relative weirdness)
  const parent = dragEl.value?.offsetParent || dragEl.value?.parentElement
  if (parent && getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative'
  }
})
</script>

<style scoped>
.remote {
  transform: rotate(19deg);
}
</style>
