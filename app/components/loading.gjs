import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

<template>
  {{#if @loading}}
    <FaIcon @icon="spinner" @size="4x" @spin={{true}} @fixedWidth={{true}} ...attributes />
  {{else}}
    {{yield}}
  {{/if}}
</template>
