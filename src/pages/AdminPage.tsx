import { Link, useLocation } from 'wouter'
import styles from './Admin.module.css'
import { ReactNode } from 'react'

interface AdminProps {
  children: ReactNode
}

export default function AdminPage({ children }: AdminProps) {
  const [, setLocation] = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLocation('/')
  }

  return (
    // Adicionamos a classe font-sans aqui para forçar a tipografia limpa em todo o painel
  <div className={`${styles.adminShell} admin-panel bg-gray-50 min-h-screen text-gray-800`}>
      <div className={styles.adminGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.menuSection}>
            <h3 className="uppercase tracking-wider text-xs font-bold text-gray-500 mb-4">Processos</h3>
            <Link className={styles.menuButton} to="/admin/ordem-limpeza">Ordem de Limpeza</Link>
            <Link className={styles.menuButton} to="/admin/estadia">Estadia</Link>
            <Link className={styles.menuButton} to="/admin/reservas">Reservas</Link>
          </div>

          <div className={styles.menuSection}>
            <h3 className="uppercase tracking-wider text-xs font-bold text-gray-500 mb-4">Cadastros Gerais</h3>
            <Link className={styles.menuButton} to="/admin/funcionario">Cadastro de funcionário</Link>
            <Link className={styles.menuButton} to="/admin/quarto">Cadastro de quarto</Link>
            <Link className={styles.menuButton} to="/admin/tipos-de-quarto">Cadastro de tipo de quarto</Link>
            <Link className={styles.menuButton} to="/admin/hospedes">Cadastro de hóspedes</Link>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button 
              onClick={handleLogout}
              className={styles.menuButton} 
              style={{ color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', width: '100%', textAlign: 'left' }}
            >
              Sair
            </button>
          </div>
        </aside>

        <section className={styles.contentArea}>
          {children}
        </section>
      </div>
    </div>
  )
}