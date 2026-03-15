<template>  
    <!-- <div  @pointerdown="unlockMedia()" class="h-250 sm-h-700 sm-p-20 relative flex justify-between align-bottom "> -->
      <div  class="h-250 sm-h-700 sm-p-20 relative flex justify-between align-bottom ">
      
        <TVStack ref="tvstack"/>

        <!-- <CeilingFan/>  -->

        <div class="cabinet-container w-100 sm-w-350 h-250 sm-h-600 relative">
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
            <Candle ref="candle" @bringToFront="bringToFront($event)" @overlap="onCandleOverlap($event)"  /> 
            <!-- <Remote @overlap="onCandleOverlap($event)" @click="onRemoteClick($event)" @bringToFront="bringToFront($event)"/>  -->
            <Buddha ref="buddha" @bringToFront="bringToFront($event)" @click="onBuddhaClick($event)" />
            <DVD ref="dvd" @bringToFront="bringToFront($event)" @click="onDVDClick($event)" @overlap="onCandleOverlap($event)" />
            <AirpodPro ref="airpodPro" @bringToFront="bringToFront($event)" @click="onAirPodProClick($event)" @overlap="onCandleOverlap($event)" />
            <!-- <Gold @bringToFront="bringToFront($event)"/> -->
            <WateringCan @overlap="putOutFire($event)" ref="wateringCan"/>   
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

//ICONS
import Cabinet from './assets/curiocabinet.png'
import Candle from './components/Candle/candle.vue'
import Remote from './components/Remote/remote.vue'
import Buddha from './components/Buddha/buddha.vue'
import Gold from './components/Gold/gold.vue'
import AirpodPro from './components/AirpodPro/airpod-pro.vue'
import DVD from './components/DVD/dvd.vue'
import Ash from './assets/ash.png'

import fireSound from './assets/fire.mp3';
import Fire from './assets/fire.gif';

export default {
  name: 'MindMap',
  components: {  
    TVStack, WateringCan, FireDetector, CeilingFan,
    Candle, Remote, Buddha, Gold, AirpodPro, DVD },
  data() {
    return {
      Cabinet, 
      Ash,
      Fire,
      activeFire: false,
    }
  },
  mounted() {
    this.fireAudio = new Audio(fireSound);
    this.watchForFire()
  },
  methods: {
    onDVDClick(e) {
      if(e.currentTarget.id === "Ash") { return }
      if (this.checkToggle(e) === false ) {
        this.$refs.tvstack.startDVDVideo();
        this.$refs.buddha.showValidation = false;
      }
    },
    onBuddhaClick(e) {
      if (this.checkToggle(e) === false ) {
        this.$refs.buddha.toggleValidation();
      }
    },
    onAirPodProClick(e) {
      if(e.currentTarget.id === "Ash") { return }
      if (this.checkToggle(e) === false ) {
        console.log('air pod pro clicked')
        // this.$refs.airpodPro.toggleMusicPlayer();
      }
    },
    checkToggle(e) { //this determines if it is a drag click or a toggle click
      return !!e?.currentTarget?.dataset?.dragged
    },
    bringToFront(e){
      if (e.classList.contains('popup-box')) {
        document.querySelectorAll('.popup-box').forEach(b => b.classList.remove('top-popup'));
        e.classList.add('top-popup');
      }
      else if (e.classList.contains('icon')) {
        document.querySelectorAll('.icon').forEach(i => i.classList.remove('top-icon'));
        e.classList.add('top-icon');
      }
    },
    waitTwoSeconds() {
      return new Promise(resolve => {
        setTimeout(resolve, 2000)
      })
    },
    unlockMedia() {
      this.fireAudio?.pause()
      this.$refs.tvstack.startBurnVideo()
      this.$refs.tvstack.pauseBurnVideo()
    },
    async onCandleOverlap(event) {
      if(this.$refs.candle.candleIsBlownOut()) { return }

      const dragElement = event.target
      const hitElement = event.detail.hits[0].target
      const target = dragElement.id === 'Candle' ? hitElement : dragElement;

      if(target.id === "Ash") { return }

      await this.waitTwoSeconds()
      if (!this.confirmOverlapToIgnite(dragElement, hitElement)) return;
      this.setFire(target)

      await this.waitTwoSeconds()
      if (target.children[1].classList.contains('hide')) return;
      const flammableIcons = document.querySelectorAll('.flammable');
      flammableIcons.forEach((icon) => {
          this.setFire(icon)
      });
    },
    async setFire(target) {
      const fire = target.children[1]
      fire.classList.remove('hide')

      await this.waitTwoSeconds()
      if (target.children[1].classList.contains('hide')) return;
      this.turnToAsh(target)
    },
    turnToAsh(target){
      target.id = 'Ash'
      const ash = target.children[2]
      ash.classList.remove('hide')
      const icon = target.children[0]
      icon.classList.add('invisible');
    },
    async escalateFire(){
      await this.waitTwoSeconds()
      await this.waitTwoSeconds()
      await this.waitTwoSeconds()
      if (!document.querySelector('.fire:not(.hide)')) return
      const cabinetFires = this.$refs.cabinetFire.querySelectorAll('.fire');
      cabinetFires.forEach((fire) => {
        fire.classList.remove('hide');
        this.fireAudio?.pause();
        this.$refs.tvstack.startBurnVideo()
      });
    },
    watchForFire() {
      const checkFire = () => {
        if (document.querySelector('.fire:not(.hide)')) {
          this.fireAudio.currentTime = 0;
          this.fireAudio.volume = 0.10   
          this.fireAudio.play().catch(() => {});
          this.escalateFire()
        } else {
          this.fireAudio?.pause()
        this.$refs.tvstack.pauseBurnVideo()
        }
      }
      this.fireObserver = new MutationObserver(checkFire)
      this.fireObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      })
      checkFire()
    },
    putOutFire(event) {
      event.detail.hits.forEach((sprayedElement) => {
        sprayedElement.target.classList.add('hide');
        if (sprayedElement.target.id === 'CandleFire') {
          this.$refs.candle.reIgnightCandleFlame()
        }
      });
    },
    confirmOverlapToIgnite(dragElement, hitElement) {
      const ar = dragElement.getBoundingClientRect();
      const br = hitElement?.getBoundingClientRect?.();
      const stillOverlapping = !!(br && !(ar.right <= br.left || ar.left >= br.right || ar.bottom <= br.top || ar.top >= br.bottom));
      return stillOverlapping
    },
    // onRemoteClick(e) {
    //   if (this.checkToggle(e) === false ) {
    //     if(e?.target.children[0].id !== "Ash") {
    //       this.$refs.tvstack.showStatic = !this.$refs.tvstack.showStatic
    //     } 
    //   }
    // },
  }
}
</script>


