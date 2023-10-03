import { modifier } from 'ember-modifier';

export default modifier(function positionElement(
  element,
  positional,
  { top, left },
) {
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;

  const width = element.offsetWidth;
  const tooltipEnd = width + left;

  if (
    tooltipEnd >
    element.parentElement.offsetWidth + element.parentElement.offsetLeft - 32
  ) {
    element.style.left = `${left - width}px`;
  }
});
