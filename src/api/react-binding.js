import { propertyGetterCreator } from '../core';

export function props(propertyNameOrFunc) {
  const getter = propertyGetterCreator(propertyNameOrFunc);
  return ctx => getter(ctx.props);
}

export function state(propertyNameOrFunc) {
  const getter = propertyGetterCreator(propertyNameOrFunc);
  return ctx => getter(ctx.state);
}
