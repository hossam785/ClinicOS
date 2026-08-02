import { Link } from 'react-router-dom'

export interface AuthFooterLink {
  label: string
  to: string
}

export interface AuthFooterProps {
  links: AuthFooterLink[]
}

export default function AuthFooter({ links }: AuthFooterProps) {
  return (
    <div
      style={{
        marginTop: '2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
