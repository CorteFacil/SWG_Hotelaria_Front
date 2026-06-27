export interface Pais {
  id: number
  nome: string
  sigla_iso2: string
  sigla_iso3: string
  ddi_telefone: number
}

export type PaisPayLoad = Omit<Pais, 'id'>

export interface Estado {
  id: number
  nomeEstado: string
  siglaUf: string
  regiaoGeografica?: string
  paisisoId?: number
  paisiso?: Pais
}


export type EstadoPayLoad = Omit<Estado, 'id'>


export interface Hospede {
  id: number
  nome: string
  cpfPassaporte: string
  email: string
  telefone: string
  nascimento: string
  estadoId: number
  estado?: Estado
  criadoEm?: string
  atualizadoEm?: string
}


export type HospedePayLoad = Omit<Hospede, 'id'>


export interface TipoDeQuarto {
  id: number
  nome: string
  descricao: string
  precoDiaria: number
  capacidadeMax: number
  tipoCama: string
  tamanho: number
}


export type TipoDeQuartoPayLoad = Omit<TipoDeQuarto, 'id'>


export interface Quarto {
  id: number
  numero: string
  andar: number
  status_quarto: 'Disponivel' | 'Ocupado' | 'Limpeza' | 'Manutencao'
  tipoDeQuartoId: number
  tipoDeQuarto?: TipoDeQuarto
}


export type QuartoPayLoad = Omit<Quarto, 'id'>


export interface Reserva {
  id: number
  entradaAcomodacao: string
  saidaAcomodacao: string
  numeroPessoas: number
  observacao?: string
  status: number
  hospedeId: number
  tipoDeQuartoId: number
  hospede?: Hospede
  tipoDeQuarto?: TipoDeQuarto
  criadoEm?: string
  atualizadoEm?: string
}

export type ReservaPayLoad = Omit<Reserva, 'id'>

export interface Estadia {
  id: number
  checkIn: string
  checkOut: string
  valorTotalEstadia: number
  reservaId: number
  funcionarioId: number
  quartoId: number
  reserva?: Reserva
  funcionario?: Funcionario
  quarto?: Quarto
}
export type EstadiaPayLoad = Omit<Estadia, 'id'>


export interface Funcionario {
  id: number
  nome: string
  email: string
  telefone: string
  cargo: string
  salario: number
}

export type FuncionarioPayLoad = Omit<Funcionario, 'id'>

export interface OrdemLimpeza {
  id: number
  quartoId: number
  funcionarioId: number
  status: string
  observacao?: string
  inicio: string
  fim: string
}

export type OrdemLimpezaPayLoad = Omit<OrdemLimpeza, 'id'>
