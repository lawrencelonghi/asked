import { useState } from "react"

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  onMouseLeave?: () => void
  nonClickable?: boolean
}

const Button = ({ children, onClick, nonClickable }: ButtonProps) => {
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    if (nonClickable) return
    setClicked(true)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`border flex gap-3 justify-center text-sm w-fit px-4 py-2
        ${nonClickable ? "cursor-default" : "cursor-pointer"}
        ${clicked && !nonClickable
          ? "bg-green-500 text-black"
          : "hover:bg-green-500 hover:text-black"
        }`}
    >
      {children}
    </button>
  )
}

export default Button