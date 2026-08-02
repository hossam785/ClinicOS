export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="pagination-nav" aria-label="Pagination Navigation">
      <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      <div className="pagination-pages" style={{ display: 'inline-block', margin: '0 8px' }}>
        {pages.map((page) => (
          <button
            key={page}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
          >
            {page}
          </button>
        ))}
      </div>
      <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </nav>
  )
}
