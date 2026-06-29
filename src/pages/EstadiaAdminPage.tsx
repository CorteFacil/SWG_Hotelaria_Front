import { useEffect, useState } from "react";
import EstadiaForm from "../components/EstadiaForm";
import { listarReservas } from "../Api/reservas";
import { listarFuncionarios } from "../Api/funcionarios";
import { listarQuartos } from "../Api/quartos";
import { listarEstadias, criarEstadia, atualizarEstadia, excluirEstadia } from "../Api/estadias";
import type { Estadia, Reserva, Funcionario, Quarto } from "../types";
import {
  Loader2,
  Search,
  CalendarDays,
  BedDouble,
  Trash2,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  UserCircle,
  DollarSign,
  UserPlus,
  BookOpenCheck,
  XCircle
} from "lucide-react";

export default function EstadiaAdminPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [estadias, setEstadias] = useState<Estadia[]>([]);

  const [estadiaEditando, setEstadiaEditando] = useState<Estadia | null>(null);
  const [erroSubmitForm, setErroSubmitForm] = useState<string | undefined>(undefined);
  const [sucessoFeedback, setSucessoFeedback] = useState("");
  const [conflitoFeedback, setConflitoFeedback] = useState("");

  const [busca, setBusca] = useState("");
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");

  const [reservaSelecionadaId, setReservaSelecionadaId] = useState<number>(0);
  const [estadiaParaExcluir, setEstadiaParaExcluir] = useState<{ id: number; label: string } | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [loadedReservas, loadedFuncionarios, loadedQuartos, loadedEstadias] = await Promise.all([
        listarReservas(),
        listarFuncionarios(),
        listarQuartos(),
        listarEstadias(),
      ]);
      setReservas(loadedReservas);
      setFuncionarios(loadedFuncionarios);
      setQuartos(loadedQuartos);
      setEstadias(loadedEstadias);
    } catch {
      setErroPagina("Falha ao carregar os dados do sistema. Atualize a página.");
    } finally {
      setLoadingDados(false);
    }
  }

  function mostrarSucesso(mensagem: string) {
    setSucessoFeedback(mensagem);
    setTimeout(() => setSucessoFeedback(""), 5000);
  }

  function mostrarConflito(mensagem: string) {
        setConflitoFeedback(mensagem);
        setTimeout(() => { setConflitoFeedback(""); }, 5000);
    }

  async function handleSubmitForm(data: any) {
    setErroSubmitForm(undefined);
    try {
      if (estadiaEditando) {
        await atualizarEstadia(String(estadiaEditando.id), data);
        mostrarSucesso("Estadia atualizada com sucesso!");
      } else {
        await criarEstadia(data);
        mostrarSucesso("Estadia registrada com sucesso!");
      }
      await carregarDados();
      handleCancel();
    } catch (err) {
      let msg = (err as Error).message;
      try { const p = JSON.parse(msg); if (p?.message) msg = p.message; } catch { /* ignora */ }
      mostrarConflito("Existe uma ordem de limpeza em andamento para este quarto!");
      setErroSubmitForm(msg);
    }
  }

  function handleCancel() {
    setReservaSelecionadaId(0);
    setEstadiaEditando(null);
    setErroSubmitForm(undefined);
  }

  function handleCliqueEditar(estadia: Estadia) {
    setEstadiaEditando(estadia);
    setReservaSelecionadaId(estadia.reservaId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirmDelete() {
    if (!estadiaParaExcluir) return;
    setDeletando(true);
    try {
      await excluirEstadia(String(estadiaParaExcluir.id));
      setEstadias((prev) => prev.filter((e) => e.id !== estadiaParaExcluir.id));
      if (estadiaEditando?.id === estadiaParaExcluir.id) handleCancel();
      fecharModalExclusao();
      mostrarSucesso("Estadia excluída com sucesso.");
    } catch {
      alert("Erro ao tentar excluir a estadia.");
    } finally {
      setDeletando(false);
    }
  }

  function fecharModalExclusao() {
    setEstadiaParaExcluir(null);
    setTextoConfirmacao("");
  }

  const estadiasFiltradas = estadias.filter((estadia) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    const nomeHospede = estadia.reserva?.hospede?.nome?.toLowerCase() ?? "";
    const numeroQuarto = estadia.quarto?.numero?.toLowerCase() ?? String(estadia.quartoId);
    const nomeFuncionario = estadia.funcionario?.nome?.toLowerCase() ?? "";
    return nomeHospede.includes(termo) || numeroQuarto.includes(termo) || nomeFuncionario.includes(termo);
  });

  const fmtData = (s: string) => s ? s.split("T")[0].split("-").reverse().join("/") : "-";
  const fmtDinheiro = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Gestão de Estadias</h1>
        <p className="text-gray-500 mt-1">Registre check-ins, check-outs e gerencie as estadias ativas.</p>
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
                <BookOpenCheck size={16} className="text-[#EF9B1B]" />
                Vincular à Reserva
              </label>
              <select
                value={reservaSelecionadaId}
                onChange={(e) => setReservaSelecionadaId(Number(e.target.value))}
                disabled={!!estadiaEditando}
                className="w-full p-3 rounded-lg bg-[#FFF8EF] border border-[#222020]/20 focus:border-[#EF9B1B] outline-none transition-all text-gray-800 disabled:opacity-60"
              >
                <option value="0" disabled>Busque e selecione a reserva...</option>
                {reservas.map((h) => (
                  <option key={h.id} value={h.id}>{h.hospede?.nome} (Reserva: #{h.id})</option>
                ))}
              </select>
              {estadiaEditando && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Modo de edição ativo. Para alterar a estadia, cancele a edição e crie uma nova estadia.
                </p>
              )}
            </div>

            {/* COLUNA ESQUERDA — Formulário */}
            {reservaSelecionadaId > 0 ? (
              <EstadiaForm
                reservaSelecionadaId={reservaSelecionadaId}
                funcionarios={funcionarios}
                quartos={quartos}
                error={erroSubmitForm}
                estadiaEditando={estadiaEditando}
                onSubmit={handleSubmitForm}
                onCancel={handleCancel}
              />
            ) : (
              <div className="bg-white border-2 border-dashed border-[#EF9B1B]/30 rounded-[1.25rem] p-10 flex flex-col items-center justify-center text-center min-h-[450px] animate-fade-in shadow-sm">
                <div className="w-20 h-20 bg-[#FFF8EF] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CalendarDays size={36} className="text-[#EF9B1B]" />
                </div>
                <h4 className="text-xl font-bold text-[#222020] font-admin mb-3">
                  Pronto para fazer o check-in?
                </h4>
                <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed">
                  Busque e vincule uma reserva no menu acima para liberar o formulário de nova estadia.
                </p>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA — Lista */}
          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] flex flex-col overflow-hidden sticky top-6 max-h-[80vh]">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Estadias Registradas</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por hóspede, quarto ou funcionário..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {estadiasFiltradas.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">Nenhuma estadia encontrada.</p>
              ) : (
                estadiasFiltradas.map((estadia) => {
                  const nomeHospede =
                    estadia.reserva?.hospede?.nome ??
                    reservas.find((r) => r.id === estadia.reservaId)?.hospede?.nome ??
                    `Reserva #${estadia.reservaId}`;
                  const numeroQuarto =
                    estadia.quarto?.numero ??
                    quartos.find((q) => q.id === estadia.quartoId)?.numero ??
                    `${estadia.quartoId}`;
                  const nomeFuncionario =
                    estadia.funcionario?.nome ??
                    funcionarios.find((f) => f.id === estadia.funcionarioId)?.nome ??
                    "—";

                  return (
                    <div
                      key={estadia.id}
                      className="bg-gray-50 hover:bg-white p-4 rounded-xl border border-gray-100 hover:border-[#EF9B1B]/40 hover:shadow-sm transition-all relative"
                    >
                      {/* Hóspede via reserva */}
                      <div className="flex items-center gap-2 mb-3 pr-16">
                        <UserCircle size={16} className="text-[#EF9B1B] shrink-0" />
                        <span className="font-bold text-[#222020] truncate">{nomeHospede}</span>
                        <span className="text-xs text-gray-400 shrink-0">· Reserva #{estadia.reservaId}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <BedDouble size={13} className="text-gray-400 shrink-0" />
                          <span>Quarto {numeroQuarto}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={13} className="text-gray-400 shrink-0" />
                          <span className="font-semibold text-emerald-700">
                            {fmtDinheiro(Number(estadia.valorTotalEstadia))}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <CalendarDays size={13} className="text-gray-400 shrink-0" />
                          <span>{fmtData(estadia.checkIn)} → {estadia.checkOut == null ? "Não definido" : fmtData(estadia.checkOut)}</span>
                          <span className="text-gray-400">· {nomeFuncionario}</span>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => handleCliqueEditar(estadia)}
                          className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setEstadiaParaExcluir({
                            id: estadia.id,
                            label: `${nomeHospede} (Quarto ${numeroQuarto})`,
                          })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {estadiaParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-[#222020] font-admin">Excluir Estadia</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir a estadia de{" "}
              <strong className="text-[#222020]">{estadiaParaExcluir.label}</strong>?
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Digite <span className="text-red-500 select-all">EXCLUIR</span> para confirmar:
              </label>
              <input
                type="text"
                value={textoConfirmacao}
                onChange={(e) => setTextoConfirmacao(e.target.value)}
                placeholder="EXCLUIR"
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
                disabled={textoConfirmacao !== "EXCLUIR" || deletando}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
              >
                {deletando ? <Loader2 size={20} className="animate-spin" /> : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE SUCESSO */}
      {sucessoFeedback && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-lg">
          <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
          <p className="font-medium font-admin">{sucessoFeedback}</p>
        </div>
      )}

      {conflitoFeedback && (
        <div className="fixed top-8 right-8 bg-red-50 border border-red-200 rounded-xl px-6 py-4 shadow-lg flex items-center gap-3 z-50">
          <XCircle className="text-red-500"/>
          <span className="text-red-700 font-medium">{conflitoFeedback}</span>
        </div>
      )}
    </div>
  );
}
