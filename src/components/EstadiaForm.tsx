import { useState, type FormEvent } from 'react'
import type { Reserva, Funcionario, Quarto } from '../types'

interface EstadiaFormProps {
  reservas: Reserva[]
  funcionarios: Funcionario[]
  quartos: Quarto[]
  error?: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function EstadiaForm({
  reservas,
  funcionarios,
  quartos,
  error,
  onSubmit,
  onCancel
}: EstadiaFormProps) {

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [valorTotalEstadia, setValorTotalEstadia] = useState('')
  const [reservaId, setReservaId] = useState('')
  const [funcionarioId, setFuncionarioId] = useState('')
  const [quartoId, setQuartoId] = useState('')

  const getErro = (palavrasChave: string[]) => {
    if (!error) return null

    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error]

    const encontradas = sentencas.filter((s) =>
      palavrasChave.some((p) =>
        s.toLowerCase().includes(p.toLowerCase())
      )
    )

    return encontradas.length > 0
      ? encontradas.join(' ').trim()
      : null
  }

  const erroCheckIn = getErro(['check-in'])
  const erroCheckOut = getErro(['check-out'])
  const erroValor = getErro(['valor'])
  const erroReserva = getErro(['reserva'])
  const erroFuncionario = getErro(['funcionário'])
  const erroQuarto = getErro(['quarto'])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
      checkIn,
      checkOut,
      valorTotalEstadia: Number(valorTotalEstadia),
      reserva: {
        id: Number(reservaId)
      },
      funcionario: {
        id: Number(funcionarioId)
      },
      quarto: {
        id: Number(quartoId)
      }
    })
  }

  return (
    <form
      className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-[#EF9B1B]/20"
      onSubmit={handleSubmit}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-black text-[#EF9B1B]">
          Nova Estadia
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Check-in
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroCheckIn
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroCheckIn && (
            <span className="text-xs text-red-500">{erroCheckIn}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Check-out
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroCheckOut
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroCheckOut && (
            <span className="text-xs text-red-500">{erroCheckOut}</span>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Valor Total da Estadia
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            value={valorTotalEstadia}
            onChange={(e) => setValorTotalEstadia(e.target.value)}
            required
            placeholder="0,00"
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroValor
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroValor && (
            <span className="text-xs text-red-500">{erroValor}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Reserva
          </label>

          <select
            value={reservaId}
            onChange={(e) => setReservaId(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroReserva
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          >
            <option value="">Selecione</option>

            {reservas.map((reserva) => (
              <option key={reserva.id} value={reserva.id}>
                Reserva #{reserva.id}
              </option>
            ))}
          </select>

          {erroReserva && (
            <span className="text-xs text-red-500">{erroReserva}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Funcionário
          </label>

          <select
            value={funcionarioId}
            onChange={(e) => setFuncionarioId(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroFuncionario
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          >
            <option value="">Selecione</option>

            {funcionarios.map((funcionario) => (
              <option key={funcionario.id} value={funcionario.id}>
                {funcionario.nome}
              </option>
            ))}
          </select>

          {erroFuncionario && (
            <span className="text-xs text-red-500">{erroFuncionario}</span>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Quarto
          </label>

          <select
            value={quartoId}
            onChange={(e) => setQuartoId(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroQuarto
                ? 'border border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          >
            <option value="">Selecione</option>

            {quartos
              .filter((quarto) => quarto.status_quarto === 'Disponivel')
              .map((quarto) => (
                <option key={quarto.id} value={quarto.id}>
                  Quarto {quarto.numero} - {quarto.tipoDeQuarto?.nome}
                </option>
              ))}
          </select>

          {erroQuarto && (
            <span className="text-xs text-red-500">{erroQuarto}</span>
          )}
        </div>

      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg font-medium border border-[#222020]/20 text-[#222020] hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg font-medium bg-[#EF9B1B] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}