import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

<template>
  <FaIcon
    class="mx-2"
    @icon={{if @isUp faChevronUp faChevronDown}}
    @fixedWidth={{true}}
  />
</template>
