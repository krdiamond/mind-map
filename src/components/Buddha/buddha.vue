<template>

    <div id="Buddha" class="buddha" 
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
            overlapWith: ['#AirpodPro', '#Remote'],
            debugBoxes: true
            }"
            alt="Buddha">
            <img :src="Buddha" alt="Buddha" />
        </div>
</template>

<script>

    import './buddha.scss';

    import Buddha from './buddha.png';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'Remote',
        data() {
            return {
                Buddha, Fire
            }
        },
        methods: {

        }
    }
</script>





