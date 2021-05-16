import { ref, watch } from 'vue'

export default function useSortableTable(list, field, direction) {
  const sortField = ref(field)
  const sortDirection = ref(direction)

  watch(list, () => {
    sortField.value = field
    sortDirection.value = direction
  })
  const update = ({ d, f }) => {
    sortField.value = f
    sortDirection.value = d
  }

  return {
    update,
    sortField,
    sortDirection
  }
}
