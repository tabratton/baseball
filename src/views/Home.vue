<template>
  <div class="home h-home overflow-auto w-screen flex flex-row items-start lg:items-center">
    <ScorebugList class="w-full shadow-md overflow-auto flex flex-row flex-wrap justify-center p-6 m-6"/>
  </div>
</template>

<script>
import ScorebugList from '@/components/ScorebugList.vue'

export default {
  name: 'Home',
  components: {
    ScorebugList
  }
}
</script>
