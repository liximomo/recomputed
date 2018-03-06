import recomputed from '../src/index';

describe('recomputed', () => {
  let mockRectInstance;
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
  });

  test('basic recomputed', () => {
    const getWrappedData = recomputed(
      mockRectInstance,
      props => {
        return props.list;
      },
      (props, state) => {
        return state.start;
      },
      (props, state) => {
        return state.end;
      },
      (list, start, end) => {
        return list.slice(start, end).map((item, index) => ({
          id: index,
          data: item,
        }));
      }
    );

    const previous = getWrappedData();
    expect(previous).toEqual([{ id: 0, data: 1 }, { id: 1, data: 2 }]);
    expect(previous).toBe(getWrappedData());

    mockRectInstance.state = {
      start: 1,
      end: 3,
    };

    const changed = getWrappedData();
    expect(changed).not.toBe(previous);
    expect(changed).toEqual([{ id: 0, data: 2 }, { id: 1, data: 3 }]);
  });

  test('overide default object', () => {
    const getWrappedData = recomputed(
      mockRectInstance,
      props => {
        return props.list;
      },
      (props, state) => {
        return state.start;
      },
      (props, state) => {
        return state.end;
      },
      (list, start, end) => {
        return list.slice(start, end).map((item, index) => ({
          id: index,
          data: item,
        }));
      }
    );

    const overrided = getWrappedData({
      ...mockRectInstance,
      state: {
        start: 2,
        end: 4,
      },
    });
    expect(overrided).toEqual([{ id: 0, data: 3 }, { id: 1, data: 4 }]);

    mockRectInstance.state = {
      start: 2,
      end: 4,
    };
    const cached = getWrappedData();
    expect(cached).toBe(overrided);
  });
});
