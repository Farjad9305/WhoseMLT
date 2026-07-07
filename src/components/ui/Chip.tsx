export default function Chip({ label, active, onClick, disabled = false }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${active ? 'bg-[#FF2D8B] text-white shadow-[0_0_15px_rgba(123,47,255,0.5)]' : 'bg-[#F0EBFF]/10 text-[#F0EBFF] hover:bg-[#F0EBFF]/20'} ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  )
}
