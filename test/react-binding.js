import { computed, $props, $state } from '../src/index';

describe('recomputed', () => {
  let mockRectInstance;
  let computedData;

  beforeEach(() => {
    mockRectInstance = {
      props: {
        list: [1, 2, 3, 4],
      },
      state: {
        start: 0,
        end: 2,
      },
    };

    const composer = computed.for(mockRectInstance);

    computedData = composer(
      $props('list'),
      $state('start'),
      $state(instState => instState.end),
      (list, start, end) => {
        return list.slice(start, end).map((item, index) => ({
          id: index,
          data: item,
        }));
      }
    );
  });

  test('should works like reselect', () => {
    const previous = computedData();
    expect(previous).toEqual([{ id: 0, data: 1 }, { id: 1, data: 2 }]);
  });

  test('should compute value correctly', () => {
    const previous = computedData();
    expect(previous).toEqual([{ id: 0, data: 1 }, { id: 1, data: 2 }]);
  });

  test('should momerized computed value', () => {
    const previous = computedData();
    expect(previous).toBe(computedData());
  });

  test('should recomputed when computed context has changed (shallow change)', () => {
    const previous = computedData();

    // change computed origin
    mockRectInstance.props = {
      list: [11, 22, 33, 44],
    };

    const changed = computedData();
    expect(changed).not.toBe(previous);
    expect(changed).toEqual([{ id: 0, data: 11 }, { id: 1, data: 22 }]);
  });

  test('should recomputed when computed context has changed (deep change)', () => {
    const previous = computedData();

    // change computed origin
    mockRectInstance.props.list = [11, 22, 33, 44];

    const changed = computedData();
    expect(changed).not.toBe(previous);
    expect(changed).toEqual([{ id: 0, data: 11 }, { id: 1, data: 22 }]);
  });

  test('should respect provided comnputed context', () => {
    const dataFromNewContext = computedData({
      props: {
        list: ['a', 'b', 'c', 'd'],
      },
      state: {
        start: 2,
        end: 4,
      },
    });
    expect(dataFromNewContext).toEqual([
      { id: 0, data: 'c' },
      { id: 1, data: 'd' },
    ]);

    // mockRectInstance.state = {
    //   start: 2,
    //   end: 4,
    // };
    const dataFromOriginContext = computedData();
    expect(dataFromOriginContext).toEqual([
      { id: 0, data: 1 },
      { id: 1, data: 2 },
    ]);
    // expect(cached).toBe(data);
  });

  test('Memorize should only respect to the input rules but context self', () => {
    const charList = ['a', 'b', 'c', 'd'];
    const dataFromNewContext = computedData({
      props: {
        list: charList,
      },
      state: {
        start: 2,
        end: 4,
      },
    });
    expect(dataFromNewContext).toEqual([
      { id: 0, data: 'c' },
      { id: 1, data: 'd' },
    ]);

    mockRectInstance.props.list = charList;
    mockRectInstance.state = {
      start: 2,
      end: 4,
    };
    const dataFromOriginContext = computedData();
    expect(dataFromOriginContext).toBe(dataFromNewContext);
  });
});
