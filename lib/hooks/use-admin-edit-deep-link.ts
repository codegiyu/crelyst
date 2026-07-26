'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { findEntityByEditId } from '@/lib/utils/adminDeepLink';

export function useAdminEditDeepLink<T extends { _id: string }>(
  items: T[],
  onEdit: (item: T) => void
) {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const openedEditId = useRef<string | null>(null);

  useEffect(() => {
    if (!editId || openedEditId.current === editId) return;

    const item = findEntityByEditId(items, editId);
    if (!item) return;

    openedEditId.current = editId;
    onEdit(item);
  }, [editId, items, onEdit]);
}
