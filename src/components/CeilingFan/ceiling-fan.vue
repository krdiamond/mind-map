<template>
    <div id="CeilingFan" class="ceiling-fan pointer" @click="toggleCeiingFan" alt="Ceiling Fan">
        <img :src="CeilingFan" alt="Ceiling Fan" />
    </div>
</template>

<script>

    import './ceiling-fan.scss';

    import CeilingFan from './ceiling-fan.gif';

    export default {
        name: 'Remote',
        data() {
            return {
                CeilingFan
            }
        },
        methods: {

        }
    }
</script>





