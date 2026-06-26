import { useEffect, useState } from "react";
import TipoDeQuartoForm from "../components/TipoDeQuartoForm";
import { api } from "../api";
import type { TipoDeQuarto } from "../types";
import { Loader2, Search, Trash2, AlertTriangle, Edit2, CheckCircle2, Tags, Users, DollarSign } from "lucide-react";

export default function TipoDeQuartoAdminPage() {
  const [tipos, setTipos] = useState<TipoDeQuarto[]>([]);
  
  const [tipoEditando, setTipoEditando] = useState<TipoDeQuarto | null>(null);
  const [buscaNome, setBuscaNome] = useState("");
  
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroPagina, setErroPagina] = useState("");
  const [sucessoFeedback, setSucessoFeedback] = useState("");
  const [erroForm, setErroForm] = useState("");

  const [itemParaExcluir, setItemParaExcluir] = useState<{id: number, nome: string} | null>(null);
  const [textoConfirmacao, setTextoConfirmacao] = useState("");
  const [deletando, setDeletando] = useState(false);
  const [erroExclusao, setErroExclusao] = useState(""); // Novo estado para erro do modal

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const dados = await api.getTiposDeQuarto();
      setTipos(dados);
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

  async function handleSubmitForm(data: Omit<TipoDeQuarto, "id">) {
    setErroForm(""); 

    try {
      if (tipoEditando) {
        await api.updateTipoDeQuarto(tipoEditando.id, data);
        mostrarSucesso("Tipo de Quarto atualizado com sucesso!");
      } else {
        await api.createTipoDeQuarto(data);
        mostrarSucesso("Tipo de Quarto criado com sucesso!");
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
      // ISSO AQUI FAZ A MÁGICA DE NÃO APAGAR OS DADOS DO FORMULÁRIO:
      throw new Error(msg); 
    }
  }

  function handleCancel() {
    setTipoEditando(null);
    setErroForm("");
  }

  function handleCliqueEditar(tipo: TipoDeQuarto) {
    setTipoEditando(tipo);
    setErroForm("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirmDelete() {
    if (!itemParaExcluir) return;
    setDeletando(true);
    setErroExclusao("");
    try {
      await api.deleteTipoDeQuarto(itemParaExcluir.id);
      setTipos(tipos.filter(t => t.id !== itemParaExcluir.id));
      fecharModalExclusao();
      if (tipoEditando?.id === itemParaExcluir.id) handleCancel();
      mostrarSucesso("Categoria excluída permanentemente.");
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
      
      setErroExclusao(msg); // Exibe o erro DENTRO do modal, sem alerts!
    } finally {
      setDeletando(false);
    }
  }

  function fecharModalExclusao() {
    setItemParaExcluir(null);
    setTextoConfirmacao("");
    setErroExclusao("");
  }

  const tiposFiltrados = tipos.filter(t => 
    !buscaNome || t.nome.toLowerCase().includes(buscaNome.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#222020] font-admin">Tipos de Quarto</h1>
        <p className="text-gray-500 mt-1">Gerencie as categorias de acomodação do hotel.</p>
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
            <TipoDeQuartoForm 
              tipoEditando={tipoEditando} 
              error={erroForm} 
              onSubmit={handleSubmitForm}
              onCancel={handleCancel}
            />
          </div>

          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] flex flex-col overflow-hidden sticky top-6 max-h-[75vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Categorias Registradas</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" placeholder="Buscar pelo nome da categoria..." 
                  value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3 bg-[#FFF8EF]/30">
              {tiposFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 py-8 font-medium text-sm">Nenhuma categoria encontrada.</p>
              ) : (
                tiposFiltrados.map(tipo => (
                  <div key={tipo.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition-colors relative">
                    <div className="flex justify-between items-start mb-2 pr-20">
                      <span className="font-bold text-[#222020] flex items-center gap-2">
                        <Tags size={16} className="text-[#EF9B1B]" /> {tipo.nome}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-emerald-600" />
                        <span className="font-medium text-emerald-700">R$ {tipo.precoDiaria.toFixed(2)} / diária</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        <span>Até {tipo.capacidadeMax} pessoas • Cama: {tipo.tipoCama}</span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-1">
                      <button onClick={() => handleCliqueEditar(tipo)} className="p-1.5 text-gray-400 hover:text-[#EF9B1B] hover:bg-[#EF9B1B]/10 rounded-lg transition-all" title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setItemParaExcluir({ id: tipo.id, nome: tipo.nome })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSÃO */}
      {itemParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100 animate-fade-in">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-[#222020] font-admin">Excluir Categoria</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir <strong>{itemParaExcluir.nome}</strong>?
            </p>

            {/* SE DER ERRO NA EXCLUSÃO, APARECE AQUI DENTRO, EM VERMELHO */}
            {erroExclusao && (
               <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                 {erroExclusao}
               </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Digite <span className="text-red-500 font-bold select-all">CANCELAR</span>:</label>
              <input type="text" value={textoConfirmacao} onChange={(e) => setTextoConfirmacao(e.target.value)} placeholder="CANCELAR" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 outline-none text-center font-bold tracking-widest uppercase" />
            </div>
            <div className="flex gap-3">
              <button onClick={fecharModalExclusao} className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Voltar</button>
              <button onClick={handleConfirmDelete} disabled={textoConfirmacao !== "CANCELAR" || deletando} className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex justify-center items-center">
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
    </div>
  );
}