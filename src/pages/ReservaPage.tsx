import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { api } from '@/api'
import HospedeForm from '../components/HospedeForm'
import ReservaForm from '../components/ReservaForm'
import type { Estado, PaisIso, TipoDeQuarto, Reserva, Hospede } from '../types'

type Screen = 'login' | 'signup' | 'dashboard'

export default function ReservaPage() {
  const [screen, setScreen] = useState<Screen>('login')
  const [hospedeLogado, setHospedeLogado] = useState<Hospede | null>(null)
  
  const [tipoDocLogin, setTipoDocLogin] = useState<'CPF' | 'Passaporte'>('CPF')
  const [docLogin, setDocLogin] = useState('')
  
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<PaisIso[]>([]) 
  const [tiposQuarto, setTiposQuarto] = useState<TipoDeQuarto[]>([])
  
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [showNovaReserva, setShowNovaReserva] = useState(false)
  const [formError, setFormError] = useState('')

  // Estados do Modal de Cancelamento
  const [reservaParaCancelar, setReservaParaCancelar] = useState<number | null>(null)
  const [docConfirmacao, setDocConfirmacao] = useState('')
  const [erroCancelamento, setErroCancelamento] = useState('')

  useEffect(() => {
    api.getEstados()
      .then((dados) => { if (Array.isArray(dados)) setEstados(dados); })
      .catch(e => console.error("Erro /estado:", e));

    api.getPaises()
      .then((dados) => { if (Array.isArray(dados)) setPaises(dados); })
      .catch(e => console.error("Erro /pais:", e));

    api.getTiposDeQuarto()
      .then((dados) => setTiposQuarto(Array.isArray(dados) ? dados : []))
      .catch(e => console.error("Erro /tipo-de-quarto:", e));
  }, []);

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
  }

  const handleDocConfirmacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocConfirmacao(aplicarMascaraDocumento(e.target.value, tipoDocLogin));
    setErroCancelamento('');
  }

  const extrairErro = (err: any) => {
    let msg = err.message || String(err);
    try {
      const parsed = JSON.parse(msg);
      if (parsed.message) return parsed.message;
    } catch { }
    return msg;
  }

  const carregarReservasDoHospede = async (hospedeId: number) => {
    try {
      const result = await api.getReservasHospede(hospedeId);
      setReservas(result);
    } catch (err: any) {
      console.error("Erro ao buscar reservas", err);
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const hospede = await api.findHospedeByDoc(docLogin); 
      if (hospede && hospede.id) {
        setHospedeLogado(hospede);

        await carregarReservasDoHospede(hospede.id);
        setScreen('dashboard');
      } else {
        setScreen('signup');
      }
    } catch (err: any) {
      setFormError(extrairErro(err));
    }
  }

  const handleHospedeCriado = async (dadosForm: any) => {
    setFormError('');
    try {
      const payloadHospede = {
        nome: dadosForm.nome,
        cpfPassaporte: dadosForm.cpfPassaporte,
        email: dadosForm.email,
        telefone: dadosForm.telefone,
        nascimento: dadosForm.nascimento,
        estado: { id: dadosForm.estadoId } 
      };

      const novoHospede = await api.createHospede(payloadHospede as any);
      setHospedeLogado(novoHospede);
      setScreen('dashboard');
    } catch (err: any) {
      setFormError(extrairErro(err));
    }
  }

  const handleReservaCriada = async (dadosReserva: Omit<Reserva, 'id' | 'status'>) => {
    setFormError('');
    try {
      await api.createReserva(dadosReserva);
      setShowNovaReserva(false);
      if (hospedeLogado?.id) await carregarReservasDoHospede(hospedeLogado.id);
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
      await api.deleteReserva(reservaParaCancelar); 
      setReservas(reservas.filter(r => r.id !== reservaParaCancelar));
      setReservaParaCancelar(null);
    } catch (err: any) {
      setErroCancelamento(extrairErro(err));
    }
  }

  const mudarTela = (novaTela: Screen) => {
    setFormError('');
    setScreen(novaTela);
  }

  const getStatusInfo = (reserva: Reserva) => {
    if (reserva.status === 0) {
      return { label: 'Pendente', style: 'border-yellow-700 bg-yellow-700 text-[#FFF8EF]', canCancel: true };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = reserva.saidaAcomodacao.split('-').map(Number);
    const dataSaida = new Date(ano, mes - 1, dia, 0, 0, 0, 0);

    if (reserva.status === 1) {
      if (hoje > dataSaida) {
        return { label: 'Realizada', style: 'border-blue-400 bg-blue-400 text-[#FFF8EF]', canCancel: false };
      }
      return { label: 'Confirmada', style: 'border-green-400 bg-green-400 text-[#FFF8EF]', canCancel: false };
    }

    return { label: 'Desconhecido', style: 'border-red-500 text-red-500', canCancel: false };
  }

  return (
    <div className="min-h-screen w-full bg-[#FFF8EF] text-[#222020] flex flex-col font-admin admin-panel relative">
      <Navbar />
      
      {/* pt-28 garante que o conteúdo não fique escondido sob a Navbar fixada */}
      <main className="flex-1 flex flex-col items-center p-6 pt-28">
        
        {screen === 'login' && (
          <div className="w-full max-w-md bg-transparent p-8 rounded-2xl border-2 border-[#222020]/10 mt-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-black text-[#EF9B1B]">Acessar Reservas</h2>
              <p className="text-sm text-[#222020]/70 mt-2 font-medium">Informe seu documento para continuar</p>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${formError ? 'text-red-500' : 'text-[#222020]'}`}>Documento</label>
                  <select value={tipoDocLogin} onChange={(e) => {
                    setTipoDocLogin(e.target.value as 'CPF' | 'Passaporte');
                    setFormError('');
                  }} className="text-xs bg-transparent text-[#EF9B1B] font-black uppercase tracking-wider outline-none cursor-pointer">
                    <option value="CPF">CPF</option>
                    <option value="Passaporte">Passaporte</option>
                  </select>
                </div>
                <input value={docLogin} onChange={handleDocLoginChange} required placeholder={tipoDocLogin === 'CPF' ? "999.999.999-99" : "Seu Passaporte"}
                  className={`w-full p-4 rounded-xl bg-transparent outline-none text-center tracking-widest text-lg uppercase font-bold transition-all ${
                    formError ? 'border-2 border-red-400 text-red-600' : 'border-2 border-[#222020]/20 focus:border-[#EF9B1B]'
                  }`} />
                {formError && <span className="text-xs text-red-500 font-bold block mt-2 text-center">{formError}</span>}
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-[#EF9B1B] text-[#FFF8EF] hover:bg-[#d88915] transform hover:-translate-y-1 active:scale-95 transition-all mt-4">
                Entrar
              </button>
            </form>
          </div>
        )}

        {screen === 'signup' && (
          <HospedeForm 
            initialDoc={docLogin} 
            estados={estados} 
            paises={paises} 
            error={formError} 
            onSubmit={handleHospedeCriado} 
            onCancel={() => mudarTela('login')}
          />
        )}

        {screen === 'dashboard' && hospedeLogado && (
          <div className="w-full max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b-2 border-[#222020]/10">
              <div>
                <h2 className="text-4xl font-display font-black text-[#222020]">Olá, {hospedeLogado.nome.split(' ')[0]}</h2>
                <p className="text-[#222020]/60 mt-1 font-medium tracking-wide">Gerencie suas estadias conosco.</p>
              </div>
              <button onClick={() => { setShowNovaReserva(!showNovaReserva); setFormError(''); }} 
                className="mt-4 md:mt-0 px-8 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-[#EF9B1B] text-[#EF9B1B] hover:bg-[#EF9B1B] hover:text-[#FFF8EF] transition-all">
                {showNovaReserva ? 'Voltar' : 'Nova Reserva'}
              </button>
            </div>

            {formError && !showNovaReserva && (
               <div className="mb-6 text-red-600 text-sm font-bold p-4 rounded-xl border-2 border-red-200">
                 {formError}
               </div>
            )}

            {showNovaReserva && (
              <div className="mb-12">
                <ReservaForm 
                  tipos={tiposQuarto} 
                  hospedeId={hospedeLogado.id} 
                  error={formError} 
                  onSubmit={handleReservaCriada} 
                  onCancel={() => { setShowNovaReserva(false); setFormError(''); }} 
                />
              </div>
            )}

            <h3 className="text-xl font-display font-black text-[#EF9B1B] mb-6 uppercase tracking-widest">Suas Reservas</h3>
            
            {reservas.length === 0 ? (
              <div className="text-center p-12 rounded-2xl border-2 border-dashed border-[#222020]/20">
                <p className="text-[#222020]/50 font-bold tracking-wide">Você ainda não possui reservas cadastradas.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reservas.map((reserva: Reserva) => {
                  const status = getStatusInfo(reserva);
                  
                  return (
                    <div key={reserva.id} className="relative p-6 rounded-2xl border-2 border-[#222020]/10 hover:border-[#EF9B1B] transition-all flex flex-col justify-between min-h-[200px] bg-transparent">
                      
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${status.style}`}>
                          {status.label}
                        </span>

                        {/* Botão de cancelar fixo, vermelho e legível */}
                        {status.canCancel && (
                          <button 
                            onClick={() => abrirModalCancelamento(reserva.id)}
                            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm active:scale-95"
                            title="Cancelar Reserva"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>

                      <div className={`space-y-3 ${status.label === 'Realizada' ? 'opacity-60' : 'opacity-100'}`}>
                        <div className="flex justify-between border-b border-[#222020]/10 pb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#222020]/60">Entrada</span>
                          <span className="font-bold">{reserva.entradaAcomodacao}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#222020]/10 pb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#222020]/60">Saída</span>
                          <span className="font-bold">{reserva.saidaAcomodacao}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#222020]/60">Hóspedes</span>
                          <span className="font-bold">{reserva.numeroPessoas} {reserva.numeroPessoas === 1 ? 'Pessoa' : 'Pessoas'}</span>
                        </div>
                      </div>

                      {reserva.observacao && (
                        <div className={`mt-4 pt-4 border-t-2 border-[#222020]/10 ${status.label === 'Realizada' ? 'opacity-60' : 'opacity-100'}`}>
                          <p className="text-xs font-medium text-[#222020]/70 italic leading-relaxed">
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

      {/* MODAL DE CANCELAMENTO COM Z-INDEX ALTO */}
      {reservaParaCancelar !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#222020]/40 backdrop-blur-sm p-4">
          <div className="bg-[#FFF8EF] p-8 rounded-2xl border-2 border-red-500 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-display font-black text-red-600 mb-2 uppercase tracking-widest">Atenção!</h3>
            <p className="text-[#222020]/80 font-bold mb-6 leading-relaxed">
              Ao cancelar esta reserva você não poderá recuperá-la e não há garantia de que conseguirá realizar a mesma.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#222020]">
                  Digite seu documento ({tipoDocLogin}) para confirmar:
                </label>
                <input
                  value={docConfirmacao}
                  onChange={handleDocConfirmacaoChange}
                  className={`w-full mt-2 p-3 rounded-xl bg-transparent border-2 outline-none font-bold uppercase tracking-widest text-center ${
                    erroCancelamento ? 'border-red-500 text-red-600' : 'border-[#222020]/20 focus:border-red-500'
                  }`}
                  placeholder={tipoDocLogin === 'CPF' ? "999.999.999-99" : "Passaporte"}
                />
                {erroCancelamento && <span className="text-xs text-red-500 font-bold block mt-2 text-center">{erroCancelamento}</span>}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setReservaParaCancelar(null)}
                  className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-[#222020]/20 text-[#222020] hover:bg-[#222020]/5 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarCancelamento}
                  className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}