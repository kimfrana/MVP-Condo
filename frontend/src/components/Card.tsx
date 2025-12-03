import { type VariantProps, tv } from "tailwind-variants";
import { type ComponentProps, type ReactNode } from "react";

const card = tv({
  base: "bg-background backdrop-blur-[10px] border border-border rounded-lg p-6 transition-all duration-700 ease-in-out shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-[5px] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:border-[rgba(0,224,199,0.5)]",
  variants: {
    variant: {
      primary: "",
      secondary: "",
      outline: ""
    }
  },
  defaultVariants: {
    variant: "primary"
  }
});

export type CardProps = ComponentProps<"div"> &
  VariantProps<typeof card> & {
    icon?: ReactNode;
    title?: string;
    description?: string;
  };

const Card = ({
  children,
  icon,
  title,
  description,
  variant,
  className,
  ...props
}: CardProps) => {
  return (
    <div className={card({ variant, className })} {...props}>
      {icon && (
        <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center mb-4 text-2xl bg-linear-to-br from-blue-500 to-teal-400 shadow-[0_4px_15px_rgba(0,123,255,0.3)]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-[1.2rem] mb-2 text-text font-semibold">{title}</h3>
      )}
      {description && (
        <p className="text-text opacity-70 leading-[1.6]">{description}</p>
      )}
      {children}
    </div>
  );
};

export default Card;
