import { useState, type FormEvent } from 'react'
import type { PaisIso } from '../types'

interface EstadoFormProps {
  paises: PaisIso[]
  error?: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function EstadoForm({
  paises,
  error,
  onSubmit,
  onCancel
}: EstadoFormProps) {

  const [nomeEstado, setNomeEstado] = useState('')
  const [siglaUf, setSiglaUf] = useState('')
  const [regiaoGeografica, setRegiaoGeografica] = useState('')
  const [paisisoId, setPaisisoId] = useState('')

  const getErro = (palavrasChave: string[]) => {
    if (!error) return null

    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error]

    const encontradas = sentencas.filter(sentenca =>
      palavrasChave.some(p =>
        sentenca.toLowerCase().includes(p.toLowerCase())
      )
    )

    return encontradas.length > 0
      ? encontradas.join(' ').trim()
      : null
  }

  const erroNome = getErro(['Nome'])
  const erroSigla = getErro(['Sigla'])
  const erroPais = getErro(['País'])
  const erroRegiao = getErro(['Região'])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
      nomeEstado,
      siglaUf,
      regiaoGeografica,
      paisisoId: Number(paisisoId)
    })
  }

  function handleClear() {
    setNomeEstado('')
    setSiglaUf('')
    setRegiaoGeografica('')
    setPaisisoId('')
  }

  return (
    <form
      className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-[#EF9B1B]/20"
      onSubmit={handleSubmit}
    >

      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-black text-[#EF9B1B]">
          Cadastro de Estado
        </h2>
      </div>

      <div className="space-y-6">

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Nome do Estado
          </label>

          <input
            value={nomeEstado}
            onChange={(e) => setNomeEstado(e.target.value)}
            required
            type="text"
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroNome
                ? 'border border-red-400 focus:border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroNome && (
            <span className="text-xs text-red-500">
              {erroNome}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Sigla UF
          </label>

          <input
            value={siglaUf}
            onChange={(e) =>
              setSiglaUf(
                e.target.value.toUpperCase().slice(0, 2)
              )
            }
            required
            maxLength={2}
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroSigla
                ? 'border border-red-400 focus:border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroSigla && (
            <span className="text-xs text-red-500">
              {erroSigla}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            País
          </label>

          <select
            value={paisisoId}
            onChange={(e) => setPaisisoId(e.target.value)}
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroPais
                ? 'border border-red-400 focus:border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          >
            <option value="">Selecione...</option>

            {paises.map((pais) => (
              <option
                key={pais.id}
                value={pais.id}
              >
                {pais.nome}
              </option>
            ))}
          </select>

          {erroPais && (
            <span className="text-xs text-red-500">
              {erroPais}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Região Geográfica
          </label>

          <input
            value={regiaoGeografica}
            onChange={(e) =>
              setRegiaoGeografica(e.target.value)
            }
            required
            className={`w-full p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${
              erroRegiao
                ? 'border border-red-400 focus:border-red-400'
                : 'border border-[#222020]/20 focus:border-[#EF9B1B]'
            }`}
          />

          {erroRegiao && (
            <span className="text-xs text-red-500">
              {erroRegiao}
            </span>
          )}
        </div>

      </div>

      <div className="mt-8 flex gap-3">

        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2.5 rounded-lg font-medium border border-[#222020]/20 hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg font-medium border border-[#222020]/20 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg font-medium bg-[#EF9B1B] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Salvar
        </button>

      </div>

    </form>
  )
}