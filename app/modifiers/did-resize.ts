import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import type { ArgsFor, PositionalArgs } from 'ember-modifier';

type ResizeHandler = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver,
) => void;

interface DidResizeSignature {
  Element: Element;
  Args: {
    Positional: [handler: ResizeHandler, options?: ResizeObserverOptions];
  };
}

export default class DidResizeModifier extends Modifier<DidResizeSignature> {
  // Public API
  element?: Element;
  handler?: ResizeHandler;
  options: ResizeObserverOptions = {};

  // Private API
  static observer: ResizeObserver | null = null;
  static handlers: WeakMap<Element, ResizeHandler> | null = null;

  constructor(owner: Owner, args: ArgsFor<DidResizeSignature>) {
    super(owner, args);

    if (!('ResizeObserver' in window)) {
      return;
    }

    if (!DidResizeModifier.observer) {
      DidResizeModifier.handlers = new WeakMap();
      DidResizeModifier.observer = new ResizeObserver((entries, observer) => {
        window.requestAnimationFrame(() => {
          for (const entry of entries) {
            const handler = DidResizeModifier.handlers?.get(entry.target);
            if (handler) handler(entry, observer);
          }
        });
      });
    }

    registerDestructor(this, unobserve);
  }

  modify(
    element: Element,
    positional: PositionalArgs<DidResizeSignature> /*, named*/,
  ) {
    unobserve(this);

    this.element = element;

    const [handler, options] = positional;

    // Save arguments for when we need them
    this.handler = handler;
    this.options = options || this.options;

    this.observe();
  }

  observe() {
    if (DidResizeModifier.observer && this.element) {
      this.addHandler();
      DidResizeModifier.observer.observe(this.element, this.options);
    }
  }

  addHandler() {
    if (this.element && this.handler) {
      DidResizeModifier.handlers?.set(this.element, this.handler);
    }
  }

  removeHandler() {
    if (this.element) {
      DidResizeModifier.handlers?.delete(this.element);
    }
  }
}

function unobserve(instance: DidResizeModifier) {
  if (instance.element && DidResizeModifier.observer) {
    DidResizeModifier.observer.unobserve(instance.element);
    instance.removeHandler();
  }
}
