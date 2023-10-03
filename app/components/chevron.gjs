import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

<template>
  <FaIcon class="mx-2" @icon={{if @isUp "chevron-up" "chevron-down"}} @fixedWidth={{true}} />
</template>
