import Computable from '../core/Computable';

export default function recomputed(instance) {
  return (...funcs) => {
    // apply arguments instead of spreading for performance.
    const computable = Computable.from.apply(null, funcs);

    const computed = (context = instance) => computable.value(context);

    if (process.env.NODE_ENV === 'test') {
      computed.getComputationCount = () => computable.getComputationCount();
    }

    return computed;
  };
}
