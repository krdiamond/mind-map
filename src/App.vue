<template>
  <div class="h-100vh p-20">
    <Wishlist v-show="showWishlist" @close="toggleWishlist" />
    <Podcast v-show="showPodcast" @close="togglePodcast" />
    <div class="w-800 cabinet-container absolute">
      <img :src="Cabinet" class="w-full" alt="Glass Cabinet" />
      <img :src="Heart" @click="toggleWishlist" class="heart w-30 absolute" alt="Heart" />
      <img :src="Headphones" @click="togglePodcast" class="headphones w-100 absolute" alt="Apple airpod pro" />
    </div>
  </div>
</template>

<script>
import Cabinet from './assets/curiocabinet.png'

import Heart from './assets/heart.png'
import Wishlist from './components/Wishlist/Wishlist.vue'

import Headphones from './assets/headphones.png'
import Podcast from './components/Podcast.vue'

export default {
  name: 'HelloWorld',
  components: {
    Wishlist,
    Podcast,
  },
  data() {
    return {
      Cabinet,
      Heart,
      Headphones,
      showWishlist: false,
      showPodcast: false
    }
  },
  methods: {
    toggleWishlist() {
      this.showWishlist = !this.showWishlist
    },
    togglePodcast() {
      this.showPodcast = !this.showPodcast
    }
  }
}
</script>

<style scoped>
.cabinet-container {
  left: 800px;
}
.heart {
  top: 135px;
  left: 420px;
}
.headphones {
  top: 573px;
  left: 386px;
}
</style>