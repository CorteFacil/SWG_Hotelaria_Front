import { useEffect, useState } from "react";
import EstadoForm from "../components/EstadoForm";
import { api } from "../api";
import type { Estado, PaisIso } from "../types";
import {
  Loader2,
  Search,
  Trash2,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  MapPin,
  Globe,
} from "lucide-react";

export default function EstadoAdminPage() {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [paises, setPaises] = useState<PaisIso[]>([]);

  const [estadoEditando, setEstadoEditando] = useState<Estado | null>(null);
  const [erroSubmitForm, setErroSubmitForm] = useState<string | undefined>(undefined);
  const [sucessoFeedback, setSucessoFeedback] = useState("");

  const [busca, setBusca] = useState("");
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");

  const [itemParaExcluir, setItemParaExcluir] = useState<{ id: number; nome: string } | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [estadosData, paisesData] = await Promise.all([
        api.getEstados(),
        api.getPaises(),
      ]);
      setEstados(estadosData);
      setPaises(paisesData);
    } catch {
      setErroPagina("Falha ao carregar os dados. Atualize a página.");
    } finally {
      setLoadingDados(false);
    }
  }

  function mostrarSucesso(mensagem: string) {
    setSucessoFeedback(mensagem);
    setTimeout(() => setSucessoFeedback(""), 3000);
  }

  async function handleSubmitForm(data: any) {
    setErroSubmitForm(undefined);
    try {
      if (estadoEditando) {
        await api.updateEstado(estadoEditando.id, data);
        mostrarSucesso("Estado atualizado com sucesso! ✨");
      } else {
        await api.createEstado(data);
        mostrarSucesso("Estado cadastrado com sucesso! ✨");
      }
      await carregarDados();
      handleCancel();
    } catch (err) {
      let mensagemLimpa = (err as Error).message;
      try {
        const erroParseado = JSON.parse(mensagemLimpa);
        if (erroParseado?.message) mensagemLimpa = erroParseado.message;
      } catch {
        // Ignora se não for JSON
      }
      setErroSubmitForm(mensagemLimpa);
    }
  }

  function handleCancel() {
    setEstadoEditando(null);
    setErroSubmitForm(undefined);
  }

  function handleCliqueEditar(estado: Estado) {
    setEstadoEditando(estado);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConfirmDelete() {
    if (!itemParaExcluir) return;
    setDeletando(true);
    try {
      await api.deleteEstado(itemParaExcluir.id);
      setEstados(estados.filter((e) => e.id !== itemParaExcluir.id));
      fecharModalExclusao();
      if (estadoEditando?.id === itemParaExcluir.id) handleCancel();
      mostrarSucesso("Estado excluído permanentemente.");
    } catch {
      alert("Erro ao excluir. O estado pode estar vinculado a hóspedes.");
    } finally {
      setDeletando(false);
    }
  }

  function fecharModalExclusao() {
    setItemParaExcluir(null);
    setTextoConfirmacao("");
  }

  const estadosFiltrados = estados.filter((estado) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      estado.nomeEstado.toLowerCase().includes(termo) ||
      estado.siglaUf.toLowerCase().includes(termo) ||
      (estado.regiaoGeografica ?? "").toLowerCase().includes(termo)
    );
  });

  return (
    <div className="max-w-8xl w-full animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Gestão de Estados</h1>
        <p className="text-gray-500 mt-1">Cadastro e manutenção de estados e regiões geográficas.</p>
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

          {/* COLUNA ESQUERDA — Formulário */}
          <div className="space-y-6">
            <EstadoForm
              paises={paises}
              estadoEditando={estadoEditando}
              error={erroSubmitForm}
              onSubmit={handleSubmitForm}
              onCancel={handleCancel}
            />
          </div>

          {/* COLUNA DIREITA — Lista */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden sticky top-6 max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Estados Registrados</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, sigla ou região..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-[#FFF8EF]/30">
              {estadosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 py-8 font-medium text-sm">
                  Nenhum estado encontrado.
                </p>
              ) : (
                estadosFiltrados.map((estado) => {
                  const pais = paises.find((p) => p.id === estado.paisisoId);
                  return (
                    <div
                      key={estado.id}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition-colors relative"
                    >
                      <div className="flex justify-between items-start mb-2 pr-20">
                        <span className="font-bold text-[#222020] flex items-center gap-2 truncate">
                          <MapPin size={16} className="text-[#EF9B1B] shrink-0" />
                          {estado.nomeEstado}
                          <span className="ml-1 text-xs font-bold bg-[#EF9B1B]/10 text-[#C47D0E] px-2 py-0.5 rounded">
                            {estado.siglaUf}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                        {estado.regiaoGeografica && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <span>{estado.regiaoGeografica}</span>
                          </div>
                        )}
                        {pais && (
                          <div className="flex items-center gap-2">
                            <Globe size={14} className="text-gray-400 shrink-0" />
                            <span>{pais.nome} ({pais.sigla_iso2})</span>
                          </div>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        <button
                          onClick={() => handleCliqueEditar(estado)}
                          className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setItemParaExcluir({ id: estado.id, nome: estado.nomeEstado })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir"
                        >
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

      {/* MODAL DE EXCLUSÃO */}
      {itemParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100 animate-fade-in">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-[#222020] font-admin">Excluir Estado</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir <strong className="text-[#222020]">{itemParaExcluir.nome}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Digite <span className="text-red-500 font-bold select-all">CANCELAR</span> para confirmar:
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
                {deletando ? <Loader2 size={20} className="animate-spin" /> : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE SUCESSO */}
      {sucessoFeedback && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-[0_8px_30px_rgba(16,185,129,0.15)] animate-fade-in">
          <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
          <p className="font-medium font-admin">{sucessoFeedback}</p>
        </div>
      )}
    </div>
  );
}
