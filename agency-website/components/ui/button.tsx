'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui-style button with LUMEN's variants. Uses `data-slot` for styling
 * hooks and forwards refs so it can wrap magnetic / motion behaviour.
 */
const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-foreground text-background hover:shadow-[0_10px_40px_-10px_hsl(var(--foreground)/0.5)]',
        glow: 'bg-primary text-primary-foreground shadow-[0_0_0_0_hsl(var(--primary)/0.6)] hover:shadow-[0_0_40px_-2px_hsl(var(--primary)/0.6)]',
        outline:
          'border border-border bg-background/40 backdrop-blur-md text-foreground hover:bg-foreground/5',
        ghost: 'text-foreground/80 hover:text-foreground hover:bg-foreground/5',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
