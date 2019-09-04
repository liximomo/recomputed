/**
 * Create a function that return the speicific property from the first argument
 *
 * @export
 * @param {(string|((ctx?) => any))} propertyNameOrFunc
 * @returns
 */
export default function propertyGetterCreator(propertyNameOrFunc) {
  const type = typeof propertyNameOrFunc;
  if (type === 'string') {
    return function(ctx) {
      return ctx[propertyNameOrFunc];
    };
  } else if (type === 'function') {
    return function(ctx) {
      return propertyNameOrFunc(ctx);
    };
  } else {
    throw new Error(`expect a function or string, got type: "${type}"`);
  }
}
