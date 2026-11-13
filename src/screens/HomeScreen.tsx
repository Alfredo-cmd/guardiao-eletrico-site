import { Play, SlidersHorizontal } from 'lucide-react'
import { Brand } from '../components/Brand'
import { HouseScene } from '../components/HouseScene'
import { formatBRL, PLANS } from '../data/plans'

interface HomeScreenProps {
  onCompare: () => void
  onExplore: () => void
  onHow: () => void
  onPricing: () => void
}

const idleSignals = {
  recording: true,
  hand: false,
  vibration: false,
  obstructed: false,
  tamper: false,
  alarm: false,
  phone: false,
  phoneAlarm: false,
}

export function HomeScreen({ onCompare, onExplore, onHow, onPricing }: HomeScreenProps) {
  return (
    <div className="app-shell bg-paper text-ink">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="meta-line hidden text-paper/55 md:block">Residência demonstrativa / Cambará-PR</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm whitespace-nowrap"
              onClick={onPricing}
            >
              <span>Planos e preços</span>
            </button>
          </div>
        </div>
      </header>

      <main className="page page-wide flex-1">
        <div className="home-grid">
          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/25 pb-2">
              <span className="folio">
                <strong>Ficha 001</strong> / residência demonstrativa
              </span>
              <span className="stamp stamp--safe">Simulação ilustrativa</span>
            </div>

            <h1 className="display mt-7 text-[clamp(4.5rem,9.6vw,8.4rem)] text-ink">
              Guardião
              <br />
              Elétrico
            </h1>

            <p className="mt-6 max-w-[30ch] text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink">
              Uma mesma ameaça.
              <br />
              Duas respostas.
            </p>

            <p className="mt-4 max-w-[56ch] text-[14.5px] leading-relaxed text-muted">
              Uma câmera que apenas registra e um sistema que combina sinais para identificar uma possível interferência
              e reagir na hora. Acompanhe a mesma cena nas duas versões.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-primary btn-lg" onClick={onCompare}>
                <Play size={17} fill="currentColor" /> Comparar os sistemas
              </button>
              <button type="button" className="btn btn-ghost btn-lg" onClick={onExplore}>
                <SlidersHorizontal size={17} /> Explorar o Guardião
              </button>
            </div>

            <button type="button" className="btn btn-quiet mt-3 text-[12.5px]" onClick={onHow}>
              Entenda a lógica da demonstração
            </button>

            <div className="mt-9 border-t-2 border-ink">
              <div className="grid sm:grid-cols-2">
                <div className="border-b border-ink/20 py-4 sm:border-b-0 sm:border-r sm:pr-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-safe" />
                    <span className="text-[13px] font-bold">Protótipo atual</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    Detecção de mão e vibração. Resposta imediata pelo buzzer local.
                  </p>
                </div>
                <div className="py-4 sm:pl-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-safety" />
                    <span className="text-[13px] font-bold">Planejado</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    Obstrução, adulteração, alarme e aviso no celular pelo app.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-[56ch] border-l-2 border-ink/30 pl-3 text-[11px] leading-relaxed text-muted">
              A comparação é com uma câmera básica sem alertas inteligentes, não com todas as câmeras do mercado.
            </p>

            <div className="mt-6 border-t-2 border-ink pt-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.05em] text-muted">Proposta comercial</span>
                  <p className="mt-1 text-[15px] font-bold leading-tight">
                    Kit local a partir de <span className="bg-safety px-1">{formatBRL(PLANS[0].setup)}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">Valores ilustrativos / instalação não inclusa.</p>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={onPricing}>
                  Ver planos e simular compra
                </button>
              </div>
            </div>
          </section>

          <section className="min-w-0">
            <div className="plate plate--feature">
              <div className="plate-head">
                <span>
                  <strong>Prancha 01</strong> / fachada e instalação
                </span>
                <span>Escala 1:50</span>
              </div>

              <div className="relative">
                <HouseScene
                  signals={idleSignals}
                  character={0}
                  pose="idle"
                  highlight="house"
                  lens="guardian"
                  compact
                />
                <div className="absolute left-3 top-3 z-20 flex items-center gap-2 border border-paper/30 bg-ink px-2 py-1.5">
                  <span className="h-1.5 w-1.5 bg-safety" />
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.06em] text-paper/75">
                    Monitoramento noturno
                  </span>
                </div>
              </div>

              <div className="plate-foot">
                <span>
                  <b>CAM 01</b> câmera
                </span>
                <span>
                  <b>SV 02</b> vibração
                </span>
                <span>
                  <b>BZ 01</b> buzzer
                </span>
                <span className="ml-auto">
                  <b>22:41</b> simulação
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start justify-between gap-5">
              <p className="max-w-[36ch] text-[10.5px] leading-relaxed text-muted">
                Ilustração técnica da residência. O monitoramento e os alertas são simulados inteiramente no navegador.
              </p>
              <span className="flex-none font-mono text-[9px] uppercase tracking-[0.06em] text-muted">Fig. 01</span>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-ink/20">
        <div className="page page-wide flex flex-wrap items-center justify-between gap-2 py-4">
          <span className="meta-line">Simulação ilustrativa / pitch PIINC</span>
          <span className="meta-line">Funciona offline / sem coleta de dados</span>
        </div>
      </footer>
    </div>
  )
}
