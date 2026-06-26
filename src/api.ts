import type { Estado, Funcionario, Hospede, OrdemLimpeza, PaisIso, Quarto, Reserva, TipoDeQuarto, Estadia } from './types'

const BASE_URL = 'http://localhost:3333'
const headers = { 'Content-Type': 'application/json' }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `${response.status} ${response.statusText}`)
  }
  if (response.status === 204) return null as any;
  try {
    return await response.json();
  } catch {
    return null as any;
  }
}

export const api = {
  // ==========================================
  // HÓSPEDES
  // ==========================================
  getHospedes: (): Promise<Hospede[]> => request('/hospede'),
  getHospedeById: (id: number): Promise<Hospede> => request(`/hospede/${id}`),
  findHospedeByDoc: (doc: string): Promise<Hospede | null> => 
    request<Hospede[]>('/hospede')
      .then(hospedes => hospedes.find(h => h.cpfPassaporte === doc) || null)
      .catch((err) => {
        console.error("Erro ao buscar hóspedes para o filtro:", err);
        return null;
      }),
  createHospede: (payload: Omit<Hospede, 'id'>): Promise<Hospede> =>
    request('/hospede', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateHospede: (id: number, payload: Partial<Hospede>): Promise<Hospede> =>
    request(`/hospede/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteHospede: (id: number): Promise<void> => request(`/hospede/${id}`, { method: 'DELETE' }),
  getHospedesByEstado: (id: number): Promise<Hospede[]> => request(`/hospede/estado/${id}`),

  // ==========================================
  // FUNCIONÁRIOS
  // ==========================================
  getFuncionarios: (): Promise<Funcionario[]> => request('/funcionario'),
  getFuncionarioById: (id: number): Promise<Funcionario> => request(`/funcionario/${id}`),
  createFuncionario: (payload: Omit<Funcionario, 'id'>): Promise<Funcionario> => 
    request('/funcionario', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateFuncionario: (id: number, payload: Partial<Funcionario>): Promise<Funcionario> => 
    request(`/funcionario/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteFuncionario: (id: number): Promise<void> => request(`/funcionario/${id}`, { method: 'DELETE' }),

  // ==========================================
  // PAÍSES
  // ==========================================
  getPaises: (): Promise<PaisIso[]> => request('/pais'),
  getPaisById: (id: number): Promise<PaisIso> => request(`/pais/${id}`),
  createPais: (payload: Omit<PaisIso, 'id'>): Promise<PaisIso> => 
    request('/pais', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updatePais: (id: number, payload: Partial<PaisIso>): Promise<PaisIso> => 
    request(`/pais/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deletePais: (id: number): Promise<void> => request(`/pais/${id}`, { method: 'DELETE' }),

  // ==========================================
  // ORDEM DE LIMPEZA
  // ==========================================
  getOrdensLimpezas: (): Promise<OrdemLimpeza[]> => request('/ordemlimpeza'),
  createOrdemLimpeza: (payload: Omit<OrdemLimpeza, 'id'>): Promise<OrdemLimpeza> => 
    request('/ordem-limpeza', { method: 'POST', headers, body: JSON.stringify(payload) }),
  getOrdemLimpezaById: (id: number): Promise<OrdemLimpeza> => request(`/ordemlimpeza/${id}`),
  updateOrdemLimpeza: (id: number, payload: Partial<OrdemLimpeza>): Promise<OrdemLimpeza> => 
    request(`/ordemlimpeza/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteOrdemLimpeza: (id: number): Promise<void> => request(`/ordemlimpeza/${id}`, { method: 'DELETE' }),
  getOrdensLimpezaByQuarto: (quartoId: number): Promise<OrdemLimpeza[]> => request(`/ordemlimpeza/quarto/${quartoId}`),
  getOrdensLimpezaByFuncionario: (funcionarioId: number): Promise<OrdemLimpeza[]> => request(`/ordemlimpezas/funcionario/${funcionarioId}`),
  getOrdensLimpezaQuartoPeriodo: (quartoId: number, inicio: string, fim: string): Promise<OrdemLimpeza[]> => request(`/ordemlimpeza/findByQuartoAndPeriodo/${quartoId}/${inicio}/${fim}`),
  getOrdensLimpezaFuncionarioPeriodo: (funcionarioId: number, inicio: string, fim: string): Promise<OrdemLimpeza[]> => request(`/ordemlimpeza/findByFuncionarioAndPeriodo/${funcionarioId}/${inicio}/${fim}`),
  getOrdensLimpezaCompleta: (funcionarioId: number, quartoId: number, inicio: string, fim: string): Promise<OrdemLimpeza[]> => request(`/ordemlimpeza/findByQuartoAndFuncionarioAndPeriodo/${funcionarioId}/${quartoId}/${inicio}/${fim}`),
  getContadorLimpeza: (status: string, inicio: string, fim: string): Promise<any> => request(`/ordemlimpeza/contadorByFuncionarioAndPeriodo/${status}/${inicio}/${fim}`),

  // ==========================================
  // QUARTOS
  // ==========================================
  getQuartos: (): Promise<Quarto[]> => request('/quarto'),
  getQuartoById: (id: number): Promise<Quarto> => request(`/quarto/${id}`),
  createQuarto: (payload: Omit<Quarto, 'id'>): Promise<Quarto> => request('/quarto', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateQuarto: (id: number, payload: Partial<Quarto>): Promise<Quarto> => request(`/quarto/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteQuarto: (id: number): Promise<void> => request(`/quarto/${id}`, { method: 'DELETE' }),

  // ==========================================
  // ESTADOS
  // ==========================================
  getEstados: (): Promise<Estado[]> => request('/estado'),
  getEstadoById: (id: number): Promise<Estado> => request(`/estado/${id}`),
  createEstado: (payload: Omit<Estado, 'id'>): Promise<Estado> => request('/estado', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateEstado: (id: number, payload: Partial<Estado>): Promise<Estado> => request(`/estado/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteEstado: (id: number): Promise<void> => request(`/estado/${id}`, { method: 'DELETE' }),

  // ==========================================
  // TIPOS DE QUARTO
  // ==========================================
  getTiposDeQuarto: (): Promise<TipoDeQuarto[]> => request('/tipo-de-quarto'),
  createTipoDeQuarto: (payload: Omit<TipoDeQuarto, 'id'>): Promise<TipoDeQuarto> => request('/tipo-de-quarto', { method: 'POST', headers, body: JSON.stringify(payload) }),
  getTipoDeQuartoById: (id: number): Promise<TipoDeQuarto> => request(`/tipo-de-quarto/${id}`),
  updateTipoDeQuarto: (id: number, payload: Partial<TipoDeQuarto>): Promise<TipoDeQuarto> => request(`/tipo-de-quarto/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteTipoDeQuarto: (id: number): Promise<void> => request(`/tipo-de-quarto/${id}`, { method: 'DELETE' }),

  // ==========================================
  // RESERVAS
  // ==========================================
  getReservas: (): Promise<Reserva[]> => request('/reserva'),
  getReservaById: (id: number): Promise<Reserva> => request(`/reserva/${id}`),
  createReserva: (payload: Omit<Reserva, 'id' | 'status'>): Promise<Reserva> => request('/reserva', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateReserva: (id: number, payload: Partial<Reserva>): Promise<Reserva> => request(`/reserva/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteReserva: (id: number): Promise<void> => request(`/reserva/${id}`, { method: 'DELETE' }),
  getReservasHospede: (hospedeId: number): Promise<Reserva[]> => request(`/reserva/hospede/${hospedeId}`),
  getReservasPorTipoQuarto: (tipoDeQuartoId: number): Promise<Reserva[]> => request(`/reserva/tipo/${tipoDeQuartoId}`),
  confirmarReservasAutomaticas: (): Promise<any> => request('/reserva/confirmar-automaticas', { method: 'POST' }),
  getRelatorioReservasPeriodo: (dataInicio?: string, dataFim?: string, hospedeId?: number, tipoDeQuartoId?: number): Promise<any> => {
    // Constrói os Query Params de forma inteligente (só adiciona se existir)
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    if (hospedeId) params.append('hospedeId', String(hospedeId));
    if (tipoDeQuartoId) params.append('tipoDeQuartoId', String(tipoDeQuartoId));
    
    const queryString = params.toString();
    const url = queryString ? `/reserva/relatorio/periodo?${queryString}` : '/reserva/relatorio/periodo';
    
    return request(url);
  },

  getRelatorioFaturamento: (dataInicio?: string, dataFim?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    const queryString = params.toString();
    const url = queryString ? `/reserva/relatorio/faturamento?${queryString}` : '/reserva/relatorio/faturamento';
    
    return request(url);
  },

  // ==========================================
  // ESTADIAS
  // ==========================================
  getEstadias: (): Promise<Estadia[]> => request('/estadia'),
  getEstadiaById: (id: number): Promise<Estadia> => request(`/estadia/${id}`),
  createEstadia: (payload: Omit<Estadia, 'id'>): Promise<Estadia> => request('/estadia', { method: 'POST', headers, body: JSON.stringify(payload) }),
  updateEstadia: (id: number, payload: Partial<Estadia>): Promise<Estadia> => request(`/estadia/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }),
  deleteEstadia: (id: number): Promise<void> => request(`/estadia/${id}`, { method: 'DELETE' }),
  getRelatorioLucroEstadia: (dataInicio: string, dataFim: string): Promise<any> => request(`/estadia/relatorio/lucroPorEstadia/${dataInicio}/${dataFim}`),
  getRelatorioProcedencia: (): Promise<any> => request('/estadia/relatorio/procedenciaGeografica'),
}