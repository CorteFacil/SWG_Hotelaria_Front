import { useState, ReactNode } from 'react'
import { Link, useLocation } from 'wouter'
import { 
  Menu, 
  X, 
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
  const [isMobileOpen, setIsMobileOpen] = useState(false) 
  const [, setLocation] = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setLocation('/')
  }

  const handleMobileMenuClick = () => {
    setIsMobileOpen(false)
  }

  return (
    <div className="flex h-screen bg-[#FFF8EF] admin-panel overflow-hidden font-admin text-[#222020] relative">
      
      {/* BARRA SUPERIOR MOBILE (Aparece apenas em telas pequenas) */}
      <div className="md:hidden absolute top-0 left-0 w-full h-20 bg-[#FFF3E3] border-b border-[#EF9B1B]/20 flex items-center justify-between px-6 z-30 shadow-sm">
        {/* LOGO MOBILE CLICÁVEL */}
        <Link to="/admin">
          <img src={logoSideBar} alt="Logo" className="w-32 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2.5 bg-[#FFF8EF] rounded-xl text-[#C47D0E] shadow-sm active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY ESCURO (Fundo embaçado ao abrir o menu no celular) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#222020]/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR (Compartilhada entre Desktop e Mobile com estilos condicionais) */}
      <aside className={`
        bg-[#FFF3E3] border-r border-[#EF9B1B]/20 flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(34,32,32,0.02)]
        
        /* Comportamento Desktop (md:) */
        md:relative md:z-20 md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-[340px]'}
        
        /* Comportamento Mobile (Flutuante) */
        fixed inset-y-0 left-0 z-50 w-[85%] max-w-[340px] transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-28 flex items-center justify-between px-4 border-b border-[#EF9B1B]/10 shrink-0">
          
          {/* LOGO SIDEBAR CLICÁVEL - Exibida quando expandido ou no mobile */}
          {(!isCollapsed || isMobileOpen) && (
            <Link to="/admin" onClick={handleMobileMenuClick} className="flex items-center overflow-hidden w-full cursor-pointer hover:opacity-80 transition-opacity">
              <img src={logoSideBar} alt="Logo" className="w-48 h-auto max-h-20 object-contain ml-2" />
            </Link>
          )}
          
          {/* Botão de Recolher/Expandir do Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:block p-2.5 rounded-xl hover:bg-[#EF9B1B]/15 text-[#C47D0E] transition-colors shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <Menu size={22} />
          </button>

          {/* Botão de Fechar do Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 custom-scroll">
          <div className="px-3">
            {(!isCollapsed || isMobileOpen) && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Processos
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/ordem-limpeza" icon={<ClipboardCheck size={22} />} text="Ordem de Limpeza" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/estadia" icon={<CalendarDays size={22} />} text="Estadia" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/reservas" icon={<BookOpenCheck size={22} />} text="Reservas" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
            </div>
          </div>

          <div className="px-3">
            {(!isCollapsed || isMobileOpen) && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Cadastros Gerais
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/funcionario" icon={<UserCircle size={22} />} text="Funcionários" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/quarto" icon={<BedDouble size={22} />} text="Quartos" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/tipos-de-quarto" icon={<Tags size={22} />} text="Tipos de Quarto" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/hospedes" icon={<Users size={22} />} text="Hóspedes" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/estado" icon={<MapPin size={22} />} text="Estado" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/pais" icon={<Globe size={22} />} text="País" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
            </div>
          </div>

          <div className="px-3">
            {(!isCollapsed || isMobileOpen) && (
              <h3 className="px-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#C47D0E] mb-3">
                Relatórios
              </h3>
            )}
            <div className="flex flex-col gap-1">
              <MenuItem to="/admin/relatorios/relatorio-reservas" icon={<FileText size={22} />} text="Reservas por Período" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/relatorios/relatorio-faturamento" icon={<BarChart3 size={22} />} text="Projeção de Faturamento" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/relatorios/relatorio-lucro-estadia" icon={<TrendingUp size={22} />} text="Lucro por Estadia" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/relatorios/relatorio-procedencia" icon={<Map size={22} />} text="Procedência Geográfica" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/relatorios/historico-limpeza" icon={<ClipboardList size={22} />} text="Histórico de Limpezas" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
              <MenuItem to="/admin/relatorios/produtividade-limpeza" icon={<Activity size={22} />} text="Produtividade da Equipe" isCollapsed={isCollapsed && !isMobileOpen} onClick={handleMobileMenuClick} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[#EF9B1B]/10 shrink-0 mb-4 md:mb-0">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-200 transition-all duration-200 group ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
            title="Sair do sistema"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {(!isCollapsed || isMobileOpen) && <span className="font-bold whitespace-nowrap">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative pt-24 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scroll">
          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgba(34,32,32,0.04)] border border-gray-100 min-h-full p-6 lg:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

function MenuItem({ to, icon, text, isCollapsed, onClick }: { to: string, icon: ReactNode, text: string, isCollapsed: boolean, onClick?: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-[#222020] hover:bg-[#EF9B1B]/10 hover:text-[#C47D0E] ${isCollapsed ? 'justify-center' : 'px-4'}`} 
      title={text}
    >
      <div className="shrink-0 transition-transform group-hover:scale-110">{icon}</div>
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden">
          {text}
        </span>
      )}
    </Link>
  )
}