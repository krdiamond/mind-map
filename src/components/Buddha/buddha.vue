<template>
    <div id="Buddha" alt="Buddha" class="buddha icon" 
            @pointerdown="$emit('bringToFront', this.$el)"
            v-draggable="{
            coordsBase: '.cabinet-container',
            snapInto: [ // desktop defaults (>=1025px)
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
            overlapWith: ['#Candle'],
            // debugBoxes: true
            }"
            >

            <img :src="Buddha" alt="Buddha" />

            <Validation 
                v-if="showValidation"
                @close="toggleValidation"
                @pointerdown="$emit('bringToFront', this.$el)"
                @click.stop 
                v-draggable.desktop
            />

        </div>
</template>

<script>

    import './buddha.scss';

    import Validation from './Validation.vue';

    import Buddha from './buddha.png';
    import Fire from '../../assets/fire.gif';

    export default {
        name: 'Remote',
        components: { Validation },
        data() {
            return {
                Buddha, Fire,
                showValidation: false,
            }
        },
        methods: {
            toggleValidation(e) {
                if (!!e?.currentTarget?.dataset?.dragged === false ) { // check if click is a drag click or a toggle click
                    this.showValidation = !this.showValidation
                }
            },
        }
    }
</script>





