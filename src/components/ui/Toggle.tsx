export default function Toggle({ on, onChange, disabled = false }: { on: boolean, onChange: (v: boolean) => void, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      className={`w-12 h-6 rounded-full p-1 transition-colors relative ${on ? 'bg-[#39FF14]' : 'bg-[#b093ff]/20'} ${disabled ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  )
}
