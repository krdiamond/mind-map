<template>
      <div class="tv-container relative">
        <img :src="TV" class="tv z-1 absolute" alt="TV" />
        <img :src="Static" v-if="showStatic" class="static z-2 absolute" alt="static" />
        <img :src="Boulder" class="boulder absolute" alt="Boulder" />
      </div>
</template>

<script>

import TV from '../assets/tv.png'
import Static from '../assets/static.gif'
import Boulder from '../assets/boulder.png'



export default {
  name: 'TVStack',
  emits: ['remote-click'],
  data() {
    return {
      TV, Boulder, Static,
      showStatic: true
    }
  },
  mounted() {

  },
  methods: {
    onRemoteClicked() {
      this.showStatic = !this.showStatic;
    }
  }
}


</script>