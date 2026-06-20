import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-navy-800 dark:bg-gold-500 text-white dark:text-navy-950 hover:bg-navy-700 dark:hover:bg-gold-400 shadow-sm hover:shadow-gold",
        secondary: "border border-border bg-background hover:bg-secondary",
        ghost: "hover:bg-secondary hover:text-foreground",
        outline: "border border-navy-200 dark:border-navy-700 bg-transparent hover:bg-navy-50 dark:hover:bg-navy-900",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-gold",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
