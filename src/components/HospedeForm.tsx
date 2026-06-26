import { useState, type FormEvent, useEffect } from 'react';
import { UserCircle, FileText, Phone, Mail, CalendarDays, Globe, MapPin } from 'lucide-react';
import type { Estado, PaisIso } from '../types';

interface HospedeFormProp {
  estados: Estado[]
  paises: PaisIso[] 
  initialDoc?: string 
  error?: string 
  hospedeEditando?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function HospedeForm({ estados, paises, initialDoc = '', error, hospedeEditando, onSubmit, onCancel }: HospedeFormProp) {
  const [nome, setNome] = useState('');
  const [tipoDoc, setTipoDoc] = useState<'CPF' | 'Passaporte'>('CPF');
  const [cpfPassaporte, setCpfPassaporte] = useState(initialDoc);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [estadoId, setEstadoId] = useState('');
  const [paisId, setPaisId] = useState(''); 

  useEffect(() => {
    if (hospedeEditando) {
      setNome(hospedeEditando.nome || '')
      setCpfPassaporte(hospedeEditando.cpfPassaporte || '')
      setEmail(hospedeEditando.email || '')
      setTelefone(hospedeEditando.telefone || '')
      
      const formatData = (dataStr: string) => dataStr ? dataStr.split('T')[0] : '';
      setNascimento(formatData(hospedeEditando.nascimento))
      
      setEstadoId(String(hospedeEditando.estadoId || ''))
      
      if (hospedeEditando.estadoId && estados.length > 0) {
          const estadoVinculado = estados.find(e => e.id === hospedeEditando.estadoId);
          if (estadoVinculado && estadoVinculado.paisisoId) {
            setPaisId(String(estadoVinculado.paisisoId));
          }
      }
    } else {
      setNome('')
      setCpfPassaporte(initialDoc)
      setTipoDoc('CPF')
      setEmail('')
      setTelefone('')
      setNascimento('')
      setEstadoId('')
      setPaisId('')
    }
  }, [hospedeEditando, initialDoc, estados]); 

  const getErro = (palavrasChave: string[]) => {
    if (!error) return null;
    const sentencas = error.match(/[^.!?]+[.!?]+/g) || [error];
    const encontradas = sentencas.filter(s => 
      palavrasChave.some(p => s.toLowerCase().includes(p.toLowerCase()))
    );
    return encontradas.length > 0 ? encontradas.join(' ').trim() : null;
  };

  const erroNome = getErro(['Nome']);
  const erroDoc = getErro(['Documento', 'CPF', 'Passaporte']);
  const erroTel = getErro(['Telefone']);
  const erroEmail = getErro(['Email']);
  const erroNasc = getErro(['Nascimento']);
  const erroEstado = getErro(['Estado']);

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (tipoDoc === 'CPF') {
      v = v.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.toUpperCase().replace(/[^A-Z0-9]/g, ''); 
      if (v.length > 15) v = v.slice(0, 15);
    }
    setCpfPassaporte(v);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    setTelefone(v);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      nome, cpfPassaporte, email, telefone, nascimento,
      estadoId: Number(estadoId),
      paisId: Number(paisId)
    });
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
          <UserCircle className="text-[#EF9B1B]" /> {hospedeEditando ? 'Editar Hóspede' : 'Cadastro de Hóspede'}
        </h2>
        <p className="text-gray-500 text-sm">Registre os dados pessoais e de contato do cliente.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nome Completo</label>
            <div className="relative">
              <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={nome} onChange={(e) => setNome(e.target.value)} required type="text" placeholder="Ex: João da Silva"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroNome ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`} />
            </div>
            {erroNome && <span className="text-xs text-red-500 block mt-1">{erroNome}</span>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Documento</label>
              <select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value as 'CPF' | 'Passaporte')} className="text-xs bg-transparent text-[#EF9B1B] font-bold outline-none cursor-pointer">
                <option value="CPF">CPF</option>
                <option value="Passaporte">Passaporte</option>
              </select>
            </div>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={cpfPassaporte} onChange={handleDocChange} required type="text" placeholder={tipoDoc === 'CPF' ? "999.999.999-99" : "Letras e Números"}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroDoc ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`} />
            </div>
            {erroDoc && <span className="text-xs text-red-500 block mt-1">{erroDoc}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Telefone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={telefone} onChange={handleTelefoneChange} required type="text" placeholder="(99) 99999-9999"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroTel ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`} />
            </div>
            {erroTel && <span className="text-xs text-red-500 block mt-1">{erroTel}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="seu@email.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroEmail ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`} />
            </div>
            {erroEmail && <span className="text-xs text-red-500 block mt-1">{erroEmail}</span>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nascimento</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={nascimento} onChange={(e) => setNascimento(e.target.value)} required type="date"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${
                  erroNasc ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`} />
            </div>
            {erroNasc && <span className="text-xs text-red-500 block mt-1">{erroNasc}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">País</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={paisId} onChange={(e) => setPaisId(e.target.value)} required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B] outline-none transition-all text-gray-800 appearance-none">
                <option value="">Selecione</option>
                {paises?.map((pais) => <option key={pais.id} value={pais.id}>{pais.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Estado</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={estadoId} onChange={(e) => setEstadoId(e.target.value)} required
                className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 appearance-none ${
                  erroEstado ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500' : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                }`}>
                <option value="">Selecione</option>
                {estados?.map((estado) => <option key={estado.id} value={estado.id}>{estado.nomeEstado} - {estado.siglaUf}</option>)}
              </select>
            </div>
            {erroEstado && <span className="text-xs text-red-500 block mt-1">{erroEstado}</span>}
          </div>

        </div>

        {error && (
          <div className="p-4 mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-medium text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <button type="button" onClick={onCancel} className="px-8 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-8 py-3 bg-[#222020] text-white rounded-xl font-medium hover:bg-[#EF9B1B] transition-colors">
            {hospedeEditando ? 'Salvar Alterações' : 'Salvar Hóspede'}
          </button>
        </div>
      </form>
    </div>
  )
}