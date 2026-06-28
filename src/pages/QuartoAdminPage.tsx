import { useEffect, useState } from "react";

import QuartoForm from "../components/QuartoForm";

import type {
    Quarto,
    TipoDeQuarto
} from "../types";

import {
    Loader2,
    Search,
    Trash2,
    AlertTriangle,
    Edit2,
    CheckCircle2,
    BedDouble,
    Building2,
    Layers,
    XCircle
} from "lucide-react";
import { atualizarQuarto, criarQuarto, excluirQuarto, listarQuartos } from "@/Api/quartos";
import { listarTipoDeQuarto } from "@/Api/tiposdequarto";

export default function QuartoAdminPage() {

    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [tiposDeQuarto, setTiposDeQuarto] = useState<TipoDeQuarto[]>([]);
    const [quartoEditando, setQuartoEditando] = useState<Quarto | null>(null);
    const [busca, setBusca] = useState("");
    const [loadingDados, setLoadingDados] = useState(true);
    const [erroPagina, setErroPagina] = useState("");
    const [sucessoFeedback, setSucessoFeedback] = useState("");
    const [conflitoFeedback, setConflitoFeedback] = useState("");

    const [itemParaExcluir, setItemParaExcluir] = useState<{
        id: number,
        numero: string
    } | null>(null);

    const [textoConfirmacao, setTextoConfirmacao] = useState("");

    const [deletando, setDeletando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [
                quartosData,
                tiposData
            ] = await Promise.all([
                listarQuartos(),
                listarTipoDeQuarto()
            ]);
            setQuartos(quartosData);
            setTiposDeQuarto(tiposData);
        }
        catch {
            setErroPagina(
                "Falha ao carregar os quartos."
            );
        }
        finally {
            setLoadingDados(false);
        }
    }

    function mostrarSucesso(
        mensagem: string
    ) {
        setSucessoFeedback(mensagem);
        setTimeout(() => {
            setSucessoFeedback("");
        }, 3000);

    }

    async function handleSubmitForm(
        data: any
    ) {
        try {
            if (
                quartoEditando
            ) {
                await atualizarQuarto(
                    String(quartoEditando.id),
                    data
                );
                mostrarSucesso(
                    "Quarto atualizado com sucesso!"
                );
            }
            else {
                await criarQuarto(
                    data
                );
                mostrarSucesso(
                    "Quarto cadastrado com sucesso!"
                );

            }
            handleCancel();
            carregarDados();
        }

        catch (err) {

            if ((err as Error).message.includes("Não podem existir dois registros com a mesma chave!")) {

                mostrarConflito(

                    "Não podem existir dois registros com a mesma chave!"

                );

            } else {

                alert(

                    (err as Error).message

                );
            }
            alert(
                (err as Error).message
            );

        }

    }

    function handleCancel() {
        setQuartoEditando(null);

    }

    function handleEditar(
        quarto: Quarto

    ) {

        setQuartoEditando(quarto);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    async function handleConfirmDelete() {

        if (
            !itemParaExcluir
        )
            return;

        setDeletando(true);

        try {

            await excluirQuarto(
                String(itemParaExcluir.id)
            );

            setQuartos(

                quartos.filter(

                    q =>

                        q.id !==

                        itemParaExcluir.id

                )

            );

            fecharModal();

            mostrarSucesso(

                "Quarto excluído."

            );

        }

        catch {

            alert(

                "Não foi possível excluir."

            );

        }

        finally {

            setDeletando(false);

        }

    }

    function fecharModal() {

        setItemParaExcluir(null);

        setTextoConfirmacao("");

    }

    /* const quartosFiltrados =

        quartos.filter(

            quarto => {

                if (!busca)

                    return true;

                const termo =

                    busca.toLowerCase();

                return (

                    quarto.numero

                        .toString()

                        .includes(

                            termo

                        )

                    ||

                    quarto

                        .tipoDeQuarto

                        ?.nome

                        ?.toLowerCase()

                        .includes(

                            termo

                        )

                );

            }

        ); */

    const quartosFiltrados = [...quartos]
        .sort((a, b) => {
            if (a.andar !== b.andar) {
                return a.andar - b.andar;
            }

            return Number(a.numero) - Number(b.numero);
        })
        .filter(quarto => {
            if (!busca) return true;

            const termo = busca.toLowerCase();

            return (
                quarto.numero.toString().includes(termo) ||
                quarto.tipoDeQuarto?.nome?.toLowerCase().includes(termo)
            );
        });

    return (
        <div className="max-w-8xl w-full animate-fade-in relative">

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#222020] font-admin">
                    Gestão de Quartos
                </h1>

                <p className="text-gray-500 mt-1">
                    Cadastro e gerenciamento dos quartos do hotel.
                </p>
            </div>

            {loadingDados ? (

                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[1.25rem] border border-gray-100 shadow-sm">

                    <Loader2 className="w-8 h-8 text-[#EF9B1B] animate-spin mb-4" />

                    <p className="text-gray-500 font-medium">

                        Carregando quartos...

                    </p>

                </div>

            ) : erroPagina ? (

                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">

                    {erroPagina}

                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* FORMULÁRIO */}

                    <div>

                        <QuartoForm

                            tiposDeQuarto={tiposDeQuarto}

                            quartoEditando={quartoEditando}

                            onSubmit={handleSubmitForm}

                            onCancel={handleCancel}

                        />

                    </div>

                    {/* LISTA */}

                    <div className="bg-white rounded-xl border border-[#EF9B1B] flex flex-col overflow-hidden sticky top-6 max-h-[75vh]">

                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">

                            <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">

                                Quartos Cadastrados

                            </h3>

                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input

                                    type="text"

                                    placeholder="Buscar por número ou tipo..."

                                    value={busca}

                                    onChange={(e) => setBusca(e.target.value)}

                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none"

                                />

                            </div>

                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF8EF]/30">

                            {quartosFiltrados.length === 0 ? (

                                <p className="text-center text-gray-500 py-8">

                                    Nenhum quarto encontrado.

                                </p>

                            ) : (

                                quartosFiltrados.map(quarto => (

                                    <div

                                        key={quarto.id}

                                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#EF9B1B]/40 transition"

                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <div className="font-bold text-[#222020] flex items-center gap-2">

                                                    <BedDouble
                                                        size={16}
                                                        className="text-[#EF9B1B]"
                                                    />

                                                    Quarto {quarto.numero}

                                                </div>

                                                <div className="mt-3 space-y-2 text-sm text-gray-600">

                                                    <div className="flex items-center gap-2">

                                                        <Layers
                                                            size={15}
                                                            className="text-gray-400"
                                                        />

                                                        Andar {quarto.andar}

                                                    </div>

                                                    <div className="flex items-center gap-2">

                                                        <Building2
                                                            size={15}
                                                            className="text-gray-400"
                                                        />

                                                        {quarto.tipoDeQuarto?.nome}

                                                    </div>

                                                    <div>

                                                        <span
                                                            className={`
                              px-2 py-1 rounded-full text-xs font-semibold

                              ${quarto.status_quarto === "Disponivel"
                                                                    ? "bg-green-100 text-green-700"

                                                                    : quarto.status_quarto === "Ocupado"
                                                                        ? "bg-red-100 text-red-700"

                                                                        : quarto.status_quarto === "Limpeza"
                                                                            ? "bg-yellow-100 text-yellow-700"

                                                                            : "bg-gray-200 text-gray-700"
                                                                }

                              `}
                                                        >

                                                            {quarto.status_quarto}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="flex gap-1">

                                                <button

                                                    onClick={() =>
                                                        handleEditar(quarto)
                                                    }

                                                    className="p-2 rounded-lg hover:bg-[#EF9B1B]/10 text-gray-500 hover:text-[#EF9B1B] transition"

                                                >

                                                    <Edit2 size={18} />

                                                </button>

                                                <button

                                                    onClick={() =>
                                                        setItemParaExcluir({

                                                            id: quarto.id,

                                                            numero: quarto.numero

                                                        })
                                                    }

                                                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"

                                                >

                                                    <Trash2 size={18} />

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                </div>

            )}

            {/* MODAL */}

            {itemParaExcluir && (

                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">

                        <div className="flex items-center gap-3 text-red-500 mb-4">

                            <AlertTriangle size={28} />

                            <h3 className="text-xl font-bold text-[#222020] font-admin">

                                Excluir Quarto

                            </h3>

                        </div>

                        <p className="mb-4">

                            Deseja realmente excluir o

                            <strong>

                                {" "}Quarto {itemParaExcluir.numero}

                            </strong>?

                        </p>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">

                                Digite <span className="text-red-500 font-bold select-all">EXCLUIR</span>:

                            </label>

                            <input

                                value={textoConfirmacao}

                                onChange={(e) =>
                                    setTextoConfirmacao(e.target.value)
                                }
                                placeholder="EXCLUIR"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-center font-bold tracking-widest uppercase"


                            />
                        </div>
                        <div className="flex gap-3 mt-6">

                            <button

                                onClick={fecharModal}

                                className="flex-1 border border-gray-200 rounded-xl py-3"

                            >

                                Voltar

                            </button>

                            <button

                                disabled={
                                    textoConfirmacao !== "EXCLUIR"
                                    || deletando
                                }

                                onClick={handleConfirmDelete}

                                className="flex-1 bg-red-500 text-white rounded-xl py-3 disabled:opacity-40"

                            >

                                {deletando

                                    ? <Loader2 className="animate-spin mx-auto" />

                                    : "Excluir"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* TOAST */}

            {sucessoFeedback && (

                <div className="fixed top-8 right-8 bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 shadow-lg flex items-center gap-3">

                    <CheckCircle2
                        className="text-emerald-500"
                    />

                    <span>

                        {sucessoFeedback}

                    </span>

                </div>

            )}

            {conflitoFeedback && (

                <div className="fixed top-8 right-8 bg-red-50 border border-red-200 rounded-xl px-6 py-4 shadow-lg flex items-center gap-3 z-50">

                    <XCircle
                        className="text-red-500"
                    />

                    <span className="text-red-700 font-medium">

                        {conflitoFeedback}

                    </span>

                </div>

            )}

        </div>

    );

}

function mostrarConflito(arg0: string) {
    throw new Error("Function not implemented.");
}
