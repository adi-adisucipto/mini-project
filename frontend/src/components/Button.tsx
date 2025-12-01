import { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    children: ReactNode
}

function Button({ children, className, ...props } : ButtonProps) {
  return (
    <button
        className={twMerge("bg-[#F6A273] rounded-[30px] w-full hover:bg-[#F6A273]/80 cursor-pointer py-2.5 lg:text-[18px] font-semibold shadow-md", className)}
        {...props}
    >
      { children }
    </button>
  )
}

export default Button
