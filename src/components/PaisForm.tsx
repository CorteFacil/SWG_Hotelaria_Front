import { useState, type FormEvent, useEffect } from 'react';
import { Globe, Hash, AlertCircle, Phone } from 'lucide-react';

interface PaisFormProps {
    error?: string
    paisEditando?: any
    onSubmit: (data: any) => Promise<void> | void
    onCancel: () => void
}

export default function PaisForm({ error, paisEditando, onSubmit, onCancel }: PaisFormProps) {
    const [nome, setNome] = useState('');
    const [siglaIso2, setSiglaIso2] = useState('');
    const [siglaIso3, setSiglaIso3] = useState('');
    const [ddiTelefone, setDdiTelefone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (paisEditando) {
            setNome(paisEditando.nome || '');
            setSiglaIso2(paisEditando.sigla_iso2 || '');
            setSiglaIso3(paisEditando.sigla_iso3 || '');
            setDdiTelefone(String(paisEditando.ddi_telefone || ''));
        } else {
            setNome('');
            setSiglaIso2('');
            setSiglaIso3('');
            setDdiTelefone('');
        }
    }, [paisEditando]);

    const extrairSentencas = (texto: string) => {
        if (!texto) return [];
        return texto.replace(/([.!?])\s+/g, '$1|').split('|').filter(Boolean);
    };

    const getErro = (palavrasChave: string[]) => {
        if (!error) return null;
        const sentencas = extrairSentencas(error);
        const encontradas = sentencas.filter(s =>
            palavrasChave.some(p => s.toLowerCase().includes(p.toLowerCase()))
        );
        return encontradas.length > 0 ? encontradas.join(' ').trim() : null;
    };

    const erroNome = getErro(['nome']);
    const erroIso2 = getErro(['iso2', 'sigla_iso2']);
    const erroIso3 = getErro(['iso3', 'sigla_iso3']);
    const erroDdi = getErro(['ddi', 'telefone']);

    const errosUsados = [erroNome, erroIso2, erroIso3, erroDdi].filter(Boolean).join(' ');
    const sentencas = extrairSentencas(error || '');
    const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim();

    const inputClass = (erro?: string | null) =>
        `w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erro ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
            : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
        }`;

    function handleClickCancelar() {
        if (!paisEditando) {
            setNome('');
            setSiglaIso2('');
            setSiglaIso3('');
            setDdiTelefone('');
        }
        onCancel();
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                nome,
                sigla_iso2: siglaIso2.toUpperCase(),
                sigla_iso3: siglaIso3.toUpperCase(),
                ddi_telefone: Number(ddiTelefone),
            });
            if (!paisEditando) {
                setNome('');
                setSiglaIso2('');
                setSiglaIso3('');
                setDdiTelefone('');
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
                    <Globe className="text-[#EF9B1B]" />
                    {paisEditando ? 'Editar País' : 'Cadastro de País'}
                </h2>
                <p className="text-gray-500 text-sm">Registre os dados de identificação do país.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Nome */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nome do País</label>
                        <div className="relative">
                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input value={nome} onChange={e => setNome(e.target.value)} required type="text" placeholder="Ex: Brasil"
                                className={inputClass(erroNome)} />
                        </div>
                        {erroNome && <span className="text-xs text-red-500 font-medium block mt-1">{erroNome}</span>}
                    </div>

                    {/* Sigla ISO2 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Sigla ISO2</label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                value={siglaIso2}
                                onChange={e => setSiglaIso2(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))}
                                required type="text" placeholder="Ex: BR" maxLength={2}
                                className={inputClass(erroIso2)} />
                        </div>
                        {erroIso2 && <span className="text-xs text-red-500 font-medium block mt-1">{erroIso2}</span>}
                    </div>

                    {/* Sigla ISO3 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Sigla ISO3</label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                value={siglaIso3}
                                onChange={e => setSiglaIso3(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                                required type="text" placeholder="Ex: BRA" maxLength={3}
                                className={inputClass(erroIso3)} />
                        </div>
                        {erroIso3 && <span className="text-xs text-red-500 font-medium block mt-1">{erroIso3}</span>}
                    </div>

                    {/* DDI */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">DDI (Código de Discagem)</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                value={ddiTelefone}
                                onChange={e => setDdiTelefone(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                required type="text" placeholder="Ex: 55"
                                className={inputClass(erroDdi)} />
                        </div>
                        {erroDdi && <span className="text-xs text-red-500 font-medium block mt-1">{erroDdi}</span>}
                    </div>

                </div>

                {erroGeral && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm flex items-center gap-3">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{erroGeral}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                    <button type="button" onClick={handleClickCancelar}
                        className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 flex items-center gap-2">
                        {loading ? 'Salvando...' : (paisEditando ? 'Salvar Alterações' : 'Salvar País')}
                    </button>
                </div>
            </form>
        </div>
    );
}