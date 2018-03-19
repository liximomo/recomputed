## Common API
```js
ref(); // is need export?
shallow();
deep();

$props();
$state();
$context();
property();

```

## Recomputed API

### Style 1
```js
const composer = recomputed(this)

composer(
  $props('start'), // default to ref
  $state('end'),
  $context('end'),
  shallow(props('list')),
  () => {
  }
);
```

### Style 2
```js
const composer = recomputed(this)

composer
  .input($props('start'))
  .input($state('end'))
  .input($context('list'))
  .compute((start, end, list) => {
    
  })
```
