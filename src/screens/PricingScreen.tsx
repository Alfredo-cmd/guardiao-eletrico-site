import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowLeft, Check, Clock3, Info, Minus, Play, Plus, ShieldCheck } from 'lucide-react'
import { Brand } from '../components/Brand'
import { PurchaseOverlay } from '../components/PurchaseOverlay'
import {
  formatBRL,
  MAX_QUANTITY,
  PLAN_FEATURES,
  PLANS,
  PRICE_DISCLAIMER,
  PURCHASE_DISCLAIMER,
  type FeatureState,
  type PlanId,
} from '../data/plans'

interface PricingScreenProps {
  onBack: () => void
  onCompare: () => void
  onHow: () => void
  onHome: () => void
}

function FeatureLine({ state, label }: { state: FeatureState; label: string }) {
  if (state === 'yes') {
    return (
      <li className="flex items-start gap-2 border-b border-ink/15 py-1.5 text-[10.5px] leading-snug text-[#3F4A44]">
        <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center border border-ink/25 text-ink">
          <Check size={9} strokeWidth={3} />
        </span>
        <span>{label}</span>
      </li>
    )
  }

  if (state === 'planned') {
    return (
      <li className="flex items-start gap-2 border-b border-ink/15 py-1.5 text-[10.5px] leading-snug text-muted">
        <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center border border-safety text-[#7A5A14]">
          <Clock3 size={9} />
        </span>
        <span>
          {label}{' '}
          <span className="font-mono text-[7px] uppercase tracking-[0.04em] text-[#7A5A14]">planejado</span>
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-start gap-2 border-b border-ink/10 py-1.5 text-[10.5px] leading-snug text-muted/55">
      <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center border border-ink/10">
        <Minus size={9} />
      </span>
      <span>{label}</span>
    </li>
  )
}

export function PricingScreen({ onBack, onCompare, onHow, onHome }: PricingScreenProps) {
  const [selectedId, setSelectedId] = useState<PlanId>('essencial')
  const [quantity, setQuantity] = useState(1)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const selectedPlan = PLANS.find((plan) => plan.id === selectedId) ?? PLANS[0]
  const setupTotal = selectedPlan.setup * quantity
  const monthlyTotal = selectedPlan.monthly * quantity

  return (
    <div className="app-shell min-h-dvh bg-paper pb-24 text-ink lg:pb-0">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand onClick={onBack} />
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="btn btn-ghost btn-sm hidden sm:inline-flex" onClick={onCompare}>
              <Play size={14} fill="currentColor" /> Comparar os sistemas
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
              <ArrowLeft size={15} /> Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="page flex-1">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
          <div>
            <span className="folio">
              <strong>Ficha 004</strong> / proposta comercial
            </span>
            <h1 className="display mt-3 text-[clamp(2.8rem,5.4vw,4.8rem)]">Planos e instalação</h1>
            <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-muted">
              Escolha a configuração do Guardião. Os valores são ilustrativos para o pitch e a compra é uma simulação.
              Os itens marcados como planejados ainda não fazem parte do protótipo.
            </p>
          </div>
          <span className="stamp stamp--alert">Simulação comercial</span>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div>
            <div className="border-2 border-ink">
              <div className="grid md:grid-cols-3">
                {PLANS.map((plan) => {
                  const selected = plan.id === selectedId
                  return (
                    <div
                      key={plan.id}
                      className={`flex flex-col border-b-2 border-ink last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0 ${
                        selected ? 'bg-safety/10' : 'bg-transparent'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(plan.id)}
                        className={`border-t-4 px-4 pb-2 pt-3 text-left transition-colors ${
                          selected ? 'border-t-safety' : 'border-t-ink'
                        }`}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[9px] tracking-[0.04em] text-muted">{plan.code}</span>
                          <span className={`stamp ${plan.statusTone === 'safe' ? 'stamp--safe' : 'stamp--planned'}`}>
                            {plan.status}
                          </span>
                        </div>
                        <h2 className="mt-2 text-[20px] font-bold leading-none">{plan.name}</h2>
                        <p className="mt-1.5 min-h-[30px] text-[10.5px] leading-snug text-muted">{plan.tagline}</p>
                      </button>

                      <div className="border-y border-ink/15 px-4 py-3">
                        <div className="flex items-end gap-1.5">
                          <span className="font-display text-[38px] leading-none">{formatBRL(plan.setup)}</span>
                          <span className="pb-1 font-mono text-[8px] uppercase tracking-[0.04em] text-muted">/ kit</span>
                        </div>
                        <div className="mt-1 font-mono text-[9px] text-muted">
                          {plan.monthly > 0 ? `+ ${formatBRL(plan.monthly)} / mês` : 'Sem mensalidade'}
                        </div>
                      </div>

                      <ul className="flex-1 px-4">
                        {PLAN_FEATURES.map((feature) => (
                          <FeatureLine key={feature.id} state={feature.availability[plan.id]} label={feature.label} />
                        ))}
                      </ul>

                      <div className="p-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(plan.id)}
                          className={`btn btn-sm w-full ${selected ? 'btn-primary' : 'btn-ghost'}`}
                        >
                          {selected ? (
                            <>
                              <Check size={13} /> Selecionado
                            </>
                          ) : (
                            'Selecionar'
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 border-l-2 border-safety pl-3 text-[10.5px] leading-relaxed text-muted">
              <Info size={12} className="mt-0.5 flex-none text-ink" />
              {PRICE_DISCLAIMER}
            </p>

            <div className="mt-6 flex flex-col gap-3 border-t-2 border-ink pt-4 sm:flex-row sm:items-center">
              <p className="text-[12px] text-muted">Quer entender a tecnologia antes de escolher?</p>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <button type="button" className="btn btn-ghost btn-sm" onClick={onHow}>
                  Como funciona
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onCompare}>
                  <Play size={13} fill="currentColor" /> Comparação completa
                </button>
              </div>
            </div>
          </div>

          <aside className="console p-4 lg:sticky lg:top-4">
            <span className="folio">Pedido / simulação</span>
            <h2 className="mt-1.5 text-[19px] font-bold leading-tight text-paper">Resumo da configuração</h2>

            <div className="mt-3 border-y border-paper/15 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted">Plano</span>
                <span className="text-[12px] font-semibold text-paper">{selectedPlan.name}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted">Quantidade</span>
                <div className="flex items-center border border-paper/25">
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center text-paper/70 transition-colors hover:bg-paper hover:text-ink disabled:opacity-30"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-7 text-center font-mono text-[11px] text-paper">{quantity}</span>
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center text-paper/70 transition-colors hover:bg-paper hover:text-ink disabled:opacity-30"
                    onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Kit</span>
                <span className="text-paper">{formatBRL(setupTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Mensalidade</span>
                <span className="text-paper">{monthlyTotal > 0 ? `${formatBRL(monthlyTotal)} / mês` : 'Sem mensalidade'}</span>
              </div>
              <div className="mt-2 flex items-end justify-between border-t border-paper/15 pt-2.5" aria-live="polite">
                <span className="text-[12px] font-bold text-paper">Total inicial</span>
                <span className="font-display text-[28px] leading-none text-safety">{formatBRL(setupTotal)}</span>
              </div>
            </div>

            {selectedPlan.statusTone === 'planned' && (
              <div className="mt-3 flex items-center gap-2 border border-safety/35 bg-safety/8 px-2.5 py-1.5 text-[10px] text-[#FFE9A8]">
                <Clock3 size={11} className="flex-none" /> Inclui recursos planejados
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary mt-4 w-full"
              onClick={() => setCheckoutOpen(true)}
            >
              <ShieldCheck size={15} /> Simular compra
            </button>

            <p className="mt-2.5 text-[9px] leading-relaxed text-paper/45">{PURCHASE_DISCLAIMER}</p>
          </aside>
        </div>
      </main>

      <footer className="border-t border-ink/20">
        <div className="page flex flex-wrap items-center justify-between gap-2 py-4">
          <span className="meta-line">Simulação comercial / pitch PIINC</span>
          <span className="meta-line">Nenhum pagamento real</span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-safety bg-ink px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.05em] text-paper/45">
              {selectedPlan.name} / {quantity} kit{quantity > 1 ? 's' : ''}
            </div>
            <div className="font-display text-[24px] leading-none text-safety">{formatBRL(setupTotal)}</div>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setCheckoutOpen(true)}>
            Simular compra
          </button>
        </div>
      </div>

      <AnimatePresence>
        {checkoutOpen && (
          <PurchaseOverlay
            key="purchase"
            plan={selectedPlan}
            quantity={quantity}
            onClose={() => setCheckoutOpen(false)}
            onHome={onHome}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
