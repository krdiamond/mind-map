<template>
  <div  class="wishlist absolute bg-white centered z-1 border radius-20 p-20">
    <div @click="$emit('close')" class="absolute top-0 right-0 p-20 pointer">X</div>

    <div class="flex">
      <div v-for="(product, index) in products" :key="index" class="h-200 w-200">
            <a :href="product.link" target="_blank">
              <img :src="product.image" alt="Product Image" class="w-full"/>
              <p class="center">{{ product.price }}</p>
            </a>
          </div>
    </div>
    
  </div>
</template>



<script>
  export default {
    name: 'Wishlist',
    data() {
      return {
        products: []
      }
    },
    created() {
      fetch('/mind-map/data/wishlist-products.json')
        .then(res => res.json())
        .then(data => {
          this.products = data
          console.log(this.products)
        })
    },
    methods: {
      
    }
  }
</script>

<style scoped>
  .wishlist {
      width: 80%;
      height: 80%;
  }
</style>