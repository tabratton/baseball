<template>
  <svg
    :class="{ 'rotate-180 translate-y-1': !isUp }"
    class="h-6 w-6 transform -translate-y-1"
    viewBox="0 0 24 24"
  >
    <path fill="currentColor" d="M7,15L12,10L17,15H7Z"/>
  </svg>
</template>

<script>
export default {
  name: 'DynamicChevron',
  props: {
    isUp: {
      type: Boolean
    }
  }
}
</script>
