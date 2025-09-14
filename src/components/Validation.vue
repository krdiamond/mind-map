<template>
<div
  ref="dragEl"
  class="draggable bg-white border radius-20 p-20 scroll"
  :style="{
    top: pos.y + 'px',
    left: pos.x + 'px',
    // helps avoid gesture conflicts while dragging on desktop
    touchAction: isDesktop ? 'none' : 'auto',
    cursor: isDesktop ? 'grab' : 'default'
  }"
  v-on="isDesktop ? { pointerdown: onPointerDown } : {}"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDraggable } from '../composables/useDraggable'

const emit = defineEmits(['close'])
const emitClose = () => emit('close')

// Breakpoint: treat >=400px as “desktop”
const mq = window.matchMedia('(max-width: 400px)')
const isDesktop = ref(mq.matches)

// Initial position based on current size
const DESKTOP_START = { x: -520, y: -120 }
const MOBILE_START  = { x:  0,  y:  0 }

const initial = isDesktop.value ? DESKTOP_START : MOBILE_START

// Draggable once; we’ll enable/disable by conditionally binding the handler
const { pos, dragEl, onPointerDown } = useDraggable({ initial })

// When the viewport crosses the breakpoint, update state (+ optionally snap position)
const onMQChange = (e) => {
  isDesktop.value = e.matches
  // Optional: update starting position when switching modes
  const start = isDesktop.value ? DESKTOP_START : MOBILE_START
  pos.x = start.x
  pos.y = start.y
}

onMounted(() => {
  mq.addEventListener('change', onMQChange)
})

onBeforeUnmount(() => {
  mq.removeEventListener('change', onMQChange)
})
</script>

