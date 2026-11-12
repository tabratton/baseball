import { modifier } from 'ember-modifier';

export default modifier<{
  Element: HTMLElement;
  Args: { Named: { top: number; left: number } };
}>(function positionElement(element, _positional, { top, left }) {
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;

  const width = element.offsetWidth;
  const tooltipEnd = width + left;
  const parent = element.parentElement;

  if (parent && tooltipEnd > parent.offsetWidth + parent.offsetLeft - 32) {
    element.style.left = `${left - width}px`;
  }
});
