<template>  
    <div class="h-250 sm-h-700 sm-p-20  relative flex justify-between align-bottom ">
        <Validation v-if="showValidation" @close="toggleValidation" @click.stop v-draggable class="popup-box sm-w-400"/>
        <Alchemy v-if="showAlchemy" @close="toggleAlchemy" @click.stop v-draggable class="popup-box sm-w-400"/>
        <MusicPlayer v-show="showMusicPlayer" @close="toggleMusicPlayer" @click.stop v-draggable class="popup-box sm-w-400"/>
      
        <div class="fire-detector-wrapper">
          <img :src="fireAlarm" class="w-40 sm-w-70"/>
          <div class="beacon"></div>
        </div>
        
        <TVStack ref="tvstack"/> 
        
        <div class="cabinet-container w-100 sm-w-350 h-250 sm-h-600 relative">
          
          <div id="CabinetStack">
              <img :src="Cabinet" class="h-250 sm-h-600 absolute" alt="Glass Cabinet" />
              <div id="CabinetFire" ref="cabinetFire" class="cabinet-fire ">
                  <img :src="Fire" alt="Fire" class="fire1 fire hide"/>
                  <img :src="Fire" alt="Fire" class="fire2 fire hide"/>
                  <img :src="Fire" alt="Fire" class="fire3 fire hide"/>
                  <img :src="Fire" alt="Fire" class="fire4 fire hide"/>
              </div>
          </div>

          <Candle ref="candle" @overlap="onCandleOverlap($event)"/> 

          <WateringCan ref="wateringCan" @overlap="putOutFire($event)"/> 

          <Remote ref="remote" @overlap="onCandleOverlap($event)" @click="onRemoteClick($event)" /> 

          

        
          <!--  -->

          <!-- <div id="Buddha" class="buddha" 
                  @click="toggleValidation" 
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
          </div> -->


          <!-- <div id="AirpodPro" class="airpod-pro flammable" 
                  @click="toggleMusicPlayer" 
                  @overlap="onCandleOverlap($event)" 
                  v-draggable="{
                  snapInto: [
                      { left: 40, top: 707, right: 278, bottom: 707},  // row 1
                      { left: 40, top: 555, right: 278, bottom: 555 }, // row 2
                      { left: 40, top: 406, right: 278, bottom: 406 }, // row 3
                      { left: 40, top: 260, right: 278, bottom: 260 }, // row 4
                      { left: 40, top: 120, right: 278, bottom: 120 }, // row 5
                    ],
                  snapDurationMs: 150,    
                  resetOnResize: true,
                  overlapWith: '#Candle' 
                }"
                alt="Airpod Pro">
              <img :src="AirpodPro" alt="Airpod Pro" />
              <img :src="Fire" alt="Fire" class="fire hide"/>
          </div> -->

          <!-- <div id="Gold" @click="toggleAlchemy" class="gold" 
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
          </div> -->

        </div>

    </div>
</template>

<script>

import './styles/_app.scss'

import TVStack from './components/TVStack.vue'
import Candle from './components/Candle/candle.vue'
import WateringCan from './components/WateringCan/watering-can.vue'
import Remote from './components/Remote/remote.vue'


import Validation from './components/Validation.vue'
import Alchemy from './components/Alchemy.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import Gratitude from './components/Gratitude.vue'
import Zine_CeilingFan from './components/zine_CeilingFan.vue'



import fireAlarm from './assets/fire-detector.png';
import fireSound from './assets/fire.mp3';
import Fire from './assets/fire.gif';


import Cabinet from './assets/curiocabinet.png'
import CeilingFan from './assets/ceiling-fan.gif'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'
import Heart from './assets/heart.png'
import Gold from './assets/gold.png'
import AirpodPro from './assets/airpod-pro.png'
import Paper from './assets/paper.png'
import Ash from './assets/ash.png'

import EgoTrap from './components/EgoTrap.vue'


export default {
  name: 'HelloWorld',
  components: { EgoTrap, Validation, MusicPlayer, Alchemy, TVStack, Gratitude, Zine_CeilingFan, Candle, WateringCan, Remote },
  data() {
    return {
      TV, Boulder, Static,
      Cabinet, Buddha, Gold, Remote, AirpodPro, Paper, Ash,
      Fire, fireAlarm, 
      CeilingFan,
      littleFires: [],
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false,
      showGratitude: false,
      showCeilingFan: false,
      activeFire: false,
    }
  },
  mounted() {
    this.fireAudio = new Audio(fireSound);
    this.littleFires = document.querySelectorAll('.fire');
  },
  watch: {
    activeFire(value) {
      if (value == true) {
        this.fireAudio.currentTime = 0;
        this.fireAudio.volume = 0.10   
        this.fireAudio.play().catch(() => {});
      } else {
        this.fireAudio?.pause()
        this.$refs.tvstack.pauseBurnVideo()
      }
    }
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
      }
    },
    toggleValidation(e) {
      if (this.checkToggle(e) === false ) {
        this.showValidation = !this.showValidation
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
      }
    },
     toggleAlchemy(e) {
      if (this.checkToggle(e) === false ) {
        this.showAlchemy = !this.showAlchemy
        this.showEgoTrap = false
        this.showValidation = false
        this.showMusicPlayer = false
        this.showCeilingFan = false
      }
      
    },
     toggleMusicPlayer(e) {
      if (this.checkToggle(e) === false ) {
        if(e?.target.children[0].id !== "Ash") {
          this.showMusicPlayer = !this.showMusicPlayer
          this.showEgoTrap = false
          this.showValidation = false
          this.showAlchemy = false
        }
      }
    },
    toggleEgoTrap() {
      this.showEgoTrap = !this.showEgoTrap
      this.showAlchemy = false
      this.showValidation = false
      this.showMusicPlayer = false
      this.showCeilingFan = false
    },
    onRemoteClick(e) {
      console.log('hi')
      if (this.checkToggle(e) === false ) {
        if(e?.target.children[0].id !== "Ash") {
          this.$refs.tvstack.onRemoteClicked()  
        }
         
      }
    },
    onCandleOverlap(event) {
      if(this.$refs.candle.candleIsBlownOut()) { return }

      const dragElement = event.target
      const hitElement = event.detail.hits[0].target
      const candle = dragElement.id === 'Candle' ? dragElement : hitElement;
      const target = dragElement.id === 'Candle' ? hitElement : dragElement;

      if (dragElement.children[0].id === 'Ash' || hitElement.children[0].id === 'Ash') { return }

      setTimeout(() => {
          this.setFireToElement(dragElement, hitElement, target)
          setTimeout(() => {
            if (this.activeFire) {
              const flammableIcons = document.querySelectorAll('.flammable');
              flammableIcons.forEach((icon) => {
                this.setFireToElement(dragElement, hitElement, icon)
              });
            }
            setTimeout(() => {
              if (this.activeFire) {
                const cabinetFires = this.$refs.cabinetFire.querySelectorAll('.fire');
                cabinetFires.forEach((fire) => {
                  fire.classList.remove('hide');
                  this.$refs.tvstack.startBurnVideo()
                });
              }
            }, 5000);
          }, 2000);
      }, 1000);
    },
    checkForActiveFire() {
        this.activeFire = false;
        this.littleFires.forEach((fire) => {
          if (!fire.classList.contains('hide') && !fire.classList.contains('candle-fire')) {
              this.activeFire = true;
          }
      });
    },
    setFireToElement(dragElement, hitElement, target) {
        if (!this.confirmOverlapToIgnite(dragElement, hitElement)) return;
        target.querySelector('.fire').classList.remove('hide');
        this.checkForActiveFire()
        setTimeout(() => {
          if (this.activeFire) {
            this.turnToAsh(target)
          }
        }, 3000);
    },
    putOutFire(event) {
      event.detail.hits.forEach((sprayedElement) => {
        sprayedElement.target.classList.add('hide');
        if (sprayedElement.target.id === 'CandleFire') {
          this.$refs.candle.reIgnightCandleFlame()
        }
        this.checkForActiveFire()
      });
    },
    turnToAsh(el) {
      const ash = document.createElement('img');
      ash.id = 'Ash';   
      ash.src = this.Ash; 
      ash.alt = 'Ash';
      el.children[0].replaceWith(ash);
    },
    confirmOverlapToIgnite(dragElement, hitElement) {
      //ultra-small overlap check at the moment of ignition
      const ar = dragElement.getBoundingClientRect();
      const br = hitElement?.getBoundingClientRect?.();
      const stillOverlapping = !!(br && !(ar.right <= br.left || ar.left >= br.right || ar.bottom <= br.top || ar.top >= br.bottom));
      return stillOverlapping
    },
  }
}
</script>


