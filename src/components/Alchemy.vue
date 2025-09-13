<template>
  <div
    class="draggable bg-white w-400 border radius-20 p-20"
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
      <h2>Alchemy</h2>
      <p>
        From 2023 - August 2025 I ran an app on a spare computer that essentially exploited a "social casino".  "Social Casinos" offer USD payouts when users purchase their "social" coins to play slot machines. It is an online gambling loophole. Some casinos offer 1 free coin per a day for simply logging in.  I was running about 4 casinos but only 1 was reliable.  My app would automanically log in every morning, collect the 1 coin and then "wash" it by playing a slot machine. The payouts were coins that were redemable for USD.  I never played the slot machines myself or put any of my own money in.  I made a lot of money doing this.  This was a source of true ◎ Alchemy ◎ ! </p>
        <p>Then in Aug 2025, NJ freaking passed a new law banning all "simulated gambling" and "social casinos" are now blocked in NJ, NY and all surrounding states so this project is dead.</p> 
        <p>I won't even get into how complicated it was to make an app that could actually play their slot machines and respond to all the different reactions the machines had.  I had to make sure it responded to everything so that the app wouldn't get stuck.  Also, I had to make sure I could collect my jackpots (there were many) without skipping over them.  It was a tiresome process and my friends and family thought it wasn't worth the money (or they thought I was crazy and didn't want to hear about it) but I live for this shit so <span class="">🤷‍♀️</span>.
      </p>
      <img :src="BirdAnimation" alt="Bird animation" class="w-full pt-12" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import BirdAnimation from '../assets/bird-animation.svg'


// Emit for the close button
const emit = defineEmits(['close'])
const emitClose = () => emit('close')

/**
 * Position is relative to the nearest positioned ancestor.
 * Ensure the parent wrapper has `position: relative`.
 */
const pos = ref({ x: -450, y: -400 })
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

</style>
