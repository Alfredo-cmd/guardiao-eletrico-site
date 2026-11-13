import { Camera, ShieldCheck } from 'lucide-react'
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
        <span className="meta-line">Modo</span>
        <span className={`chip ${basicMode ? 'chip-alert' : 'chip-current'}`}>
          {basicMode ? 'Câmera básica' : 'Guardião Elétrico'}
        </span>
        <span className="ml-auto hidden text-[10.5px] text-muted sm:block">
          Controle os sinais no painel lateral
        </span>
      </div>
    )
  }

  const options: { id: 'camera' | 'guardian'; label: string; icon: typeof Camera; code: string }[] = [
    { id: 'camera', label: 'Câmera básica', icon: Camera, code: '01' },
    { id: 'guardian', label: 'Guardião Elétrico', icon: ShieldCheck, code: '02' },
  ]

  return (
    <div className="flex min-h-8 flex-wrap items-center gap-2">
      <span className="meta-line hidden md:inline">Comparar</span>
      <div
        className="flex items-stretch border border-ink"
        role="group"
        aria-label="Escolher capítulo da comparação"
      >
        {options.map(({ id, label, icon: Icon, code }, index) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                index === 0 ? 'border-r border-ink' : ''
              } ${
                isActive
                  ? 'bg-safety text-ink'
                  : 'bg-transparent text-muted hover:bg-ink hover:text-paper'
              }`}
            >
              <span className="hidden font-mono text-[8px] opacity-65 sm:inline">{code}</span>
              <Icon size={12} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <span className="ml-auto hidden font-mono text-[9px] tracking-[0.03em] text-muted lg:block">
        Sequência guiada / ~1 min
      </span>
    </div>
  )
}
