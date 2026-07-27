import { useMemo, useState } from 'react';

export default function usePagination(items = [], pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  return { page, totalPages, paginated, goToPage, nextPage, prevPage, setPage };
}
