<template>
  <div class="h-900 relative p-20">
   <div class="tv-container relative  w-500">
        <img :src="TV" class="tv w-400 z-1 absolute" alt="TV" />
        <img :src="Static" class="static w-400 z-1 absolute" alt="static" />
        <img :src="Boulder" class="boulder w-500 absolute" alt="Boulder" />
      </div>
      <div class="cabinet-container w-800 absolute">
        <img :src="Cabinet" class=" w-800 absolute" alt="Glass Cabinet" />
        <!-- <div @click="toggleEgoTrap" class="ego text-40 absolute" alt="Ego Brain">🧠</div> -->

          <div
            class="remote absolute pointer"
            ref="remoteEl"
            :style="{ left: remotePos.x + 'px', top: remotePos.y + 'px', transform: 'rotate(20deg)' }"
            @pointerdown.stop.prevent="onRemoteDown"
            @click.stop
          >
            <img :src="Remote" class="w-100" alt="Remote" />
          </div>

        <div @click="toggleValidation" class="buddha absolute pointer" alt="Buddha">
          <img :src="Buddha" class="w-60" alt="Buddha" />
          <Validation v-if="showValidation" @close="toggleValidation" />
        </div>

        <div @click="toggleAlchemy" class="gold absolute pointer" alt="Gold">
          <img :src="Gold" class="w-60" alt="Gold" />
          <Alchemy v-if="showAlchemy" @close="toggleAlchemy" />
        </div> 

         <div @click="toggleMusicPlayer" class="airpod-pro absolute pointer" alt="AirpodPro">
          <img :src="AirpodPro" class="w-60" alt="AirpodPro" />
          <MusicPlayer v-if="showMusicPlayer" @close="toggleMusicPlayer" />
        </div> 








      </div>




  </div>
</template>

<script>
import { useDraggable } from './composables/useDraggable'

import EgoTrap from './components/EgoTrap.vue'
import Validation from './components/Validation.vue'
import Alchemy from './components/Alchemy.vue'
import MusicPlayer from './components/MusicPlayer.vue'

import Cabinet from './assets/curiocabinet.png'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'
import Gold from './assets/gold.png'
import Remote from './assets/remote.png'
import AirpodPro from './assets/airpod-pro.png'




export default {
  name: 'HelloWorld',
  components: { EgoTrap, Validation, Alchemy, MusicPlayer },
  setup() {
    // one instance per draggable element
    const remoteDrag = useDraggable({
      initial: { x: 395, y: 415 },
      constrainToParent: true
    })
    // const buddhaDrag = useDraggable({
    //   initial: { x: 400, y: 534 },
    //   constrainToParent: true
    // })
    // const goldDrag = useDraggable({
    //   initial: { x: 280, y: 555 },
    //   constrainToParent: true
    // })

    // expose them to the template
    return {
      // remote
      remotePos: remoteDrag.pos,
      remoteEl:  remoteDrag.dragEl,
      onRemoteDown: remoteDrag.onPointerDown,

      // // buddha
      // buddhaPos: buddhaDrag.pos,
      // buddhaEl:  buddhaDrag.dragEl,
      // onBuddhaDown: buddhaDrag.onPointerDown,

      // // gold
      // goldPos: goldDrag.pos,
      // goldEl:  goldDrag.dragEl,
      // onGoldDown: goldDrag.onPointerDown,
    }
  },
  data() {
    return {
      Cabinet, TV, Boulder, Static, Buddha, Gold, Remote, AirpodPro,
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false
    }
  },
  mounted() {

  },
  methods: {
    toggleEgoTrap() {
      this.showEgoTrap = !this.showEgoTrap
      this.showAlchemy = false
      this.showValidation = false
      this.showMusicPlayer = false
    },
    toggleValidation() {
      this.showValidation = !this.showValidation
      this.showEgoTrap = false
      this.showAlchemy = false
      this.showMusicPlayer = false
    },
     toggleAlchemy() {
      this.showAlchemy = !this.showAlchemy
      this.showEgoTrap = false
      this.showValidation = false
      this.showMusicPlayer = false
    },
     toggleMusicPlayer() {
      this.showMusicPlayer = !this.showMusicPlayer
      this.showEgoTrap = false
      this.showValidation = false
      this.showAlchemy = false
    },
  }
}
</script>

<style scoped>

.tv-container {
    height: 580px;
    width: 500px;
    top: 300px;
    left: 100px;
}

.cabinet-container {
    height: 800px;
    right: 0;
    bottom: 40px;
}

.boulder{
  top: 250px;
}

.tv {
  left: 60px;
}

.static {
  width: 556px;
  height: 242px;
  z-index: 2;
  top: 25px;
  transform: perspective(2500px) rotateY(50deg) rotateZ(.5deg);
}




.gold {
  top: 555px;
  left: 280px;
}

.airpod-pro {
  top: 569px;
  left: 340px;
}

.buddha {
  top: 534px;
  left: 400px;
}
.ego {
  top: 268px;
  left: 300px;
}
.remote {
  transform: rotate(20deg);
}




</style>