<template>



      <div class="tv-container relative">
          <img :src="TV" class="tv z-1 absolute" alt="TV" />
            
          <div class="tv-video-frame" v-if="showMovie">
            <iframe
              id="DVD"
              ref="dvdMovie"
              class="tv-video-iframe"
              src="https://drive.google.com/file/d/1V4kQFjRPnbErQk1jPFNMzY9XjpAUw1k3/preview"
              allow="autoplay; fullscreen"
              webkitallowfullscreen
              mozallowfullscreen
            ></iframe>
          </div>
          

          <video v-show="showBurnVideo"
            id="Burn"
            ref="burnVideo"
            loop
            playsinline
            webkit-playsinline
            preload="auto"
            class="static z-2 absolute"
          >
            <source :src="Burn" type="video/mp4" />
          </video>

        <img :src="Static" class="static z-1 absolute" alt="static" />
        <img :src="Boulder" class="boulder absolute" alt="Boulder" />
      </div>
</template>

<script>

import './tv-stack.scss'

import TV from './tv.png'
import Static from './static.gif'
import Burn from './burn.mp4'
import Boulder from './boulder.png'


export default {
  name: 'TVStack',
  emits: ['remote-click'],
  data() {
    return {
      TV, Boulder, Static, Burn,
      showMovie: false,
      showBurnVideo: false,
      unlockMedia: false
    }
  },
  mounted() {

  },
  methods: {
    startDVDVideo() {
      const isIPhone = /iPhone/i.test(navigator.userAgent)
      if (isIPhone) {
        console.log('iphone?')
        window.open(
          "https://drive.google.com/file/d/1V4kQFjRPnbErQk1jPFNMzY9XjpAUw1k3/preview",
          "_blank"
        )
        return
      }
      this.showMovie = !this.showMovie
    },
    startBurnVideo() {
        this.showBurnVideo = true;
        this.showMovie = false;
        this.$refs.burnVideo.play(); 
    },
    pauseBurnVideo(){
      this.showBurnVideo = false;
      this.$refs.burnVideo.pause(); 
    }
  }
}


</script>