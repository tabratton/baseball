import type { TOC } from '@ember/component/template-only';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

<template>
  {{#if @loading}}
    <FaIcon
      @icon={{faSpinner}}
      @size="4x"
      @spin={{true}}
      @fixedWidth={{true}}
      ...attributes
    />
  {{else}}
    {{yield}}
  {{/if}}
</template> satisfies TOC<{
  Element: SVGElement;
  Args: { loading?: boolean };
  Blocks: { default: [] };
}>;
