import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export default function useTranslationsInSetup() {
  const store = useStore()

  const locale = computed(() => store.getters.getLocale)
  const watchFunc = callBack => {
    callBack()
    watch(locale, () => callBack())
  }

  return {
    watchFunc
  }
}
