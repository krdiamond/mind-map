<template>
  <div>
    <EgoTrap v-if="showEgoTrap" @close="toggleEgoTrap" />
    <div class="page-container p-20 relative">
      <div class="cabinet-container w-800 relative">
        <img :src="Cabinet" class=" w-800 absolute" alt="Glass Cabinet" />
        <div @click="toggleEgoTrap" class="ego text-80 absolute" alt="Ego Brain">🧠</div>
      </div>
      
    </div>
  </div>
</template>

<script>
import Cabinet from './assets/curiocabinet.png'
import EgoTrap from './components/EgoTrap.vue'

export default {
  name: 'HelloWorld',
  components: {
    EgoTrap,
  },
  data() {
    return {
      Cabinet,
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
  top: 100px;
  left: 800px;
}
.page-container {
  width: 1500px; /* Large scrollable area */
  height: 900px;
}
</style>