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
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors"
      style={{
        borderColor:
          state === 'alert'
            ? 'rgba(255,104,116,0.38)'
            : state === 'on'
              ? 'rgba(87,217,178,0.3)'
              : state === 'warn'
                ? 'rgba(244,201,93,0.34)'
                : 'var(--line)',
        background:
          state === 'alert'
            ? 'rgba(255,104,116,0.07)'
            : state === 'on'
              ? 'rgba(87,217,178,0.055)'
              : state === 'warn'
                ? 'rgba(244,201,93,0.05)'
                : 'rgba(255,255,255,0.02)',
      }}
    >
      <span
        className="grid h-9 w-9 flex-none place-items-center rounded-[10px] border"
        style={{
          borderColor:
            state === 'alert'
              ? 'rgba(255,104,116,0.35)'
              : state === 'on'
                ? 'rgba(87,217,178,0.35)'
                : state === 'warn'
                  ? 'rgba(244,201,93,0.35)'
                  : 'var(--line)',
          color:
            state === 'alert'
              ? '#FF6874'
              : state === 'on'
                ? '#57D9B2'
                : state === 'warn'
                  ? '#F4C95D'
                  : '#7E93A8',
          background: 'rgba(8,17,31,0.45)',
        }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[12px] font-semibold text-paper/90">{label}</span>
          {tag && (
            <span className="rounded-full border border-[#F4C95D]/35 bg-[#F4C95D]/8 px-1.5 py-px font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#F4C95D]/90">
              {tag}
            </span>
          )}
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
    <div className="flex flex-col gap-2">
      <Row
        icon={cameraMode ? <CircleSlash2 size={17} /> : obstructed ? <ScanEye size={17} /> : <Camera size={17} />}
        label="Câmera"
        status={
          cameraMode
            ? obstructed
              ? 'Visão obstruída — segue gravando'
              : 'Gravando — sem interpretação'
            : obstructed
              ? 'Obstrução detectada · planejado'
              : signals.hand
                ? 'Mão detectada na área'
                : 'Monitorando a área'
        }
        state={obstructed ? 'warn' : signals.hand ? 'on' : cameraMode ? 'muted' : 'on'}
        tag={obstructed && !cameraMode ? 'planejado' : undefined}
      />
      <Row
        icon={<Radio size={17} />}
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
        icon={<Siren size={17} />}
        label="Buzzer local"
        status={cameraMode ? 'Não disponível' : signals.alarm ? 'Acionado no local' : 'Em espera'}
        state={cameraMode ? 'muted' : signals.alarm ? 'alert' : 'off'}
      />
      <Row
        icon={<Smartphone size={17} />}
        label="Celular · app"
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
