<template>
  <div
    id="DVD"
    class="dvd icon flammable"
    ref="dvd"
    @pointerdown="$emit('bringToFront', $refs.dvd)"
    v-draggable="{
      coordsBase: '.cabinet-container',
      snapInto: [
        { left: 28, top: 490, width: 180, height: 80 },
        { left: 28, top: 370, width: 180, height: 80 },
        { left: 28, top: 265, width: 180, height: 80 },
        { left: 28, top: 153, width: 180, height: 80 },
        { left: 28, top: 44, width: 180, height: 80 },
      ],
      responsive: [
        {
          query: '(max-width: 1024px)',
          coordsBase: '.cabinet-container',
          snapInto: [
            { left: 13, top: 195, width: 73, height: 40 },
            { left: 13, top: 148, width: 73, height: 40 },
            { left: 13, top: 103, width: 73, height: 40 },
            { left: 13, top: 58, width: 73, height: 40 },
            { left: 13, top: 12, width: 73, height: 40 },
          ]
        }
      ],
      snapDurationMs: 150,
      resetOnResize: true,
      overlapWith: ['#Candle'],
    //   debugBoxes: true
    }"
    alt="dvd Pro"
  >
    <div class="product-box">
        <div class="product-box__inner">
            <div class="box box--front" :style="{ backgroundImage: `url(${DVDFront})` }"></div>
            <div class="box box--left" :style="{ backgroundImage: `url(${DVDLeft})` }"></div>
            <div class="box box--back" :style="{ backgroundImage: `url(${DVDBack})` }"></div>
            <div class="box box--right" :style="{ backgroundImage: `url(${DVDRight})` }"></div>
        </div>
    </div>

    <img :src="Fire" alt="Fire" class="fire hide" />
  </div>
</template>

<script>
import './dvd.scss'

import DVDFront from './assets/dvd-front.jpg'
import DVDBack from './assets/dvd-back.jpg'
import DVDLeft from './assets/dvd-left.jpg'
import DVDRight from './assets/dvd-right.jpg'
import Fire from '../../assets/fire.gif'

export default {
  name: 'DVD',
  data() {
    return {
      DVDFront,
      DVDBack,
      DVDLeft,
      DVDRight,
      Fire,
    }
  },
  methods: {

  },
}
</script>