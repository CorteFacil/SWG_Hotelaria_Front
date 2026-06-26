import { useEffect, useState, type FormEvent } from "react";

import {
    BedDouble,
    Layers,
    Building2,
    BadgeInfo
} from "lucide-react";

import type {
    TipoDeQuarto
} from "../types";

interface QuartoFormProps {

    tiposDeQuarto: TipoDeQuarto[];

    quartoEditando?: any;

    error?: string;

    onSubmit: (data: any) => void;

    onCancel: () => void;

}

export default function QuartoForm({

    tiposDeQuarto,

    quartoEditando,

    error,

    onSubmit,

    onCancel

}: QuartoFormProps) {

    const [numero, setNumero] =
        useState("");

    const [andar, setAndar] =
        useState("");

    const [status_quarto,
        setStatusQuarto] =
        useState("Disponivel");

    const [tipoDeQuartoId,
        setTipoDeQuartoId] =
        useState("");

    useEffect(() => {

        if (quartoEditando) {

            setNumero(

                quartoEditando.numero ?? ""

            );

            setAndar(

                String(

                    quartoEditando.andar

                )

            );

            setStatusQuarto(

                quartoEditando.status_quarto

            );

            setTipoDeQuartoId(

                String(

                    quartoEditando.tipoDeQuartoId

                )

            );

        }

        else {

            setNumero("");

            setAndar("");

            setStatusQuarto("Disponivel");

            setTipoDeQuartoId("");

        }

    }, [quartoEditando]);

    function getErro(chaves: string[]) {

        if (!error) return null;

        const sentencas =

            error.match(

                /[^.!?]+[.!?]+/g

            ) || [error];

        const encontradas =

            sentencas.filter(s =>

                chaves.some(chave =>

                    s

                        .toLowerCase()

                        .includes(

                            chave.toLowerCase()

                        )

                )

            );

        return encontradas.length

            ? encontradas.join(" ")

            : null;

    }

    const erroNumero =
        getErro(["Número"]);

    const erroAndar =
        getErro(["Andar"]);

    const erroTipo =
        getErro(["Tipo"]);

    function handleSubmit(

        e: FormEvent

    ) {

        e.preventDefault();

        onSubmit({

            numero,

            andar: Number(andar),

            status_quarto,

            tipoDeQuartoId:

                Number(tipoDeQuartoId)

        });

    }

    return (

        <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B]">

            <div className="mb-8">

                <h2 className="text-2xl font-bold text-[#222020] flex items-center gap-2">

                    <BedDouble
                        className="text-[#EF9B1B]"
                    />

                    {

                        quartoEditando

                            ?

                            "Editar Quarto"

                            :

                            "Cadastro de Quarto"

                    }

                </h2>

                <p className="text-gray-500 text-sm">

                    Informe os dados do quarto.

                </p>

            </div>

            <form

                onSubmit={handleSubmit}

                className="space-y-6"

            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Número */}

                    <div className="space-y-2">

                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
                            Número
                        </label>

                        <div className="relative">

                            <BedDouble
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />

                            <input
                                type="text"
                                required
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                placeholder="Ex: 101"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erroNumero
                                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                                    }`}
                            />

                        </div>

                        {erroNumero && (
                            <span className="text-xs text-red-500">
                                {erroNumero}
                            </span>
                        )}

                    </div>

                    {/* Andar */}

                    <div className="space-y-2">

                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
                            Andar
                        </label>

                        <div className="relative">

                            <Layers
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="number"
                                min={1}
                                required
                                value={andar}
                                onChange={(e) => setAndar(e.target.value)}
                                placeholder="1"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erroAndar
                                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                                    }`}
                            />

                        </div>

                        {erroAndar && (
                            <span className="text-xs text-red-500">
                                {erroAndar}
                            </span>
                        )}

                    </div>

                    {/* Tipo */}

                    <div className="space-y-2">

                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
                            Tipo de Quarto
                        </label>

                        <div className="relative">

                            <Building2
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                required
                                value={tipoDeQuartoId}
                                onChange={(e) => setTipoDeQuartoId(e.target.value)}
                                className={`w-full appearance-none pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erroTipo
                                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                                    }`}
                            >

                                <option value="">
                                    Selecione...
                                </option>

                                {tiposDeQuarto.map(tipo => (

                                    <option
                                        key={tipo.id}
                                        value={tipo.id}
                                    >

                                        {tipo.nome}

                                    </option>

                                ))}

                            </select>

                        </div>

                        {erroTipo && (
                            <span className="text-xs text-red-500">
                                {erroTipo}
                            </span>
                        )}

                    </div>

                    {/* Status */}

                    <div className="space-y-2">

                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
                            Status
                        </label>

                        <div className="relative">

                            <BadgeInfo
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                value={status_quarto}
                                onChange={(e) => setStatusQuarto(e.target.value)}
                                className="w-full appearance-none pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800"
                            >

                                <option value="Disponivel">
                                    Disponível
                                </option>

                                <option value="Ocupado">
                                    Ocupado
                                </option>

                                <option value="Limpeza">
                                    Limpeza
                                </option>

                                <option value="Manutencao">
                                    Manutenção
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {error && (

                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">

                        {error}

                    </div>

                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">

                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-[#222020] text-white hover:bg-[#EF9B1B] transition-colors"
                    >

                        {quartoEditando

                            ? "Salvar Alterações"

                            : "Salvar Quarto"}

                    </button>

                </div>

            </form>

        </div>

    );

}