import { useState, useEffect, type FormEvent } from "react";

import {
  Map,
  Badge,
  Globe2,
  MapPinned
} from "lucide-react";

import type {
  PaisIso,
  Estado
} from "../types";

interface EstadoFormProps {

  paises: PaisIso[];

  error?: string;

  estadoEditando?: Estado | null;

  onSubmit: (data: any) => void;

  onCancel: () => void;

}

export default function EstadoForm({

  paises,

  error,

  estadoEditando,

  onSubmit,

  onCancel

}: EstadoFormProps) {

  const [nomeEstado, setNomeEstado] =
    useState("");

  const [siglaUf, setSiglaUf] =
    useState("");

  const [regiaoGeografica,
    setRegiaoGeografica] =
    useState("");

  const [paisisoId,
    setPaisisoId] =
    useState("");

  useEffect(() => {

    if (estadoEditando) {

      setNomeEstado(
        estadoEditando.nomeEstado ?? ""
      );

      setSiglaUf(
        estadoEditando.siglaUf ?? ""
      );

      setRegiaoGeografica(
        estadoEditando.regiaoGeografica ?? ""
      );

      setPaisisoId(
        String(
          estadoEditando.paisisoId ?? ""
        )
      );

    }

    else {

      setNomeEstado("");

      setSiglaUf("");

      setRegiaoGeografica("");

      setPaisisoId("");

    }

  }, [estadoEditando]);

  const getErro = (palavrasChave: string[]) => {

    if (!error) return null;

    const sentencas =
      error.match(/[^.!?]+[.!?]+/g)
      || [error];

    const encontradas =
      sentencas.filter(sentenca =>

        palavrasChave.some(p =>

          sentenca
            .toLowerCase()
            .includes(
              p.toLowerCase()
            )

        )

      );

    return encontradas.length > 0

      ? encontradas.join(" ").trim()

      : null;

  };

  const erroNome =
    getErro(["Nome"]);

  const erroSigla =
    getErro(["Sigla"]);

  const erroPais =
    getErro(["País"]);

  const erroRegiao =
    getErro(["Região"]);

  function handleSubmit(

    event: FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();

    onSubmit({

      nomeEstado,

      siglaUf,

      regiaoGeografica,

      paisisoId:
        Number(paisisoId)

    });

  }

  return (

    <form

      className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B]"

      onSubmit={handleSubmit}

    >

      <div className="text-center mb-6">

        <h2 className="text-2xl font-display font-black text-[#EF9B1B]">

          {

            estadoEditando

              ?

              "Editar Estado"

              :

              "Cadastro de Estado"

          }

        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">        {/* Nome do Estado */}

        <div className="space-y-1">

          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Nome do Estado
          </label>

          <div className="relative">

            <Map
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EF9B1B]"
            />

            <input
              value={nomeEstado}
              onChange={(e) => setNomeEstado(e.target.value)}
              required
              placeholder="Ex.: Espírito Santo"
              className={`w-full pl-10 p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${erroNome
                ? "border border-red-400 focus:border-red-400"
                : "border border-[#222020]/20 focus:border-[#EF9B1B]"
                }`}
            />

          </div>

          {erroNome && (
            <span className="text-xs text-red-500">
              {erroNome}
            </span>
          )}

        </div>

        {/* Sigla */}

        <div className="space-y-1">

          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Sigla UF
          </label>

          <div className="relative">

            <Badge
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EF9B1B]"
            />

            <input
              value={siglaUf}
              onChange={(e) =>
                setSiglaUf(
                  e.target.value
                    .toUpperCase()
                    .slice(0, 2)
                )
              }
              required
              maxLength={2}
              placeholder="ES"
              className={`w-full pl-10 p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${erroSigla
                ? "border border-red-400 focus:border-red-400"
                : "border border-[#222020]/20 focus:border-[#EF9B1B]"
                }`}
            />

          </div>

          {erroSigla && (
            <span className="text-xs text-red-500">
              {erroSigla}
            </span>
          )}

        </div>

        {/* País */}

        <div className="space-y-1">

          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            País
          </label>

          <div className="relative">

            <Globe2
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EF9B1B]"
            />

            <select
              value={paisisoId}
              onChange={(e) =>
                setPaisisoId(e.target.value)
              }
              required
              className={`w-full pl-10 p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all appearance-none ${erroPais
                ? "border border-red-400 focus:border-red-400"
                : "border border-[#222020]/20 focus:border-[#EF9B1B]"
                }`}
            >

              <option value="">
                Selecione
              </option>

              {paises.map((pais) => (

                <option
                  key={pais.id}
                  value={pais.id}
                >

                  {pais.nome} ({pais.sigla_iso2})

                </option>

              ))}

            </select>

          </div>

          {erroPais && (
            <span className="text-xs text-red-500">
              {erroPais}
            </span>
          )}

        </div>

        {/* Região */}

        <div className="space-y-1">

          <label className="text-xs font-medium uppercase tracking-wider text-[#222020]">
            Região Geográfica
          </label>

          <div className="relative">

            <MapPinned
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#EF9B1B]"
            />

            <input
              value={regiaoGeografica}
              onChange={(e) =>
                setRegiaoGeografica(e.target.value)
              }
              required
              placeholder="Ex.: Sudeste"
              className={`w-full pl-10 p-2.5 rounded-lg bg-[#FFF8EF] outline-none transition-all ${erroRegiao
                ? "border border-red-400 focus:border-red-400"
                : "border border-[#222020]/20 focus:border-[#EF9B1B]"
                }`}
            />

          </div>

          {erroRegiao && (
            <span className="text-xs text-red-500">
              {erroRegiao}
            </span>
          )}

        </div>

      </div>

      <div className="mt-8 flex gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg font-medium border border-[#222020]/20 text-[#222020] hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg font-medium bg-[#EF9B1B] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          {estadoEditando
            ? "Salvar Alterações"
            : "Salvar Estado"}
        </button>

      </div>

    </form>

  )

}