/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  sortable?: boolean;
  initialSort?: { key: string; direction: SortDirection };
  onSortChange?: (key: string, direction: SortDirection) => void;
}

export default function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
  sortable = false,
  initialSort,
  onSortChange,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(initialSort?.key || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSort?.direction || null);

  const handleSort = (columnKey: string, column: TableColumn<T>) => {
    if (!sortable || !column.sortable) return;

    let newDirection: SortDirection = 'asc';
    if (sortKey === columnKey && sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortKey === columnKey && sortDirection === 'desc') {
      newDirection = null;
      setSortKey(null);
      setSortDirection(null);
      onSortChange?.(columnKey, null);
      return;
    }

    setSortKey(columnKey);
    setSortDirection(newDirection);
    onSortChange?.(columnKey, newDirection);
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    const column = columns.find((col) => col.key === sortKey);
    if (!column || !column.sortable) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      if (column.sortFn) {
        return column.sortFn(a, b);
      }

      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return String(aValue).localeCompare(String(bValue));
    });

    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortKey, sortDirection, columns]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-primary-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortable) return null;

    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return null;

    if (sortKey !== columnKey) {
      return (
        <svg
          className="w-4 h-4 ml-1 text-primary-400 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 ml-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-primary-200">
        <thead className="bg-primary-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key, column)}
                className={`px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider ${
                  sortable && column.sortable ? 'cursor-pointer hover:bg-primary-100 select-none' : ''
                } ${column.className || ''}`}
              >
                <div className="flex items-center">
                  {column.header}
                  <SortIcon columnKey={column.key} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-primary-200">
          {sortedData.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-primary-50 transition-colors' : ''}
            >
              {columns.map((column) => (
                <td key={column.key} className={`px-6 py-4 whitespace-nowrap text-sm text-primary-900 ${column.className || ''}`}>
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

