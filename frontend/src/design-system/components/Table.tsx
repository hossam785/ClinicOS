import type { TableHTMLAttributes } from 'react'

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  headers: string[]
}

export default function Table({ headers, children, ...props }: TableProps) {
  return (
    <table {...props}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
