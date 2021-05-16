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
        <path class="stroke-black fill-white" d="M 206.503 166.512 L 197.953 175.012 M 189.848 157.915 L 206.848 157.915 M 190.348 158.399 L 190.348 166.899 M 206.36 158.399 L 206.36 166.899 M 190.203 166.512 L 198.633 175.034" style="paint-order: fill;"></path>
        <polygon class="stroke-white fill-white" points="198.283 173.812 190.966 166.441 190.966 158.512 205.766 158.512 205.832 166.458"></polygon>
      </svg>
      <div class="flex flex-row">
        <button
          class="hover:bg-white hover:bg-opacity-10 p-2 leading-4 focus:outline-none mr-2"
          @click="goToLeagueLeaders"
        >
          {{ t('navbar.leagueLeaders') }}
        </button>
        <input
          class="p-1 pl-2 bg-transparent placeholder-white placeholder-opacity-75 border-none focus:bg-white focus:bg-opacity-10 focus:outline-none focus:border-none focus:ring-0"
          type="text"
          :placeholder="t('navbar.search')"
        >
        <select
          v-model="selectedLocale"
          class="bg-transparent border-none placeholder-white placeholder-opacity-75 focus:bg-white focus:bg-opacity-10 focus:outline-none focus:border-none focus:ring-0"
        >
          <option value="enUS">English (US)</option>
          <option value="es">Spanish</option>
        </select>
      </div>
    </div>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t, locale } = useI18n({ useScope: 'global' })
    const selectedLocale = ref(store.getters.getLocale)

    const goHome = () => router.push('/')
    const goToLeagueLeaders = () => router.push('/league-leaders')

    watch(selectedLocale, () => {
      store.commit('updateLocale', selectedLocale.value)
      locale.value = selectedLocale.value
    })

    return {
      goHome,
      goToLeagueLeaders,
      selectedLocale,
      t
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

select option {
  @apply bg-red-800;
}
</style>
