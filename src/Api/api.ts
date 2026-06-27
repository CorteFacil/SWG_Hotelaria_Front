import type { Estado, Funcionario, Hospede, OrdemLimpeza, Pais, Quarto, Reserva, TipoDeQuarto } from '../types'

const BASE_URL = 'http://localhost:3333'
const headers = { 'Content-Type': 'application/json' }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `${response.status} ${response.statusText}`)
  }
  return response.json()
}

export const api = {
  getHospedes: (): Promise<Hospede[]> => request('/hospede'),
  getFuncionarios: (): Promise<Funcionario[]> => request('/funcionario'),
  getQuartos: (): Promise<Quarto[]> => request('/quarto'),
  getEstados: (): Promise<Estado[]> => request('/estado'),
  getPaises: (): Promise<Pais[]> => request('/pais'),



  getOrdensLimpezas: (): Promise<OrdemLimpeza[]> => request('/ordemlimpeza'),
  createOrdemLimpeza: (payload: Omit<OrdemLimpeza, 'id'>): Promise<OrdemLimpeza> => request('/ordem-limpeza', { method: 'POST', headers, body: JSON.stringify(payload) }),

  createHospede: (payload: Omit<Hospede, 'id'>): Promise<Hospede> =>
    request('/hospede', { method: 'POST', headers, body: JSON.stringify(payload) }),

  getTipos: (): Promise<TipoDeQuarto[]> => request('/tipo-de-quarto'),
  createTipo: (payload: Omit<TipoDeQuarto, 'id'>): Promise<TipoDeQuarto> =>
    request('/tipo-de-quarto', { method: 'POST', headers, body: JSON.stringify(payload) }),

  getReservas: (): Promise<Reserva[]> => request('/reserva'),
  createReserva: (payload: Omit<Reserva, 'id' | 'status'>): Promise<Reserva> =>
    request('/reserva', { method: 'POST', headers, body: JSON.stringify(payload) }),
}
