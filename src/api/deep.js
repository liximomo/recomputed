import ReferenceInput from '../core/ReferenceInput';
import deepEqual from '../utils/deepEqual';

export default input => ReferenceInput.from(input, deepEqual);
