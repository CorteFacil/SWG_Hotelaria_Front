import { useState, useEffect, type SyntheticEvent } from 'react'
import { CalendarDays, BedDouble, Users, AlignLeft } from 'lucide-react'

interface TipoDeQuarto { id: number; nome: string }

interface ReservaFormProps {
  tipos: TipoDeQuarto[]
  hospedeId: number
  error?: string 
  reservaEditando?: any 
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function ReservaForm({ tipos, hospedeId, error, reservaEditando, onSubmit, onCancel }: ReservaFormProps) {
  const [entradaAcomodacao, setEntradaAcomodacao] = useState('')
  const [saidaAcomodacao, setSaidaAcomodacao] = useState('')
  const [numeroPessoas, setNumeroPessoas] = useState('1')
  const [observacao, setObservacao] = useState('')
  const [tipoDeQuartoId, setTipoDeQuartoId] = useState('')

  useEffect(() => {
    if (reservaEditando) {
      const formatData = (dataStr: string) => dataStr ? dataStr.split('T')[0] : '';
      setEntradaAcomodacao(formatData(reservaEditando.entradaAcomodacao));
      setSaidaAcomodacao(formatData(reservaEditando.saidaAcomodacao));
      setNumeroPessoas(String(reservaEditando.numeroPessoas));
      setObservacao(reservaEditando.observacao || '');
      setTipoDeQuartoId(String(reservaEditando.tipoDeQuartoId));
    } else {
      setEntradaAcomodacao('');
      setSaidaAcomodacao('');
      setNumeroPessoas('1');
      setObservacao('');
      setTipoDeQuartoId('');
    }
  }, [reservaEditando]);

  const getErro = (inclui: string[], exclui: string[] = []) => {
    if (!error) return null;
    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error];
    const encontradas = sentencas.filter(s => 
      inclui.some(p => s.toLowerCase().includes(p.toLowerCase())) &&
      !exclui.some(e => s.toLowerCase().includes(e.toLowerCase()))
    );
    return encontradas.length > 0 ? encontradas.join(' ').trim() : null;
  };

  const erroEntrada = getErro(['Entrada', 'data', 'reserva']);
  const erroSaida = getErro(['Saída', 'Saida']);
  const erroQuarto = getErro(['Quarto'], ['capacidade', 'pessoas']);
  const erroPessoas = getErro(['Pessoas', 'capacidade']);
  const erroObs = getErro(['Observação', 'Observacao']);

  const sentencas = error ? (error.match(/[^.!?]+[.!?]+/g) || [error]) : [];
  const errosUsados = [erroEntrada, erroSaida, erroQuarto, erroPessoas, erroObs].filter(Boolean).join(' ');
  const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({
      entradaAcomodacao, saidaAcomodacao, numeroPessoas: Number(numeroPessoas),
      observacao, hospedeId, tipoDeQuartoId: Number(tipoDeQuartoId),
    })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
          <CalendarDays className="text-[#EF9B1B]" /> {reservaEditando ? 'Editar Reserva' : 'Nova Reserva'}
        </h2>
        <p className="text-gray-500 text-sm">Vincule o hóspede a uma acomodação no período desejado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
              <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Entrada</label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={entradaAcomodacao} onChange={(e) => setEntradaAcomodacao(e.target.value)} required type="date" 
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                    erroEntrada ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                  }`} />
              </div>
              {erroEntrada && <span className="text-xs text-red-500 block mt-1">{erroEntrada}</span>}
          </div>
          
          <div className="space-y-2">
              <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Saída</label>
              <div className="relative">
                <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={saidaAcomodacao} onChange={(e) => setSaidaAcomodacao(e.target.value)} required type="date" min={entradaAcomodacao}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                    erroSaida ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                  }`} />
              </div>
              {erroSaida && <span className="text-xs text-red-500 block mt-1">{erroSaida}</span>}
          </div>  

          <div className="space-y-2">
              <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Tipo de Quarto</label>
              <div className="relative">
                <BedDouble size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select value={tipoDeQuartoId} onChange={(e) => setTipoDeQuartoId(e.target.value)} required 
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 appearance-none ${
                    erroQuarto ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                  }`}>
                  <option value="">Selecionar</option>
                  {tipos?.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}
                </select>
              </div>
              {erroQuarto && <span className="text-xs text-red-500 block mt-1">{erroQuarto}</span>}
          </div>

          <div className="space-y-2">
              <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nº de Pessoas</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                required type="number" min="1" placeholder="Ex: 2"
                value={numeroPessoas} onChange={e => setNumeroPessoas(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
              />
              </div>
              {erroPessoas && <span className="text-xs text-red-500 block mt-1">{erroPessoas}</span>}
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Observações</label>
            <div className="relative">
              <AlignLeft size={18} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
              <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={3} maxLength={255} placeholder="Descreva solicitações especiais (Ex: Berço extra...)"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none resize-none transition-all text-gray-800 ${
                  erroObs ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}></textarea>
            </div>
            {erroObs && <span className="text-xs text-red-500 block mt-1">{erroObs}</span>}
        </div>

        {erroGeral && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm">
            {erroGeral}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors">
              {reservaEditando ? 'Salvar Alterações' : 'Confirmar Reserva'}
            </button>
        </div>  
      </form>
    </div>
  )
}