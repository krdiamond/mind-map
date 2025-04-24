<template>
    <div
      class="draggable bg-white w-400 m-20 border radius-20 p-20"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
      @mousedown="startDrag"
      ref="dragEl">
          <div @click="$emit('close')" class="absolute top-0 right-0 p-20 pointer">X</div>
          <div>
            <h2>pleasure trap / ego trap </h2>
            <p>The world expects that you can do something but you find that you are having a difficult time.  This is an effect brought on by the pleasure trap. The pleasure trap is an unnatural & pleasure seeking problem that is not possible for a human to solve based on our design.  Think quitting smoking, time travel, alchemy. Thus your internal device is picking up a sense that people have a higher esteem for you and higher expectations than you have for yourself.  Generally you have a pretty aware sense of your capabilities but nothing is more confusing than your cool friend telling you, you can do something that you can't.  Only, you rationally know that they are wrong. To leave the ego trap is to not try, said by bujowski and matt’s tattoo and yoda to maintain self esteem. Although, the problem will never be solved.</p>
            <p>In certain sitiations a person can become overrated and cause an ego trap. There was a great episode of Frasier where there is a man with a gun at Café Nervosa and Bulldog uses a pregnant woman as a human sheild. In doing so he accidentally knocks over a pot of coffee and burns the man leading him to run away.  Bulldog was praised as a hero and lived within the hell of the ego trap, knowing that he was actually a coward.  Eventually Frasier calls him out in front of his community fully crushing his ego publically</p>
            <p>This is a common issue in procrastination. “If i have more esteem to lose than i have to gain, i am not going to try”. If the expectations from others are so high that you are unlikely to meet them is it worth putting in the effort if the result is beneath the expectations of others?  The true solution: change the focus of who you choose to receive self esteem from. Switch to your internal audience for approval.  Always remember, if you can't do something perfectly just do it a little better than you did yesterday. </p>
          </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pos = ref({ x: 100, y: 100 })
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