import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Trash, Pencil, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 shadow-md text-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        cancel:
          "bg-red-500 text-secondary-foreground shadow-sm hover:bg-red-700",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        view: "text-gray-500 hover:text-green-600 h-8 p-0",
        edit: "text-gray-500 hover:text-blue-600 h-8 p-0",
        delete: "text-gray-500 hover:text-red-600 h-8 p-0",
        up: "text-gray-500 hover:text-green-600 h-8 p-0 rotate-90",
        down: "text-gray-500 hover:text-green-600 h-8 p-0 rotate-90",
        add: "bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 shadow-md text-lg",
        close: "text-gray-500 hover:text-red-600 h-8 p-0",
        pageControls: "relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm text-blue-500 hover:bg-gray-200",
        pageNumberActive: "relative inline-flex items-center px-4 py-2 border z-10 bg-indigo-50 border-indigo-500 text-indigo-600 text-sm",
        pageNumberDisabled: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 text-sm",
      },
      size: {
        default: "h-9 px-2 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    let Icon = null;
    if (variant === "edit") {
      Icon = <Pencil size={20} />;
    } else if (variant === "delete") {
      Icon = <Trash size={20} />;
    }
    else if (variant === "view") {
      Icon = <Eye size={20} />;
    }
    else if (variant === "up") {
      Icon = <ChevronLeft size={20} />;
    }
    else if (variant === "down") {
      Icon = <ChevronRight size={20} />;
    }
    else if (variant === "add") {
      Icon = <Plus size={20} />;
    }


    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon}
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button"

export { Button, buttonVariants }
