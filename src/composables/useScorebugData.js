import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default function useScorebugData(interval = 20000) {
  const store = useStore()
  const timer = ref(null)
  const fetchData = () => store.dispatch('updateGames')
  fetchData()
  onMounted(() => (timer.value = setInterval(fetchData, interval)))
  onBeforeUnmount(() => clearInterval(timer.value))
}
