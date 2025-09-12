<template>
    <div
      class="draggable bg-white w-400 m-20 border radius-20 p-20"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
      @mousedown="startDrag"
      ref="dragEl">
          <div @click="$emit('close')" class="absolute top-0 right-0 p-20 pointer">X</div>
          <div>
            <h2>Pleasure Trap // Ego Trap</h2>
              <p>The <b>Pleasure Trap</b> describes how our instincts, designed for survival in a natural environment, get hijacked in modern life. We evolved to seek pleasure, avoid pain, and conserve energy. That wiring helped our ancestors, but in today’s world it backfires. Processed food, nicotine, alcohol, and endless entertainment all trigger short-term reward circuits, leaving us stuck in unhealthy loops. Think of someone who wants to quit smoking or stick to a diet, but their brain is constantly drawn back toward the “quick fix.”</p>

              <p>The <b>Ego Trap</b> occurs when others hold you in higher esteem and expect more from you than you believe you can realistically deliver. You may know your own limits, but when your cool friend insists “you can do it,” their praise raises the stakes. Now trying and falling short risks a public loss of esteem. To protect yourself, the safest option feels like not trying at all. This is why the Ego Trap is often tied to procrastination: <em>“If I have more esteem to lose than I have to gain, why risk it?”</em></p>

              <p>These two traps can stack. The Pleasure trap gets you stuck in self-defeating cycles (overeating, smoking, procrastinating). Then the ego trap locks you in place: the fear of failing publicly makes it even harder to take the small, imperfect steps that are the only way out. The cycle becomes: <em>temptation → slip-up → inflated expectations → avoidance.</em> The key to breaking it is to shift your “audience” away from external esteem and toward your internal audience. Always remember, if you can't do something perfectly just do it a little better than you did yesterday.</p>

              <p>There’s a perfect illustration of the ego trap in an episode of Frasier. At Café Nervosa, a gunman bursts in. Bulldog, in a panic, shoves a pregnant woman in front of him as a shield — hardly heroic. But in the chaos, he accidentally knocks over a pot of hot coffee that scalds the gunman and drives him away. To everyone watching, Bulldog looks like a brave hero. Now Bulldog is trapped. The world heaps praise on him, expecting courage and leadership — but inside, he knows he acted out of cowardice. That gap between external esteem and internal reality is exactly what makes the ego trap so painful. Eventually, when Frasier exposes the truth, Bulldog’s public ego is crushed, but the trap itself is broken.</p>

          </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pos = ref({ x: 625, y: 100 })
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
  position: absolute;
  z-index: 9999;
  cursor: grab;
  user-select: none;
}
.draggable:active { cursor: grabbing; }
</style>