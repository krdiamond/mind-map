<template>
    <div id="Candle" class="candle-wrapper"
        @overlap="$emit('overlap', $event)"
        v-draggable="{
            // desktop defaults (>=1025px)
            coordsBase: '.cabinet-container',
            snapInto: [
                { left: 28, top: 515, width: 180, height: 30 }, // shelf 1
                { left: 28, top: 400, width: 180, height: 30 }, // shelf 2
                { left: 28, top: 290, width: 180, height: 30 }, // shelf 3
                { left: 28, top: 180, width: 180, height: 30 }, // shelf 4
                { left: 28, top: 70,  width: 180, height: 30 }, // shelf 5
            ],
            responsive: [
                {
                    query: '(max-width: 1024px)',
                    coordsBase: '.cabinet-container',
                    snapInto: [
                        { left: 13, top: 210, width: 73, height: 26 }, // shelf 1 (mobile)
                        { left: 13, top: 163, width: 73, height: 26 }, // shelf 2
                        { left: 13, top: 117, width: 73, height: 26 }, // shelf 3
                        { left: 13, top: 70, width: 73, height: 26 }, // shelf 4
                        { left: 13, top: 25,  width: 73, height: 26 }, // shelf 5
                    ]
                }
            ],
            snapDurationMs: 150,
            resetOnResize: true,
            overlapWith: ['#AirpodPro', '#Remote'],
            // debugBoxes: true
        }"
        >
        <img :src="Candle" class="candle w-20 sm-w-40"/>
        <img id="CandleFire" :src="Fire" ref="candleFire" class="candle-fire fire w-10 sm-w-20"/>
    </div>
</template>

<script>

    import './candle.scss';
    import Candle from './assets/candle.png'
    import Fire from '../../assets/fire.gif';


    export default {
    name: 'Candle',
    data() {
        return {
            Candle, Fire
        }
    },
    methods: {
        candleIsBlownOut() {
            return this.$refs.candleFire.classList.contains('hide')
        },
        reIgnightCandleFlame() {
            setTimeout(() => {
                    this.$refs.candleFire.classList.remove('hide')
                }, 3000);
            },
        }
    }
</script>





