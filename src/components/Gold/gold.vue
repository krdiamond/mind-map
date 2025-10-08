<template>
    <div id="Gold" class="gold" 
        v-draggable="{
        // desktop defaults (>=1025px)
        coordsBase: '.cabinet-container',
        snapInto: [
            { left: 28, top: 525, width: 180, height: 46 }, // shelf 1
            { left: 28, top: 410, width: 180, height: 46 }, // shelf 2
            { left: 28, top: 300, width: 180, height: 46 }, // shelf 3
            { left: 28, top: 190, width: 180, height: 46 }, // shelf 4
            { left: 28, top: 82,  width: 180, height: 46 }, // shelf 5
        ],
        responsive: [
            {
                query: '(max-width: 1024px)',
                coordsBase: '.cabinet-container',
                snapInto: [
                    { left: 13, top: 215, width: 73, height: 25 }, // shelf 1 (mobile)
                    { left: 13, top: 168, width: 73, height: 25 }, // shelf 2
                    { left: 13, top: 122, width: 73, height: 25 }, // shelf 3
                    { left: 13, top: 76, width: 73, height: 25 }, // shelf 4
                    { left: 13, top: 30,  width: 73, height: 25 }, // shelf 5
                ]
            }
        ],
        snapDurationMs: 150,
        resetOnResize: true,
        // debugBoxes: true
        }"
        alt="Gold">
        <img :src="Gold" alt="Gold" />
    </div> 

</template>

<script>

    import './gold.scss';

    import Gold from './gold.png';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'Remote',
        data() {
            return {
                Gold, Fire
            }
        },
        methods: {

        }
    }
</script>





