<template>
    <div  class="podcast absolute bg-white centered z-1 border radius-20 p-20">
      <div class="absolute top-0 right-0 p-20">PODCAST</div>
      <div @click="$emit('close')" class="absolute top-0 right-0 p-20">X</div>
    </div> 
</template>
  
  <script>
    export default {
      name: 'Podcast'
    }
  </script>
  
  <style scoped>
    .podcast {
        width: 80%;
        height: 80%;
    }
  </style>