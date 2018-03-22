# Recomputed

Simple "computed" for React inspired by [reselect](https://github.com/reactjs/reselect).

```js
import recomputed, { property, $props, $state, shallow, deep } from 'recomputed';

class App extends React.Component {
  constructor(props) {
    super(props);

    const composer = recomputed(this);

    this.getSlice = composer(
      property('list'), // object property
      $props('start'), // react props
      $state(instState => instState.end), // react state
      (list, start, end) => list.slice(start, end)
    );

    // compose with existed computed 
    this.getSliceSum = composer(
      this.getSlice,
      slice => slice.reduce((sum, data) => sum + data, 0)
    );

    // use decorator
    this.getSelected = composer(
      deep(props('datas')),
      shallow(props('selectedIds')),
      (datas, selectedIds) => datas.filter(data => selectedIds.indexOf(data.id) !== -1)
    );
  }
}
```

## API
### recomputed(computeContext: any)
Take one computeContext, return a composer function which can create computed.

### composer(...inputFunc, resultFunc)
Takes one or more input function, computes their values and passes them as arguments to resultFunc.

```js
import recomputed, { property } from 'recomputed';

const composer = recomputed({
  nums: [1,2,3,4,5,6],
  blackList: [3],
});

this.getOddNums = composer(
  property('nums'),
  ctx => ctx.blackList,
  (nums, blackList) => nums.filter(num => blackList.indexof(num) === -1)
);
```

### property(param)
if `param` is a string, creates a Input that returns the `param` property of given object.

```js
const input = property('name');
input.value({ name: 'foo '}) // return foo
```

if `param` is a function, creates a Input that returns the result of `param` call with given object.
 
```js
const input = property(ctx => ctx.name);
input.value({ name: 'foo '}) // return foo
```
