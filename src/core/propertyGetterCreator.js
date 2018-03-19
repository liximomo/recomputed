export default function propertyGetterCreator(propertyNameOrFunc) {
  const type = typeof propertyNameOrFunc;
  if (type === 'string') {
    return function (obj) {
      return obj[propertyNameOrFunc];
    };
  } else if (type === 'function') {
    return function (obj) {
      return propertyNameOrFunc(obj);
    };
  } else {
    throw new Error(
      'expect input to be function or string, ' + `instead received type: [${type}]`
    );
  }
}
