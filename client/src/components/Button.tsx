import React from 'react'
type ButtonProps = {
  text: string
  onClick?: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="border text-sm w-fit px-4 py-2 hover:bg-white cursor-pointer hover:text-black"
    >
      {text}
    </button>
  )
}

export default Button