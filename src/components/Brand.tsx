interface BrandProps {
  compact?: boolean
  onClick?: () => void
}

export function Brand({ compact = false, onClick }: BrandProps) {
  const content = (
    <>
      <span className="relative grid h-9 w-9 flex-none place-items-center bg-[#F2C230]" aria-hidden="true">
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <path d="M19.5 3 9 19h6l-2 10 10.5-16h-6Z" fill="#101617" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap font-sans text-[14.5px] font-bold tracking-[-0.01em] text-paper">
          Guardião Elétrico
        </span>
        {!compact && (
          <span className="mt-0.5 hidden font-mono text-[8.5px] tracking-[0.04em] text-paper/55 sm:block">
            Ficha PIINC / simulação
          </span>
        )}
      </span>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-80"
        title="Voltar ao início"
      >
        {content}
      </button>
    )
  }

  return <div className="flex items-center gap-2.5">{content}</div>
}
