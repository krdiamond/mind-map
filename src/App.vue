<template>
  <div class="page-container relative p-20">
   <div class="tv-container relative  w-500">
        <img :src="TV" class="tv w-400 z-1 absolute" alt="TV" />
        <img :src="Static" class="static w-400 z-1 absolute" alt="static" />
        <img :src="Boulder" class="boulder w-500 absolute" alt="Boulder" />
      </div>
      <div class="cabinet-container w-800 absolute">
        <img :src="Cabinet" class=" w-800 absolute" alt="Glass Cabinet" />
        <!-- <div @click="toggleEgoTrap" class="ego text-40 absolute" alt="Ego Brain">🧠</div> -->
        <div @click="toggleValidation" class="buddha absolute" alt="Buddha">
          <img :src="Buddha" class="w-60" alt="Buddha" />
          <Validation v-if="showValidation" @close="toggleValidation" />
        </div>
      </div>
  </div>
</template>

<script>
import EgoTrap from './components/EgoTrap.vue'
import Validation from './components/Validation.vue'

import Cabinet from './assets/curiocabinet.png'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'

import Buddha from './assets/buddha.png'




export default {
  name: 'HelloWorld',
  components: {
    EgoTrap,
    Validation,
  },
  data() {
    return {
      Cabinet,
      TV,
      Boulder,
      Static,
      Buddha,
      showEgoTrap: false,
      showValidation: false,
    }
  },
  mounted() {

  },
  methods: {
    toggleEgoTrap() {
      this.showEgoTrap = !this.showEgoTrap
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.style.overflow = this.showEgoTrap ? 'hidden' : '';
    },
    toggleValidation() {
      this.showValidation = !this.showValidation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.style.overflow = this.showValidation ? 'hidden' : '';
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



.buddha {
  top: 534px;
  left: 400px;
}
.ego {
  top: 268px;
  left: 300px;
}


.page-container {
  height: 900px;
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
</style>