import ReferenceInput from '../core/ReferenceInput';
import shallowEqual from '../utils/shallowEqual';

export default input => ReferenceInput.from(input, shallowEqual);
