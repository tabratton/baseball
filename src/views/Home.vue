<template>
  <div class="home h-home overflow-auto w-screen flex flex-col items-center">
    <div class="m-4 mb-0">
      <date-picker v-model="date" color="red" :locale="locale" is-dark>
        <template v-slot="{ inputValue, inputEvents }">
          <input
            id="date"
            class="bg-gray-800 text-white w-full p-2 appearance-none border-none rounded-l focus:outline-none"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </date-picker>
    </div>
    <ScorebugList class="w-full shadow-md overflow-auto flex flex-row flex-wrap justify-center p-2 md:p-4" :date="date"/>
  </div>
</template>

<script>
import { DatePicker } from 'v-calendar';
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

import ScorebugList from '@/components/ScorebugList.vue'

export default {
  name: 'Home',
  components: {
    DatePicker,
    ScorebugList
  },
  setup() {
    const store = useStore()
    const date = ref(store.getters.getDate)

    const locale = computed(() => store.getters.getLocale)

    watch(date, () => store.commit('updateDate', date.value))

    return {
      date,
      locale
    }
  }
}
</script>
