import { useEffect, useState } from "react";
import OrdemLimpezaForm from "../components/OrdemLimpezaForm";
import type { OrdemLimpeza, Funcionario, Quarto } from "../types";
import { Loader2, Search, Trash2, AlertTriangle, Edit2, CheckCircle2, ClipboardList, BedDouble, UserCircle, Clock } from "lucide-react";
import { criarOrdemLimpeza, atualizarOrdemLimpeza, excluirOrdemLimpeza, listarOrdemLimpeza } from "@/Api/ordemlimpeza";
import { listarFuncionarios } from "@/Api/funcionarios";
import { listarQuartos } from "@/Api/quartos";

const STATUS_STYLE: Record<string, string> = {
  'Concluido': 'bg-emerald-100 text-emerald-700',
  'Andamento': 'bg-blue-100 text-blue-700',
  'Não Concluido': 'bg-red-100 text-red-700',
};

export default function OrdemLimpezaAdminPage() {
  const [ordens, setOrdens] = useState<OrdemLimpeza[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);

  const [ordemEditando, setOrdemEditando] = useState<OrdemLimpeza | null>(null);
  const [busca, setBusca] = useState("");

  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");
  const [sucessoFeedback, setSucessoFeedback] = useState("");
  const [erroFeedback, setErroFeedback] = useState("");
  const [erroForm, setErroForm] = useState("");

  const [itemParaExcluir, setItemParaExcluir] = useState<{ id: number, label: string } | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [ordensData, funcionariosData, quartosData] = await Promise.all([
        listarOrdemLimpeza(),
        listarFuncionarios(),
        listarQuartos(),
      ]);
      setOrdens(ordensData);
      setFuncionarios(funcionariosData);
      setQuartos(quartosData);
    } catch (err) {
      setErroPagina("Falha ao carregar os dados. Atualize a página.");
    } finally {
      setLoadingDados(false);
    }
  }

  function mostrarSucesso(mensagem: string) {
    setSucessoFeedback(mensagem);
    setTimeout(() => setSucessoFeedback(""), 3000);
  }

  function mostrarErro(mensagem: string) {
    setErroFeedback(mensagem);
    setTimeout(() => setErroFeedback(""), 4500);
  }

  async function handleSubmitForm(data: any) {
    setErroForm("");
    try {
      const payload = {
        ...data,
        quartoId: Number(data.quartoId),
        funcionarioId: Number(data.funcionarioId),
      };

      if (ordemEditando) {
        await atualizarOrdemLimpeza(String(ordemEditando.id), payload);
        mostrarSucesso("Ordem de limpeza atualizada com sucesso!");
      } else {
        await criarOrdemLimpeza(payload);
        mostrarSucesso("Ordem de limpeza criada com sucesso!");
      }
      handleCancel();
      carregarDados();
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
      setErroForm(msg);
      throw new Error(msg);
    }
  }

  function handleCancel() {
    setOrdemEditando(null);
    setErroForm("");
  }

  function handleCliqueEditar(ordem: OrdemLimpeza) {
    setOrdemEditando(ordem);
    setErroForm("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirmDelete() {
    if (!itemParaExcluir) return;
    setDeletando(true);
    try {
      await excluirOrdemLimpeza(String(itemParaExcluir.id));
      setOrdens(ordens.filter(o => o.id !== itemParaExcluir.id));
      fecharModalExclusao();
      if (ordemEditando?.id === itemParaExcluir.id) handleCancel();
      mostrarSucesso("Registro excluído permanentemente.");
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
      fecharModalExclusao();
      mostrarErro(msg);
    } finally {
      setDeletando(false);
    }
  }

  function fecharModalExclusao() {
    setItemParaExcluir(null);
    setTextoConfirmacao("");
  }

  const formatarData = (data: string) =>
    new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  const ordensFiltradas = ordens.filter(o => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    const quarto = quartos.find(q => q.id === o.quartoId);
    const func = funcionarios.find(f => f.id === o.funcionarioId);
    return (
      quarto?.numero.toString().includes(termo) ||
      func?.nome.toLowerCase().includes(termo) ||
      o.status.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Ordens de Limpeza</h1>
        <p className="text-gray-500 mt-1">Gerencie as ordens de limpeza vinculadas a quartos e funcionários.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 overflow-hidden">

          <div className="space-y-6 h-full overflow-y-auto custom-scroll pr-2">
            <OrdemLimpezaForm
              funcionarios={funcionarios}
              quartos={quartos}
              ordemEditando={ordemEditando}
              error={erroForm}
              onSubmit={handleSubmitForm}
              onCancel={handleCancel}
            />
          </div>

          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] flex flex-col overflow-hidden sticky top-6 max-h-[75vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Ordens Registradas</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Buscar por quarto, funcionário ou status..."
                  value={busca} onChange={e => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-[#FFF8EF]/30">
              {ordensFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-8 font-medium text-sm">Nenhuma ordem encontrada.</p>
              ) : (
                ordensFiltradas.map(ordem => {
                  const quarto = quartos.find(q => q.id === ordem.quartoId);
                  const func = funcionarios.find(f => f.id === ordem.funcionarioId);
                  return (
                    <div key={ordem.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition-colors relative">
                      <div className="flex justify-between items-start mb-2 pr-20">
                        <span className="font-bold text-[#222020] flex items-center gap-2 truncate">
                          <ClipboardList size={16} className="text-[#EF9B1B] shrink-0" />
                          Quarto {quarto?.numero ?? '—'}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[ordem.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {ordem.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <UserCircle size={14} className="text-gray-400" />
                          <span>{func?.nome ?? 'Funcionário não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BedDouble size={14} className="text-gray-400" />
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            Andar {quarto?.andar ?? '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-xs">{formatarData(ordem.inicio)} → {formatarData(ordem.fim)}</span>
                        </div>
                        {ordem.observacao && (
                          <p className="text-xs text-gray-400 italic truncate mt-1">"{ordem.observacao}"</p>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        <button onClick={() => handleCliqueEditar(ordem)} className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setItemParaExcluir({ id: ordem.id, label: `Quarto ${quarto?.numero} — ${func?.nome}` })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Excluir">
                          <Trash2 size={18} />
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

      {itemParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100 animate-fade-in">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-[#222020] font-admin">Excluir Ordem de Limpeza</h3>
            </div>
            <p className="text-gray-600 mb-4">Tem certeza que deseja excluir a ordem de <strong>{itemParaExcluir.label}</strong>?</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Digite <span className="text-red-500 font-bold select-all">EXCLUIR</span>:
              </label>
              <input
                type="text" value={textoConfirmacao}
                onChange={e => setTextoConfirmacao(e.target.value.toUpperCase())}
                placeholder="EXCLUIR"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 outline-none text-center font-bold tracking-widest uppercase"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={fecharModalExclusao} className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Voltar</button>
              <button onClick={handleConfirmDelete} disabled={textoConfirmacao !== "EXCLUIR" || deletando}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex justify-center items-center">
                {deletando ? <Loader2 size={20} className="animate-spin" /> : "Sim, Excluir"}
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

      {erroFeedback && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-[0_8px_30px_rgba(239,68,68,0.15)] animate-fade-in">
          <AlertTriangle size={24} className="text-red-500 shrink-0" />
          <p className="font-medium font-admin">{erroFeedback}</p>
        </div>
      )}
    </div>
  );
}