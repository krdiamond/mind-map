<template>
  <div>
    <EgoTrap v-if="showEgoTrap" @close="toggleEgoTrap" />
    <div class="page-container p-20 relative">
      <div class="relative  w-500">
        <img :src="TV" class="tv w-400 z-1 absolute" alt="TV" />
        <img :src="Static" class="static w-400 z-1 absolute" alt="static" />
        <img :src="Boulder" class="boulder w-500 absolute" alt="Boulder" />
      </div>
      <div class="cabinet-container w-800 relative">
        <img :src="Cabinet" class=" w-800 absolute" alt="Glass Cabinet" />
        <div @click="toggleEgoTrap" class="ego text-80 absolute" alt="Ego Brain">🧠</div>
      </div>
      
    </div>
  </div>
</template>

<script>
import EgoTrap from './components/EgoTrap.vue'

import Cabinet from './assets/curiocabinet.png'
import TV from './assets/tv.png'
import Static from './assets/static.gif'
import Boulder from './assets/boulder.png'


export default {
  name: 'HelloWorld',
  components: {
    EgoTrap,
  },
  data() {
    return {
      Cabinet,
      TV,
      Boulder,
      Static,
      showEgoTrap: false,
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
  }
}
</script>

<style scoped>
.heart {
  top: 135px;
  left: 420px;
}
.ego {
  top: 525px;
  left: 400px;
}
.cabinet-container {
  top: 50px;
  left: 800px;
}
.page-container {
  width: 1500px; /* Large scrollable area */
  height: 900px;
}

.boulder{
  top: 500px;
  left: 50px;
}

.tv {
  top: 255px;
  left: 100px;
}

.static {
  width: 556px;
    height: 242px;
    z-index: 2;
    top: 281px;
    left: 39px;
    transform: perspective(2500px) rotateY(50deg) rotateZ(.5deg);
}
</style>