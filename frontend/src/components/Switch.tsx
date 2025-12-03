import { type VariantProps, tv } from 'tailwind-variants';
import type { ComponentProps, FC } from 'react';

const switchStyles = tv({
  base: `
    relative inline-block w-[60px] h-[32px]
  `,
  variants: {
    variant: {
      default: 'bg-gray-300',
      primary: 'bg-blue-500',
      secondary: 'bg-teal-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type SwitchProps = ComponentProps<'input'> & {
  variant?: VariantProps<typeof switchStyles>['variant'];
};

const Switch: FC<SwitchProps> = ({ variant, className, ...props }) => {
  return (
    <label className={`relative inline-block w-[60px] h-8`}>
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0 peer"
        {...props}
      />
      <span
        className={`
          absolute top-0 left-0 right-0 bottom-0
          rounded-full
          bg-[rgba(224,224,226,0.5)]
          transition-all duration-300 ease-in-out
          peer-checked:bg-primary
        `}
      ></span>
      <span
        className={`
          absolute left-1 top-1 w-6 h-6 
          bg-white rounded-full shadow-md
          transition-all duration-300 ease-in-out
          peer-checked:translate-x-7
        `}
      ></span>
    </label>
  );
};

export default Switch;
