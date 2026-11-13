import type { ReactNode } from 'react'
import { Camera, Radio, Siren, Smartphone, ScanEye, CircleSlash2 } from 'lucide-react'
import type { Signals } from '../data/scenes'

interface SensorPanelProps {
  signals: Signals
  mode: 'camera' | 'guardian' | 'summary'
}

interface RowProps {
  icon: ReactNode
  label: string
  status: string
  state: 'on' | 'off' | 'alert' | 'warn' | 'muted'
  tag?: string
}

function Row({ icon, label, status, state, tag }: RowProps) {
  const iconTone =
    state === 'alert'
      ? 'border-signal text-signal'
      : state === 'on'
        ? 'border-[#6CC49B]/70 text-[#9FD9BB]'
        : state === 'warn'
          ? 'border-safety text-safety'
          : 'border-paper/20 text-paper/45'

  return (
    <div className="flex items-center gap-3 border-b border-paper/15 py-2.5 last:border-b-0">
      <span className={`grid h-8 w-8 flex-none place-items-center border ${iconTone}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-paper/90">{label}</span>
          {tag && <span className="chip chip-planned">{tag}</span>}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-muted">{status}</span>
      </span>
      <span
        className={`led ${
          state === 'alert' ? 'led--alert' : state === 'on' ? 'led--on' : state === 'warn' ? 'led--warn' : ''
        }`}
      />
    </div>
  )
}

export function SensorPanel({ signals, mode }: SensorPanelProps) {
  const cameraMode = mode === 'camera'
  const obstructed = signals.obstructed

  return (
    <div>
      <Row
        icon={cameraMode ? <CircleSlash2 size={16} /> : obstructed ? <ScanEye size={16} /> : <Camera size={16} />}
        label="Câmera"
        status={
          cameraMode
            ? obstructed
              ? 'Visão obstruída / segue gravando'
              : 'Gravando / sem interpretação'
            : obstructed
              ? 'Obstrução detectada / planejado'
              : signals.hand
                ? 'Mão detectada na área'
                : 'Monitorando a área'
        }
        state={obstructed ? 'warn' : signals.hand ? 'on' : cameraMode ? 'muted' : 'on'}
        tag={obstructed && !cameraMode ? 'planejado' : undefined}
      />
      <Row
        icon={<Radio size={16} />}
        label="Sensor de vibração"
        status={
          cameraMode
            ? 'Não faz parte deste cenário'
            : signals.vibration
              ? 'Vibração detectada na instalação'
              : 'Sem vibração no momento'
        }
        state={cameraMode ? 'muted' : signals.vibration ? 'on' : 'off'}
      />
      <Row
        icon={<Siren size={16} />}
        label="Buzzer local"
        status={cameraMode ? 'Não disponível' : signals.alarm ? 'Acionado no local' : 'Em espera'}
        state={cameraMode ? 'muted' : signals.alarm ? 'alert' : 'off'}
      />
      <Row
        icon={<Smartphone size={16} />}
        label="Celular / app"
        status={
          cameraMode
            ? 'Não disponível'
            : signals.phoneAlarm
              ? 'Alarme tocando no celular'
              : signals.phone
                ? 'Notificação simulada exibida'
                : 'Alarme e aviso em desenvolvimento'
        }
        state={cameraMode ? 'muted' : signals.phoneAlarm ? 'alert' : signals.phone ? 'warn' : 'off'}
        tag={cameraMode ? undefined : 'planejado'}
      />
    </div>
  )
}
