import { format } from 'date-fns'
import { enUS, es } from 'date-fns/locale'

import { computed } from 'vue'
import { useStore } from 'vuex'

const locales = { 'en-US': enUS, es }

export default function useDateFormat() {
  const store = useStore()

  const dateFormat = computed(() => (date, formatStr = 'PP') => {
    return format(date, formatStr, { locale: locales[store.getters.getLocale] })
  })

  return {
    dateFormat
  }
}
