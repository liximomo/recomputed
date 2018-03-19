import identityEqual from '../utils/identityEqual';

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

  return function() {
    // we reference arguments instead of spreading them for performance reasons
    if (!areArgumentsEqual(identityEqual, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(this, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}
