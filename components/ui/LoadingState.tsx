import React from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'primary' | 'primarySolid' | 'subtle' | 'ring'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
  containerClassName?: string
  contentClassName?: string
  messageClassName?: string
  spinnerClassName?: string
  spinnerSize?: SpinnerSize
  spinnerVariant?: SpinnerVariant
}

export function LoadingState({
  message,
  fullScreen = false,
  containerClassName = '',
  contentClassName = '',
  messageClassName = 'text-slate-400',
  spinnerClassName = '',
  spinnerSize = 'md',
  spinnerVariant = 'primary',
}: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${containerClassName}`}
    >
      <div className={`text-center ${contentClassName}`}>
        <LoadingSpinner
          size={spinnerSize}
          variant={spinnerVariant}
          className={spinnerClassName}
        />
        {message ? <p className={messageClassName}>{message}</p> : null}
      </div>
    </div>
  )
}
