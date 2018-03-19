# Recomputed

Simple "computed" for React inspired by [reselect](https://github.com/reactjs/reselect).

```js
import recomputed, { property, props, state, shallow } from '../src/index';

class App extends React.Component {
  constructor(props) {
    super(props);

    const composer = recomputed(this);

    this.getSlice = composer(
      property('list'), // object property
      state('start'), // react props
      state(instState => instState.end), // react state
      (list, start, end) => list.slice(start, end)
    );

    this.getSliceSum = composer(
      this.getSlice,
      slice => slice.reduce((sum, data) => sum + data, 0)
    );

    this.getSelected = composer(
      shallow(props('datas')),
      shallow(props('selectedIds')),
      (datas, selectedIds) => datas.filter(data => selectedIds.indexOf(data.id) !== -1)
    );
  }
}
```

## API

recomputed(reactInstance, ...inputComputeds | [inputComputeds], resultFunc)
