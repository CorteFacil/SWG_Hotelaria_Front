import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import ReservaForm from '../components/ReservaForm'
import type { TipoDeQuarto, Reserva, Hospede } from '../types'
import { LogOut, Plus, CalendarClock, BedDouble, Users, AlertCircle, XCircle, ArrowRight, UserSquare2, CheckCircle2 } from 'lucide-react'
import { listarTipoDeQuarto } from '@/Api/tiposdequarto'
import { criarReserva, excluirReserva, listarReservasPeloHospede } from '@/Api/reservas'
import { listarHospedes } from '@/Api/hospedes'

type Screen = 'login' | 'dashboard'

export default function ReservaPage() {
  const [, setLocation] = useLocation()
  const [screen, setScreen] = useState<Screen>('login')
  const [hospedeLogado, setHospedeLogado] = useState<Hospede | null>(null)

  const [tipoDocLogin, setTipoDocLogin] = useState<'CPF' | 'Passaporte'>('CPF')
  const [docLogin, setDocLogin] = useState('')

  const [tiposQuarto, setTiposQuarto] = useState<TipoDeQuarto[]>([])

  const [reservas, setReservas] = useState<Reserva[]>([])
  const [showNovaReserva, setShowNovaReserva] = useState(false)
  const [formError, setFormError] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  // ESTADO PARA A MENSAGEM DE SUCESSO ELEGANTE
  const [sucessoFeedback, setSucessoFeedback] = useState('')

  const [reservaParaCancelar, setReservaParaCancelar] = useState<number | null>(null)
  const [docConfirmacao, setDocConfirmacao] = useState('')
  const [erroCancelamento, setErroCancelamento] = useState('')

  useEffect(() => {
    listarTipoDeQuarto()
      .then((tiposData) => {
        if (Array.isArray(tiposData)) setTiposQuarto(tiposData);
      })
      .catch(e => console.error("Erro ao carregar tipos de quarto:", e));
  }, []);

  // FUNÇÃO QUE SUBSTITUI O ALERT
  function mostrarSucesso(mensagem: string) {
    setSucessoFeedback(mensagem);
    setTimeout(() => setSucessoFeedback(''), 4000);
  }

  const aplicarMascaraDocumento = (valor: string, tipo: 'CPF' | 'Passaporte') => {
    let v = valor;
    if (tipo === 'CPF') {
      v = v.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (v.length > 15) v = v.slice(0, 15);
    }
    return v;
  }

  const handleDocLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocLogin(aplicarMascaraDocumento(e.target.value, tipoDocLogin));
    setFormError('');
    setLoginMessage('');
  }

  const handleDocConfirmacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocConfirmacao(aplicarMascaraDocumento(e.target.value, tipoDocLogin));
    setErroCancelamento('');
  }

  const extrairErro = (err: any) => {
    let msg = err.message || String(err);
    try {
      while (typeof msg === 'string' && msg.trim().startsWith('{')) {
        const parsed = JSON.parse(msg);
        if (parsed.message) msg = parsed.message;
        else if (parsed.error) msg = parsed.error;
        else break;
      }
    } catch { }
    return msg;
  }

  const carregarReservasDoHospede = async (hospedeId: number) => {
    try {
      const result = await listarReservasPeloHospede(hospedeId);
      setReservas(result);
    } catch (err: any) {
      console.error("Erro ao buscar reservas", err);
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoginMessage('');
    try {
      const hospede = await listarHospedes().then(hospede => hospede.find(h => h.cpfPassaporte === docLogin) || null);
      if (hospede && hospede.id) {
        setHospedeLogado(hospede);
        await carregarReservasDoHospede(hospede.id);
        setScreen('dashboard');
      } else {
        setLoginMessage('Hóspede não encontrado. Por favor, crie seu cadastro abaixo.');
      }
    } catch (err: any) {
      setFormError(extrairErro(err));
    }
  }

  const handleReservaCriada = async (dadosReserva: Reserva) => {
    setFormError('');
    try {
      await criarReserva(dadosReserva);
      setShowNovaReserva(false);
      if (hospedeLogado?.id) await carregarReservasDoHospede(hospedeLogado.id);

      // O ALERT SAIU, ENTROU A NOTIFICAÇÃO PROFISSIONAL
      mostrarSucesso("Reserva solicitada com sucesso!");
    } catch (err: any) {
      setFormError(extrairErro(err));
    }
  }

  const abrirModalCancelamento = (reservaId: number) => {
    setReservaParaCancelar(reservaId);
    setDocConfirmacao('');
    setErroCancelamento('');
  }

  const confirmarCancelamento = async () => {
    if (!hospedeLogado || reservaParaCancelar === null) return;

    if (docConfirmacao !== hospedeLogado.cpfPassaporte) {
      setErroCancelamento('Documento incorreto. Verifique os números digitados.');
      return;
    }

    try {
      await excluirReserva(String(reservaParaCancelar));
      setReservas(reservas.filter(r => r.id !== reservaParaCancelar));
      setReservaParaCancelar(null);
      mostrarSucesso("Sua reserva foi cancelada com sucesso.");
    } catch (err: any) {
      setErroCancelamento(extrairErro(err));
    }
  }

  const handleLogout = () => {
    setHospedeLogado(null);
    setReservas([]);
    setDocLogin('');
    setScreen('login');
  }

  const getStatusInfo = (reserva: Reserva) => {
    if (reserva.status === 0) {
      return { label: 'Pendente', style: 'border-orange-200 bg-orange-100 text-orange-700', canCancel: true };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = reserva.saidaAcomodacao.split('-').map(Number);
    const dataSaida = new Date(ano, mes - 1, dia, 0, 0, 0, 0);

    if (reserva.status === 1) {
      if (hoje > dataSaida) {
        return { label: 'Realizada', style: 'border-emerald-200 bg-emerald-100 text-emerald-700', canCancel: false };
      }
      return { label: 'Confirmada', style: 'border-blue-200 bg-blue-100 text-blue-700', canCancel: false };
    }

    return { label: 'Desconhecido', style: 'border-red-200 bg-red-100 text-red-700', canCancel: false };
  }

  return (
    <div className="min-h-screen w-full bg-[#FFF8EF] text-[#222020] flex flex-col font-admin relative selection:bg-[#EF9B1B]/30">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-20 w-full max-w-6xl mx-auto">

        {/* TELA DE LOGIN */}
        {screen === 'login' && (
          <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-[#EF9B1B]/20 animate-fade-in relative overflow-hidden">

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#FFF8EF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#EF9B1B]">
                <UserSquare2 size={32} />
              </div>
              <h2 className="text-3xl font-black font-admin text-[#222020]">Portal do Hóspede</h2>
              <p className="text-gray-500 mt-2 text-sm">Acesse suas reservas informando seu documento.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#C47D0E] uppercase tracking-wider">Documento</label>
                  <select value={tipoDocLogin} onChange={(e) => {
                    setTipoDocLogin(e.target.value as 'CPF' | 'Passaporte');
                    setFormError('');
                  }} className="text-xs bg-transparent text-[#EF9B1B] font-bold outline-none cursor-pointer">
                    <option value="CPF">CPF</option>
                    <option value="Passaporte">Passaporte</option>
                  </select>
                </div>
                <input value={docLogin} onChange={handleDocLoginChange} required placeholder={tipoDocLogin === 'CPF' ? "999.999.999-99" : "Seu Passaporte"}
                  className={`w-full p-4 rounded-xl bg-gray-50 outline-none text-center tracking-widest text-lg uppercase font-bold transition-all border ${formError ? 'border-red-400 focus:ring-red-400/40 text-red-600' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#EF9B1B]/40 focus:border-[#EF9B1B]'
                    }`} />
                {formError && <span className="text-xs text-red-500 font-bold block mt-2 text-center">{formError}</span>}
                {loginMessage && (
                  <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2 mt-2">
                    <AlertCircle size={16} /> {loginMessage}
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold bg-[#222020] text-white hover:bg-[#EF9B1B] transition-colors flex justify-center items-center gap-2">
                Entrar <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-3">Ainda não possui cadastro conosco?</p>
              <button
                onClick={() => setLocation('/hospede')}
                className="text-[#EF9B1B] font-bold hover:text-[#C47D0E] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                Criar minha conta agora
              </button>
            </div>
          </div>
        )}

        {/* TELA DO DASHBOARD DO HÓSPEDE */}
        {screen === 'dashboard' && hospedeLogado && (
          <div className="w-full animate-fade-in">

            {/* Header do Hóspede */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-[#EF9B1B]/20">
              <div className="mb-4 md:mb-0">
                <h2 className="text-4xl font-black font-admin text-[#222020]">Olá, {hospedeLogado.nome.split(' ')[0]} 👋</h2>
                <p className="text-gray-500 mt-1">Bem-vindo(a) à sua área exclusiva de gerenciamento de estadias.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowNovaReserva(!showNovaReserva); setFormError(''); }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showNovaReserva
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-[#EF9B1B] text-white shadow-lg hover:bg-[#C47D0E]'
                    }`}>
                  {showNovaReserva ? <XCircle size={20} /> : <Plus size={20} />}
                  {showNovaReserva ? 'Cancelar' : 'Nova Reserva'}
                </button>
                <button onClick={handleLogout} className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Sair da conta">
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {formError && !showNovaReserva && (
              <div className="mb-6 bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl border border-red-200 flex items-center gap-3">
                <AlertCircle size={20} /> {formError}
              </div>
            )}

            {/* Formulário Embutido de Nova Reserva */}
            {showNovaReserva && (
              <div className="mb-12 animate-fade-in">
                <ReservaForm
                  tipos={tiposQuarto}
                  hospedeId={hospedeLogado.id}
                  error={formError}
                  onSubmit={handleReservaCriada}
                  onCancel={() => { setShowNovaReserva(false); setFormError(''); }}
                />
              </div>
            )}

            {/* Listagem de Reservas */}
            <h3 className="text-xl font-bold text-[#222020] font-admin mb-6 flex items-center gap-2">
              <CalendarClock className="text-[#EF9B1B] " /> Histórico de Reservas
            </h3>

            {reservas.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-[#FFF8EF] rounded-full flex items-center justify-center mb-4 text-[#EF9B1B]">
                  <BedDouble size={36} />
                </div>
                <h4 className="text-lg font-bold font-admin text-[#222020] mb-2">Nenhuma reserva encontrada</h4>
                <p className="text-gray-500 max-w-sm">
                  Você ainda não possui estadias agendadas. Clique em "Nova Reserva" para planejar sua próxima viagem conosco.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reservas.map((reserva: Reserva) => {
                  const status = getStatusInfo(reserva);
                  const tipoQuarto = tiposQuarto.find(t => t.id === reserva.tipoDeQuartoId)?.nome || "Acomodação";

                  return (
                    <div key={reserva.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(34,32,32,0.03)] hover:border-[#EF9B1B]/40 hover:shadow-lg transition-all flex flex-col justify-between group">

                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold font uppercase tracking-wider border ${status.style}`}>
                          {status.label}
                        </span>

                        {status.canCancel && (
                          <button
                            onClick={() => abrirModalCancelamento(reserva.id)}
                            className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm active:scale-95"
                            title="Cancelar Reserva"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>

                      <div className={`space-y-4 ${status.label === 'Realizada' ? 'opacity-60' : 'opacity-100'}`}>
                        <div className="flex items-center gap-3 text-[#222020]">
                          <BedDouble size={18} className="text-[#EF9B1B]" />
                          <span className="font-bold">{tipoQuarto}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Entrada</span>
                            <span className="font-medium text-sm">{reserva.entradaAcomodacao.split('T')[0].split('-').reverse().join('/')}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Saída</span>
                            <span className="font-medium text-sm">{reserva.saidaAcomodacao.split('T')[0].split('-').reverse().join('/')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-gray-400" />
                          <span>Para {reserva.numeroPessoas} {reserva.numeroPessoas === 1 ? 'Pessoa' : 'Pessoas'}</span>
                        </div>
                      </div>

                      {reserva.observacao && (
                        <div className={`mt-4 pt-4 border-t border-gray-100 ${status.label === 'Realizada' ? 'opacity-60' : 'opacity-100'}`}>
                          <p className="text-xs text-gray-500 italic line-clamp-2">
                            "{reserva.observacao}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL DE CANCELAMENTO */}
      {reservaParaCancelar !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#222020]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-2xl font-black font-admin text-[#222020]">Cancelar Reserva</h3>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Tem certeza? Esta ação é irreversível e a acomodação será liberada para outros clientes.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Confirme seu {tipoDocLogin}:
              </label>
              <input
                value={docConfirmacao}
                onChange={handleDocConfirmacaoChange}
                className={`w-full p-3 rounded-xl bg-white border outline-none font-bold text-center tracking-widest ${erroCancelamento ? 'border-red-400 text-red-600 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-[#EF9B1B]'
                  }`}
                placeholder={tipoDocLogin === 'CPF' ? "999.999.999-99" : "Passaporte"}
              />
              {erroCancelamento && <span className="text-xs text-red-500 font-bold block mt-2 text-center">{erroCancelamento}</span>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setReservaParaCancelar(null)} className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Voltar
              </button>
              <button onClick={confirmarCancelamento} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-md transition-colors">
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOSSO NOVO TOAST DE SUCESSO PROFISSIONAL */}
      {sucessoFeedback && (
        <div className="fixed top-32 right-8 z-[100] flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-xl animate-fade-in max-w-md">
          <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
          <p className="font-bold text-base leading-snug">{sucessoFeedback}</p>
        </div>
      )}

      <Footer />
    </div>
  )
}