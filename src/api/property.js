import propertyGetterCreator from '../core/propertyGetterCreator';
import Input from '../core/Input';

export default function property(propertyNameOrFunc) {
  const getter = propertyGetterCreator(propertyNameOrFunc);
  return Input.from(getter);
}
