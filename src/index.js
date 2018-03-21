import recomputed from './api/recomputed';
import property from './api/property';
import { props as $props, state as $state } from './api/react-binding';
import shallow from './api/shallow';
import deep from './api/deep';

export default recomputed;

export {
  property,
  // avoid props to conflict with props or state in react method signature
  $props,
  $state,

  shallow,
  deep,
};
