import { HTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface ContainerProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode
}

function Container({children, className, ...props}: ContainerProps) {
  return (
    <div 
      {...props}
      className={twMerge("bg-[#87786C] p-5 rounded-[20px] lg:w-[1080px] lg:max-w-[1080px] md:w-2xl md:max-w-2xl w-[353px] max-w-[353px]", className)}>
        {children}
    </div>
  )
}

export default Container
