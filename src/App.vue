<template>
  <!-- TODO: Create top navbar -->
  <router-view></router-view>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const timer = ref(null)

    const fetchData = () => store.dispatch('updateGames')

    fetchData()

    onMounted(() => (timer.value = setInterval(fetchData, 60000)))

    onBeforeUnmount(() => clearInterval(timer))
  }
}
</script>
