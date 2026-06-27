import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import type { Pais, Estado } from '../types'
import HospedeForm from '../components/HospedeForm'
import { UserPlus, CheckCircle2, Loader2 } from 'lucide-react'
import { listarEstados } from '@/Api/estados'
import { listarPaises } from '@/Api/paises'
import { criarHospede } from '@/Api/hospedes'

export default function HospedePage() {
  const [, setLocation] = useLocation() // HOOK DE NAVEGAÇÃO
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])

  const [feedback, setFeedback] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFormData()
  }, [])

  async function loadFormData() {
    try {
      const [loadedEstados, loadedPaises] = await Promise.all([
        listarEstados(),
        listarPaises(),
      ])
      setEstados(loadedEstados)
      setPaises(loadedPaises)
    } catch (err) {
      setError(`Erro ao carregar formulário: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  function mostrarSucesso(mensagem: string) {
    setFeedback(mensagem);
    // Reduzido para 2.5 segundos porque vamos mudar de tela logo em seguida
    setTimeout(() => setFeedback(''), 2500);
  }

  async function handleCreateHospede(data: any) {
    setError('')
    try {
      const payloadSeguro = {
        ...data,
        estadoId: Number(data.estadoId),
        paisId: Number(data.paisId),
        estado: { id: Number(data.estadoId) }
      };

      await criarHospede(payloadSeguro)

      mostrarSucesso('Cadastro realizado com sucesso!  Redirecionando...')

      setTimeout(() => {
        setLocation('/reserva');
      }, 2500);

    } catch (err) {
      let msg = (err as Error).message;
      try {
        const parsed = JSON.parse(msg);
        if (parsed.message) msg = parsed.message;
      } catch (e) { }

      setError(msg);
      throw new Error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] font-admin text-[#222020] flex flex-col items-center py-4 px-4 sm:px-6 relative selection:bg-[#EF9B1B]/30">

      <div className="w-full max-w-3xl animate-fade-in">

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#EF9B1B]/20 text-[#EF9B1B]">
            <UserPlus size={36} />
          </div>
          <h1 className="text-4xl font-black text-[#222020] mb-3">
            Crie sua Conta
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            Preencha seus dados abaixo para se tornar nosso hóspede e ter acesso à plataforma de reservas.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-[#EF9B1B]/20 shadow-sm">
            <Loader2 className="w-10 h-10 text-[#EF9B1B] animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-lg">Preparando formulário...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <HospedeForm
              estados={estados}
              paises={paises}
              error={error}
              onSubmit={handleCreateHospede}
              onCancel={() => {
                setError('');
                window.history.back();
              }}
            />
          </div>
        )}

      </div>

      {feedback && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-xl animate-fade-in max-w-md">
          <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
          <p className="font-bold text-base leading-snug">{feedback}</p>
        </div>
      )}
    </div>
  )
}