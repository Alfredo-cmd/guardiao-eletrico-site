export type PlanId = 'essencial' | 'conectado' | 'total'
export type FeatureState = 'yes' | 'no' | 'planned'

export interface PlanFeature {
  id: string
  label: string
  availability: Record<PlanId, FeatureState>
}

export interface Plan {
  id: PlanId
  code: string
  name: string
  tagline: string
  setup: number
  monthly: number
  status: string
  statusTone: 'safe' | 'planned'
}

/**
 * Valores ilustrativos para o pitch. Edite aqui para usar os preços reais.
 * Os recursos marcados como "planned" ainda não fazem parte do protótipo.
 */
export const PLANS: Plan[] = [
  {
    id: 'essencial',
    code: '01',
    name: 'Essencial',
    tagline: 'O kit do protótipo: câmera, sensor de vibração e buzzer local.',
    setup: 349,
    monthly: 0,
    status: 'Protótipo atual',
    statusTone: 'safe',
  },
  {
    id: 'conectado',
    code: '02',
    name: 'Conectado',
    tagline: 'A mesma proteção local com alarme e aviso no celular pelo app.',
    setup: 549,
    monthly: 19.9,
    status: 'Planejado',
    statusTone: 'planned',
  },
  {
    id: 'total',
    code: '03',
    name: 'Total',
    tagline: 'Adiciona detecção de obstrução e adulteração física ao conjunto.',
    setup: 749,
    monthly: 29.9,
    status: 'Planejado',
    statusTone: 'planned',
  },
]

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: 'kit',
    label: 'Câmera + sensor de vibração',
    availability: { essencial: 'yes', conectado: 'yes', total: 'yes' },
  },
  {
    id: 'rule',
    label: 'Regra local mão + vibração',
    availability: { essencial: 'yes', conectado: 'yes', total: 'yes' },
  },
  {
    id: 'buzzer',
    label: 'Buzzer local',
    availability: { essencial: 'yes', conectado: 'yes', total: 'yes' },
  },
  {
    id: 'phoneAlarm',
    label: 'Alarme no celular pelo app',
    availability: { essencial: 'no', conectado: 'planned', total: 'planned' },
  },
  {
    id: 'notice',
    label: 'Notificação com endereço cadastrado',
    availability: { essencial: 'no', conectado: 'planned', total: 'planned' },
  },
  {
    id: 'tamper',
    label: 'Obstrução e adulteração',
    availability: { essencial: 'no', conectado: 'no', total: 'planned' },
  },
]

export const PRICE_DISCLAIMER =
  'Valores ilustrativos para o pitch. Instalação, frete e impostos não estão incluídos. Recursos marcados como planejados ainda não fazem parte do protótipo.'

export const PURCHASE_DISCLAIMER =
  'Simulação de compra. Nenhum pagamento é processado, nenhum dado é enviado e nenhum pedido é criado.'

export const MAX_QUANTITY = 5

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
