<template>
  <table :class="{ [bgClass]: !!bgClass, [textClass]: !!textClass }" class="table-auto text-center">
    <slot name="caption"></slot>
    <thead>
      <tr>
        <th
          class="cursor-pointer whitespace-nowrap"
          :class="{ [header.class]: !!header.class }"
          scope="col"
          v-for="header in headers"
          :key="header.field"
          @click="sort(header.field)"
        >
          <slot name="header" :header="header"></slot>
          <Chevron v-if="sortField === header.field" class="inline" :isUp="sortDirection === 'asc'"/>
        </th>
      </tr>
    </thead>
    <tbody>
      <slot name="rows" :sortedItems="sortedItems"></slot>
    </tbody>
  </table>
</template>

<script>
import { computed, toRefs } from 'vue'

import Chevron from '@/components/Chevron'

export default {
  name: 'SortableTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    sortField: {
      type: String,
      required: true
    },
    sortDirection: {
      type: String,
      required: true
    },
    bgClass: {
      type: String,
      required: true
    },
    textClass: {
      type: String,
      required: true
    }
  },
  components: {
    Chevron
  },
  setup(props, { emit }) {
    const { items, sortDirection, sortField } = toRefs(props)

    const sortedItems = computed(() => [...items.value].sort((a, b) => {
      let modifier = 1;
      if (sortDirection.value === 'desc') {
        modifier = -1;
      }

      const keyList = sortField.value.split('.')

      const valueA = keyList.reduce((obj, key) => obj[key], a)
      const valueB = keyList.reduce((obj, key) => obj[key], b)

      if (valueA < valueB){
        return -1 * modifier;
      }

      if (valueA > valueB) {
        return modifier;
      }

      return 0;
    }))

    const sort = field => {
      let dir
      let f
      if (field === sortField.value) {
        dir = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        dir = 'asc'
      }

      f = field

      emit('updateSort', { d: dir, f: f })
    }

    return {
      sort,
      sortedItems
    }
  }
}
</script>
