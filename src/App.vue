<template>
  <div>
    <ul>
      <li>after 30 seconds icons turn into soot one by one, on timer</li>
      <li>need all block assets </li>
    </ul>
  </div>
  
    <div class="h-250 sm-h-900 sm-p-20  relative flex justify-between align-bottom ">
        <Validation v-if="showValidation" @close="toggleValidation" @click.stop v-draggable class="popup-box sm-w-400"/>
        <Alchemy v-if="showAlchemy" @close="toggleAlchemy" @click.stop v-draggable class="popup-box sm-w-400"/>
        <MusicPlayer v-if="showMusicPlayer" @close="toggleMusicPlayer" @click.stop v-draggable class="popup-box sm-w-400"/>
      

         <div class="fire-alarm">Fire Alarm</div>


          <div id="WateringCan"
              class="watering-can-container"
              @overlap="putOutFire($event)"
              v-draggable="{
                snapInto: [{ left: 0, top: 700, right: 1500, bottom: 700 }],
                snapDurationMs: 150,
                resetOnResize: true,
                overlapWith: '#Paper',        // what you want to douse
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
          <img :src="Cabinet" class="h-250 sm-h-800 absolute" alt="Glass Cabinet" />



            <div v-if="showMoreFire" class="more-fire">
                <div class="fire"></div>
                <div class="fire"></div>
                <div class="fire"></div>
            </div>

            <div id="Paper" class="paper" 
                @click="onPaperClick"
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
                overlapWith: '#Candle',  // only fires when Paper hits Candle
                minOverlapRatio: 0.15,          // optional (default 0.15)
                overlapPadding: 4               // optional (default 4px) 

              }"
              alt="Paper">
              <img :src="Paper" alt="Paper" />
              <img :src="Fire" alt="Fire" class="fire"/>
          </div>

          <div id="Candle" class="candle" 
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
                overlapWith: '#Paper',          // or ['#Paper', '#SomethingElse']
                minOverlapRatio: 0.15,          // optional (default 0.15)
                overlapPadding: 4               // optional (default 4px)   
              }"
              alt="Candle">
              Candle
          </div>

          <div id="Remote" class="remote" 
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
            <img :src="Remote" alt="Remote" />
            <click-spark style="--click-spark-color: black;"></click-spark>
          </div>

          <div id="Buddha" @click="toggleValidation" class="buddha" 
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


          <div id="AirpodPro" @click="toggleMusicPlayer" class="airpod-pro" 
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

import fireSound from './assets/fire.mp3';
import Fire from './assets/fire.gif';

import WateringCan from './assets/watering-can.png';
import Water from './assets/water.gif';



import Cabinet from './assets/curiocabinet.png'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'
import Gold from './assets/gold.png'
import Remote from './assets/remote.png'
import AirpodPro from './assets/airpod-pro.png'
import Paper from './assets/paper.png'
import Ash from './assets/ash.png'


export default {
  name: 'HelloWorld',
  components: { EgoTrap, Validation, MusicPlayer, Alchemy, TVStack },
  data() {
    return {
      Cabinet, TV, Boulder, Static,
      Buddha, Gold, Remote, AirpodPro, Paper, Ash,
      WateringCan, Water,
      Fire,
      showEgoTrap: false,
      showValidation: false,
      showAlchemy: false,
      showMusicPlayer: false,
      showMoreFire: false,
      _burnTimers: new WeakMap()
    }
  },
  mounted() {
    this.fireAudio = new Audio(fireSound);
  },
  methods: {
    checkToggle(e) {
      return !!e?.currentTarget?.dataset?.dragged
    },
    toggleValidation(e) {
      console.log('clicked?')
      if (this.checkToggle(e) === false ) {
        this.showValidation = !this.showValidation
        this.showEgoTrap = false
        this.showAlchemy = false
        this.showMusicPlayer = false
      }
    },
     toggleAlchemy(e) {
      if (this.checkToggle(e) === false ) {
        this.showAlchemy = !this.showAlchemy
        this.showEgoTrap = false
        this.showValidation = false
        this.showMusicPlayer = false
      }
      
    },
     toggleMusicPlayer(e) {
      if (this.checkToggle(e) === false ) {
        this.showMusicPlayer = !this.showMusicPlayer
        this.showEgoTrap = false
        this.showValidation = false
        this.showAlchemy = false
      }
    },
    onRemoteClick(e) {
      if (this.checkToggle(e) === false) {
        this.$refs.tvstack.onRemoteClicked()
      }
    },
    toggleEgoTrap() {
      this.showEgoTrap = !this.showEgoTrap
      this.showAlchemy = false
      this.showValidation = false
      this.showMusicPlayer = false
    },
      onCandleOverlap({ detail }) {
      const { element, hits = [] } = detail;
      const target = element?.id === 'Candle' ? hits[0]?.target : element;
      if (!target) return;

      // setup/cancel timers for this element
      const timers = this._burnTimers.get(target) || {};
      clearTimeout(timers.ignite);
      clearTimeout(timers.escalate1);
      this._burnTimers.set(target, timers);

      // 1) ignite after 1s
      timers.ignite = setTimeout(() => {
        target.dataset.burning = 'true';          // mark as burning

        // show the fire image (prefer a .fire child)
        const fireImg = target.querySelector('.fire') || target.children[0];
        if (fireImg) fireImg.style.display = 'block';

        // play sound
        if (this.fireAudio) {
          this.fireAudio.currentTime = 0;
          this.fireAudio.play().catch(() => {});
        }

        // 2) escalate after 5s IF still burning
        timers.escalate1 = setTimeout(() => {
          if (target.dataset.burning === 'true') {
            this.onFireEscalate(target);
          }
        }, 5000);

      }, 1000);
    },
    putOutFire({ detail }) {
      for (const h of detail.hits || []) {
        const el = h.target;
        // hide fire
        const fireImg = el.querySelector('.fire');
        if (fireImg) fireImg.style.display = 'none';
        // stop audio
        if (this.fireAudio) {
          this.fireAudio.pause();
          this.fireAudio.currentTime = 0;
        }
        // clear timers & mark not burning
        const timers = this._burnTimers.get(el);
        if (timers) {
          clearTimeout(timers.ignite);
          clearTimeout(timers.escalate1);
          this._burnTimers.delete(el);
        }
        delete el.dataset.burning;
      }
    },
    onFireEscalate(el) {
      console.log('🔥 Escalation triggered for:', el.id);
      console.log(el.children[0])

      //  const fireImg = el.children[0];
      //   if (!fireImg) return;

      //   // swap to the big/inferno graphic
      //   fireImg = this.Ash;
      // // do whatever: show modal, damage score, spread fire, etc.
      // // example: el.classList.add('engulfed');


       // make a replacement node
      const ashes = document.createElement('src');
      ashes.id = el.id;                       // preserve id if you want
      ashes.className = el.className + ' ashes';
      const img = new Image();
      img.alt = 'Ashes';
      img.src = this.Ash;                // imported asset path
      ashes.appendChild(img);

      // swap in one step
      el.children[0].replaceWith(ashes);

    

    },
  }
}
</script>