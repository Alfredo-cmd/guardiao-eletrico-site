interface BrandProps {
  compact?: boolean
  onClick?: () => void
}

export function Brand({ compact = false, onClick }: BrandProps) {
  const content = (
    <>
      <span className="relative grid h-10 w-10 flex-none place-items-center rounded-[13px] border border-[#35D6EF]/35 bg-[#35D6EF]/10 shadow-[0_0_24px_-8px_rgba(53,214,239,0.6)]">
        <svg viewBox="0 0 32 32" className="h-[22px] w-[22px]" aria-hidden="true">
          <path
            d="M16 3.4 26 7.2v8.1c0 6.3-4.2 9.9-10 11.9-5.8-2-10-5.6-10-11.9V7.2Z"
            fill="none"
            stroke="#35D6EF"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M17.6 9.2 12 17.6h3.5l-1 5.2 5.7-8.6h-3.5Z" fill="#F4C95D" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#57D9B2] shadow-[0_0_8px_#57D9B2]" />
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap font-display text-[14px] font-semibold uppercase leading-none tracking-[0.13em] text-paper sm:text-[15px]">
          Guardião Elétrico
        </span>
        {!compact && (
          <span className="mt-1 hidden font-mono text-[8.5px] uppercase leading-none tracking-[0.2em] text-[#9DB0C7]/75 sm:block">
            Pitch PIINC · simulação
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
        className="flex items-center gap-2.5 rounded-xl text-left transition hover:opacity-85"
        aria-label="Voltar ao início"
      >
        {content}
      </button>
    )
  }

  return <div className="flex items-center gap-2.5">{content}</div>
}
