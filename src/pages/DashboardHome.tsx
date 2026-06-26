import { Link } from "wouter";
import { 
  CalendarDays, 
  Users, 
  BedDouble, 
  TrendingUp, 
  ArrowRight, 
  ClipboardCheck, 
  Clock 
} from "lucide-react";

export default function DashboardHome() {
  
  // Dados simulados para visualização inicial (Você pode conectar com a API depois)
  const metricas = [
    { titulo: "Reservas Hoje", valor: "12", icon: <CalendarDays size={24} />, cor: "text-blue-600", bg: "bg-blue-100" },
    { titulo: "Check-ins Pendentes", valor: "5", icon: <Clock size={24} />, cor: "text-orange-600", bg: "bg-orange-100" },
    { titulo: "Quartos Limpos", valor: "80%", icon: <ClipboardCheck size={24} />, cor: "text-emerald-600", bg: "bg-emerald-100" },
    { titulo: "Ocupação Atual", valor: "64%", icon: <BedDouble size={24} />, cor: "text-purple-600", bg: "bg-purple-100" },
  ];

  const atalhos = [
    { titulo: "Nova Reserva", desc: "Agendar uma nova estadia", link: "/admin/reservas", icon: <CalendarDays size={28} /> },
    { titulo: "Cadastrar Hóspede", desc: "Registrar novo cliente", link: "/admin/hospedes", icon: <Users size={28} /> },
    { titulo: "Ordem de Limpeza", desc: "Gerenciar limpeza de quartos", link: "/admin/ordem-limpeza", icon: <ClipboardCheck size={28} /> },
    { titulo: "Faturamento", desc: "Ver relatórios financeiros", link: "/admin/relatorios/relatorio-faturamento", icon: <TrendingUp size={28} /> },
  ];

  return (
    <div className="w-full animate-fade-in">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="mb-10 bg-gradient-to-r from-[#222020] to-[#3a3737] p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black font-admin mb-2">Central de Comando</h1>
          <p className="text-gray-300 max-w-xl">
            Bem-vindo(a) ao painel de gestão. Aqui você tem uma visão geral das operações do hotel e acesso rápido aos processos mais importantes do dia a dia.
          </p>
        </div>
        {/* Elemento visual decorativo */}
        <div className="absolute -right-10 -top-24 opacity-10">
          <TrendingUp size={300} />
        </div>
      </div>

      {/* Grid de Métricas */}
      <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Visão Geral de Hoje</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metricas.map((metrica, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${metrica.bg} ${metrica.cor}`}>
              {metrica.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{metrica.titulo}</p>
              <h4 className="text-2xl font-black text-[#222020]">{metrica.valor}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Acesso Rápido */}
      <h3 className="text-lg font-bold text-[#222020] font-admin mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {atalhos.map((atalho, idx) => (
          <Link key={idx} to={atalho.link}>
            <div className="bg-white border border-[#EF9B1B]/20 p-6 rounded-xl shadow-sm hover:shadow-lg hover:border-[#EF9B1B] transition-all group cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FFF8EF] rounded-full flex items-center justify-center text-[#EF9B1B] group-hover:scale-110 transition-transform shrink-0">
                  {atalho.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#222020] mb-1">{atalho.titulo}</h4>
                  <p className="text-sm text-gray-500">{atalho.desc}</p>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-[#EF9B1B] group-hover:translate-x-1 transition-all">
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}