<template>

  
    <div class="h-250 sm-h-900 sm-p-20  relative flex justify-between align-bottom ">
      
      <TVStack ref="tvstack"/>

      <Validation v-show="showValidation" @close="toggleValidation" @click.stop v-draggable/>
      <Alchemy v-show="showAlchemy" @close="toggleAlchemy" @click.stop v-draggable/>
      <MusicPlayer v-show="showMusicPlayer" @close="toggleMusicPlayer" @click.stop v-draggable/>
      <!-- <Gratitude v-show="showGratitude" @close="toggleGratitude" @click.stop v-draggable /> -->
      <!-- <Zine_CeilingFan v-show="showCeilingFan" @close="toggleCeiingFan" @click.stop v-draggable /> -->


      <div id="CeilingFan" class="ceiling-fan pointer"  alt="Ceiling Fan">
         <img :src="CeilingFan" alt="Ceiling Fan" />
      </div>

      <div class="cabinet-container h-250 sm-h-800 sm-mr-60 relative">
        <img :src="Cabinet" class="h-250 sm-h-800 absolute" alt="Glass Cabinet" />
          
        <div id="Remote" class="remote absolute pointer" 
              @click="onRemoteClick"
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
          <click-spark style="--click-spark-color: black;"></click-spark>
         </div>

         <!-- <div id="Heart" @click="toggleGratitude" class="heart absolute pointer" 
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
              alt="Heart">
             <img :src="Heart" alt="Heart" /> 
         </div> -->

        <div id="Spaghetti" @click="toggleSpaghetti" class="spaghetti absolute pointer" 
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
              alt="spaghetti">
             <img :src="Spaghetti" alt="spaghetti" /> 
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


         <div id="AirpodPro" @click="toggleMusicPlayer" class="airpod-pro absolute pointer" 
                v-draggable="{
                snapInto: [
                    { left: 40, top: 707, right: 278, bottom: 750}, // row 1
                    { left: 40, top: 560, right: 278, bottom: 610 }, // row 2
                    { left: 40, top: 413, right: 278, bottom: 420 }, // row 3
                    { left: 40, top: 270, right: 278, bottom: 320 }, // row 4
                    { left: 40, top: 128, right: 278, bottom: 120 }, // row 5
                  ],
                snapDurationMs: 150,    
                resetOnResize: true   
              }"
              alt="Airpod Pro">
            <img :src="AirpodPro" alt="Airpod Pro" />
         </div>

        <div id="Gold" @click="toggleAlchemy" class="gold absolute pointer" 
                v-draggable="{
                snapInto: [
                    { left: 40, top: 711, right: 278, bottom: 711}, // row 1
                    { left: 40, top: 560, right: 278, bottom: 560 }, // row 2
                    { left: 40, top: 414, right: 278, bottom: 414 }, // row 3
                    { left: 40, top: 268, right: 278, bottom: 268 }, // row 4
                    { left: 40, top: 123, right: 278, bottom: 123 }, // row 5
                  ],
                snapDurationMs: 150,    
                resetOnResize: true   
              }"
              alt="Gold">
            <img :src="Gold" alt="Gold" />
         </div>

      </div>

  </div>
</template>

<script>

import './styles/_app.scss'

import EgoTrap from './components/EgoTrap.vue'
import TVStack from './components/TVStack.vue'
import Validation from './components/Validation.vue'
import Alchemy from './components/Alchemy.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import Gratitude from './components/Gratitude.vue'
import Zine_CeilingFan from './components/zine_CeilingFan.vue'

import Cabinet from './assets/curiocabinet.png'
import CeilingFan from './assets/ceiling-fan.gif'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'
import Heart from './assets/heart.png'
import Spaghetti from './assets/spaghetti.png'
import Gold from './assets/gold.png'
import Remote from './assets/remote.png'
import AirpodPro from './assets/airpod-pro.png'


export default {
  name: 'MindMap',
  components: { EgoTrap, Validation, MusicPlayer, Alchemy, TVStack, Gratitude, Zine_CeilingFan },
  data() {
    return {
      Cabinet, TV, Boulder, Static, CeilingFan,
      Buddha, Heart, Gold, Remote, AirpodPro, Spaghetti,
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false,
      showGratitude: false,
      showCeilingFan: false,
      showDanny: false
    }
  },
  mounted() {

  },
  methods: {
    checkToggle(e) { //this determines if it is a drag click or a toggle click
      return !!e?.currentTarget?.dataset?.dragged
    },
    toggleCeiingFan(e) {
    if (this.checkToggle(e) === false ) {
        this.showCeilingFan = !this.showCeilingFan
        this.showValidation = false;
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showMusicPlayer = false
        this.showDanny = false
      }
    },
    toggleValidation(e) {
      if (this.checkToggle(e) === false ) {
        this.showValidation = !this.showValidation
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
        this.showDanny = false
      }
    },
     toggleAlchemy(e) {
      if (this.checkToggle(e) === false ) {
        this.showAlchemy = !this.showAlchemy
        this.showEgoTrap = false
        this.showValidation = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
        this.showDanny = false
      }
      
    },
     toggleMusicPlayer(e) {
      if (this.checkToggle(e) === false ) {
        this.showMusicPlayer = !this.showMusicPlayer
        this.showEgoTrap = false
        this.showValidation = false
        this.showAlchemy = false
        this.showCeilingFan = false
        this.showDanny = false
      }
    },
    toggleGratitude(e) {
      if (this.checkToggle(e) === false ) {
        this.showGratitude = !this.showGratitude;
        this.showEgoTrap = false
        this.showValidation = false
        this.showAlchemy = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
        this.showDanny = false
      }
    },
    toggleEgoTrap() {
      if (this.checkToggle(e) === false ) {
        this.showEgoTrap = !this.showEgoTrap
        this.showAlchemy = false
        this.showValidation = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
        this.showDanny = false    
      }
      
    },
    toggleSpaghetti() {
      if (this.checkToggle(e) === false ) {
        this.showDanny = !this.showDanny
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showValidation = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
      }
      
    },
    onRemoteClick(e) {
      if (this.checkToggle(e) === false) {
        this.$refs.tvstack.onRemoteClicked()
      }
    }
  }
}
</script>