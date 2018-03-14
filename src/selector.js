// modified from https://github.com/reactjs/reselect/blob/master/src/index.js
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
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

function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs = null;
  let lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function() {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(dep => typeof dep === 'function')) {
    const dependencyTypes = dependencies.map(dep => typeof dep).join(', ');
    throw new Error(
      'Selector creators expect all input-selectors to be functions, ' +
        `instead received the following types: [${dependencyTypes}]`
    );
  }

  return dependencies;
}

function createSelectorCreator(memoize, ...memoizeOptions) {
  return (...funcs) => {
    let recomputations = 0;
    const resultFunc = funcs.pop();
    const dependencies = getDependencies(funcs);

    const memoizedResultFunc = memoize(function() {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }, ...memoizeOptions);

    // do not memoize this function
    const selector = function() {
      const params = [];
      const length = dependencies.length;

      for (let i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    };

    selector.resultFunc = resultFunc;
    selector.recomputations = () => recomputations;
    selector.resetRecomputations = () => (recomputations = 0);
    return selector;
  };
}

export default createSelectorCreator(defaultMemoize);