import { createDep } from '../core';
import { deepEqual } from '../utils';

export default input => createDep(input, deepEqual);
