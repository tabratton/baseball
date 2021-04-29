<template>
  <div class="flex flex-row items-start justify-center">
    <div class="m-2">
      <BattersTable :side="'away'" :game="game"/>
      <div class="inline-block">
        <PitchersTable :side="'away'" :game="game"/>
      </div>
    </div>
    <div class="m-2">
      <BattersTable :side="'home'" :game="game"/>
      <div class="inline-block">
        <PitchersTable :side="'home'" :game="game"/>
      </div>
    </div>
  </div>
</template>

<script>
import BattersTable from '@/components/BattersTable'
import PitchersTable from '@/components/PitchersTable'

export default {
  name: 'Players',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  components: {
    BattersTable,
    PitchersTable
  }
}
</script>

<style scoped>
.players-table {
  @apply border-collapse border border-white border-opacity-50;
}

.players-table th,
.players-table td {
  @apply pr-3 pl-3;
}

.players-table td {
  @apply border-l border-r border-white border-opacity-60;
}

.players-table th {
  @apply border-b border-white border-opacity-60;
}
</style>
