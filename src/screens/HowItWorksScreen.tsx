import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock3,
  EyeOff,
  Hand,
  Info,
  Play,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Smartphone,
  Waves,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { ExplainerFlow } from '../components/ExplainerFlow'

interface HowItWorksScreenProps {
  onBack: () => void
  onCompare: () => void
}

const implemented = [
  { icon: Hand, text: 'Detecção de mão por visão computacional' },
  { icon: Waves, text: 'Sensor de vibração na instalação elétrica' },
  { icon: ShieldCheck, text: 'Regra combinada: mão e vibração' },
  { icon: Siren, text: 'Buzzer local como resposta imediata' },
]

const planned = [
  { icon: EyeOff, text: 'Alerta de obstrução da câmera' },
  { icon: ShieldAlert, text: 'Sensor de adulteração física' },
  { icon: Smartphone, text: 'Notificação no celular com tipo, horário e endereço cadastrado' },
  { icon: Siren, text: 'Alarme sonoro no celular pelo app do Guardião' },
  { icon: Camera, text: 'Infraestrutura de comunicação remota' },
]

export function HowItWorksScreen({ onBack, onCompare }: HowItWorksScreenProps) {
  return (
    <div className="app-shell">
      <header className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Brand onClick={onBack} />
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
          <ArrowLeft size={15} /> Voltar
        </button>
      </header>

      <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-10 sm:px-8">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-[#35D6EF]" />
            <span className="eyebrow eyebrow-cyan">Entenda a lógica</span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Como o Guardião <span className="gradient-text">pensa?</span>
          </h1>
          <p className="mt-3 max-w-[600px] text-[13.5px] leading-relaxed text-muted sm:text-[14.5px]">
            O protótipo atual não tenta adivinhar tudo. Ele combina dois sinais independentes — imagem e vibração — e
            só dispara o alarme local quando os dois confirmam a mesma situação.
          </p>
        </div>

        <div className="mt-7 grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <ExplainerFlow />

          <div className="flex flex-col gap-4">
            <section className="panel p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-[17px] font-semibold text-paper">Protótipo atual</h2>
                <span className="chip chip-live chip-dot">Implementado</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                O que já faz parte do estágio descrito pelo projeto.
              </p>
              <ul className="mt-3 space-y-2">
                {implemented.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md border border-[#57D9B2]/25 bg-[#57D9B2]/8 text-[#57D9B2]">
                      <Icon size={12.5} />
                    </span>
                    <span className="text-[12px] leading-snug text-paper/80">{text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-[17px] font-semibold text-paper">Funcionalidades planejadas</h2>
                <span className="chip chip-planned">Futuro</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                A simulação ilustra a visão futura. Nada aqui é enviado de verdade.
              </p>
              <ul className="mt-3 space-y-2">
                {planned.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md border border-[#F4C95D]/25 bg-[#F4C95D]/8 text-[#F4C95D]">
                      <Icon size={12.5} />
                    </span>
                    <span className="text-[12px] leading-snug text-paper/80">{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-[#F4C95D]/20 bg-[#F4C95D]/4 px-2.5 py-2 text-[10.5px] leading-snug text-[#FFE9B1]/75">
                <Clock3 size={12} className="mt-0.5 flex-none" />
                Obstrução exige tratamento de iluminação, perda de sinal e falsos positivos. Não é trivial nem infalível.
              </p>
            </section>

            <section className="panel-flat p-4">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-[#9DB0C7]" />
                <h2 className="font-display text-[13.5px] font-semibold text-paper/90">Limites desta demonstração</h2>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] leading-snug text-muted">
                <li className="flex gap-1.5">
                  <Check size={11} className="mt-0.5 flex-none text-[#57D9B2]" /> Nenhuma chamada de emergência ou
                  notificação real é enviada.
                </li>
                <li className="flex gap-1.5">
                  <Check size={11} className="mt-0.5 flex-none text-[#57D9B2]" /> A localização é um endereço cadastrado,
                  não GPS em tempo real.
                </li>
                <li className="flex gap-1.5">
                  <Check size={11} className="mt-0.5 flex-none text-[#57D9B2]" /> O sistema detecta sinais de possível
                  interferência — não impede todos os furtos.
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/2 p-4 sm:flex-row sm:items-center">
          <p className="text-[12px] text-muted">
            Quer ver a mesma cena nas duas versões, do início ao fim?
          </p>
          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={onCompare}>
              <Play size={14} fill="currentColor" /> Comparação completa
              <ArrowRight size={14} />
            </button>
            <button type="button" className="btn btn-quiet btn-sm" onClick={onBack}>
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
