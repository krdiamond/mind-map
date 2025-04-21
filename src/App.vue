<script setup>
import Wishlist from './components/Wishlist.vue'
import Cabinet from './assets/curiocabinet.png'
</script>

<template>
  <div class="h-100vh">
    <div class="w-800 cabinet">
      <img :src="Cabinet" class="w-fill" alt="Glass Cabinet" />
      <Wishlist />
    </div>
      
    
  </div>
</template>

<style scoped>
.cabinet {
  left: 1000px;
  position: relative;
  top: 100px;
}
</style>

