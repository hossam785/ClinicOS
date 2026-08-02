/**
 * Design Token Color mappings matching docs/DESIGN_DNA.md
 * References the CSS custom variables in tokens.css
 */
export const colors = {
  primary: {
    default: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
  },
  secondary: {
    default: 'var(--color-secondary)',
    hover: 'var(--color-secondary-hover)',
  },
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  background: {
    base: 'var(--color-bg-base)',
    surface: 'var(--color-bg-surface)',
  },
  text: {
    main: 'var(--color-text-main)',
    muted: 'var(--color-text-muted)',
  },
  border: 'var(--color-border)',
}
