import React from 'react'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'primary' | 'primarySolid' | 'subtle' | 'ring'

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'border-b-2 border-blue-500',
  primarySolid: 'border-4 border-blue-600 border-t-transparent',
  subtle: 'border-2 border-slate-700 border-t-blue-500',
  ring: 'border-4 border-solid border-blue-500 border-r-transparent',
}

interface LoadingSpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label="Loading"
      role="status"
    />
  )
}
