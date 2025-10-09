<template>
    <div class="fire-detector-wrapper">
        <img :src="FireDetector" class="w-40 sm-w-70"/>
        <div class="beacon"></div>
    </div>
</template>

<script>

    import './fire-detector.scss';
    
    import FireDetector from './fire-detector.png';

    export default {
        name: 'FireDetector',
        data() {
            return {
                FireDetector
            }
        }
    }
</script>





