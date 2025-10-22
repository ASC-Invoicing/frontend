import { useState } from "react";

export const usePagination = (initialPageSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onPageChange = (newPage: number, newSize?: number) => {
    setPage(newPage);
    if (newSize) setPageSize(newSize);
  };

  return { page, pageSize, onPageChange };
};
