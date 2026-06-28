import { useState } from "react";

import {
  Loader2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  BarChart3,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import { listarRelatorioProcedencia } from "@/Api/relatorios";

export default function RelatorioProcedenciaPage() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [buscou, setBuscou] = useState(false);

  async function handleGerar() {
    setLoading(true);
    setErro("");
    setBuscou(true);
    try {
      const dados = await listarRelatorioProcedencia()
      setResultados(Array.isArray(dados) ? dados : []);
    } catch (err) {
      let msg = (err as Error).message;
      try {
        while (typeof msg === "string" && msg.trim().startsWith("{")) {
          const parsed = JSON.parse(msg);
          if (parsed.message) msg = parsed.message;
          else if (parsed.error) msg = parsed.error;
          else break;
        }
      } catch {
        // mantém mensagem original
      }
      setErro(msg);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }

  const fmt = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  const totalEstadias = resultados.reduce((acc, curr) => acc + Number(curr.qtdestadias ?? 0), 0);
  const totalReceita = resultados.reduce((acc, curr) => acc + Number(curr.receitatotal ?? 0), 0);

  // Agrupa por país para destacar os totais por país
  const paisesMapa = resultados.reduce((acc: Record<string, number>, curr) => {
    acc[curr.pais] = (acc[curr.pais] ?? 0) + Number(curr.qtdestadias ?? 0);
    return acc;
  }, {});
  const totalPaises = Object.keys(paisesMapa).length;

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Procedência Geográfica</h1>
        <p className="text-gray-500 mt-1">
          Origem dos hóspedes por país e estado, com receita e ticket médio por região.
        </p>
      </div>

      {/* BOTÃO DE GERAR */}
      <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] mb-8">
        <h3 className="text-lg font-bold text-[#222020] font-admin mb-4 flex items-center gap-2">
          <TrendingUp className="text-[#EF9B1B]" size={20} /> Relatório Completo
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Exibe todas as estadias agrupadas por país e estado de origem do hóspede.
        </p>
        <button
          onClick={handleGerar}
          disabled={loading}
          className="h-[50px] px-8 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {loading
            ? <Loader2 size={18} className="animate-spin" />
            : <><BarChart3 size={18} /> Gerar Relatório</>}
        </button>
      </div>

      {buscou && (
        <div className="space-y-6">

          {/* CARDS DE RESUMO */}
          {!loading && !erro && resultados.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-[1.25rem] flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-blue-700 font-bold uppercase tracking-widest text-xs mb-1">Países de Origem</p>
                  <h2 className="text-3xl font-black text-blue-600 font-admin">{totalPaises}</h2>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <Globe size={24} />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-[1.25rem] flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-1">Total de Estadias</p>
                  <h2 className="text-3xl font-black text-amber-600 font-admin">{totalEstadias}</h2>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                  <Users size={24} />
                </div>
              </div>

              {/* <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-[1.25rem] flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-1">Receita Total</p>
                  <h2 className="text-3xl font-black text-emerald-600 font-admin">{fmt(totalReceita)}</h2>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                  <DollarSign size={24} />
                </div>
              </div> */}
            </div>
          )}

          {/* TABELA */}
          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#222020] font-admin">
                Detalhamento por Região
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-[#EF9B1B] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Buscando dados de procedência...</p>
              </div>
            ) : erro ? (
              <div className="p-8 flex flex-col items-center text-center">
                <AlertCircle size={40} className="text-red-400 mb-3" />
                <p className="text-red-600 font-medium text-lg">{erro}</p>
              </div>
            ) : resultados.length === 0 ? (
              <div className="p-16 text-center text-gray-500 font-medium">
                Nenhuma estadia registrada para análise de procedência.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FFF8EF] text-[#C47D0E] text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20">País</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Estado</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-center">Estadias</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-right">Receita Total</th>
                      <th className="p-4 font-bold border-b border-[#EF9B1B]/20 text-right">Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {resultados.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-bold text-[#222020]">
                          <span className="flex items-center gap-1.5">
                            <Globe size={14} className="text-[#EF9B1B] shrink-0" />
                            {item.pais ?? "—"}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            {item.estado ?? "—"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                            {item.qtdestadias}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-emerald-600 text-right">
                          {fmt(Number(item.receitatotal ?? 0))}
                        </td>
                        <td className="p-4 text-sm text-gray-500 text-right">
                          {fmt(Number(item.valormedio ?? 0))}
                        </td>
                      </tr>
                    ))}
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