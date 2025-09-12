<template>
    <div
      class="draggable bg-white w-400 m-20 border radius-20 p-20"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
      @mousedown="startDrag"
      ref="dragEl">
          <div @click="$emit('close')" class="absolute top-0 right-0 p-20 pointer">X</div>
          <div>
            <h2>Buddha’s Parable of the Poisoned Arrow</h2>
            <p>It's just as if <b>a man were wounded with an arrow</b> thickly smeared with poison. His friends & companions, kinsmen & relatives would provide him with a surgeon, and <b>the man would say, 'I won't have this arrow removed until I know whether the man who wounded me was a noble warrior, a priest, a merchant, or a worker.'</b> He would say, 'I won't have this arrow removed until I know the given name & clan name of the man who wounded me... until I know whether he was tall, medium, or short... until I know whether he was dark, ruddy-brown, or golden-colored... until I know his home village, town, or city... until I know whether the bow with which I was wounded was a long bow or a crossbow... until I know whether the bowstring with which I was wounded was fiber, bamboo threads, sinew, hemp, or bark... until I know whether the shaft with which I was wounded was wild or cultivated... until I know whether the feathers of the shaft with which I was wounded were those of a vulture, a stork, a hawk, a peacock, or another bird... until I know whether the shaft with which I was wounded was bound with the sinew of an ox, a water buffalo, a langur, or a monkey.' He would say, 'I won't have this arrow removed until I know whether the shaft with which I was wounded was that of a common arrow, a curved arrow, a barbed, a calf-toothed, or an oleander arrow.' <b>The man would die and those things would still remain unknown to him.</b></p>
          </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pos = ref({ x: 700, y: 400 })
const dragging = ref(false)
const offset = ref({ x: 0, y: 0 })
const dragEl = ref(null)

function startDrag(e) {
  dragging.value = true
  offset.value = {
    x: e.clientX - pos.value.x,
    y: e.clientY - pos.value.y
  }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
}

function onDrag(e) {
  if (!dragging.value) return
  pos.value = {
    x: e.clientX - offset.value.x,
    y: e.clientY - offset.value.y
  }
}

function endDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
}
</script>

<style scoped>
.draggable {
  position: fixed;
  z-index: 9999;
  cursor: grab;
  user-select: none;
}
</style>