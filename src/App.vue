<template>
  <div class="app-grid">
    <div class="navbar flex flex-row items-center justify-between bg-red-800 shadow-lg text-gray-100">
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
        <!-- TODO: Do something about search -->
        <input
          class="p-1 pl-2 w-24 bg-transparent placeholder-white placeholder-opacity-75 border-none focus:bg-white focus:bg-opacity-10 focus:outline-none focus:border-none focus:ring-0 hidden"
          type="text"
          :placeholder="t('navbar.search')"
        >
        <button
            class="hover:bg-white hover:bg-opacity-10 p-2 leading-4 focus:outline-none mr-2"
            @click="goToStandings"
        >
          {{ t('navbar.standings') }}
        </button>
        <button
          class="hover:bg-white hover:bg-opacity-10 p-2 leading-4 focus:outline-none mr-2"
          @click="goToLeagueLeaders"
        >
          {{ t('navbar.leagueLeaders') }}
        </button>
        <multiselect
          class="w-32"
          id="localeSelect"
          v-model="selectedLocale"
          :valueProp="'value'"
          :trackBy="label"
          :maxHeight="320"
          :options="options"
          :object="true"
          :mode="'single'"
          :caret="true"
          :canDeselect="false"
          :searchable="true"
        >
          <template v-slot:singlelabel="{ value }">
            <span class="multiselect-single-label">{{ value.label }}</span>
          </template>
          <template v-slot:option="{ option }">
            {{ option.label }}
          </template>
        </multiselect>
      </div>
    </div>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    Multiselect
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t, locale } = useI18n({ useScope: 'global' })

    const defaultLocale = store.getters.getLocale || 'en-US'
    const selectedLocale = ref({ label: t(`locales.${defaultLocale}`), value: defaultLocale })

    const goHome = () => router.push('/')
    const goToLeagueLeaders = () => router.push('/league-leaders')
    const goToStandings = () => router.push('/standings')

    const updateLocale = l => {
      store.commit('updateLocale', l.value)
      locale.value = l.value
    }

    watch(selectedLocale, () => updateLocale(selectedLocale.value))

    updateLocale(selectedLocale.value)

    const options = computed(() => {
      return [
        { label: 'English', value: 'en-US' },
        { label: 'Spanish', value: 'es'}
      ]
    })

    return {
      goHome,
      goToLeagueLeaders,
      goToStandings,
      selectedLocale,
      t,
      options
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
