import { createSelector } from 'reselect';

function defaultPicker(object) {
  return [object.props, object.state];
}

function createComputedCreater() {
  return (instance, ...args) => {
    const selector = createSelector(...args);

    const computed = (overided = instance) => selector(...defaultPicker(overided), overided);

    return computed;
  };
}

const recomputed = createComputedCreater(defaultPicker);

export default recomputed;

export { createComputedCreater };
