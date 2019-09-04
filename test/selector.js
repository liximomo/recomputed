import { computed } from '../src/index';

// Construct 1E6 states for perf test outside of the perf test so as to not change the execute time of the test function
const numOfStates = 1000000;
const states = [];

for (let i = 0; i < numOfStates; i++) {
  states.push({ a: 1, b: 2 });
}

describe('selector', () => {
  test('basic selector', () => {
    const selector = computed(state => state.a, a => a);
    const firstState = { a: 1 };
    const firstStateNewPointer = { a: 1 };
    const secondState = { a: 2 };

    expect(selector(firstState)).toBe(1);
    expect(selector(firstState)).toBe(1);
    expect(selector.recomputations()).toBe(1);
    expect(selector(firstStateNewPointer)).toBe(1);
    expect(selector.recomputations()).toBe(1);
    expect(selector(secondState)).toBe(2);
    expect(selector.recomputations()).toBe(2);
  });

  test("don't pass extra parameters to inputSelector when only called with the state", () => {
    const selector = computed((...params) => params.length, a => a);
    expect(selector({})).toBe(1);
  });

  test('basic selector multiple keys', () => {
    const selector = computed(
      state => state.a,
      state => state.b,
      (a, b) => a + b
    );
    const state1 = { a: 1, b: 2 };

    expect(selector(state1)).toBe(3);
    expect(selector(state1)).toBe(3);
    expect(selector.recomputations()).toBe(1);
    const state2 = { a: 3, b: 2 };
    expect(selector(state2)).toBe(5);
    expect(selector(state2)).toBe(5);
    expect(selector.recomputations()).toBe(2);
  });

  test('basic selector invalid input selector', () => {
    expect(() =>
      computed(state => state.a, 'not a function', (a, b) => a + b)
    ).toThrowError(/expect all arguments to be functions.*function, string/);
  });

  test('basic selector cache hit performance', () => {
    const selector = computed(
      state => state.a,
      state => state.b,
      (a, b) => a + b
    );
    const state1 = { a: 1, b: 2 };

    const start = new Date();
    for (let i = 0; i < 1000000; i++) {
      selector(state1);
    }
    const totalTime = new Date() - start;

    expect(selector(state1)).toBe(3);
    expect(selector.recomputations()).toBe(1);

    expect(totalTime).toBeLessThan(1000);
  });

  test('basic selector cache hit performance for state changes but shallowly equal selector args', () => {
    const selector = computed(
      state => state.a,
      state => state.b,
      (a, b) => a + b
    );

    const start = new Date();
    for (let i = 0; i < numOfStates; i++) {
      selector(states[i]);
    }
    const totalTime = new Date() - start;

    expect(selector(states[0])).toBe(3);
    expect(selector.recomputations()).toBe(1);

    expect(totalTime).toBeLessThan(1000);
  });

  test('memoized composite arguments', () => {
    const selector = computed(state => state.sub, sub => sub);
    const state1 = { sub: { a: 1 } };
    expect(selector(state1)).toEqual({ a: 1 });
    expect(selector(state1)).toEqual({ a: 1 });
    expect(selector.recomputations()).toBe(1);
    const state2 = { sub: { a: 2 } };
    expect(selector(state2)).toEqual({ a: 2 });
    expect(selector.recomputations()).toBe(2);
  });

  test('first argument can be an array', () => {
    const selector = computed([state => state.a, state => state.b], (a, b) => {
      return a + b;
    });
    expect(selector({ a: 1, b: 2 })).toBe(3);
    expect(selector({ a: 1, b: 2 })).toBe(3);
    expect(selector.recomputations()).toBe(1);
    expect(selector({ a: 3, b: 2 })).toBe(5);
    expect(selector.recomputations()).toBe(2);
  });

  test('can accept props', () => {
    const selector = computed(
      state => state.a,
      state => state.b,
      (state, props) => props.c,
      (a, b, c) => {
        return a + b + c;
      }
    );
    expect(selector({ a: 1, b: 2 }, { c: 100 })).toBe(103);
  });

  test('recomputes result after exception', () => {
    let called = 0;
    const selector = computed(
      state => state.a,
      () => {
        called++;
        throw Error('test error');
      }
    );
    expect(() => selector({ a: 1 })).toThrowError('test error');
    expect(() => selector({ a: 1 })).toThrowError('test error');
    expect(called).toBe(2);
  });

  test('memoizes previous result before exception', () => {
    let called = 0;
    const selector = computed(
      state => state.a,
      a => {
        called++;
        if (a > 1) throw Error('test error');
        return a;
      }
    );
    const state1 = { a: 1 };
    const state2 = { a: 2 };
    expect(selector(state1)).toBe(1);
    expect(() => selector(state2)).toThrowError('test error');
    expect(selector(state1)).toBe(1);
    expect(called).toBe(2);
  });

  test('chained selector', () => {
    const selector1 = computed(state => state.sub, sub => sub);
    const selector2 = computed(selector1, sub => sub.value);
    const state1 = { sub: { value: 1 } };
    expect(selector2(state1)).toBe(1);
    expect(selector2(state1)).toBe(1);
    expect(selector2.recomputations()).toBe(1);
    const state2 = { sub: { value: 2 } };
    expect(selector2(state2)).toBe(2);
    expect(selector2.recomputations()).toBe(2);
  });

  test('chained selector with props', () => {
    const selector1 = computed(
      state => state.sub,
      (state, props) => props.x,
      (sub, x) => ({ sub, x })
    );
    const selector2 = computed(
      selector1,
      (state, props) => props.y,
      (param, y) => param.sub.value + param.x + y
    );
    const state1 = { sub: { value: 1 } };

    expect(selector2(state1, { x: 100, y: 200 })).toBe(301);
    expect(selector2(state1, { x: 100, y: 200 })).toBe(301);
    expect(selector2.recomputations()).toBe(1);
    const state2 = { sub: { value: 2 } };
    expect(selector2(state2, { x: 100, y: 201 })).toBe(303);
    expect(selector2.recomputations()).toBe(2);
  });

  test('chained selector with variadic args', () => {
    const selector1 = computed(
      state => state.sub,
      (state, props, another) => props.x + another,
      (sub, x) => ({ sub, x })
    );
    const selector2 = computed(
      selector1,
      (state, props) => props.y,
      (param, y) => param.sub.value + param.x + y
    );

    const state1 = { sub: { value: 1 } };
    expect(selector2(state1, { x: 100, y: 200 }, 100)).toBe(401);
    expect(selector2(state1, { x: 100, y: 200 }, 100)).toBe(401);
    expect(selector2.recomputations()).toBe(1);
    const state2 = { sub: { value: 2 } };
    expect(selector2(state2, { x: 100, y: 201 }, 200)).toBe(503);
    expect(selector2.recomputations()).toBe(2);
  });

  test('structured selector', () => {
    const selector = computed({
      x: state => state.a,
      y: state => state.b,
    });
    const firstResult = selector({ a: 1, b: 2 });
    expect(firstResult).toEqual({ x: 1, y: 2 });
    expect(selector({ a: 1, b: 2 })).toBe(firstResult);
    const secondResult = selector({ a: 2, b: 2 });
    expect(secondResult).toEqual({ x: 2, y: 2 });
    expect(selector({ a: 2, b: 2 })).toBe(secondResult);
  });

  test('structured selector with invalid arguments', () => {
    expect(() =>
      computed({
        a: state => state.b,
        c: 'd',
      })
    ).toThrow(/expect all arguments to be functions.*function, string/);
  });

  test('resetRecomputations', () => {
    const selector = computed(state => state.a, a => a);
    expect(selector({ a: 1 })).toBe(1);
    expect(selector({ a: 1 })).toBe(1);
    expect(selector.recomputations()).toBe(1);
    expect(selector({ a: 2 })).toBe(2);
    expect(selector.recomputations()).toBe(2);

    selector.resetRecomputations();
    expect(selector.recomputations()).toBe(0);

    expect(selector({ a: 1 })).toBe(1);
    expect(selector({ a: 1 })).toBe(1);
    expect(selector.recomputations()).toBe(1);
    expect(selector({ a: 2 })).toBe(2);
    expect(selector.recomputations()).toBe(2);
  });

  test('export last function as resultFunc', () => {
    const lastFunction = () => {};
    const selector = computed(state => state.a, lastFunction);
    expect(selector.resultFunc).toBe(lastFunction);
  });
});
