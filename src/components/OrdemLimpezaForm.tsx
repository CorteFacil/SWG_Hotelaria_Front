import { useState, type FormEvent, useEffect } from 'react';
import { ClipboardList, BedDouble, UserCircle, Clock, CheckCircle, Loader, XCircle, AlertCircle, FileText } from 'lucide-react';
import type { Funcionario, Quarto, OrdemLimpezaPayLoad } from '../types';

interface OrdemLimpezaFormProps {
    funcionarios: Funcionario[]
    quartos: Quarto[]
    error?: string
    ordemEditando?: any
    onSubmit: (data: OrdemLimpezaPayLoad) => Promise<void> | void
    onCancel: () => void
}

export default function OrdemLimpezaForm({ funcionarios, quartos, error, ordemEditando, onSubmit, onCancel }: OrdemLimpezaFormProps) {
    const [quartoId, setQuartoId] = useState('');
    const [funcionarioId, setFuncionarioId] = useState('');
    const [status, setStatus] = useState('');
    const [observacao, setObservacao] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ordemEditando) {
            setQuartoId(String(ordemEditando.quartoId || ''));
            setFuncionarioId(String(ordemEditando.funcionarioId || ''));
            setStatus(ordemEditando.status || '');
            setObservacao(ordemEditando.observacao || '');
            setInicio(ordemEditando.inicio ? new Date(ordemEditando.inicio).toISOString().slice(0, 16) : '');
            setFim(ordemEditando.fim ? new Date(ordemEditando.fim).toISOString().slice(0, 16) : '');
        } else {
            setQuartoId(''); setFuncionarioId(''); setStatus('');
            setObservacao(''); setInicio(''); setFim('');
        }
    }, [ordemEditando]);

    const extrairSentencas = (texto: string) => {
        if (!texto) return [];
        return texto.replace(/([.!?])\s+/g, '$1|').split('|').filter(Boolean);
    };

    const getErro = (palavrasChave: string[]) => {
        if (!error) return null;
        const sentencas = extrairSentencas(error);
        const encontradas = sentencas.filter(s =>
            palavrasChave.some(p => s.toLowerCase().includes(p.toLowerCase()))
        );
        return encontradas.length > 0 ? encontradas.join(' ').trim() : null;
    };

    const erroQuarto = getErro(['quarto', 'quartoId']);
    const erroFuncionario = getErro(['funcionario', 'funcionarioId']);
    const erroStatus = getErro(['status']);
    const erroInicio = getErro(['inicio']);
    const erroFim = getErro(['fim']);
    const erroObs = getErro(['observacao', 'observação']);

    const errosUsados = [erroQuarto, erroFuncionario, erroStatus, erroInicio, erroFim, erroObs].filter(Boolean).join(' ');
    const sentencas = extrairSentencas(error || '');
    const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim();

    const inputClass = (erro?: string | null) =>
        `w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erro ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
            : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
        }`;

    const selectClass = (erro?: string | null) =>
        `w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 appearance-none ${erro ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
            : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
        }`;

    const statusOpcoes = [
        { valor: 'Concluido', label: 'Concluído', icon: CheckCircle, cor: 'text-emerald-500' },
        { valor: 'Andamento', label: 'Em Andamento', icon: Loader, cor: 'text-blue-500' },
        { valor: 'Não Concluido', label: 'Não Concluído', icon: XCircle, cor: 'text-red-500' },
    ];

    function handleClickCancelar() {
        if (!ordemEditando) {
            setQuartoId(''); setFuncionarioId(''); setStatus('');
            setObservacao(''); setInicio(''); setFim('');
        }
        onCancel();
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                quartoId: Number(quartoId),
                funcionarioId: Number(funcionarioId),
                status,
                observacao,
                inicio,
                fim,
            });
            if (!ordemEditando) {
                setQuartoId(''); setFuncionarioId(''); setStatus('');
                setObservacao(''); setInicio(''); setFim('');
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
                    <ClipboardList className="text-[#EF9B1B]" />
                    {ordemEditando ? 'Editar Ordem de Limpeza' : 'Nova Ordem de Limpeza'}
                </h2>
                <p className="text-gray-500 text-sm">Vincule um quarto e funcionário para registrar a ordem de limpeza.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Quarto */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Quarto</label>
                        <div className="relative">
                            <BedDouble size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select value={quartoId} onChange={e => setQuartoId(e.target.value)} required className={selectClass(erroQuarto)}>
                                <option value="">Selecione</option>
                                {quartos.map(q => <option key={q.id} value={q.id}>Quarto {q.numero}</option>)}
                            </select>
                        </div>
                        {erroQuarto && <span className="text-xs text-red-500 font-medium block mt-1">{erroQuarto}</span>}
                    </div>

                    {/* Funcionário */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Funcionário</label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select value={funcionarioId} onChange={e => setFuncionarioId(e.target.value)} required className={selectClass(erroFuncionario)}>
                                <option value="">Selecione</option>
                                {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                            </select>
                        </div>
                        {erroFuncionario && <span className="text-xs text-red-500 font-medium block mt-1">{erroFuncionario}</span>}
                    </div>

                    {/* Início */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Início</label>
                        <div className="relative">
                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input value={inicio} onChange={e => setInicio(e.target.value)} required type="datetime-local"
                                className={inputClass(erroInicio)} />
                        </div>
                        {erroInicio && <span className="text-xs text-red-500 font-medium block mt-1">{erroInicio}</span>}
                    </div>

                    {/* Fim */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Fim</label>
                        <div className="relative">
                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input value={fim} onChange={e => setFim(e.target.value)} required type="datetime-local" min={inicio}
                                className={inputClass(erroFim)} />
                        </div>
                        {erroFim && <span className="text-xs text-red-500 font-medium block mt-1">{erroFim}</span>}
                    </div>

                    {/* Status */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Status</label>
                        <div className="grid grid-cols-3 gap-3">
                            {statusOpcoes.map(({ valor, label, icon: Icon, cor }) => (
                                <button
                                    key={valor} type="button"
                                    onClick={() => setStatus(valor)}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${status === valor
                                            ? 'border-[#EF9B1B] bg-[#EF9B1B]/10 text-[#C47D0E]'
                                            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                                        }`}>
                                    <Icon size={16} className={status === valor ? 'text-[#EF9B1B]' : cor} />
                                    {label}
                                </button>
                            ))}
                        </div>
                        {erroStatus && <span className="text-xs text-red-500 font-medium block mt-1">{erroStatus}</span>}
                    </div>

                    {/* Observação */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
                            Observação <span className="text-gray-400 normal-case font-normal">(opcional)</span>
                        </label>
                        <div className="relative">
                            <FileText size={18} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
                            <textarea
                                value={observacao} onChange={e => setObservacao(e.target.value)}
                                rows={4} placeholder="Descreva detalhes relevantes sobre esta ordem..."
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 resize-none ${erroObs ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
                                        : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                                    }`}
                            />
                        </div>
                        {erroObs && <span className="text-xs text-red-500 font-medium block mt-1">{erroObs}</span>}
                    </div>

                </div>

                {erroGeral && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm flex items-center gap-3">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{erroGeral}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                    <button type="button" onClick={handleClickCancelar}
                        className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading || !status}
                        className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex items-center gap-2">
                        {loading ? 'Salvando...' : (ordemEditando ? 'Salvar Alterações' : 'Criar Ordem')}
                    </button>
                </div>
            </form>
        </div>
    );
}