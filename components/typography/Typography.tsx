import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Semantic Typography Components
 * 
 * Centralized text/heading sizing, line-height, and color management.
 * All components ensure WCAG AA contrast compliance and mobile responsiveness.
 */

// ============================================================
// Heading Components (h1 - h6)
// ============================================================

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  color?: 'foreground' | 'muted' | 'accent' | 'primary' | 'primary-foreground'
}

/**
 * H1 - Page title
 * Desktop: 48px (3rem), Mobile: 36px (2.25rem)
 */
export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
)
H1.displayName = 'H1'

/**
 * H2 - Section title
 * Desktop: 36px (2.25rem), Mobile: 28px (1.75rem)
 */
export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-3xl lg:text-4xl font-bold tracking-tight text-balance',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
)
H2.displayName = 'H2'

/**
 * H3 - Subsection title
 * Desktop: 28px (1.75rem), Mobile: 22px (1.375rem)
 */
export const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl lg:text-3xl font-bold tracking-snug text-balance',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
)
H3.displayName = 'H3'

/**
 * H4 - Card/block title
 * Desktop: 24px (1.5rem), Mobile: 20px (1.25rem)
 */
export const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        'text-xl lg:text-2xl font-semibold tracking-snug text-balance',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
)
H4.displayName = 'H4'

/**
 * H5 - Label/metadata
 * Desktop: 20px (1.25rem), Mobile: 18px (1.125rem)
 */
export const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'text-lg lg:text-xl font-semibold tracking-normal',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h5>
  )
)
H5.displayName = 'H5'

/**
 * H6 - Small section label
 * Desktop: 18px (1.125rem), Mobile: 16px (1rem)
 */
export const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <h6
      ref={ref}
      className={cn(
        'text-base lg:text-lg font-semibold tracking-normal',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h6>
  )
)
H6.displayName = 'H6'

// ============================================================
// Body Text Components
// ============================================================

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  variant?: 'body-lg' | 'body' | 'body-sm' | 'caption' | 'muted'
  color?: 'foreground' | 'muted' | 'accent' | 'primary' | 'primary-foreground'
}

/**
 * Body Large - Lead paragraph or hero text
 * Desktop: 20px (1.25rem), Mobile: 18px (1.125rem)
 */
export const BodyLarge = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-lg lg:text-xl leading-relaxed',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)
BodyLarge.displayName = 'BodyLarge'

/**
 * Body - Default paragraph text
 * Desktop: 16px (1rem), Mobile: 16px (1rem)
 */
export const Body = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-base leading-relaxed',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)
Body.displayName = 'Body'

/**
 * Body Small - Secondary information, descriptions
 * Desktop: 14px (0.875rem), Mobile: 14px (0.875rem)
 */
export const BodySmall = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, color = 'foreground', ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm leading-relaxed',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)
BodySmall.displayName = 'BodySmall'

/**
 * Caption - Small labels, metadata, or footnotes
 * Desktop: 12px (0.75rem), Mobile: 12px (0.75rem)
 */
export const Caption = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, color = 'muted', ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-xs leading-normal tracking-wide',
        color === 'foreground' && 'text-foreground',
        color === 'muted' && 'text-muted-foreground',
        color === 'accent' && 'text-accent',
        color === 'primary' && 'text-primary',
        color === 'primary-foreground' && 'text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)
Caption.displayName = 'Caption'

/**
 * Muted - Subtle, secondary text (convenience variant)
 * Inherits size from parent context
 */
export const Muted = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-muted-foreground', className)}
      {...props}
    >
      {children}
    </span>
  )
)
Muted.displayName = 'Muted'

// ============================================================
// Semantic Variant Shorthand
// ============================================================

/**
 * Text component with variant prop for flexibility
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, variant = 'body', color = 'foreground', className, ...props }, ref) => {
    const variants = {
      'body-lg': BodyLarge,
      'body': Body,
      'body-sm': BodySmall,
      'caption': Caption,
      'muted': Muted,
    }

    const Component = variants[variant] as any
    return (
      <Component
        ref={ref}
        color={color}
        className={className}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = 'Text'
