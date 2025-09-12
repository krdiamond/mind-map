<template>
  <div
    class="draggable bg-white w-400 m-20 border radius-20 p-20"
    :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
    @pointerdown.stop.prevent="onPointerDown"
    @click.stop
    ref="dragEl"
  >
    <!-- Close button: prevent drag start on pointerdown, then emit close on click -->
    <div
      class="absolute top-0 right-0 p-20 pointer"
      role="button"
      tabindex="0"
      @pointerdown.stop
      @click.stop="emitClose"
      @keydown.enter.stop.prevent="emitClose"
      @keydown.space.stop.prevent="emitClose"
    >
      X
    </div>

    <div>
      <h2>Buddha’s Parable of the Poisoned Arrow</h2>
      <p>
        It's just as if <b>a man were wounded with an arrow</b> thickly smeared with poison. His friends &amp; companions, kinsmen &amp; relatives would provide him with a surgeon, and
        <b>the man would say, 'I won't have this arrow removed until I know whether the man who wounded me was a noble warrior, a priest, a merchant, or a worker.'</b>
        He would say, 'I won't have this arrow removed until I know the given name &amp; clan name of the man who wounded me... until I know whether he was tall, medium, or short... until I know whether he was dark, ruddy-brown, or golden-colored... until I know his home village, town, or city... until I know whether the bow with which I was wounded was a long bow or a crossbow... until I know whether the bowstring with which I was wounded was fiber, bamboo threads, sinew, hemp, or bark... until I know whether the shaft with which I was wounded was wild or cultivated... until I know whether the feathers of the shaft with which I was wounded were those of a vulture, a stork, a hawk, a peacock, or another bird... until I know whether the shaft with which I was wounded was bound with the sinew of an ox, a water buffalo, a langur, or a monkey.' He would say, 'I won't have this arrow removed until I know whether the shaft with which I was wounded was that of a common arrow, a curved arrow, a barbed, a calf-toothed, or an oleander arrow.'
        <b>The man would die and those things would still remain unknown to him.</b>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Emit for the close button
const emit = defineEmits(['close'])
const emitClose = () => emit('close')

/**
 * Position is relative to the nearest positioned ancestor.
 * Ensure the parent wrapper has `position: relative`.
 */
const pos = ref({ x: -520, y: -120 })
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
.draggable {
  position: absolute; /* relative to positioned parent */
  z-index: 9999;
  cursor: grab;
  user-select: none;
  touch-action: none; /* crucial for touch: allows smooth pointer events */
}
.draggable:active {
  cursor: grabbing;
}
</style>
