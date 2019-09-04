import { computed, property, $state, shallow, deep } from '../src/index';

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

    composer = computed.for(mockRectInstance);
  });

  test('should memorized by reference (should cached)', () => {
    const selectedItem = composer(
      property('list'),
      $state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.recomputations();
    mockRectInstance.list[0].data = 11;
    selectedItem();
    expect(selectedItem.recomputations()).toEqual(count);
  });

  test('should memorized by reference (should not cached)', () => {
    const selectedItem = composer(
      property('list'),
      $state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.recomputations();
    mockRectInstance.list = mockRectInstance.list.slice();
    selectedItem();
    expect(selectedItem.recomputations() === count + 1);
  });

  test('should memorized by shallow (should cached)', () => {
    const selectedItem = composer(
      shallow(property('list')),
      $state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const previous = selectedItem();
    expect(previous).toEqual({ nested: 2 });

    const count = selectedItem.recomputations();
    mockRectInstance.list = mockRectInstance.list.slice();
    selectedItem();
    expect(selectedItem.recomputations()).toEqual(count);
  });

  test('should not memorized by shallow but memorized by deep', () => {
    const shallowSelectedItem = composer(
      shallow(property('list')),
      $state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const deepSelectedItem = composer(
      deep(property('list')),
      $state('selectedId'),
      (list, selectedId) => {
        return list.find(item => item.id === selectedId).data;
      }
    );
    const shallowPrevious = shallowSelectedItem();
    const deepPrevious = deepSelectedItem();
    expect(shallowPrevious).toEqual({ nested: 2 });
    expect(deepPrevious).toEqual({ nested: 2 });

    const shallowCount = shallowSelectedItem.recomputations();
    const deepCount = deepSelectedItem.recomputations();
    mockRectInstance.list = mockRectInstance.list.slice();
    mockRectInstance.list[0] = { ...mockRectInstance.list[0] };
    shallowSelectedItem();
    deepSelectedItem();
    expect(shallowSelectedItem.recomputations()).toEqual(shallowCount + 1);
    expect(deepSelectedItem.recomputations()).toEqual(deepCount);
  });
});
