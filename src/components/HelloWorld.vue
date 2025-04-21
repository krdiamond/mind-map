<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="updateMessage">Click Me</button>
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
h1 {
  color: #42b983;
}
</style>