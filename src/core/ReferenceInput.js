import InputInterface from './InputInterface';

class ReferenceInput extends InputInterface {
  static from(input, equivalenceDetector) {
    return new ReferenceInput(input, equivalenceDetector);
  }

  constructor(input, equivalenceDetector) {
    super();
    this._input = input;
    this._value = null;
    this._equivalenceDetector = equivalenceDetector;
  }

  value(ctx) {
    const value = this._input._getValue(ctx);
    if (this.isEqual(this._value, value)) {
      // return same reference to keep computable's memorize
      return this._value;
    }

    this._value = value;
    return this._value;
  }

  isEqual(a, b) {
    return this._equivalenceDetector(a, b);
  }
}

export default ReferenceInput;
