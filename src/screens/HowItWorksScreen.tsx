import {
  ArrowLeft,
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
    <div className="app-shell bg-paper text-ink">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand onClick={onBack} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
            <ArrowLeft size={15} /> Voltar
          </button>
        </div>
      </header>

      <main className="page flex-1">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
          <div>
            <span className="folio">
              <strong>Ficha 003</strong> / lógica do sistema
            </span>
            <h1 className="display mt-3 text-[clamp(2.8rem,5.4vw,4.8rem)]">Como o Guardião pensa?</h1>
            <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
              O protótipo atual não tenta adivinhar tudo. Ele combina dois sinais independentes — imagem e vibração —
              e só dispara o alarme local quando os dois confirmam a mesma situação.
            </p>
          </div>
          <span className="stamp stamp--planned">Interativo</span>
        </div>

        <div className="mt-8 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ExplainerFlow />

          <div className="flex flex-col gap-7">
            <section className="border-t-2 border-ink pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[18px] font-bold">Protótipo atual</h2>
                <span className="stamp stamp--safe">Implementado</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                O que já faz parte do estágio descrito pelo projeto.
              </p>
              <ul className="mt-3">
                {implemented.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 border-b border-ink/15 py-2">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center border border-ink/25 text-ink">
                      <Icon size={12.5} />
                    </span>
                    <span className="text-[12px] leading-snug text-[#3F4A44]">{text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t-2 border-ink pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[18px] font-bold">Funcionalidades planejadas</h2>
                <span className="stamp stamp--planned">Futuro</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
                A simulação ilustra a visão futura. Nada aqui é enviado de verdade.
              </p>
              <ul className="mt-3">
                {planned.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 border-b border-ink/15 py-2">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center border border-ink/25 text-ink">
                      <Icon size={12.5} />
                    </span>
                    <span className="text-[12px] leading-snug text-[#3F4A44]">{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-start gap-2 border-l-2 border-safety pl-3 text-[10.5px] leading-snug text-muted">
                <Clock3 size={12} className="mt-0.5 flex-none" />
                Obstrução exige tratamento de iluminação, perda de sinal e falsos positivos. Não é trivial nem
                infalível.
              </p>
            </section>

            <section className="border-t border-ink/25 pt-3">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-ink" />
                <h2 className="text-[13.5px] font-bold">Limites desta demonstração</h2>
              </div>
              <ul className="mt-2">
                {[
                  'Nenhuma chamada de emergência ou notificação real é enviada.',
                  'A localização é um endereço cadastrado, não GPS em tempo real.',
                  'O sistema detecta sinais de possível interferência — não impede todos os furtos.',
                ].map((item) => (
                  <li key={item} className="flex gap-2 border-b border-ink/10 py-1.5 text-[11px] leading-snug text-muted">
                    <Check size={11} className="mt-0.5 flex-none text-safe" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="console mt-10 flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
          <p className="text-[12px] text-paper/70">Quer ver a mesma cena nas duas versões, do início ao fim?</p>
          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={onCompare}>
              <Play size={14} fill="currentColor" /> Comparação completa
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
