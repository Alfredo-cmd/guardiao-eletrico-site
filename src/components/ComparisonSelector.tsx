import { Camera, ShieldCheck, Sparkles } from 'lucide-react'
import type { SimPhase } from '../data/scenes'

interface ComparisonSelectorProps {
  active: SimPhase
  mode: 'pitch' | 'explore'
  onSelect: (phase: 'camera' | 'guardian') => void
  basicMode?: boolean
}

export function ComparisonSelector({ active, mode, onSelect, basicMode = false }: ComparisonSelectorProps) {
  if (mode === 'explore') {
    return (
      <div className="flex min-h-8 items-center gap-2">
        <span className="eyebrow flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#F4C95D]" />
          Modo explorar
        </span>
        <span className={`chip ${basicMode ? 'chip-alert' : 'chip-current'}`}>
          {basicMode ? 'Câmera básica' : 'Guardião Elétrico'}
        </span>
        <span className="ml-auto hidden text-[10.5px] text-muted sm:block">
          Controle os sinais no painel lateral
        </span>
      </div>
    )
  }

  const options: { id: 'camera' | 'guardian'; label: string; short: string; icon: typeof Camera }[] = [
    { id: 'camera', label: 'Câmera básica', short: 'Câmera', icon: Camera },
    { id: 'guardian', label: 'Guardião Elétrico', short: 'Guardião', icon: ShieldCheck },
  ]

  return (
    <div className="flex min-h-8 items-center gap-2">
      <span className="eyebrow hidden items-center gap-1.5 md:flex">Comparação</span>
      <div
        className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/25 p-1"
        role="group"
        aria-label="Escolher capítulo da comparação"
      >
        {options.map(({ id, label, short, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition ${
                isActive
                  ? id === 'camera'
                    ? 'bg-[#F4C95D]/16 text-[#FFE6A8] shadow-[inset_0_0_0_1px_rgba(244,201,93,0.35)]'
                    : 'bg-[#35D6EF]/14 text-[#C6F4FD] shadow-[inset_0_0_0_1px_rgba(53,214,239,0.32)]'
                  : 'text-muted hover:bg-white/5 hover:text-paper'
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </button>
          )
        })}
      </div>
      <span className="ml-auto hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/70 lg:flex">
        Sequência guiada · ~1 min
      </span>
    </div>
  )
}
