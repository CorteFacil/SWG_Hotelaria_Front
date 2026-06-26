import { useState, ReactNode } from 'react'
import { Link, useLocation } from 'wouter'
import { 
  Menu, 
  LogOut, 
  ClipboardCheck, 
  CalendarDays, 
  BookOpenCheck, 
  Users, 
  BedDouble, 
  Tags, 
  UserCircle,
  MapPin,
  Globe,
  FileText,
  BarChart3,
  TrendingUp,
  Map,
  ClipboardList,
  Activity
} from 'lucide-react'
import logoSideBar from '@/assets/logoSideBar.svg'

interface AdminProps {
  children: ReactNode
}

export default function AdminPage({ children }: AdminProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [, setLocation] = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setLocation('/')
  }

  return (
    <div className="flex h-screen bg-[#FFF8EF] admin-panel overflow-hidden font-admin text-[#222020]">
      <aside className={`${isCollapsed ? 'w-20' : 'w-[340px]'} bg-[#FFF3E3] border-r border-[#EF9B1B]/20 flex flex-col transition-all duration-300 ease-in-out relative z-20 shadow-[4px_0_24px_rgba(34,32,32,0.02)]`}>
        <div className="h-28 flex items-center justify-between px-4 border-b border-[#EF9B1B]/10 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center overflow-hidden w-full">
              <img src={logoSideBar} alt="Logo" className="w-48 h-auto max-h-20 object-contain" />
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2.5 rounded-xl hover:bg-[#EF9B1B]/15 text-[#C47D0E] transition-colors shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <Menu size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 custom-scroll">
          <div className="px-3">
            {!isCollapsed && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Processos
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/ordem-limpeza" icon={<ClipboardCheck size={22} />} text="Ordem de Limpeza" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/estadia" icon={<CalendarDays size={22} />} text="Estadia" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/reservas" icon={<BookOpenCheck size={22} />} text="Reservas" isCollapsed={isCollapsed} />
            </div>
          </div>

          <div className="px-3">
            {!isCollapsed && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Cadastros Gerais
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/funcionario" icon={<UserCircle size={22} />} text="Funcionários" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/quarto" icon={<BedDouble size={22} />} text="Quartos" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/tipos-de-quarto" icon={<Tags size={22} />} text="Tipos de Quarto" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/hospedes" icon={<Users size={22} />} text="Hóspedes" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/estado" icon={<MapPin size={22} />} text="Estado" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/pais" icon={<Globe size={22} />} text="País" isCollapsed={isCollapsed} />
            </div>
          </div>

          <div className="px-3">
            {!isCollapsed && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Relatórios
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/relatorios/relatorio-reservas" icon={<FileText size={22} />} text="Reservas por Período" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/relatorios/relatorio-faturamento" icon={<BarChart3 size={22} />} text="Faturamento por Tipo" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/relatorios/lucro-estadia" icon={<TrendingUp size={22} />} text="Lucro por Estadia" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/relatorios/procedencia" icon={<Map size={22} />} text="Procedência Geográfica" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/relatorios/historico-limpeza" icon={<ClipboardList size={22} />} text="Histórico de Limpezas" isCollapsed={isCollapsed} />
              <MenuItem to="/admin/relatorios/produtividade-limpeza" icon={<Activity size={22} />} text="Produtividade da Equipe" isCollapsed={isCollapsed} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[#EF9B1B]/10 shrink-0">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
            title="Sair do sistema"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-bold whitespace-nowrap">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scroll">
          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 min-h-full p-6 lg:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

function MenuItem({ to, icon, text, isCollapsed }: { to: string, icon: ReactNode, text: string, isCollapsed: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-[#222020] hover:bg-[#EF9B1B]/10 hover:text-[#C47D0E] ${isCollapsed ? 'justify-center' : 'px-4'}`} title={text}>
      <div className="shrink-0 transition-transform group-hover:scale-110">{icon}</div>
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden">
          {text}
        </span>
      )}
    </Link>
  )
}