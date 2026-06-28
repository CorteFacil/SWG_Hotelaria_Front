import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import type { Pais } from '../types'
import FuncionarioForm from '../components/FuncionarioForm'
import { Briefcase, CheckCircle2, Loader2 } from 'lucide-react'
import { listarPaises } from '@/Api/paises'
import { criarFuncionario } from '@/Api/funcionarios'

export default function FuncionarioPage() {
    const [, setLocation] = useLocation()
    const [paises, setPaises] = useState<Pais[]>([])

    const [feedback, setFeedback] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFormData()
    }, [])

    async function loadFormData() {
        try {
            const loadedPaises = await listarPaises()
            setPaises(loadedPaises)
        } catch (err) {
            setError(`Erro ao carregar formulário: ${(err as Error).message}`)
        } finally {
            setLoading(false)
        }
    }

    function mostrarSucesso(mensagem: string) {
        setFeedback(mensagem)
        setTimeout(() => setFeedback(''), 2500)
    }

    async function handleCreateFuncionario(data: any) {
        setError('')
        try {
            const payloadSeguro = {
                ...data,
                paisisoId: Number(data.paisisoId),
            }

            await criarFuncionario(payloadSeguro)

            mostrarSucesso('Funcionário cadastrado com sucesso! Redirecionando...')

            setTimeout(() => {
                setLocation('/funcionarios')
            }, 2500)
        } catch (err) {
            let msg = (err as Error).message
            try {
                const parsed = JSON.parse(msg)
                if (parsed.message) msg = parsed.message
            } catch (_) { }

            setError(msg)
            throw new Error(msg)
        }
    }

    return (
        <div className="min-h-screen bg-[#FFF8EF] font-admin text-[#222020] flex flex-col items-center py-4 px-4 sm:px-6 relative selection:bg-[#EF9B1B]/30">

            <div className="w-full max-w-3xl animate-fade-in">

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#EF9B1B]/20 text-[#EF9B1B]">
                        <Briefcase size={36} />
                    </div>
                    <h1 className="text-4xl font-black text-[#222020] mb-3">
                        Cadastro de Funcionário
                    </h1>
                    <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
                        Preencha os dados abaixo para registrar um novo funcionário no sistema.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-[#EF9B1B]/20 shadow-sm">
                        <Loader2 className="w-10 h-10 text-[#EF9B1B] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium text-lg">Preparando formulário...</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <FuncionarioForm
                            paises={paises}
                            error={error}
                            onSubmit={handleCreateFuncionario}
                            onCancel={() => {
                                setError('')
                                window.history.back()
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