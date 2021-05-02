<template>
  <div class="home h-home overflow-auto w-screen flex flex-row items-start lg:items-center">
    <ScorebugList class="shadow-md overflow-auto flex flex-row flex-wrap md:justify-center p-2 m-2 md:p-6 md:m-6"/>
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
