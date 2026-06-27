import { useEffect, useState } from "react";
import HospedeForm from "../components/HospedeForm";
import type { Hospede, Estado, Pais } from "../types";
import { Loader2, Search, Trash2, AlertTriangle, Edit2, CheckCircle2, UserCircle, Phone, MapPin } from "lucide-react";
import { atualizarHospede, criarHospede, excluirHospede, listarHospedes } from "@/Api/hospedes";
import { listarEstados } from "@/Api/estados";
import { listarPaises } from "@/Api/paises";

export default function HospedeAdminPage() {
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);

  const [hospedeEditando, setHospedeEditando] = useState<Hospede | null>(null);
  const [busca, setBusca] = useState("");

  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");
  const [sucessoFeedback, setSucessoFeedback] = useState("");
  const [erroFeedback, setErroFeedback] = useState("");

  const [erroForm, setErroForm] = useState("");

  const [itemParaExcluir, setItemParaExcluir] = useState<{ id: number, nome: string } | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [hospedesData, estadosData, paisesData] = await Promise.all([
        listarHospedes(),
        listarEstados(),
        listarPaises()
      ]);
      setHospedes(hospedesData);
      setEstados(estadosData);
      setPaises(paisesData);
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
      const payloadSeguro = {
        ...data,
        estadoId: Number(data.estadoId),
        paisId: Number(data.paisId),
        estado: { id: Number(data.estadoId) }
      };

      if (hospedeEditando) {
        await atualizarHospede(String(hospedeEditando.id), payloadSeguro);
        mostrarSucesso("Hóspede atualizado com sucesso!");
      } else {
        await criarHospede(payloadSeguro);
        mostrarSucesso("Hóspede cadastrado com sucesso!");
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
      } catch (e) { }

      setErroForm(msg);
      throw new Error(msg);
    }
  }

  function handleCancel() {
    setHospedeEditando(null);
    setErroForm("");
  }

  function handleCliqueEditar(hospede: Hospede) {
    setHospedeEditando(hospede);
    setErroForm("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirmDelete() {
    if (!itemParaExcluir) return;
    setDeletando(true);
    try {
      await excluirHospede(String(itemParaExcluir.id));
      setHospedes(hospedes.filter(h => h.id !== itemParaExcluir.id));
      fecharModalExclusao();
      if (hospedeEditando?.id === itemParaExcluir.id) handleCancel();
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
      } catch (e) { }

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

  const hospedesFiltrados = hospedes.filter(h => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return h.nome.toLowerCase().includes(termo) || h.cpfPassaporte.includes(termo);
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Gestão de Hóspedes</h1>
        <p className="text-gray-500 mt-1">Cadastro e histórico de clientes do hotel.</p>
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
            <HospedeForm
              estados={estados}
              paises={paises}
              hospedeEditando={hospedeEditando}
              error={erroForm}
              onSubmit={handleSubmitForm}
              onCancel={handleCancel}
            />
          </div>

          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] flex flex-col overflow-hidden sticky top-6 max-h-[75vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Hóspedes Registrados</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Buscar por nome ou CPF..."
                  value={busca} onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-[#FFF8EF]/30">
              {hospedesFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 py-8 font-medium text-sm">Nenhum hóspede encontrado.</p>
              ) : (
                hospedesFiltrados.map(hospede => {
                  const estado = estados.find(e => e.id === hospede.estadoId);
                  return (
                    <div key={hospede.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition-colors relative">
                      <div className="flex justify-between items-start mb-2 pr-20">
                        <span className="font-bold text-[#222020] flex items-center gap-2 truncate">
                          <UserCircle size={16} className="text-[#EF9B1B]" /> {hospede.nome}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">CPF/Pass: {hospede.cpfPassaporte}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span>{hospede.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{estado ? `${estado.nomeEstado} - ${estado.siglaUf}` : "Estado não informado"}</span>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        <button onClick={() => handleCliqueEditar(hospede)} className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setItemParaExcluir({ id: hospede.id, nome: hospede.nome })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Excluir">
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
              <h3 className="text-xl font-bold text-[#222020] font-admin">Excluir Hóspede</h3>
            </div>
            <p className="text-gray-600 mb-4">Tem certeza que deseja excluir <strong>{itemParaExcluir.nome}</strong>?</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Digite <span className="text-red-500 font-bold select-all">EXCLUIR</span>:</label>
              <input type="text" value={textoConfirmacao} onChange={(e) => setTextoConfirmacao(e.target.value.toUpperCase())} placeholder="EXCLUIR" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 outline-none text-center font-bold tracking-widest uppercase" />
            </div>
            <div className="flex gap-3">
              <button onClick={fecharModalExclusao} className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Voltar</button>
              <button onClick={handleConfirmDelete} disabled={textoConfirmacao !== "EXCLUIR" || deletando} className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex justify-center items-center">
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