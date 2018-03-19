import propertyGetterCreator from '../core/propertyGetterCreator';
import Input from '../core/Input';

export function props(propertyNameOrFunc) {
  const getter = propertyGetterCreator(propertyNameOrFunc);
  return Input.from(ctx => getter(ctx.props));
}

export function state(propertyNameOrFunc) {
  const getter = propertyGetterCreator(propertyNameOrFunc);
  return Input.from(ctx => getter(ctx.state));
}
