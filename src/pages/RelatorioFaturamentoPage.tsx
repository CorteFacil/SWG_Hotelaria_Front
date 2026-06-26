import { useState } from "react";
import { api } from "../api";
import { Loader2, CalendarDays, TrendingUp, DollarSign, AlertCircle, BarChart3 } from "lucide-react";

export default function RelatorioFaturamentoPage() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [buscou, setBuscou] = useState(false);

  async function handleGerarRelatorio(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setBuscou(true);

    try {
      const dados = await api.getRelatorioFaturamento(
        dataInicio || undefined, 
        dataFim || undefined
      );
      setResultados(dados || []);
    } catch (err) {
      let msg = (err as Error).message;
      
      try {
        while (typeof msg === 'string' && msg.trim().startsWith('{')) {
          const parsed = JSON.parse(msg);
          if (parsed.message) {
            msg = parsed.message;
          } else if (parsed.error) {
            msg = parsed.error;
          } else {
            break;
          }
        }
      } catch (e) { 
      }
      
      setErro(msg);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }

  const formatarDinheiro = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Soma o total considerando os nomes vindos do Postgres em minúsculas
  const totalGeral = resultados.reduce((acc, curr) => {
    const valor = curr.totalProjetado || curr.totalprojetado || 0;
    return acc + valor;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Projeção de Faturamento</h1>
        <p className="text-gray-500 mt-1">Análise de receita projetada baseada em reservas confirmadas por categoria.</p>
      </div>

      <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] mb-8">
        <h3 className="text-lg font-bold text-[#222020] font-admin mb-4 flex items-center gap-2">
          <TrendingUp className="text-[#EF9B1B]" size={20} /> Filtros de Período
        </h3>
        
        <form onSubmit={handleGerarRelatorio} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Data Inicial (Opcional)</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800" />
            </div>
          </div>

          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Data Final (Opcional)</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} min={dataInicio}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full md:w-1/3 h-[50px] bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><BarChart3 size={18} /> Calcular Faturamento</>}
          </button>
        </form>
      </div>

      {buscou && (
        <div className="space-y-6">
          {!loading && !erro && resultados.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[1.25rem] flex items-center justify-between shadow-sm animate-fade-in">
              <div>
                <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-1">Total Projetado no Período</p>
                <h2 className="text-4xl font-black text-emerald-600 font-admin">{formatarDinheiro(totalGeral)}</h2>
              </div>
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                <DollarSign size={32} />
              </div>
            </div>
          )}

          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#222020] font-admin">Detalhamento por Categoria</h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-[#EF9B1B] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Calculando receitas...</p>
              </div>
            ) : erro ? (
              <div className="p-8 flex flex-col items-center text-center">
                  <AlertCircle size={40} className="text-red-400 mb-3" />
                  <p className="text-red-600 font-medium text-lg">{erro}</p>
              </div>
            ) : resultados.length === 0 ? (
              <div className="p-16 text-center text-gray-500 font-medium">
                Nenhuma reserva confirmada encontrada para cálculo neste período.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FFF8EF] text-[#C47D0E] text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Categoria</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-center">Qtd. Reservas</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-right">Diária Base</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-right">Faturamento Projetado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {resultados.map((item, index) => {
                      const tipoAcomodacao = item.tipoAcomodacao || item.tipoacomodacao;
                      const quantidadeReservas = item.quantidadeReservas || item.quantidadereservas;
                      const precoDiaria = item.precoDiaria || item.precodiaria;
                      const totalProjetado = item.totalProjetado || item.totalprojetado;

                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm font-bold text-[#222020]">{tipoAcomodacao}</td>
                          <td className="p-4 text-sm text-gray-600 text-center font-medium">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">{quantidadeReservas}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-500 text-right">
                            {formatarDinheiro(precoDiaria)}
                          </td>
                          <td className="p-4 text-sm font-bold text-emerald-600 text-right">
                            {formatarDinheiro(totalProjetado)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}