<template>
  <div class="app-grid">
    <div class="navbar flex flex-row items-center justify-between bg-red-800 shadow-lg text-white">
      <span
        class="h-home w-home bg-white transform rotate-45 ml-4 cursor-pointer"
        @click="goHome"
      ></span>
      <input
        class="p-1 pl-2 bg-transparent placeholder-white placeholder-opacity-75 border-none focus:bg-white focus:bg-opacity-10 focus:outline-none focus:border-none focus:ring-0"
        type="text"
        placeholder="search..."
      >
    </div>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const store = useStore()
    const timer = ref(null)

    const fetchData = () => store.dispatch('updateGames')

    fetchData()

    const goHome = () => router.push('/')

    onMounted(() => (timer.value = setInterval(fetchData, 60000)))

    onBeforeUnmount(() => clearInterval(timer))

    return {
      goHome
    }
  }
}
</script>

<style>
.app-grid {
  display: grid;
  grid-template:
      "navbar" 2rem
      "content" calc(100vh - 2rem)
      / auto;
}

.navbar {
  grid-area: navbar;
}

.content {
  grid-area: content;
}
</style>
