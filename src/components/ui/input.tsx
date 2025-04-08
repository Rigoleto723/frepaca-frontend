import * as React from "react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority";
import { Search } from 'lucide-react';

const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-gray-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        search: "bg-transparent font-normal text-gray-800 pl-10",
        body: "bg-gray-50 text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div className="relative">
        {variant === "search" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(inputVariants({ variant, className }))}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

