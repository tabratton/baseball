<template>
  <div class="app-grid">
    <div class="navbar flex flex-row items-center justify-between bg-red-800 shadow-lg text-white">
      <svg
        class="ml-4 cursor-pointer"
        viewBox="189.848 157.915 17 17.119"
        width="17"
        height="17.119"
        @click="goHome"
      >
        <path d="M 206.503 166.512 L 197.953 175.012 M 189.848 157.915 L 206.848 157.915 M 190.348 158.399 L 190.348 166.899 M 206.36 158.399 L 206.36 166.899 M 190.203 166.512 L 198.633 175.034" style="paint-order: fill; fill: rgb(255, 255, 255); stroke: rgb(0, 0, 0);"></path>
        <polygon style="stroke: rgb(255, 255, 255); fill: rgb(255, 255, 255);" points="198.283 173.812 190.966 166.441 190.966 158.512 205.766 158.512 205.832 166.458"></polygon>
      </svg>
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
