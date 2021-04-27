<template>
  <div class="home h-full flex flex-row flex-wrap justify-center items-center">
    <ScorebugList class="flex flex-wrap justify-center"/>
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
