<template>
      <div class="tv-container relative">
        <img :src="TV" class="tv z-1 absolute" alt="TV" />
        <video id="Burn" ref="burnVideo" loop class="static z-2 absolute">
          <source :src="Burn" type="video/mp4">
        </video>
        <img :src="Static" v-if="showStatic" class="static z-2 absolute" alt="static" />
        <img :src="Boulder" class="boulder absolute" alt="Boulder" />
      </div>






</template>

<script>

import TV from '../assets/tv.png'
import Static from '../assets/static.gif'
import Burn from '../assets/burn.mp4'
import Boulder from '../assets/boulder.png'



export default {
  name: 'TVStack',
  emits: ['remote-click'],
  data() {
    return {
      TV, Boulder, Static, Burn,
      showStatic: true
    }
  },
  mounted() {

  },
  methods: {
    onRemoteClicked() {
      this.showStatic = !this.showStatic;
    },
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