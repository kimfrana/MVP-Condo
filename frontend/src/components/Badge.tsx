import { type VariantProps, tv } from 'tailwind-variants';
import { type ComponentProps, type ReactNode } from 'react';

const badge = tv({
  base: `
    inline-block px-4 py-2
    rounded-[20px]
    text-[0.9rem] font-semibold
    backdrop-blur-[10px]
    transition-all duration-300 ease-in-out
    cursor-pointer
    select-none
  `,
  variants: {
    variant: {
      primary: `
        bg-[rgba(0,123,255,0.15)]
        text-[#007BFF]
        border border-[rgba(0,123,255,0.3)]
        hover:bg-[rgba(0,123,255,0.25)]
        hover:scale-105
      `,
      secondary: `
        bg-[rgba(0,224,199,0.15)]
        text-[#00BDAA]
        border border-[rgba(0,224,199,0.3)]
        hover:bg-[rgba(0,224,199,0.25)]
        hover:scale-105
      `,
    },
    size: {
      small: 'px-3 py-1 text-sm',
      medium: 'px-4 py-2 text-[0.9rem]',
      large: 'px-5 py-2 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badge> & {
  children: ReactNode;
};

const Badge = ({ variant, size, children, ...props }: BadgeProps) => {
  return (
    <span className={badge({ variant, size })} {...props}>
      {children}
    </span>
  );
};

export default Badge;
