import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'

export default function useScorebugListData(date, interval = 20000) {
  const store = useStore()
  const timer = ref(null)
  const fetchData = computed(() => {
    const formatted = format(date.value, 'yyyy-MM-dd')
    return () => store.dispatch('fetchGamesForDay', formatted)
  })
  fetchData.value()

  watch(date, (newDate, prevDate) => {
    const oldFormat = format(prevDate, 'yyyy-MM-dd')
    const newFormat = format(newDate, 'yyyy-MM-dd')
    if (oldFormat !== newFormat) {
      fetchData.value()
      clearInterval(timer.value)
      timer.value = setInterval(fetchData.value, interval)
    }
  })
  onMounted(() => (timer.value = setInterval(fetchData.value, interval)))
  onBeforeUnmount(() => clearInterval(timer.value))
}
