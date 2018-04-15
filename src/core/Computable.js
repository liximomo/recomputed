import memoize from './memoize';
import InputInterface from './InputInterface';

class Computable extends InputInterface {
  static from(...inputs) {
    const resultFun = inputs.pop();

    const inputFuncs = [];

    inputs.forEach(input => {
      const type = typeof input;

      if (input instanceof InputInterface) {
        inputFuncs.push(input.value.bind(input));
      } else if (type === 'function') {
        inputFuncs.push(input);
      } else {
        throw new Error(
          'Computable::from expect all input to be function or instance of Input' +
            `instead received the following types: [${type}]`
        );
      }
    });

    return new Computable(inputFuncs, resultFun);
  }

  constructor(inputFuncs, resultFun) {
    super();

    this._inputFuncs = inputFuncs;
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
    const inputFuncs = this._inputFuncs;
    const resultFunc = this._memoizedCompute;

    const params = [];
    const length = inputFuncs.length;

    for (let i = 0; i < length; i++) {
      params.push(inputFuncs[i](context));
    }

    // apply arguments instead of spreading for performance.
    return resultFunc.apply(null, params);
  }
}

export default Computable;
