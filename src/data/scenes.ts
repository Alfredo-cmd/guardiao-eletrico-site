export type SimPhase = 'camera' | 'guardian' | 'summary'
export type Tone = 'neutral' | 'warn' | 'good' | 'alert' | 'planned'
export type Highlight = 'camera' | 'box' | 'sensor' | 'buzzer' | 'phone' | 'house' | null

export interface Signals {
  recording: boolean
  hand: boolean
  vibration: boolean
  obstructed: boolean
  tamper: boolean
  alarm: boolean
  phone: boolean
  phoneAlarm: boolean
}

export type SignalsKey = keyof Signals

export interface SimStep {
  id: string
  phase: SimPhase
  phaseLabel: string
  title: string
  caption: string
  detail: string
  duration: number
  tone: Tone
  character: number
  pose: 'idle' | 'walk' | 'reach'
  signals: Signals
  highlight: Highlight
  planned?: boolean
  statusLine: string
}

export const ADDRESS = 'Residência demonstrativa — Cambará/PR'
export const ADDRESS_SHORT = 'Cambará/PR'
export const DEMO_TIME = '22:41'

const baseSignals: Signals = {
  recording: false,
  hand: false,
  vibration: false,
  obstructed: false,
  tamper: false,
  alarm: false,
  phone: false,
  phoneAlarm: false,
}

const s = (patch: Partial<Signals>): Signals => ({ ...baseSignals, ...patch })

export const steps: SimStep[] = [
  {
    id: 'cameraIntro',
    phase: 'camera',
    phaseLabel: 'Câmera básica',
    title: 'Tudo tranquilo',
    caption: 'Uma câmera básica grava a fachada. Nenhum alerta inteligente está configurado neste cenário.',
    detail: 'A câmera registra imagens, mas não interpreta o que vê. Neste cenário fictício, não há regra automática de aviso.',
    duration: 5500,
    tone: 'neutral',
    character: 0,
    pose: 'idle',
    signals: s({ recording: true }),
    highlight: 'camera',
    statusLine: 'Gravando — sem análise inteligente',
  },
  {
    id: 'cameraApproach',
    phase: 'camera',
    phaseLabel: 'Câmera básica',
    title: 'Alguém se aproxima',
    caption: 'Uma pessoa se aproxima da instalação elétrica externa.',
    detail: 'A cena é apenas gravada. A câmera não possui uma regra configurada para reagir a essa aproximação.',
    duration: 7000,
    tone: 'warn',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true }),
    highlight: 'box',
    statusLine: 'Gravando. Nenhum alerta automático.',
  },
  {
    id: 'cameraObstructed',
    phase: 'camera',
    phaseLabel: 'Câmera básica',
    title: 'A visão é obstruída',
    caption: 'A visão da câmera é obstruída de forma abstrata. A imagem fica escura.',
    detail: 'Sem análise de imagem, a câmera não entende que perdeu a visão da área. Ela segue apenas gravando o que consegue.',
    duration: 5500,
    tone: 'alert',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, obstructed: true }),
    highlight: 'camera',
    statusLine: 'Visão obstruída — a câmera não interpreta',
  },
  {
    id: 'cameraOutcome',
    phase: 'camera',
    phaseLabel: 'Câmera básica',
    title: 'Registro, não resposta',
    caption: 'A ocorrência só seria percebida depois. Registrar não é o mesmo que reagir na hora.',
    detail: 'Neste cenário, nenhum aviso foi disparado. A gravação existe, mas resposta imediata não.',
    duration: 7000,
    tone: 'alert',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, obstructed: true }),
    highlight: 'house',
    statusLine: 'Ocorrência percebida apenas depois',
  },
  {
    id: 'guardianIntro',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Agora, o Guardião',
    caption: 'A mesma casa, a mesma cena. Câmera e sensor de vibração passam a ser monitorados em conjunto.',
    detail: 'Protótipo atual: visão computacional para detectar mão + sensor de vibração na instalação elétrica.',
    duration: 5000,
    tone: 'good',
    character: 0,
    pose: 'idle',
    signals: s({ recording: true }),
    highlight: 'house',
    statusLine: 'Câmera e sensor de vibração ativos',
  },
  {
    id: 'guardianApproach',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Dois sinais em observação',
    caption: 'A mesma aproximação à caixa elétrica. O Guardião acompanha imagem e vibração ao mesmo tempo.',
    detail: 'A câmera observa a área e o sensor acompanha a vibração da instalação. Cada sinal é avaliado separadamente.',
    duration: 6500,
    tone: 'good',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true }),
    highlight: 'box',
    statusLine: 'Monitorando dois sinais',
  },
  {
    id: 'handDetected',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Mão detectada',
    caption: 'A câmera reconhece uma mão na área monitorada.',
    detail: 'Sinal 1 de 2. Sozinho, ele ainda não dispara o alarme local.',
    duration: 5000,
    tone: 'good',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, hand: true }),
    highlight: 'camera',
    statusLine: 'Mão detectada — aguardando o segundo sinal',
  },
  {
    id: 'vibrationDetected',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Condição confirmada',
    caption: 'Mão detectada E vibração detectada. A regra do protótipo confirma a condição de alerta.',
    detail: 'Sinal 2 de 2. A combinação dos dois sinais satisfaz a regra e aciona a resposta local.',
    duration: 5000,
    tone: 'alert',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, hand: true, vibration: true, alarm: true }),
    highlight: 'sensor',
    statusLine: 'Regra satisfeita — buzzer acionado',
  },
  {
    id: 'localAlarm',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Alarme local',
    caption:
      'O buzzer dispara no local. Pelo app do Guardião, o alarme também pode tocar no celular (recurso planejado).',
    detail:
      'Regra do protótipo: mão && vibração → alarme local. O alarme no celular via app é uma funcionalidade planejada.',
    duration: 7000,
    tone: 'alert',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, hand: true, vibration: true, alarm: true, phoneAlarm: true }),
    highlight: 'buzzer',
    statusLine: 'Alarme local ativo / alarme no celular planejado',
  },
  {
    id: 'plannedTamperDemo',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Obstrução e adulteração',
    caption:
      'No futuro, obstrução e adulteração acionariam alertas próprios — e também o alarme local e no celular.',
    detail:
      'Recursos planejados: análise de imagem com critérios de confirmação e sensor de adulteração. A consequência inclui alarme, mas a lógica ainda não está implementada.',
    duration: 7000,
    tone: 'planned',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, obstructed: true, tamper: true, alarm: true, phoneAlarm: true }),
    highlight: 'camera',
    planned: true,
    statusLine: 'Alarme como consequência / obstrução/adulteração planejadas',
  },
  {
    id: 'plannedPhoneAlert',
    phase: 'guardian',
    phaseLabel: 'Guardião Elétrico',
    title: 'Aviso no celular',
    caption:
      'Com o alarme ativo, a notificação simulada mostraria o tipo de evento, o horário e a localização cadastrada do imóvel.',
    detail: 'Planejado: aviso remoto no celular do proprietário. Sem GPS em tempo real e sem chamadas reais nesta versão.',
    duration: 7500,
    tone: 'planned',
    character: 1,
    pose: 'reach',
    signals: s({ recording: true, obstructed: true, tamper: true, alarm: true, phone: true }),
    highlight: 'phone',
    planned: true,
    statusLine: 'Notificação fictícia / alarme local ativo',
  },
  {
    id: 'summary',
    phase: 'summary',
    phaseLabel: 'Resumo',
    title: 'Duas respostas diferentes',
    caption: 'Câmera básica: registro sem alerta neste cenário. Guardião: detecção combinada e resposta local.',
    detail: 'Alertas remotos, obstrução e adulteração seguem como funcionalidades planejadas.',
    duration: 0,
    tone: 'good',
    character: 1,
    pose: 'idle',
    signals: s({ recording: true, hand: true, vibration: true, alarm: true }),
    highlight: null,
    statusLine: 'Fim da demonstração',
  },
]

export const stepById = (id: string) => steps.find((step) => step.id === id)

export const cameraSteps = steps.filter((step) => step.phase === 'camera')
export const guardianSteps = steps.filter((step) => step.phase === 'guardian' && !step.planned)
export const plannedSteps = steps.filter((step) => step.planned)

export interface ExploreState {
  basicMode: boolean
  hand: boolean
  vibration: boolean
  obstruction: boolean
  tamper: boolean
  phoneAlarm: boolean
}

export const initialExploreState: ExploreState = {
  basicMode: false,
  hand: false,
  vibration: false,
  obstruction: false,
  tamper: false,
  phoneAlarm: false,
}

export interface ExploreReadout {
  alarm: boolean
  obstructionAlert: boolean
  tamperAlert: boolean
  title: string
  caption: string
  tone: Tone
}

export function readExplore(state: ExploreState): ExploreReadout {
  const { basicMode, hand, vibration, obstruction, tamper } = state
  const obstructionAlert = !basicMode && obstruction
  const tamperAlert = !basicMode && tamper
  const prototypeAlarm = !basicMode && hand && vibration
  const plannedAlarm = !basicMode && !prototypeAlarm && (obstructionAlert || tamperAlert)

  if (basicMode) {
    return {
      alarm: false,
      obstructionAlert: false,
      tamperAlert: false,
      title: 'Câmera básica',
      caption: 'A câmera apenas grava. Nenhum sinal gera alerta automático neste modo de comparação.',
      tone: 'neutral',
    }
  }

  if (prototypeAlarm) {
    return {
      alarm: true,
      obstructionAlert,
      tamperAlert,
      title: 'Alarme local ativo',
      caption:
        'Mão detectada E vibração detectada. A regra do protótipo foi satisfeita e o buzzer disparou. O alarme no celular é um recurso planejado.',
      tone: 'alert',
    }
  }

  if (plannedAlarm) {
    const both = obstructionAlert && tamperAlert
    return {
      alarm: true,
      obstructionAlert,
      tamperAlert,
      title: both
        ? 'Alarme planejado'
        : obstructionAlert
          ? 'Alarme por obstrução'
          : 'Alarme por adulteração',
      caption: both
        ? 'No futuro, obstrução e adulteração também acionariam o alarme local e no celular. Demonstração de recurso planejado.'
        : obstructionAlert
          ? 'No futuro, a obstrução da câmera também acionaria o alarme local e no celular, sem depender da detecção de mão.'
          : 'No futuro, a adulteração física também acionaria o alarme local e no celular. Demonstração de recurso planejado.',
      tone: 'planned',
    }
  }

  if (hand) {
    return {
      alarm: false,
      obstructionAlert,
      tamperAlert,
      title: 'Mão detectada',
      caption: 'Falta a vibração para o alarme local. A regra do protótipo exige os dois sinais.',
      tone: 'good',
    }
  }

  if (vibration) {
    return {
      alarm: false,
      obstructionAlert,
      tamperAlert,
      title: 'Vibração detectada',
      caption: 'Falta a detecção de mão para o alarme local. A regra do protótipo exige os dois sinais.',
      tone: 'good',
    }
  }

  return {
    alarm: false,
    obstructionAlert,
    tamperAlert,
    title: 'Tudo tranquilo',
    caption: 'Câmera e sensor monitorando. Ative os sinais abaixo para ver a lógica do Guardião em ação.',
    tone: 'neutral',
  }
}
