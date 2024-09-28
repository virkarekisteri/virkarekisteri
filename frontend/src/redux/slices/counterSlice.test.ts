import type { AppStore } from 'redux/store';
import { makeStore } from 'redux/store';
import type { CounterState } from './counterSlice';
import { counterSlice, decrement, increment, incrementByAmount, selectCount } from './counterSlice';

interface LocalTestContext {
  store: AppStore;
}

describe<LocalTestContext>('counter reducer', (it) => {
  beforeEach<LocalTestContext>((context) => {
    const initialState: CounterState = {
      value: 3,
      status: 'idle',
    };

    context.store = makeStore({ counter: initialState });
  });

  it('should handle initial state', () => {
    expect(counterSlice.reducer(undefined, { type: 'unknown' })).toStrictEqual({
      value: 0,
      status: 'idle',
    });
  });

  it('should handle increment', ({ store }) => {
    expect(selectCount(store.getState())).toBe(3);

    store.dispatch(increment());

    expect(selectCount(store.getState())).toBe(4);
  });

  it('should handle decrement', ({ store }) => {
    expect(selectCount(store.getState())).toBe(3);

    store.dispatch(decrement());

    expect(selectCount(store.getState())).toBe(2);
  });

  it('should handle incrementByAmount', ({ store }) => {
    expect(selectCount(store.getState())).toBe(3);

    store.dispatch(incrementByAmount(2));

    expect(selectCount(store.getState())).toBe(5);
  });
});
