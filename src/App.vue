<template>  
<ul>
  <li>finsih candle and wick placement</li>
  <li> check all placement on mobile</li>
  <li> make sure remote does not work if it is ash</li>
  <li> is vue the best to use for popups? Seems like unnecesarry data states</li>
</ul>
    <div class="h-250 sm-h-900 sm-p-20  relative flex justify-between align-bottom ">
        <Validation v-if="showValidation" @close="toggleValidation" @click.stop v-draggable class="popup-box sm-w-400"/>
        <Alchemy v-if="showAlchemy" @close="toggleAlchemy" @click.stop v-draggable class="popup-box sm-w-400"/>
        <MusicPlayer v-show="showMusicPlayer" @close="toggleMusicPlayer" @click.stop v-draggable class="popup-box sm-w-400"/>
      
        <div class="fire-alarm">Fire Alarm</div>

        <div id="WateringCan"
              class="watering-can-container"
              @overlap="putOutFire($event)"
              v-draggable="{
                snapInto: [{ left: 0, top: 620, right: 1500, bottom: 620 }],
                snapDurationMs: 150,
                resetOnResize: true,
                overlapWith: ['#AirpodPro', '#Remote', '#CabinetFire'],        // what you want to douse
                overlapOnMove: true,          // hover detection
                overlapSubject: '.water',     // only the water image counts
                minOverlapRatio: 0.05,
                overlapPadding: 0
              }">
            <img :src="WateringCan" class="watering-can"/>
            <img :src="Water" class="water"/>
        </div>

        <TVStack ref="tvstack"/> 
        
        <div class="cabinet-container h-250 sm-h-800 sm-mr-60 relative">
          
          <div id="CabinetStack">
              <img :src="Cabinet" class="h-250 sm-h-800 absolute" alt="Glass Cabinet" />
              <div id="CabinetFire" ref="cabinetFire" class="cabinet-fire ">
                  <img :src="Fire" alt="Fire" class="fire1"/>
                  <img :src="Fire" alt="Fire" class="fire2"/>
                  <img :src="Fire" alt="Fire" class="fire3"/>
                  <img :src="Fire" alt="Fire" class="fire4"/>
              </div>
          </div>
          
          <!-- need to work on shelf placement for the candle, also need flame gif -->
          <div id="Candle" class="candle-wrapper"  
                @click="onCandleClick" 
                @overlap="onCandleOverlap($event)"
                v-draggable="{
                snapInto: [
                    { left: 20, top: 700, right: 290, bottom: 720 }, // row 1
                    { left: 20, top: 538, right: 290, bottom: 620 }, // row 2
                    { left: 20, top: 410, right: 290, bottom: 420 }, // row 3
                    { left: 20, top: 260, right: 290, bottom: 320 }, // row 4
                    { left: 20, top: 114, right: 290, bottom: 120 }, // row 5
                  ],
                snapDurationMs: 150,    
                resetOnResize: true,
                overlapWith: ['#AirpodPro', '#Remote'],    // or ['#Paper', '#SomethingElse'] 
              }"
              alt="Candle">
                <img :src="Candle" class="candle"/>
                <!-- <img :src="Water" class="water"/> -->
          </div>

          <div id="Remote" class="remote flammable" 
                @click="onRemoteClick(e)" 
                @overlap="onCandleOverlap($event)" 
                v-draggable="{
                snapInto: [
                    { left: 20, top: 700, right: 290, bottom: 720 }, // row 1
                    { left: 20, top: 538, right: 290, bottom: 620 }, // row 2
                    { left: 20, top: 410, right: 290, bottom: 420 }, // row 3
                    { left: 20, top: 260, right: 290, bottom: 320 }, // row 4
                    { left: 20, top: 114, right: 290, bottom: 120 }, // row 5
                  ],
                snapDurationMs: 150,    
                resetOnResize: true,
                overlapWith: '#Candle' 
              }"
              alt="Remote">
            <img :src="Remote" alt="Remote" />
            <img :src="Fire" alt="Fire" class="fire"/>
            <click-spark style="--click-spark-color: black;"></click-spark>
          </div>

          <div id="Buddha" class="buddha" 
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
          </div>


          <div id="AirpodPro" class="airpod-pro flammable" 
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
              <img :src="Fire" alt="Fire" class="fire"/>
          </div>

          <div id="Gold" @click="toggleAlchemy" class="gold" 
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




import fireSound from './assets/fire.mp3';
import Fire from './assets/fire.gif';

import WateringCan from './assets/watering-can.png';
import Water from './assets/water.gif';



import Cabinet from './assets/curiocabinet.png'
import CeilingFan from './assets/ceiling-fan.gif'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'
import Candle from './assets/candle.png'
import Heart from './assets/heart.png'
import Gold from './assets/gold.png'
import Remote from './assets/remote.png'
import AirpodPro from './assets/airpod-pro.png'
import Paper from './assets/paper.png'
import Ash from './assets/ash.png'


export default {
  name: 'HelloWorld',
  components: { EgoTrap, Validation, MusicPlayer, Alchemy, TVStack, Gratitude, Zine_CeilingFan },
  data() {
    return {
      TV, Boulder, Static,
      Cabinet, Buddha, Gold, Remote, AirpodPro, Paper, Ash, Candle,
      WateringCan, Water,
      Fire,
      CeilingFan,
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false,
      showGratitude: false,
      showCeilingFan: false,
    }
  },
  mounted() {
    this.fireAudio = new Audio(fireSound);
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
      if (this.checkToggle(e) === false) {
        if(e?.target.children[0].id !== "Ash") {
          // this.$refs.tvstack.onRemoteClicked()    
        }
      }
    },
    onCandleOverlap({ detail }) {
    const { element, hits = [] } = detail;
    if ([detail.element, detail.hits?.[0]?.target]
        .some(el => el && (el.id?.toLowerCase() === 'ash' || el.querySelector?.('[id="ash" i]')))) {
      return;
    }
    const target = element?.id === 'Candle' ? hits[0]?.target : element;
    if (!target) return;

    // clear any existing timers attached to this element
    clearTimeout(target._igniteTimeout);
    clearTimeout(target._escalateTimeout);
    clearTimeout(target._burnItDown);

    const candle = document.getElementById('Candle');

    // start a 1s fuse
    target._igniteTimeout = setTimeout(() => {
      // ✨ ultra-small overlap check at the moment of ignition
      const ar = target.getBoundingClientRect();
      const br = candle?.getBoundingClientRect?.();
      const stillOverlapping = !!(br && !(ar.right <= br.left || ar.left >= br.right || ar.bottom <= br.top || ar.top >= br.bottom));
      if (!stillOverlapping) return; // moved away before 1s → do nothing

      // ignite
      target.dataset.burning = 'true';
      const fireIcon = target.querySelector('.fire');
      if (fireIcon) fireIcon.style.display = 'block';

      if (this.fireAudio) {
        this.fireAudio.currentTime = 0;
        this.fireAudio.play().catch(() => {});
      }

      // escalate in 3s only if still burning
      target._escalateTimeout = setTimeout(() => {
        if (target.dataset.burning === 'true') {
          this.onFireEscalate(target);
        }
          // escalate in 3s only if still burning
          target._burnItDown = setTimeout(() => {
            if (target.dataset.burning === 'true') {
              this.burnItDown();
            }
          }, 3000);
      }, 3000);
    }, 1000);
  },
    putOutFire({ detail }) {
      detail.hits.forEach((sprayedElement) => {
          // hide fire
          const fireIcon = sprayedElement.target.querySelector('.fire') || null;
          const cabinetFire = sprayedElement.target.id === "CabinetFire" ?  sprayedElement.target : null ;
          if (fireIcon) fireIcon.style.display = 'none';
          if (cabinetFire) cabinetFire.style.display = 'none';
          // stop sound
          this.fireAudio?.pause?.(); if (this.fireAudio) this.fireAudio.currentTime = 0;
          // stop video
          this.$refs.tvstack.pauseBurnVideo()
          // clear timers + mark not burning
          clearTimeout(sprayedElement.target._igniteTimeout);
          clearTimeout(sprayedElement.target._escalateTimeout);
          clearTimeout(sprayedElement.target._burnItDown);
          delete sprayedElement.target.dataset.burning;
      });
    },
    onFireEscalate(el) {
      const ash = document.createElement('img');
      ash.id = 'Ash';   
      ash.src = this.Ash; 
      ash.alt = 'Ash';
      el.children[0].replaceWith(ash);
    },
    burnItDown() {
      this.$refs.cabinetFire.style.display = 'block'
      const fireIcons = document.querySelectorAll('.fire');
      fireIcons.forEach((fire) => {
        fire.parentElement.dataset.burning = 'true';
        fire.style.display = 'block'
      });

      setTimeout(() => {
        const flammableIcons = document.querySelectorAll('.flammable');
        flammableIcons.forEach((icon) => {
          if (icon.dataset.burning === 'true') {
            this.onFireEscalate(icon)
          }
        });
      }, 3000);

      setTimeout(() => {
          this.$refs.tvstack.startBurnVideo()
      }, 500);
    }
  }
}
</script>