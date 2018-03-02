# Recomputed

Simple "computed" for React based on [reselect](https://github.com/reactjs/reselect).

```js
import recomputed from 'recomputed';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getWrappedData = recomputed(
      this,
      (props) => {
        return props.list;
      },
      (props, state) => {
        return state.start;
      },
      (props, state) => {
        return state.end;
      },
      (list, start, end) => {
        return list.slice(start, end).map(item => ({
          id: genId(),
          data: item
        }));
      },
    );
  }
}
```

## API

recomputed(reactInstance, ...inputComputeds | [inputComputeds], resultFunc)
