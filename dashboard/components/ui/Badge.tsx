interface BadgeProps {
  variant?: 'active' | 'inactive' | 'pending' | 'error'
  children: React.ReactNode
}

export function Badge({ variant = 'active', children }: BadgeProps) {
  const classes = {
    active: 'badge-active',
    inactive: 'badge-inactive',
    pending: 'badge-pending',
    error: 'badge-error',
  }

  return (
    <span className={classes[variant]}>
      {children}
    </span>
  )
}
