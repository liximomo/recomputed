import { createDep } from '../core';
import { shallowEqual } from '../utils';

export default input => createDep(input, shallowEqual);
