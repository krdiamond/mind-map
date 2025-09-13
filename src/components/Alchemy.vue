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
import { useDraggable } from '../composables/useDraggable'
import BirdAnimation from '../assets/bird-animation.svg'

const emit = defineEmits(['close'])
const emitClose = () => emit('close')

// one-liner reuse
const { pos, dragEl, onPointerDown } = useDraggable({
  initial: { x: -450, y: -400 }
})
</script>

<style scoped>

</style>
