import memoize from './memoize';
import InputInterface from './InputInterface';

class Computable {
  static from(...inputs) {
    const resultFun = inputs.pop();

    if (!inputs.every(input => input instanceof InputInterface)) {
      const funcTypes = inputs.map(dep => typeof dep).join(', ');
      throw new Error(
        'Computable::from expect all input to be instance of Input, ' +
          `instead received the following types: [${funcTypes}]`
      );
    }

    return new Computable(inputs, resultFun);
  }

  constructor(inputs, resultFun) {
    this._inputs = inputs;
    this._resultFun = resultFun;
    this._computationCount = 0;

    this._memoizedCompute = memoize(this.compute.bind(this));
  }

  getComputationCount() {
    return this._computationCount;
  }

  resetComputationCount() {
    this._computationCount = 0;
  }

  getResultFunction() {
    return this._resultFun;
  }

  compute() {
    this._computationCount += 1;

    // apply arguments instead of spreading for performance.
    return this._resultFun.apply(null, arguments);
  }

  value(context) {
    const inputs = this._inputs;
    const resultFunc = this._memoizedCompute;

    const params = [];
    const length = inputs.length;

    for (let i = 0; i < length; i++) {
      // apply arguments instead of spreading and mutate a local list of params for performance.
      params.push(inputs[i].value(context));
    }

    // apply arguments instead of spreading for performance.
    return resultFunc.apply(null, params);
  }
}

export default Computable;
