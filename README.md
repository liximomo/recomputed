# Recomputed

Simple **computed** inspired by [reselect](https://github.com/reactjs/reselect).

```js
import { computed, property, $props, $state, shallow, deep } from 'recomputed';

class App extends React.Component {
  constructor(props) {
    super(props);

    const $computed = computed.for(this);

    this.getSlice = $computed(
      property('list'), // object property
      $props('start'), // react props
      $state(instState => instState.end), // react state
      (list, start, end) => list.slice(start, end)
    );

    // compose with existed computed
    this.getSliceSum = $computed(this.getSlice, slice =>
      slice.reduce((sum, data) => sum + data, 0)
    );

    // use decorator
    this.getSelected = $computed(
      deep(props('datas')),
      shallow(props('selectedIds')),
      (datas, selectedIds) =>
        datas.filter(data => selectedIds.indexOf(data.id) !== -1)
    );
  }
}
```

## API

### `computed(...inputSelectors | [inputSelectors], resultFunc)`

Takes one or more selectors, or an array of selectors, computes their values and passes them as arguments to resultFunc.

`computed` determines if the value returned by an input-selector has changed between calls using reference equality (===). Inputs to selectors created with `computed` should be immutable.

Selectors created with `computed` have a cache size of 1. This means they always recalculate when the value of an input-selector changes, as a selector only stores the preceding value of each input-selector.

```js
const getSum = computed(
  state => state.values.value1,
  state => state.values.value2,
  (value1, value2) => value1 + value2
);

// You can also pass an array of selectors
const getTotal = computed(
  [state => state.values.value1, state => state.values.value2],
  (value1, value2) => value1 + value2
);
```

### `computed.for(computeContext: any)`

Take a `computeContext`, return a _`computed`_ function which bind to the `computeContext`.

```js
import { computed } from 'recomputed';

const context = {
  nums: [1, 2, 3, 4, 5, 6],
  blackList: [3],
};
const $computed = computed.for(context);
this.getOddNums = $computed(
  ctx => ctx.nums,
  ctx => ctx.blackList,
  (nums, blackList) => nums.filter(num => blackList.indexof(num) === -1)
);
```

### `property(name: string)`

Creates a Function that returns the `name` property of given object.

```js
const getName = property('name');
getName({ name: 'foo ' }); // return foo
```
