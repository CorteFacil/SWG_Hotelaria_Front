import { useState, useEffect } from "react";
import type { Hospede, TipoDeQuarto } from "../types";
import { Loader2, Search, FileText, BedDouble, UserCircle, AlertCircle } from "lucide-react";
import { listarHospedes } from "@/Api/hospedes";
import { listarTipoDeQuarto } from "@/Api/tiposdequarto";
import { listarRelatorioReservasPeriodo } from "@/Api/reservas";

export default function RelatorioReservasPage() {
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [tipos, setTipos] = useState<TipoDeQuarto[]>([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [hospedeId, setHospedeId] = useState("");
  const [tipoDeQuartoId, setTipoDeQuartoId] = useState("");

  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [buscou, setBuscou] = useState(false);

  useEffect(() => {
    // Carrega hospedes e tipos de quarto para popular os filtros
    Promise.all([listarHospedes(), listarTipoDeQuarto()])
      .then(([hospedesData, tiposData]) => {
        setHospedes(hospedesData);
        setTipos(tiposData);
      })
      .catch(() => console.error("Erro ao carregar filtros"));
  }, []);

  async function handleGerarRelatorio(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setBuscou(true);

    try {
      const dados = await listarRelatorioReservasPeriodo(
        dataInicio || undefined,
        dataFim || undefined,
        hospedeId || undefined,
        tipoDeQuartoId || undefined
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

  const formatarData = (dataSql: string) => {
    if (!dataSql) return "-";
    return dataSql.split('T')[0].split('-').reverse().join('/');
  };

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Relatório de Reservas</h1>
        <p className="text-gray-500 mt-1">Consulte o histórico e o fluxo de ocupação por período e filtros.</p>
      </div>

      <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] mb-8">
        <h3 className="text-lg font-bold text-[#222020] font-admin mb-4 flex items-center gap-2">
          <Search className="text-[#EF9B1B]" size={20} /> Filtros de Busca
        </h3>

        <form onSubmit={handleGerarRelatorio} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#C47D0E] uppercase tracking-wider">Data Inicial</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#C47D0E] uppercase tracking-wider">Data Final</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} min={dataInicio}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#C47D0E] uppercase tracking-wider">Hóspede (Opcional)</label>
            <select value={hospedeId} onChange={(e) => setHospedeId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 outline-none transition-all text-gray-800">
              <option value="">Todos os Hóspedes</option>
              {hospedes.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#C47D0E] uppercase tracking-wider">Acomodação (Opcional)</label>
            <select value={tipoDeQuartoId} onChange={(e) => setTipoDeQuartoId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 outline-none transition-all text-gray-800">
              <option value="">Todas</option>
              {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-[50px] bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><FileText size={18} /> Filtrar</>}
          </button>
        </form>
      </div>

      {buscou && (
        <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-[#222020] font-admin">Resultados da Consulta</h3>
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
              Nenhuma reserva encontrada para o período/filtros informados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF8EF] text-[#C47D0E] text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Cód.</th>
                    <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Hóspede</th>
                    <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Acomodação</th>
                    <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Período</th>
                    <th className="p-4 font-bold border-b border-[#EF9B1B]/20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resultados.map((item, index) => {
                    // TRUQUE PARA LIDAR COM O POSTGRES: Busca tanto com CamelCase quanto com minúsculas!
                    const idReserva = item.idReserva || item.idreserva;
                    const nomeHospede = item.nomeHospede || item.nomehospede;
                    const tipoQuarto = item.tipoQuarto || item.tipoquarto;
                    const dataEntrada = item.dataEntrada || item.dataentrada;
                    const dataSaida = item.dataSaida || item.datasaida;

                    return (
                      <tr key={idReserva || index} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-medium text-gray-500">#{idReserva}</td>
                        <td className="p-4 text-sm font-bold text-[#222020] flex items-center gap-2">
                          <UserCircle size={16} className="text-[#EF9B1B]" /> {nomeHospede}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2"><BedDouble size={14} className="text-gray-400" /> {tipoQuarto}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatarData(dataEntrada)} até {formatarData(dataSaida)}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-md uppercase tracking-wider whitespace-nowrap ${item.status === 'Confirmada' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                            }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )
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