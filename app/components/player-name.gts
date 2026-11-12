import type { TOC } from '@ember/component/template-only';

<template>
  <span class="text-sm font-light">
    {{yield to="first"}}
  </span>
  <span class="font-bold">
    {{yield to="last"}}
  </span>
</template> satisfies TOC<{ Blocks: { first: []; last: [] } }>;
