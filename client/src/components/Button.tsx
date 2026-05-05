type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  onMouseLeave?: () => void
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="border flex gap-3 justify-center text-sm w-fit px-4 py-2 hover:bg-green-500 cursor-pointer hover:text-black"
    >
      {children}
    </button>
  )
}

export default Button
