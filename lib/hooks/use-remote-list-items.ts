'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Keep a mutable local list in sync when remote fetch data identity changes,
 * without an effect (avoids react-hooks/set-state-in-effect).
 */
export function useRemoteListItems<T>(
  remote: T[] | undefined
): [T[], Dispatch<SetStateAction<T[]>>] {
  const [items, setItems] = useState<T[]>(remote ?? []);
  const [prevRemote, setPrevRemote] = useState(remote);

  if (remote !== prevRemote) {
    setPrevRemote(remote);
    setItems(remote ?? []);
  }

  return [items, setItems];
}
