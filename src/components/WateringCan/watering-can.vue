<template>
    <div id="WateringCan" class="watering-can-container"
            v-draggable="{
            snapInto: [
                { left: -400, top: 475, width: 500, height: 125 }, // Ground
            ],
            responsive: [
                {
                    query: '(max-width: 1024px)',
                    coordsBase: '.cabinet-container',
                    snapInto: [
                        { left: -150, top: 185, width: 200, height: 65 }, // // Ground
                    ]
                }
            ],
            snapDurationMs: 150,
            resetOnResize: true,
            overlapWith: ['.fire'],        // what you want to douse
            overlapOnMove: true,           // hover detection
            overlapSubject: '.water',      // only the water image counts
            minOverlapRatio: .75,
            overlapPadding: 0,
            //   debugBoxes: true
            }">
        <img :src="WateringCan" class="watering-can"/>
        <img :src="Water" class="water"/>
    </div> 
</template>

<script>

    import './watering-can.scss';

    import WateringCan from './assets/watering-can.png';
    import Water from './assets/water.gif';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'WateringCan',
        data() {
            return {
                WateringCan, Water, Fire
            }
        },
        methods: {

        }
    }
</script>





