import Computable from '../core/Computable';

export default function recomputed(ctx) {
  return function computeWithBindingContext(...funcs) {
    // apply arguments instead of spreading for performance.
    const computable = Computable.from.apply(null, funcs);

    let computed;
    if (typeof ctx === 'function') {
      computed = (context = ctx()) => {
        computable.value(context);
      };
    } else {
      computed = (context = ctx) => computable.value(context);
    }

    if (process.env.NODE_ENV === 'test') {
      computed.getComputationCount = () => computable.getComputationCount();
    }

    return computed;
  };
}
