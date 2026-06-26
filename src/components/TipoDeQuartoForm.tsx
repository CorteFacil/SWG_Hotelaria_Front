import { Tags, DollarSign, Users, AlignLeft, AlertCircle, BedDouble, Maximize } from 'lucide-react'
import { useState, useEffect, type SyntheticEvent } from 'react'

interface TipoDeQuartoFormProps {
  tipoEditando?: any
  error?: string 
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function TipoDeQuartoForm({ tipoEditando, error, onSubmit, onCancel }: TipoDeQuartoFormProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [capacidadeMax, setCapacidadeMax] = useState('')
  const [tipoCama, setTipoCama] = useState('')
  const [tamanho, setTamanho] = useState('')
  const [precoDiaria, setPrecoDiaria] = useState('')

  useEffect(() => {
    if (tipoEditando) {
      setNome(tipoEditando.nome || '')
      setDescricao(tipoEditando.descricao || '')
      setCapacidadeMax(String(tipoEditando.capacidadeMax || ''))
      setTipoCama(tipoEditando.tipoCama || '')
      setTamanho(String(tipoEditando.tamanho || ''))
      setPrecoDiaria(String(tipoEditando.precoDiaria || ''))
    } else {
      setNome('')
      setDescricao('')
      setCapacidadeMax('')
      setTipoCama('')
      setTamanho('')
      setPrecoDiaria('')
    }
  }, [tipoEditando])

  // Lógica de desmembramento de erros idêntica à do ReservaForm
  const getErro = (inclui: string[], exclui: string[] = []) => {
    if (!error) return null;
    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error];
    const encontradas = sentencas.filter(s => 
      inclui.some(p => s.toLowerCase().includes(p.toLowerCase())) &&
      !exclui.some(e => s.toLowerCase().includes(e.toLowerCase()))
    );
    return encontradas.length > 0 ? encontradas.join(' ').trim() : null;
  };

  const erroNome = getErro(['nome', 'categoria']);
  const erroPreco = getErro(['preço', 'preco', 'diária', 'diaria', 'valor']);
  const erroCapacidade = getErro(['capacidade', 'pessoas', 'máxima', 'maxima']);
  const erroCama = getErro(['cama']);
  const erroTamanho = getErro(['tamanho', 'metro', 'm2', 'm²']);
  const erroDescricao = getErro(['descrição', 'descricao', 'detalhe']);

  const sentencas = error ? (error.match(/[^.!?]+[.!?]+/g) || [error]) : [];
  const errosUsados = [erroNome, erroPreco, erroCapacidade, erroCama, erroTamanho, erroDescricao].filter(Boolean).join(' ');
  const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim();

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        nome,
        descricao,
        precoDiaria: Number(precoDiaria),
        capacidadeMax: Number(capacidadeMax),
        tipoCama,
        tamanho: Number(tamanho) 
      })
      
      if (!tipoEditando) {
        setNome('')
        setDescricao('')
        setPrecoDiaria('')
        setCapacidadeMax('')
        setTipoCama('')
        setTamanho('')
      }
    } catch (err) {
      // Ignora, o erro é tratado na página pai e passado via prop 'error'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] mb-2 flex items-center gap-2">
          <Tags className="text-[#EF9B1B]" /> {tipoEditando ? 'Editar Tipo de Quarto' : 'Cadastro de Tipo de Quarto'}
        </h2>
        <p className="text-gray-500 text-sm">Defina as categorias de acomodação do hotel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nome da Categoria</label>
            <input 
              required type="text" placeholder="Ex: Suíte Master Vista Mar"
              value={nome} onChange={e => setNome(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                erroNome ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
              }`}
            />
            {erroNome && <span className="text-xs text-red-500 block mt-1">{erroNome}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Preço Diária (R$)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                required type="number" step="0.01" placeholder="0.00"
                value={precoDiaria} onChange={e => setPrecoDiaria(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroPreco ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroPreco && <span className="text-xs text-red-500 block mt-1">{erroPreco}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Capacidade Máxima</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                required type="number" min="1" placeholder="Ex: 2"
                value={capacidadeMax} onChange={e => setCapacidadeMax(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroCapacidade ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroCapacidade && <span className="text-xs text-red-500 block mt-1">{erroCapacidade}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Tipo de Cama</label>
            <div className="relative">
              <BedDouble size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                required type="text" placeholder="Ex: 1 Cama King"
                value={tipoCama} onChange={e => setTipoCama(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroCama ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroCama && <span className="text-xs text-red-500 block mt-1">{erroCama}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Tamanho (m²)</label>
            <div className="relative">
              <Maximize size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                required type="number" min="1" placeholder="Ex: 25"
                value={tamanho} onChange={e => setTamanho(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroTamanho ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}
              />
            </div>
            {erroTamanho && <span className="text-xs text-red-500 block mt-1">{erroTamanho}</span>}
          </div>

        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Descrição Detalhada</label>
          <div className="relative">
            <AlignLeft size={18} className="absolute left-4 top-4 text-gray-400" />
            <textarea 
              rows={4} placeholder="Descreva as características e diferenciais deste tipo de quarto..."
              value={descricao} onChange={e => setDescricao(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 resize-none ${
                erroDescricao ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
              }`}
            />
          </div>
          {erroDescricao && <span className="text-xs text-red-500 block mt-1">{erroDescricao}</span>}
        </div>

        {/* ERROS GERAIS QUE NÃO SE ENCAIXAM NOS CAMPOS */}
        {erroGeral && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p>{erroGeral}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" disabled={loading}
            className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Salvando...' : (tipoEditando ? 'Salvar Alterações' : 'Salvar Categoria')}
          </button>
        </div>
      </form>
    </div>
  )
}