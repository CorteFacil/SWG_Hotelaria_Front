import { useState, useEffect } from "react";
import type { Funcionario, Quarto } from "../types";
import { Loader2, Search, FileText, BedDouble, UserCircle, AlertCircle, Clock } from "lucide-react";
import { listarFuncionarios } from "@/Api/funcionarios";
import { listarQuartos } from "@/Api/quartos";
import { listarOrdemLimpeza } from "@/Api/ordemlimpeza";
import type { OrdemLimpeza } from "../types";

const STATUS_STYLE: Record<string, string> = {
    'Concluido': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Andamento': 'bg-blue-100 text-blue-700 border-blue-200',
    'Não Concluido': 'bg-red-100 text-red-700 border-red-200',
};

export default function RelatorioOrdemLimpezaPage() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [quartoId, setQuartoId] = useState("");
    const [funcionarioId, setFuncionarioId] = useState("");

    const [resultados, setResultados] = useState<OrdemLimpeza[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [buscou, setBuscou] = useState(false);

    useEffect(() => {
        Promise.all([listarFuncionarios(), listarQuartos()])
            .then(([funcionariosData, quartosData]) => {
                setFuncionarios(funcionariosData);
                setQuartos(quartosData);
            })
            .catch(() => console.error("Erro ao carregar filtros"));
    }, []);

    async function handleBuscar(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErro("");
        setBuscou(true);
        try {
            const todas = await listarOrdemLimpeza();

            const filtradas = todas.filter(o => {
                const inicio = new Date(o.inicio);
                if (dataInicio && inicio < new Date(dataInicio)) return false;
                if (dataFim && inicio > new Date(dataFim)) return false;
                if (quartoId && o.quartoId !== Number(quartoId)) return false;
                if (funcionarioId && o.funcionarioId !== Number(funcionarioId)) return false;
                return true;
            });

            setResultados(filtradas);
        } catch (err) {
            let msg = (err as Error).message;
            try {
                while (typeof msg === 'string' && msg.trim().startsWith('{')) {
                    const parsed = JSON.parse(msg);
                    if (parsed.message) msg = parsed.message;
                    else if (parsed.error) msg = parsed.error;
                    else break;
                }
            } catch (_) { }
            setErro(msg);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelar() {
        setDataInicio("");
        setDataFim("");
        setQuartoId("");
        setFuncionarioId("");
        setResultados([]);
        setErro("");
        setBuscou(false);
    }

    const formatarDataHora = (data: string) => {
        if (!data) return "-";
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800 appearance-none";
    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800";

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#222020] font-admin">Relatório de Ordens de Limpeza</h1>
                <p className="text-gray-500 mt-1">Consulte as ordens de limpeza por período, quarto e funcionário.</p>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] mb-8">
                <h3 className="text-lg font-bold text-[#222020] font-admin mb-6 flex items-center gap-2">
                    <Search className="text-[#EF9B1B]" size={20} /> Filtros de Busca
                </h3>

                <form onSubmit={handleBuscar}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">

                        {/* Coluna: Período */}
                        <div>
                            <p className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={14} /> Período
                            </p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Início</label>
                                    <input
                                        type="datetime-local" value={dataInicio}
                                        onChange={e => setDataInicio(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</label>
                                    <input
                                        type="datetime-local" value={dataFim} min={dataInicio}
                                        onChange={e => setDataFim(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coluna: Filtros */}
                        <div>
                            <p className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Search size={14} /> Filtro
                            </p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quarto</label>
                                    <select value={quartoId} onChange={e => setQuartoId(e.target.value)} className={selectClass}>
                                        <option value="">Todos os Quartos</option>
                                        {quartos.map(q => <option key={q.id} value={q.id}>Quarto {q.numero}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</label>
                                    <select value={funcionarioId} onChange={e => setFuncionarioId(e.target.value)} className={selectClass}>
                                        <option value="">Todos os Funcionários</option>
                                        {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 mb-6" />

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleCancelar}
                            className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex items-center gap-2">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><FileText size={18} /> Buscar</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Resultados */}
            {buscou && (
                <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 overflow-hidden">

                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#222020] font-admin">
                            Lista de Ordens de Limpeza por Quarto e Funcionário
                        </h3>
                        {!loading && !erro && (
                            <span className="text-sm text-gray-500 font-medium">
                                {resultados.length} {resultados.length === 1 ? 'ordem encontrada' : 'ordens encontradas'}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-[#EF9B1B] animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Buscando dados...</p>
                        </div>
                    ) : erro ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <AlertCircle size={40} className="text-red-400 mb-3" />
                            <p className="text-red-600 font-medium text-lg">{erro}</p>
                        </div>
                    ) : resultados.length === 0 ? (
                        <div className="p-16 text-center text-gray-500 font-medium">
                            Nenhuma ordem encontrada para o período/filtros informados.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FFF8EF] text-[#C47D0E] text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Quarto</th>
                                        <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Funcionário</th>
                                        <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Início</th>
                                        <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Fim</th>
                                        <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {resultados.map((ordem, index) => {
                                        const quarto = quartos.find(q => q.id === ordem.quartoId);
                                        const func = funcionarios.find(f => f.id === ordem.funcionarioId);
                                        return (
                                            <tr key={ordem.id ?? index} className="hover:bg-[#FFF8EF]/50 transition-colors">
                                                <td className="p-4 text-sm font-bold text-[#222020]">
                                                    <span className="flex items-center gap-2">
                                                        <BedDouble size={16} className="text-[#EF9B1B] shrink-0" />
                                                        Quarto {quarto?.numero ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-2">
                                                        <UserCircle size={14} className="text-gray-400 shrink-0" />
                                                        {func?.nome ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">{formatarDataHora(ordem.inicio)}</td>
                                                <td className="p-4 text-sm text-gray-600">{formatarDataHora(ordem.fim)}</td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-md uppercase tracking-wider whitespace-nowrap ${STATUS_STYLE[ordem.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                        {ordem.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}