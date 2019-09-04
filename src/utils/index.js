export { default as identityEqual } from './identityEqual';
export { default as shallowEqual } from './shallowEqual';
export { default as deepEqual } from './deepEqual';

export function isObject(val) {
  return val !== null && typeof val === 'object';
}
