import { useState, useEffect, type FormEvent } from 'react'
import { CalendarDays, BedDouble, Users, DollarSign, UserCircle } from 'lucide-react'
import type { Reserva, Funcionario, Quarto, Estadia } from '../types'

interface EstadiaFormProps {
  reservas: Reserva[]
  funcionarios: Funcionario[]
  quartos: Quarto[]
  error?: string
  estadiaEditando?: Partial<Estadia> | null
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function EstadiaForm({
  reservas,
  funcionarios,
  quartos,
  error,
  estadiaEditando,
  onSubmit,
  onCancel,
}: EstadiaFormProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [valorTotalEstadia, setValorTotalEstadia] = useState('')
  const [reservaId, setReservaId] = useState('')
  const [funcionarioId, setFuncionarioId] = useState('')
  const [quartoId, setQuartoId] = useState('')

  useEffect(() => {
    if (estadiaEditando) {
      setCheckIn((estadiaEditando.checkIn ?? '').split('T')[0])
      setCheckOut((estadiaEditando.checkOut ?? '').split('T')[0])
      setValorTotalEstadia(String(estadiaEditando.valorTotalEstadia ?? ''))
      setReservaId(String(estadiaEditando.reservaId ?? estadiaEditando.reserva?.id ?? ''))
      setFuncionarioId(String(estadiaEditando.funcionarioId ?? estadiaEditando.funcionario?.id ?? ''))
      setQuartoId(String(estadiaEditando.quartoId ?? estadiaEditando.quarto?.id ?? ''))
    } else {
      setCheckIn('')
      setCheckOut('')
      setValorTotalEstadia('')
      setReservaId('')
      setFuncionarioId('')
      setQuartoId('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadiaEditando?.id])

  const getErro = (inclui: string[], exclui: string[] = []) => {
    if (!error) return null
    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error]
    const encontradas = sentencas.filter(s =>
      inclui.some(p => s.toLowerCase().includes(p.toLowerCase())) &&
      !exclui.some(e => s.toLowerCase().includes(e.toLowerCase()))
    )
    return encontradas.length > 0 ? encontradas.join(' ').trim() : null
  }

  const erroCheckIn      = getErro(['check-in'])
  const erroCheckOut     = getErro(['check-out'])
  const erroValor        = getErro(['valor'])
  const erroReserva      = getErro(['reserva'])
  const erroFuncionario  = getErro(['funcionário', 'funcionario'])
  const erroQuarto       = getErro(['quarto'])

  const sentencas = error ? (error.match(/[^.!?]+[.!?]+/g) || [error]) : []
  const errosUsados = [erroCheckIn, erroCheckOut, erroValor, erroReserva, erroFuncionario, erroQuarto].filter(Boolean).join(' ')
  const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({
      checkIn,
      checkOut,
      valorTotalEstadia: Number(valorTotalEstadia),
      reservaId: Number(reservaId),
      funcionarioId: Number(funcionarioId),
      quartoId: Number(quartoId),
    })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
          <CalendarDays className="text-[#EF9B1B]" />
          {estadiaEditando ? 'Editar Estadia' : 'Nova Estadia'}
        </h2>
        <p className="text-gray-500 text-sm">Vincule uma reserva a um quarto e registre os dados da estadia.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Check-in */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Check-in</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroCheckIn
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroCheckIn && <span className="text-xs text-red-500 block mt-1">{erroCheckIn}</span>}
          </div>

          {/* Check-out */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Check-out</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                required
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroCheckOut
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroCheckOut && <span className="text-xs text-red-500 block mt-1">{erroCheckOut}</span>}
          </div>

          {/* Reserva */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Reserva</label>
            <div className="relative">
              <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                required
                value={reservaId}
                onChange={(e) => setReservaId(e.target.value)}
                className={`w-full appearance-none pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroReserva
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              >
                <option value="">Selecione...</option>
                {reservas.map((r) => (
                  <option key={r.id} value={r.id}>
                    Reserva #{r.id}{r.hospede ? ` — ${r.hospede.nome}` : ''}
                  </option>
                ))}
              </select>
            </div>
            {erroReserva && <span className="text-xs text-red-500 block mt-1">{erroReserva}</span>}
          </div>

          {/* Funcionário */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Funcionário</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                required
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(e.target.value)}
                className={`w-full appearance-none pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroFuncionario
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              >
                <option value="">Selecione...</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
            {erroFuncionario && <span className="text-xs text-red-500 block mt-1">{erroFuncionario}</span>}
          </div>

          {/* Quarto */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Quarto</label>
            <div className="relative">
              <BedDouble size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                required
                value={quartoId}
                onChange={(e) => setQuartoId(e.target.value)}
                className={`w-full appearance-none pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroQuarto
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              >
                <option value="">Selecione...</option>
                {quartos
                  .filter((q) => q.status_quarto === 'Disponivel' || String(q.id) === quartoId)
                  .map((q) => (
                    <option key={q.id} value={q.id}>
                      Quarto {q.numero} — {q.tipoDeQuarto?.nome}
                      {q.status_quarto !== 'Disponivel' ? ` (${q.status_quarto})` : ''}
                    </option>
                  ))}
              </select>
            </div>
            {erroQuarto && <span className="text-xs text-red-500 block mt-1">{erroQuarto}</span>}
          </div>

          {/* Valor Total */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Valor Total</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="number"
                required
                step="0.01"
                min="0"
                placeholder="0,00"
                value={valorTotalEstadia}
                onChange={(e) => setValorTotalEstadia(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroValor
                    ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                    : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroValor && <span className="text-xs text-red-500 block mt-1">{erroValor}</span>}
          </div>

        </div>

        {erroGeral && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm">
            {erroGeral}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors"
          >
            {estadiaEditando ? 'Salvar Alterações' : 'Registrar Estadia'}
          </button>
        </div>
      </form>
    </div>
  )
}
