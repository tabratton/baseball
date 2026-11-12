import type { TOC } from '@ember/component/template-only';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

<template>
  <FaIcon
    class="mx-2"
    @icon={{if @isUp faChevronUp faChevronDown}}
    @fixedWidth={{true}}
    ...attributes
  />
</template> satisfies TOC<{ Element: SVGElement; Args: { isUp?: boolean } }>;
