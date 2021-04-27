<template>
  <div class="home w-full h-full flex justify-center">
    <ScorebugList/>
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
