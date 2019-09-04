import { identityEqual } from '../utils';

function areArgumentsEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  const length = prev.length;
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

export default function memoize(func) {
  let lastArgs = null;
  let lastResult = null;

  return function(...currentArgs) {
    if (!areArgumentsEqual(identityEqual, lastArgs, currentArgs)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(this, currentArgs);
    }

    lastArgs = currentArgs;
    return lastResult;
  };
}
