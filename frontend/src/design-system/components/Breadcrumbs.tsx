import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

export default function Breadcrumbs({ items, separator = '/' }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
      <ol
        className="breadcrumbs-list"
        style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {item.href && !isLast ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span aria-current={item.isCurrent || isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span style={{ margin: '0 8px' }}>{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
