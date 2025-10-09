<template>


<div id="AirpodPro" class="airpod-pro flammable" 
        v-draggable="{
        // desktop defaults (>=1025px)
        coordsBase: '.cabinet-container',
        snapInto: [
            { left: 28, top: 510, width: 180, height: 62 }, // shelf 1
            { left: 28, top: 400, width: 180, height: 62 }, // shelf 2
            { left: 28, top: 300, width: 180, height: 62 }, // shelf 3
            { left: 28, top: 190, width: 180, height: 62 }, // shelf 4
            { left: 28, top: 80,  width: 180, height: 62 }, // shelf 5
        ],
        responsive: [
            {
                query: '(max-width: 1024px)',
                coordsBase: '.cabinet-container',
                snapInto: [
                    { left: 13, top: 220, width: 73, height: 29 }, // shelf 1 (mobile)
                    { left: 13, top: 170, width: 73, height: 29 }, // shelf 2
                    { left: 13, top: 125, width: 73, height: 29 }, // shelf 3
                    { left: 13, top: 80, width: 73, height: 29 }, // shelf 4
                    { left: 13, top: 35,  width: 73, height: 29 }, // shelf 5
                ]
            }
        ],
        snapDurationMs: 150,
        resetOnResize: true,
        // debugBoxes: true
        }"
    alt="Airpod Pro">
    <img :src="AirpodPro" alt="Airpod Pro" />
    <img :src="Fire" alt="Fire" class="fire hide"/>
</div> 

        
</template>

<script>

    import './airpod-pro.scss';

    import AirpodPro from './airpod-pro.png';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'AirpodPro',
        data() {
            return {
                AirpodPro, Fire
            }
        },
        methods: {

        }
    }
</script>





