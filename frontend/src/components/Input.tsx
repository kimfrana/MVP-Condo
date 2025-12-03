import { type VariantProps, tv } from 'tailwind-variants';
import { forwardRef, type ComponentProps } from 'react';

const input = tv({
  base: `
    w-full px-4 py-3
    bg-[rgba(255,255,255,0.8)] backdrop-blur-[10px]
    border-2 rounded-md
    text-[#1C1C1E] text-base
    transition-all duration-300 ease-in-out
    outline-none
    placeholder:text-[#1C1C1E] placeholder:opacity-50
    focus:ring-4 focus:ring-[rgba(0,123,255,0.1)] focus:bg-[rgba(255,255,255,0.95)]
  `,
  variants: {
    variant: {
      default: 'border-[rgba(224,224,226,0.5)] focus:border-[#007BFF]',
      error: 'border-red-400 focus:border-red-500',
      success: 'border-green-400 focus:border-green-500',
    },
    size: {
      small: 'px-3 py-2 text-sm',
      medium: 'px-4 py-3 text-base',
      large: 'px-5 py-4 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'medium',
  },
});

export type InputProps = ComponentProps<'input'> & VariantProps<typeof input> & {
  error?: string;
  label?: string; 
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, size, className, error,label,required, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
         {label && (
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={input({ variant, size, className })}
          {...props}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

export default Input;