import {type VariantProps, tv} from 'tailwind-variants'
import { type ComponentProps } from 'react'

const button = tv({
   base: 'relative overflow-hidden rounded-[12px] px-7 py-3 font-semibold text-base cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-[10px] border-none',
  variants: {
    variant: {
      primary: 'bg-[rgba(0,123,255,0.9)] text-white shadow-[0_4px_15px_rgba(0,123,255,0.3)] hover:bg-[rgba(0,102,209,0.9)] hover:shadow-[0_6px_20px_rgba(0,102,209,0.4)] hover:-translate-y-[2px]',
      secondary: 'bg-[rgba(0,224,199,0.9)] text-white shadow-[0_4px_15px_rgba(0,224,199,0.3)] hover:bg-[rgba(0,189,170,0.9)] hover:shadow-[0_6px_20px_rgba(0,189,170,0.4)] hover:-translate-y-[2px]',
      outline: 'bg-[rgba(255,255,255,0.7)] text-[#007BFF] border-2 border-[rgba(0,123,255,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:bg-[rgba(0,123,255,0.1)] hover:border-[#007BFF] hover:shadow-[0_6px_20px_rgba(0,123,255,0.2)]',
    }
  },
  defaultVariants: {
    variant: 'primary',
  }
})

export type ButtonProps  = ComponentProps<"button"> & VariantProps<typeof button>

const Button = ({ children, variant,className, ...props }: ButtonProps) => {
  return (
    <button className={button({ variant, className })} {...props}>
      {children}
    </button>
  )
}

export default Button