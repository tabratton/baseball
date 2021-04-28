<template>
  <div class="home h-full w-full flex flex-row items-center">
    <ScorebugList class="w-full shadow-md overflow-auto flex flex-row flex-wrap justify-center p-12 m-12"/>
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
