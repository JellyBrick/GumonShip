import { useCallback, useRef, useState } from 'react';

type Setter<T> = (newValue: T, silent?: boolean) => void;
type Getter<T> = () => T;

/**
 * @description useState with reference
 * @param initialState initial state
 * @returns [state, setState, getState]: if setState's isSilent is true, state will not be updated (not re-rendered)
 * @example const [state, setState, getState] = useStateRef(0);
 */
export const useStateRef = <S>(initialState: S): [S, Setter<S>, Getter<S>] => {
  const ref = useRef<S>(initialState);
  const [, forceRerender] = useState<Record<string, unknown>>();

  const update: Setter<S> = useCallback((newValue, isSilent = false) => {
    ref.current = newValue;
    if (!isSilent) forceRerender({});
  }, []);
  const getter = useCallback(() => ref.current, []);

  return [ref.current, update, getter];
};
