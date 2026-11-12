import { assert } from '@ember/debug';
import { getOwner, setOwner } from '@ember/owner';

/**
 * Gives `target` the same owner as `context`, so that `@service` injections
 * work on plain classes created by owned objects (services, components, etc.).
 */
export default function inheritOwner(target: object, context: object): void {
  const owner = getOwner(context);
  assert('inheritOwner: context does not have an owner', owner);
  setOwner(target, owner);
}
