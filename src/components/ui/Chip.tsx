export default function Chip({ label, active, onClick, disabled = false }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${active ? 'bg-[#7B2FFF] text-white shadow-[0_0_15px_rgba(123,47,255,0.5)]' : 'bg-[#b093ff]/10 text-[#b093ff] hover:bg-[#b093ff]/20'} ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  )
}
