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
  import CamperShoes from './assets/camper-shoes.png'

  export default {
    name: 'Wishlist',
    data() {
      return {
        products: [
          {
            "image": CamperShoes,
            "link": "https://www.camperlab.com/en_US/women/shoes/tos/camperlab-tossu-A500005-001",
            "price": "$290.00"
          }
        ]
      }
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