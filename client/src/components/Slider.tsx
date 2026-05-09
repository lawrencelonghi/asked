const Slider = ({ value, onChange }: { value: number, onChange: (n: number) => void }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-4xl font-semibold">{value}</span>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-84 accent-orange-500 cursor-pointer"
      />
      {/* <div className="flex justify-between w-84 text-xs text-gray-400">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div> */}
    </div>
  )
}

export default Slider