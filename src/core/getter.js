import memoize from './memoize';

/** @typedef {(...args: any[]) => any} DepFn */

/**
 * Create a function always that return the same reference
 * if fn' return value is equal to the last one.
 *
 * @export
 * @param {(ctx?) => any} fn
 * @param {(a, b) => boolean} equalityCheck
 * @returns
 */
export function createDep(fn, equalityCheck) {
  let lastResult = null;

  return function(ctx) {
    const result = fn(ctx);
    if (equalityCheck(lastResult, result)) {
      return lastResult;
    }

    lastResult = result;
    return result;
  };
}

function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(dep => typeof dep === 'function')) {
    const dependencyTypes = dependencies.map(dep => typeof dep).join(', ');
    throw new Error(
      'recomputed expect all arguments to be functions, ' +
        `instead received the following types: [${dependencyTypes}]`
    );
  }

  return dependencies;
}

/**
 *  Create a memoried function
 *
 * @export
 * @param {DepFn[]} fns
 * @returns {(...args: any[]) => any}
 */
export function createMemo(...fns) {
  const resultFunc = fns.pop();
  const depFns = getDependencies(fns);

  let computationCount = 0;
  const memoizedResultFn = memoize((...args) => {
    computationCount += 1;
    return resultFunc.apply(null, args);
  });
  /* eslint-disable no-use-before-define */
  memo.recomputations = () => computationCount;
  memo.resetRecomputations = () => (computationCount = 0);
  memo.resultFunc = resultFunc;
  /* eslint-enable no-use-before-define */

  function memo(...args) {
    const params = [];
    const length = depFns.length;

    for (let i = 0; i < length; i++) {
      params.push(depFns[i].apply(null, args));
    }

    // apply arguments instead of spreading for performance.
    return memoizedResultFn.apply(null, params);
  }

  return memo;
}
