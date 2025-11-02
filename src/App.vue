<template>  
    <div  @pointerdown="unlockMedia()" class="h-250 sm-h-700 sm-p-20 relative flex justify-between align-bottom ">
      
        <TVStack ref="tvstack"/>

        <CeilingFan/> 

        <div class="cabinet-container w-100 sm-w-350 h-250 sm-h-600 relative">
            
            <Alchemy v-if="showAlchemy" @close="toggleAlchemy" @click.stop v-draggable.desktop class="popup-box sm-w-400"/>
            <MusicPlayer v-show="showMusicPlayer" @close="toggleMusicPlayer" @click.stop v-draggable.desktop class="popup-box sm-w-400"/>
            <FireDetector ref="fireDetector"/> 

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

            <Remote ref="remote" @overlap="onCandleOverlap($event)" @click="onRemoteClick($event)"/> 
            <Validation v-if="showValidation" @close="toggleValidation" @click.stop v-draggable.desktop class="popup-box sm-w-400"/>
            
            <Buddha ref="buddha" @click="toggleValidation"/>
            <Gold ref="buddha" @click="toggleAlchemy"/>
            <AirpodPro ref="airpodPro" @overlap="onCandleOverlap($event)"  @click="toggleMusicPlayer"/>
        </div>
    </div>
</template>

<script>

import './styles/_app.scss'

//ROOM ELEMENTS
import TVStack from './components/TVStack/TVStack.vue'
import FireDetector from './components/FireDetector/fire-detector.vue'
import CeilingFan from './components/CeilingFan/ceiling-fan.vue'
import WateringCan from './components/WateringCan/watering-can.vue'

//POPUPS
import Validation from './components/Validation.vue'
import Alchemy from './components/Alchemy.vue'
import MusicPlayer from './components/MusicPlayer.vue'

//ICONS
import Cabinet from './assets/curiocabinet.png'
import Candle from './components/Candle/candle.vue'
import Remote from './components/Remote/remote.vue'
import Buddha from './components/Buddha/buddha.vue'
import Gold from './components/Gold/gold.vue'
import AirpodPro from './components/AirpodPro/airpod-pro.vue'
import Ash from './assets/ash.png'

import fireSound from './assets/fire.mp3';
import Fire from './assets/fire.gif';

export default {
  name: 'MindMap',
  components: { 
    Validation, MusicPlayer, Alchemy,
    TVStack, WateringCan, FireDetector, CeilingFan,
    Candle, Remote, Buddha, Gold, AirpodPro },
  data() {
    return {
      Cabinet, 
      Ash,
      Fire,
      littleFires: [],
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false,
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
    },
  }, 
  methods: {
    checkToggle(e) { //this determines if it is a drag click or a toggle click
      return !!e?.currentTarget?.dataset?.dragged
    },
    unlockMedia() {
      this.fireAudio?.pause()
      this.$refs.tvstack.startBurnVideo()
      this.$refs.tvstack.pauseBurnVideo()
    },
    toggleValidation(e) {
      if (this.checkToggle(e) === false ) {
        this.showValidation = !this.showValidation
        this.showAlchemy = false
        this.showMusicPlayer = false
      }
    },
     toggleAlchemy(e) {
      if (this.checkToggle(e) === false ) {
        this.showAlchemy = !this.showAlchemy
        this.showValidation = false
        this.showMusicPlayer = false
      }
    },
     toggleMusicPlayer(e) {
      if (this.checkToggle(e) === false ) {
       if(e?.target.children[0].id !== "Ash") {
          this.showMusicPlayer = !this.showMusicPlayer
          this.showValidation = false
          this.showAlchemy = false
        }
      }
    },
    onRemoteClick(e) {
      if (this.checkToggle(e) === false ) {
        if(e?.target.children[0].id !== "Ash") {
          this.$refs.tvstack.showStatic = !this.$refs.tvstack.showStatic
        } 
      }
    },
    onCandleOverlap(event) {
      if(this.$refs.candle.candleIsBlownOut()) { return }

      const dragElement = event.target
      const hitElement = event.detail.hits[0].target
      if (dragElement.children[0].id === 'Ash' || hitElement.children[0].id === 'Ash') { return }

      const target = dragElement.id === 'Candle' ? hitElement : dragElement;
      const flammableIcons = document.querySelectorAll('.flammable');
      const cabinetFires = this.$refs.cabinetFire.querySelectorAll('.fire');

      setTimeout(() => {
         if (!this.confirmOverlapToIgnite(dragElement, hitElement)) return;
         this.startFire(target)
          setTimeout(() => {
            if (target.children[1].classList.contains('hide')){ this.activeFire = false; return }
            flammableIcons.forEach((icon) => {
                this.startFire(icon)
            });
            setTimeout(() => {
              if (this.activeFire) {
                cabinetFires.forEach((fire) => {
                  fire.classList.remove('hide');
                  this.fireAudio?.pause();
                  this.$refs.tvstack.startBurnVideo()
                });
              }
            }, 5000);
          }, 2000);
      }, 1000);
    },
    startFire(target) {
      this.activeFire = true
      const fire = target.children[1]
      fire.classList.remove('hide')
      setTimeout(() => {
        if (!fire.classList.contains('hide')) {
          this.turnToAsh(target)
        }
        }, 3000);
    },
    turnToAsh(target) {
      const ash = document.createElement('img');
      ash.id = 'Ash';   
      ash.src = this.Ash; 
      ash.alt = 'Ash';
      target.children[0].replaceWith(ash);
    },
    checkForActiveFire() {
      this.activeFire = false;
      this.littleFires.forEach((fire) => {
        if (!fire.classList.contains('hide') && !fire.classList.contains('candle-fire')) {
            this.activeFire = true;
        }
      });
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
    confirmOverlapToIgnite(dragElement, hitElement) {
      const ar = dragElement.getBoundingClientRect();
      const br = hitElement?.getBoundingClientRect?.();
      const stillOverlapping = !!(br && !(ar.right <= br.left || ar.left >= br.right || ar.bottom <= br.top || ar.top >= br.bottom));
      return stillOverlapping
    },
  }
}
</script>


