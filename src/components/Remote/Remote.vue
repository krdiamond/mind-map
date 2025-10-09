<template>
    <div id="Remote" class="remote flammable" alt="Remote"
         v-draggable="{
            // desktop defaults (>=1025px)
            coordsBase: '.cabinet-container',
            snapInto: [
                { left: 28, top: 515, width: 180, height: 57 }, // shelf 1
                { left: 28, top: 400, width: 180, height: 57 }, // shelf 2
                { left: 28, top: 290, width: 180, height: 57 }, // shelf 3
                { left: 28, top: 180, width: 180, height: 57 }, // shelf 4
                { left: 28, top: 70,  width: 180, height: 57 }, // shelf 5
            ],
            responsive: [
                {
                    query: '(max-width: 1024px)',
                    coordsBase: '.cabinet-container',
                    snapInto: [
                        { left: 13, top: 210, width: 73, height: 23 }, // shelf 1 (mobile)
                        { left: 13, top: 163, width: 73, height: 23 }, // shelf 2
                        { left: 13, top: 117, width: 73, height: 23 }, // shelf 3
                        { left: 13, top: 70, width: 73, height: 23 }, // shelf 4
                        { left: 13, top: 25,  width: 73, height: 23 }, // shelf 5
                    ]
                }
            ],
            snapDurationMs: 150,
            resetOnResize: true,
            overlapWith: ['#Candle'],
            // debugBoxes: true
        }"
        >
        <img :src="Remote" alt="Remote" />
        <img :src="Fire" alt="Fire" class="fire hide"/>
        <click-spark style="--click-spark-color: black;"></click-spark>
    </div>
</template>

<script>

    import './remote.scss';

    import './click-spark.js' 

    import Remote from './assets/remote.png';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'Remote',
        data() {
            return {
                Remote, Fire
            }
        },
        methods: {

        }
    }
</script>





