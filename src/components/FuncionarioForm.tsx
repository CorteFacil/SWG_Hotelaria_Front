import { useState, type FormEvent, useEffect } from 'react';
import { UserCircle, Phone, Mail, CalendarDays, Globe, MapPin, Lock, Briefcase, Home, AlertCircle, FileText } from 'lucide-react';
import type { Pais } from '../types';

interface FuncionarioFormProps {
  paises: Pais[]
  error?: string
  funcionarioEditando?: any
  onSubmit: (data: any) => Promise<void> | void
  onCancel: () => void
}

export default function FuncionarioForm({ paises, error, funcionarioEditando, onSubmit, onCancel }: FuncionarioFormProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [cargo, setCargo] = useState('funcionario');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [paisId, setPaisId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (funcionarioEditando) {
      setNome(funcionarioEditando.nome || '');
      setTelefone(funcionarioEditando.telefone || '');
      const formatData = (d: string) => d ? d.split('T')[0] : '';
      setNascimento(formatData(funcionarioEditando.data_nascimento));
      setCpf(funcionarioEditando.cpf || '');
      setEmail(funcionarioEditando.email || '');
      setCidade(funcionarioEditando.cidade || '');
      setBairro(funcionarioEditando.bairro || '');
      setRua(funcionarioEditando.rua || '');
      setCargo(funcionarioEditando.cargo || 'funcionario');
      setLogin(funcionarioEditando.login || '');
      setSenha('');
      setPaisId(String(funcionarioEditando.paisisoId || ''));
    } else {
      setNome(''); setTelefone(''); setNascimento(''); setCpf('');
      setEmail(''); setCidade(''); setBairro(''); setRua('');
      setCargo('funcionario'); setLogin(''); setSenha(''); setPaisId('');
    }
  }, [funcionarioEditando]);

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
  const erroTel = getErro(['telefone']);
  const erroNasc = getErro(['nascimento', 'data']);
  const erroCpf = getErro(['cpf']);
  const erroEmail = getErro(['email']);
  const erroCidade = getErro(['cidade']);
  const erroLogin = getErro(['login']);
  const erroSenha = getErro(['senha']);

  const errosUsados = [erroNome, erroTel, erroNasc, erroCpf, erroEmail, erroCidade, erroLogin, erroSenha].filter(Boolean).join(' ');
  const sentencas = extrairSentencas(error || '');
  const erroGeral = sentencas.filter(s => !errosUsados.includes(s.trim())).join(' ').trim();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(v);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    setTelefone(v);
  };

  function handleClickCancelar() {
    if (!funcionarioEditando) {
      setNome(''); setTelefone(''); setNascimento(''); setCpf('');
      setEmail(''); setCidade(''); setBairro(''); setRua('');
      setCargo('funcionario'); setLogin(''); setSenha(''); setPaisId('');
    }
    onCancel();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ nome, telefone, data_nascimento: nascimento, cpf, email, cidade, bairro, rua, cargo, login, senha, paisisoId: Number(paisId) });
      if (!funcionarioEditando) {
        setNome(''); setTelefone(''); setNascimento(''); setCpf('');
        setEmail(''); setCidade(''); setBairro(''); setRua('');
        setCargo('funcionario'); setLogin(''); setSenha(''); setPaisId('');
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (erro?: string | null) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 ${erro ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
      : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
    }`;

  const selectClass = (erro?: string | null) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all text-gray-800 appearance-none ${erro ? 'border-red-400 focus:ring-red-400/40 focus:border-red-500'
      : 'border-gray-200 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
    }`;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B] w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222020] font-admin mb-2 flex items-center gap-2">
          <Briefcase className="text-[#EF9B1B]" />
          {funcionarioEditando ? 'Editar Funcionário' : 'Cadastro de Funcionário'}
        </h2>
        <p className="text-gray-500 text-sm">Registre os dados pessoais e de acesso do funcionário.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nome Completo</label>
            <div className="relative">
              <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={nome} onChange={e => setNome(e.target.value)} required type="text" placeholder="Ex: Maria Souza"
                className={inputClass(erroNome)} />
            </div>
            {erroNome && <span className="text-xs text-red-500 font-medium block mt-1">{erroNome}</span>}
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">CPF</label>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={cpf} onChange={handleCpfChange} required type="text" placeholder="999.999.999-99"
                className={inputClass(erroCpf)} />
            </div>
            {erroCpf && <span className="text-xs text-red-500 font-medium block mt-1">{erroCpf}</span>}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Telefone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={telefone} onChange={handleTelefoneChange} required type="text" placeholder="(99) 99999-9999"
                className={inputClass(erroTel)} />
            </div>
            {erroTel && <span className="text-xs text-red-500 font-medium block mt-1">{erroTel}</span>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="seu@email.com"
                className={inputClass(erroEmail)} />
            </div>
            {erroEmail && <span className="text-xs text-red-500 font-medium block mt-1">{erroEmail}</span>}
          </div>

          {/* Nascimento */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Nascimento</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={nascimento} onChange={e => setNascimento(e.target.value)} required type="date"
                className={inputClass(erroNasc)} />
            </div>
            {erroNasc && <span className="text-xs text-red-500 font-medium block mt-1">{erroNasc}</span>}
          </div>

          {/* País */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">País</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={paisId} onChange={e => setPaisId(e.target.value)} required className={selectClass()}>
                <option value="">Selecione</option>
                {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Cidade */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Cidade</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={cidade} onChange={e => setCidade(e.target.value)} type="text" placeholder="Ex: Cachoeiro de Itapemirim"
                className={inputClass(erroCidade)} />
            </div>
            {erroCidade && <span className="text-xs text-red-500 font-medium block mt-1">{erroCidade}</span>}
          </div>

          {/* Bairro */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Bairro</label>
            <div className="relative">
              <Home size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={bairro} onChange={e => setBairro(e.target.value)} type="text" placeholder="Ex: Centro"
                className={inputClass()} />
            </div>
          </div>

          {/* Rua */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Rua</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={rua} onChange={e => setRua(e.target.value)} type="text" placeholder="Ex: Rua das Flores, 123"
                className={inputClass()} />
            </div>
          </div>

          {/* Cargo */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Cargo</label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={cargo} onChange={e => setCargo(e.target.value)} className={selectClass()}>
                <option value="funcionario">Funcionário</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
          </div>

          {/* Linha divisória de acesso */}
          <div className="md:col-span-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0">Dados de Acesso</p>
            <hr className="border-gray-100 mt-2" />
          </div>

          {/* Login */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Login</label>
            <div className="relative">
              <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={login} onChange={e => setLogin(e.target.value)} required type="text" placeholder="Ex: maria.souza"
                className={inputClass(erroLogin)} />
            </div>
            {erroLogin && <span className="text-xs text-red-500 font-medium block mt-1">{erroLogin}</span>}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">
              Senha {funcionarioEditando && <span className="text-gray-400 normal-case font-normal">(deixe em branco para manter)</span>}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input value={senha} onChange={e => setSenha(e.target.value)} required={!funcionarioEditando}
                type="password" placeholder="Mínimo 8 caracteres"
                className={inputClass(erroSenha)} />
            </div>
            {erroSenha && <span className="text-xs text-red-500 font-medium block mt-1">{erroSenha}</span>}
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
            {loading ? 'Salvando...' : (funcionarioEditando ? 'Salvar Alterações' : 'Salvar Funcionário')}
          </button>
        </div>
      </form>
    </div>
  );
}