import { useState, useEffect, type FormEvent } from "react";
import { Map, Tag, Globe2, MapPinned } from "lucide-react";
import type { Pais, Estado } from "../types";

interface EstadoFormProps {
  paises: Pais[];
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
  onCancel,
}: EstadoFormProps) {
  const [nomeEstado, setNomeEstado] = useState("");
  const [siglaUf, setSiglaUf] = useState("");
  const [regiaoGeografica, setRegiaoGeografica] = useState("");
  const [paisisoId, setPaisisoId] = useState("");

  useEffect(() => {
    if (estadoEditando) {
      setNomeEstado(estadoEditando.nomeEstado ?? "");
      setSiglaUf(estadoEditando.siglaUf ?? "");
      setRegiaoGeografica(estadoEditando.regiaoGeografica ?? "");
      setPaisisoId(String(estadoEditando.paisisoId ?? ""));
    } else {
      setNomeEstado("");
      setSiglaUf("");
      setRegiaoGeografica("");
      setPaisisoId("");
    }
  }, [estadoEditando?.id]);

  function getErro(chaves: string[]) {
    if (!error) return null;
    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error];
    const encontradas = sentencas.filter((s) =>
      chaves.some((chave) => s.toLowerCase().includes(chave.toLowerCase()))
    );
    return encontradas.length ? encontradas.join(" ") : null;
  }

  const erroNome   = getErro(["Nome"]);
  const erroSigla  = getErro(["Sigla"]);
  const erroPais   = getErro(["País"]);
  const erroRegiao = getErro(["Região"]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ nomeEstado, siglaUf, regiaoGeografica, paisisoId: Number(paisisoId) });
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] flex items-center gap-2">
          <Map className="text-[#EF9B1B]" />
          {estadoEditando ? "Editar Estado" : "Cadastro de Estado"}
        </h2>
        <p className="text-gray-500 text-sm">Informe os dados do estado.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
              Nome do Estado
            </label>
            <div className="relative">
              <Map size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                value={nomeEstado}
                onChange={(e) => setNomeEstado(e.target.value)}
                placeholder="Ex: Espírito Santo"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroNome
                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                }`}
              />
            </div>
            {erroNome && <span className="text-xs text-red-500">{erroNome}</span>}
          </div>

          {/* Sigla */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
              Sigla UF
            </label>
            <div className="relative">
              <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={2}
                value={siglaUf}
                onChange={(e) => setSiglaUf(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="ES"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroSigla
                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                }`}
              />
            </div>
            {erroSigla && <span className="text-xs text-red-500">{erroSigla}</span>}
          </div>

          {/* País */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
              País
            </label>
            <div className="relative">
              <Globe2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                required
                value={paisisoId}
                onChange={(e) => setPaisisoId(e.target.value)}
                className={`w-full appearance-none pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroPais
                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                }`}
              >
                <option value="">Selecione...</option>
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nome} ({pais.sigla_iso2})
                  </option>
                ))}
              </select>
            </div>
            {erroPais && <span className="text-xs text-red-500">{erroPais}</span>}
          </div>

          {/* Região */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
              Região Geográfica
            </label>
            <div className="relative">
              <MapPinned size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                value={regiaoGeografica}
                onChange={(e) => setRegiaoGeografica(e.target.value)}
                placeholder="Ex: Sudeste"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroRegiao
                    ? "border-red-400 focus:ring-red-400/40 focus:border-red-500"
                    : "border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]"
                }`}
              />
            </div>
            {erroRegiao && <span className="text-xs text-red-500">{erroRegiao}</span>}
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
            {estadoEditando ? "Salvar Alterações" : "Salvar Estado"}
          </button>
        </div>
      </form>
    </div>
  );
}
