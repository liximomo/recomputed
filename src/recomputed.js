import createSelector from './selector';

function defaultPicker(object) {
  return [object.props, object.state];
}

function computedCreater(picker) {
  return (instance, ...args) => {
    const selector = createSelector(...args);

    let computed;
    if (picker) {
      computed = (overrided = instance) => selector(...picker(overrided), overrided);
    } else {
      computed = (overrided = instance) => selector(overrided);
    }

    return computed;
  };
}

const recomputed = computedCreater(defaultPicker);

export default recomputed;

export { computedCreater };
