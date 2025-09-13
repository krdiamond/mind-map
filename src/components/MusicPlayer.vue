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
      <h2>AirpodPro</h2>
    </div>
  </div>
</template>

<script setup>
import { useDraggable } from '../composables/useDraggable'

const emit = defineEmits(['close'])
const emitClose = () => emit('close')

// one-liner reuse
const { pos, dragEl, onPointerDown } = useDraggable({
  initial: { x: -450, y: -400 }
})
</script>

<style scoped>

</style>
