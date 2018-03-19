import InputInterface from './InputInterface';

class Input extends InputInterface {
  static from(getValue) {
    return new Input(getValue);
  }

  constructor(getValue) {
    super();
    this._getValue = getValue;
  }

  value(ctx) {
    return this._getValue(ctx);
  }
}

export default Input;
