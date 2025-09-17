<template>
  <div class="h-250 sm-h-900 sm-p-20  relative flex justify-between align-bottom ">
     <Validation v-if="showValidation" @close="toggleValidation" @click.stop v-draggable class="popup-box"  />


      <div class="tv-container relative">
        <img :src="TV" class="tv z-1 absolute" alt="TV" />
        <img :src="Static" class="static z-2 absolute" alt="static" />
        <img :src="Boulder" class="boulder absolute" alt="Boulder" />
      </div>

     

      <div class="cabinet-container h-250 sm-h-800 relative">
        <img :src="Cabinet" class="h-250 sm-h-800 absolute" alt="Glass Cabinet" />
          
        <div id="Remote" class="remote absolute pointer" 
              v-draggable="{
              snapInto: [
                  { left: 20, top: 700, right: 290, bottom: 720 }, // row 1
                  { left: 20, top: 538, right: 290, bottom: 620 }, // row 2
                  { left: 20, top: 410, right: 290, bottom: 420 }, // row 3
                  { left: 20, top: 260, right: 290, bottom: 320 }, // row 4
                  { left: 20, top: 114, right: 290, bottom: 120 }, // row 5
                ],
              snapDurationMs: 150,    
              resetOnResize: true   
            }"
            alt="Remote">
          <img :src="Remote" alt="Remote" class="remote" />
         </div>

         <div id="Buddha" @click="toggleValidation" class="buddha absolute pointer" 
                v-draggable="{
                snapInto: [
                    { left: 40, top: 685, right: 278, bottom: 750}, // row 1
                    { left: 40, top: 528, right: 278, bottom: 610 }, // row 2
                    { left: 40, top: 387, right: 278, bottom: 420 }, // row 3
                    { left: 40, top: 237, right: 278, bottom: 320 }, // row 4
                    { left: 40, top: 93, right: 278, bottom: 120 }, // row 5
                  ],
                snapDurationMs: 150,    
                resetOnResize: true   
              }"
              alt="Buddha">
            <img :src="Buddha" alt="Buddha" />
         </div>


        <!-- <div @click="toggleAlchemy" class="gold absolute pointer" alt="Gold">
          <img :src="Gold" class="w-60" alt="Gold" />
          <Alchemy v-if="showAlchemy" @close="toggleAlchemy" />
        </div>  -->

         <!-- <div @click="toggleMusicPlayer" class="airpod-pro absolute pointer" alt="AirpodPro">
          <img :src="AirpodPro" class="w-60" alt="AirpodPro" />
          <MusicPlayer v-if="showMusicPlayer" @close="toggleMusicPlayer" />
        </div>  -->
      </div>

  </div>
</template>

<script>

import './styles/_app.scss'

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
  data() {
    return {
      Cabinet, TV, Boulder, Static, 
      Buddha, Gold, Remote, AirpodPro,
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false
    }
  },
  mounted() {

  },
  methods: {
    checkToggle(e) {
      return !!e?.currentTarget?.dataset?.dragged
    },
    toggleValidation(e) {
      if (this.checkToggle(e) === false ) {
        this.showValidation = !this.showValidation
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showMusicPlayer = false
      }
    },
    toggleEgoTrap() {
      this.showEgoTrap = !this.showEgoTrap
      this.showAlchemy = false
      this.showValidation = false
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





</style>