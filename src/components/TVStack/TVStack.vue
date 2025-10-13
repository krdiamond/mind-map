<template>
      <div class="tv-container relative">
        <img :src="TV" class="tv z-1 absolute" alt="TV" />
        
        <video
          id="Burn"
          ref="burnVideo"
          loop
          playsinline
          webkit-playsinline
          preload="auto"
          class="static z-2 absolute"
        >
          <source :src="Burn" type="video/mp4" />
        </video>

        <img :src="Static" v-if="showStatic" class="static z-2 absolute" alt="static" />
        <img :src="Boulder" class="boulder absolute" alt="Boulder" />
      </div>
</template>

<script>

import './tv-stack.scss'

import TV from './tv.png'
import Static from './static.gif'
import Burn from './burn.mp4'
import Boulder from './boulder.png'


export default {
  name: 'TVStack',
  emits: ['remote-click'],
  data() {
    return {
      TV, Boulder, Static, Burn,
      showStatic: true,
      unlockMedia: false
    }
  },
  mounted() {

  },
  methods: {
    startBurnVideo() {
        this.$refs.burnVideo.play(); 
        this.showStatic = false;
    },
    pauseBurnVideo(){
        this.$refs.burnVideo.pause(); 
        this.showStatic = true;
    }
  }
}


</script>