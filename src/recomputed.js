import { createSelector } from 'reselect';

function defaultPicker(object) {
  return [object.props, object.state, object.context];
}

function createComputedCreater() {
  return (instance, ...args) => {
    const selector = createSelector(...args);

    const computed = () => selector(...defaultPicker(instance));

    return computed;
  };
}

const recomputed = createComputedCreater(defaultPicker);

export default recomputed;

export { createComputedCreater };
