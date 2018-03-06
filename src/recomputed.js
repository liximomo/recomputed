import { createSelector } from 'reselect';

function defaultPicker(object) {
  return [object.props, object.state];
}

function createComputedCreater() {
  return (instance, ...args) => {
    const selector = createSelector(...args);

    const computed = (overrided = instance) => selector(...defaultPicker(overrided), overrided);

    return computed;
  };
}

const recomputed = createComputedCreater(defaultPicker);

export default recomputed;

export { createComputedCreater };
