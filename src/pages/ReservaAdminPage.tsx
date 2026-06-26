import { useEffect, useState } from "react";
import ReservaForm from "../components/ReservaForm";
import { api } from "../api";
import type { Hospede, TipoDeQuarto, Reserva } from "../types";
import { Loader2, UserCircle, Search, CalendarDays, BedDouble, Trash2, AlertTriangle, Edit2, CheckCircle2, UserPlus } from "lucide-react";

export default function ReservaAdminPage() {
  const [tipos, setTipos] = useState<TipoDeQuarto[]>([]);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  
  const [hospedeSelecionadoId, setHospedeSelecionadoId] = useState<number>(0);
  const [erroSubmitForm, setErroSubmitForm] = useState<string | undefined>(undefined);
  
  // Controle de Edição e Feedback
  const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
  const [sucessoFeedback, setSucessoFeedback] = useState(""); // <-- NOVO ESTADO AQUI

  const [buscaNome, setBuscaNome] = useState("");
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");

  const [reservaParaExcluir, setReservaParaExcluir] = useState<{id: number, nomeHospede: string} | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [loadedHospedes, loadedTipos, loadedReservas] = await Promise.all([
        api.getHospedes(),
        api.getTiposDeQuarto(),
        api.getReservas()
      ]);
      setHospedes(loadedHospedes);
      setTipos(loadedTipos);
      setReservas(loadedReservas);
    } catch (err) {
      setErroPagina("Falha ao carregar os dados do sistema. Atualize a página.");
    } finally {
      setLoadingDados(false);
    }
  }

  // NOVO: Função para mostrar a mensagem bonitinha e apagar depois de 3 segundos
  function mostrarSucesso(mensagem: string) {
    setSucessoFeedback(mensagem);
    setTimeout(() => {
      setSucessoFeedback("");
    }, 3000);
  }

  async function handleSubmitForm(data: any) {
    setErroSubmitForm(undefined); 

    try {
      if (reservaEditando) {
        await api.updateReserva(reservaEditando.id, { ...data, status: reservaEditando.status });
        mostrarSucesso("Reserva atualizada com sucesso!"); // <-- TROCOU O ALERT
      } else {
        await api.createReserva({ ...data, status: 0 });
        mostrarSucesso("Reserva criada com sucesso!"); // <-- TROCOU O ALERT
      }
      
      handleCancel(); 
      carregarDados(); 
    } catch (err) {
      let mensagemLimpa = (err as Error).message;
      try {
        const erroParseado = JSON.parse(mensagemLimpa);
        if (erroParseado && erroParseado.message) {
          mensagemLimpa = erroParseado.message;
        }
      } catch (e) {
        // Ignora se não for JSON
      }
      setErroSubmitForm(mensagemLimpa);
    }
  }

  function handleCancel() {
    setHospedeSelecionadoId(0);
    setReservaEditando(null);
    setErroSubmitForm(undefined);
  }

  function handleCliqueEditar(reserva: Reserva) {
    setReservaEditando(reserva);
    setHospedeSelecionadoId(reserva.hospedeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirmDelete() {
    if (!reservaParaExcluir) return;
    setDeletando(true);
    try {
      await api.deleteReserva(reservaParaExcluir.id);
      setReservas(reservas.filter(r => r.id !== reservaParaExcluir.id));
      fecharModalExclusao();
      
      if (reservaEditando?.id === reservaParaExcluir.id) {
        handleCancel();
      }
      mostrarSucesso("Reserva cancelada com sucesso."); // <-- Feedback de exclusão também!
    } catch (err) {
      alert("Erro ao tentar cancelar a reserva.");
    } finally {
      setDeletando(false);
    }
  }

  function fecharModalExclusao() {
    setReservaParaExcluir(null);
    setTextoConfirmacao("");
  }

  const reservasFiltradas = reservas.filter(reserva => {
    if (!buscaNome) return true;
    const hospede = hospedes.find(h => h.id === reserva.hospedeId);
    return hospede?.nome.toLowerCase().includes(buscaNome.toLowerCase());
  });

  function getStatusConfig(status: number, dataSaidaStr: string) {
    if (status === 1) {
      const dataSaida = new Date(dataSaidaStr);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); 
      if (dataSaida < hoje) {
        return { text: "Realizada", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" };
      } else {
        return { text: "Confirmada", classes: "bg-blue-100 text-blue-700 border-blue-200" };
      }
    }
    return { text: "Pendente", classes: "bg-orange-100 text-orange-700 border-orange-200" };
  }

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Gestão de Reservas</h1>
        <p className="text-gray-500 mt-1">Agende estadias e consulte o histórico de locações.</p>
      </div>

      {loadingDados ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[1.25rem] border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-[#EF9B1B] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Carregando painel...</p>
        </div>
      ) : erroPagina ? (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
          <p>{erroPagina}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-[#EF9B1B]/20">
               <label className="text-xs font-medium uppercase tracking-wider text-[#222020] flex items-center gap-2 mb-3">
                 <UserCircle size={16} className="text-[#EF9B1B]" /> 
                 Vincular ao Hóspede
               </label>
               <select 
                 value={hospedeSelecionadoId} 
                 onChange={(e) => setHospedeSelecionadoId(Number(e.target.value))} 
                 disabled={!!reservaEditando}
                 className="w-full p-3 rounded-lg bg-[#FFF8EF] border border-[#222020]/20 focus:border-[#EF9B1B] outline-none transition-all text-gray-800 disabled:opacity-60"
               >
                 <option value="0" disabled>Busque e selecione o hóspede responsável...</option>
                 {hospedes.map((h) => (
                   <option key={h.id} value={h.id}>{h.nome} (CPF/PAS: {h.cpfPassaporte})</option>
                 ))}
               </select>
               {reservaEditando && (
                 <p className="text-xs text-blue-600 mt-2 font-medium">
                   Modo de edição ativo. Para alterar o hóspede, cancele a edição e crie uma nova reserva.
                 </p>
               )}
            </div>

            {hospedeSelecionadoId > 0 ? (
              <ReservaForm 
                tipos={tipos}
                hospedeId={hospedeSelecionadoId}
                error={erroSubmitForm}
                reservaEditando={reservaEditando} 
                onSubmit={handleSubmitForm}
                onCancel={handleCancel}
              />
            ) : (
              // Empty State - Estado Vazio Animado
              <div className="bg-white border-2 border-dashed border-[#EF9B1B]/30 rounded-[1.25rem] p-10 flex flex-col items-center justify-center text-center min-h-[450px] animate-fade-in shadow-sm">
                <div className="w-20 h-20 bg-[#FFF8EF] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <UserPlus size={36} className="text-[#EF9B1B]" />
                </div>
                <h4 className="text-xl font-bold text-[#222020] font-admin mb-3">
                  Pronto para agendar?
                </h4>
                <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed">
                  Busque e vincule um hóspede no menu acima para liberar o formulário de nova reserva.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden sticky top-6 max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Reservas Registradas</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar pelo nome do hóspede..." 
                  value={buscaNome}
                  onChange={(e) => setBuscaNome(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-[#FFF8EF]/30">
              {reservasFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-8 font-medium text-sm">Nenhuma reserva encontrada.</p>
              ) : (
                reservasFiltradas.map(reserva => {
                  const nomeHospede = hospedes.find(h => h.id === reserva.hospedeId)?.nome || "Desconhecido";
                  const tipoQuarto = tipos.find(t => t.id === reserva.tipoDeQuartoId)?.nome || "Acomodação";
                  const statusInfo = getStatusConfig(reserva.status, reserva.saidaAcomodacao);
                  
                  return (
                    <div key={reserva.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition-colors relative">
                      <div className="flex justify-between items-start mb-2 pr-20">
                        <span className="font-bold text-[#222020] truncate">{nomeHospede}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-md uppercase tracking-wider whitespace-nowrap ${statusInfo.classes}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <BedDouble size={14} className="text-gray-400" />
                          <span>{tipoQuarto} • {reserva.numeroPessoas} Pessoa(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-gray-400" />
                          <span>
                            {reserva.entradaAcomodacao.split('T')[0].split('-').reverse().join('/')} até {reserva.saidaAcomodacao.split('T')[0].split('-').reverse().join('/')}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        <button 
                          onClick={() => handleCliqueEditar(reserva)}
                          className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all"
                          title="Editar Reserva"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setReservaParaExcluir({ id: reserva.id, nomeHospede })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Cancelar Reserva"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {reservaParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100 animate-fade-in">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-[#222020] font-admin">Cancelar Reserva</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Tem certeza que você quer cancelar a reserva de <strong className="text-[#222020]">{reservaParaExcluir.nomeHospede}</strong>? Ela será perdida para sempre e a ação não pode ser desfeita.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Para confirmar, digite <span className="text-red-500 font-bold select-all">CANCELAR</span> abaixo:
              </label>
              <input 
                type="text" 
                value={textoConfirmacao}
                onChange={(e) => setTextoConfirmacao(e.target.value)}
                placeholder="CANCELAR"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-center font-bold tracking-widest uppercase"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={fecharModalExclusao}
                className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={textoConfirmacao !== "CANCELAR" || deletando}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white shadow-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
              >
                {deletando ? <Loader2 size={20} className="animate-spin" /> : "Sim, Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sucessoFeedback && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-[0_8px_30px_rgba(16,185,129,0.15)] animate-fade-in">
          <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
          <p className="font-medium font-admin">{sucessoFeedback}</p>
        </div>
      )}

    </div>
  );
}