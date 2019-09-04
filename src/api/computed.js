import { createMemo } from '../core';

/**
 *
 *
 * @param {{[x: string]: any}} context
 * @returns
 */
function recomputedWithContext(context) {
  return function computeWithBindingContext(...funcs) {
    // apply arguments instead of spreading for performance.
    const memo = createMemo.apply(null, funcs);

    let computed;
    if (typeof context === 'function') {
      computed = (ctx = context()) => memo(ctx);
    } else {
      computed = (ctx = context) => memo(ctx);
    }

    computed.recomputations = memo.recomputations;
    computed.resetRecomputations = memo.recomputations;

    return computed;
  };
}

export default function recomputed(...args) {
  if (args.length === 1) {
    const structuredSelector = args[0];
    if (typeof structuredSelector !== 'object') {
      throw new Error(
        'recomputed expects first argument to be an object ' +
          `where each property is a selector, instead received a ${typeof selectors}`
      );
    }

    const objectKeys = Object.keys(structuredSelector);
    return createMemo(
      objectKeys.map(key => structuredSelector[key]),
      (...values) => {
        return values.reduce((composition, value, index) => {
          // eslint-disable-next-line no-param-reassign
          composition[objectKeys[index]] = value;
          return composition;
        }, {});
      }
    );
  }

  // apply arguments instead of spreading for performance.
  return createMemo.apply(null, args);
}

recomputed.for = recomputedWithContext;
