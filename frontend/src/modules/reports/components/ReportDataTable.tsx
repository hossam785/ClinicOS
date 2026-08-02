// Report Data Table Component — ClinicOS

import React from 'react'

export interface TableColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  align?: 'left' | 'center' | 'right'
}

export interface ReportDataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

export function ReportDataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No report data available.',
}: ReportDataTableProps<T>): React.ReactElement {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse space-y-3">
        <div className="h-6 w-full rounded bg-slate-200" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-slate-100" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="transition hover:bg-slate-50">
                {columns.map((col, colIdx) => {
                  const content =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor as keyof T] as React.ReactNode)
                  return (
                    <td
                      key={colIdx}
                      className={`px-4 py-3 whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {content}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
