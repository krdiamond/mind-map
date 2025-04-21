<script setup>
import Heart from '../assets/heart.png'
</script>


<template>
  <div>
    <img :src="Heart" class="heart w-30 absolute" alt="Heart" />
    <!-- <button @click="updateMessage">Click Me</button> -->
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      message: 'Hello from Options API!'
    }
  },
  methods: {
    updateMessage() {
      this.message = 'You clicked the button!'
    }
  }
}
</script>

<style scoped>
.heart {
  top: 135px;
  left: 420px;
}
</style>