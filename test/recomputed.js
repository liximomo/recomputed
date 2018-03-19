import recomputed, { property, props, state, shallow, deep } from '../src/index';

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

    const composer = recomputed(mockRectInstance);

    computedData = composer(props('list'), state('start'), state('end'), (list, start, end) => {
      return list.slice(start, end).map((item, index) => ({
        id: index,
        data: item,
      }));
    });
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
    expect(dataFromNewContext).toEqual([{ id: 0, data: 'c' }, { id: 1, data: 'd' }]);

    // mockRectInstance.state = {
    //   start: 2,
    //   end: 4,
    // };
    const dataFromOriginContext = computedData();
    expect(dataFromOriginContext).toEqual([{ id: 0, data: 1 }, { id: 1, data: 2 }]);
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
    expect(dataFromNewContext).toEqual([{ id: 0, data: 'c' }, { id: 1, data: 'd' }]);

    mockRectInstance.props.list = charList;
    mockRectInstance.state = {
      start: 2,
      end: 4,
    };
    const dataFromOriginContext = computedData();
    expect(dataFromOriginContext).toBe(dataFromNewContext);
  });
});

describe('decorator', () => {
  let mockRectInstance;
  let composer;

  beforeEach(() => {
    mockRectInstance = {
      list: [
        {
          id: 1,
          data: {
            nested: 1,
          },
        },
        {
          id: 2,
          data: {
            nested: 2,
          },
        },
      ],
      state: {
        selectedId: 2,
      },
    };

    composer = recomputed(mockRectInstance);
  });

  test('should memorized by reference (should cached)', () => {
    const selectedItem = composer(property('list'), state('selectedId'), (list, selectedId) => {
      return list.find(item => item.id === selectedId).data;
    });
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.getComputationCount();
    mockRectInstance.list[0].data = 11;
    selectedItem();
    expect(selectedItem.getComputationCount()).toEqual(count);
  });

  test('should memorized by reference (should not cached)', () => {
    const selectedItem = composer(property('list'), state('selectedId'), (list, selectedId) => {
      return list.find(item => item.id === selectedId).data;
    });
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.getComputationCount();
    mockRectInstance.list = mockRectInstance.list.slice();
    selectedItem();
    expect(selectedItem.getComputationCount() === count + 1);
  });

  test('should memorized by shallow (should cached)', () => {
    const selectedItem = composer(
      shallow(property('list')),
      state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.getComputationCount();
    mockRectInstance.list = mockRectInstance.list.slice();
    selectedItem();
    expect(selectedItem.getComputationCount()).toEqual(count);
  });

  test('should not memorized by shallow but memorized by deep', () => {
    const shallowSelectedItem = composer(
      shallow(property('list')),
      state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const deepSelectedItem = composer(
      deep(property('list')),
      state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const shallowPrevious = shallowSelectedItem();
    const deepPrevious = deepSelectedItem();
    expect(shallowPrevious).toEqual({ nested: 2 });
    expect(deepPrevious).toEqual({ nested: 2 });

    const shallowCount = shallowSelectedItem.getComputationCount();
    const deepCount = deepSelectedItem.getComputationCount();
    mockRectInstance.list = mockRectInstance.list.slice();
    mockRectInstance.list[0] = { ...mockRectInstance.list[0] };
    shallowSelectedItem();
    deepSelectedItem();
    expect(shallowSelectedItem.getComputationCount()).toEqual(shallowCount + 1);
    expect(deepSelectedItem.getComputationCount()).toEqual(deepCount);
  });
});
