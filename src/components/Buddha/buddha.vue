<template>

    <div id="Buddha" class="buddha" 
            v-draggable="{
            // desktop defaults (>=1025px)
            coordsBase: '.cabinet-container',
            snapInto: [
                { left: 28, top: 495, width: 180, height: 80 }, // shelf 1
                { left: 28, top: 377, width: 180, height: 80 }, // shelf 2
                { left: 28, top: 269, width: 180, height: 80 }, // shelf 3
                { left: 28, top: 158, width: 180, height: 80 }, // shelf 4
                { left: 28, top: 50,  width: 180, height: 80 }, // shelf 5
            ],
            responsive: [
                {
                    query: '(max-width: 1024px)',
                    coordsBase: '.cabinet-container',
                    snapInto: [
                        { left: 13, top: 200, width: 73, height: 42 }, // shelf 1 (mobile)
                        { left: 13, top: 152, width: 73, height: 42 }, // shelf 2
                        { left: 13, top: 105, width: 73, height: 42 }, // shelf 3
                        { left: 13, top: 60, width: 73, height: 42 }, // shelf 4
                        { left: 13, top: 14,  width: 73, height: 42 }, // shelf 5
                    ]
                }
            ],
            snapDurationMs: 150,
            resetOnResize: true,
            // debugBoxes: true
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





