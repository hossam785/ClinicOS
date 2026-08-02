export interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
}

export default function Loader({ size = 'medium' }: LoaderProps) {
  return <div className="loader" data-size={size} role="progressbar" />
}
