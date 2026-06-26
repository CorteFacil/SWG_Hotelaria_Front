import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import logoNavbar from '@/assets/logoNavbar.svg';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Agora extraímos a rota atual (currentPath) além do setLocation
  const [currentPath, setLocation] = useLocation(); 
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (menuOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, scale: 0.8, y: -10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out" }
        );
      }
    }
  }, [menuOpen]);

  const handleReserve = () => {
    setLocation("/reserva");
    setMenuOpen(false);
  };

  const handleFuncionarioArea = () => {
    setLocation("/admin");
    setMenuOpen(false);
  };

  // FUNÇÃO INTELIGENTE DE NAVEGAÇÃO
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    e.preventDefault();
    const targetId = item.toLowerCase();

    // Função interna para rolar a tela
    const scrollToSection = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'início' || targetId === 'inicio') {
        // Se for "Início" e não achar o ID, simplesmente joga a tela pro topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (currentPath !== '/') {
      // Se não estiver na home, vai para a home primeiro
      setLocation('/');
      // Aguarda um instante para a home renderizar e então desliza
      setTimeout(scrollToSection, 150);
    } else {
      // Se já estiver na home, só desliza
      scrollToSection();
    }
  };

  return (
    <nav
      className={`gsap-nav fixed top-0 w-full z-[100] h-[72px] transition-all duration-300 ease-in-out ${
        scrolled 
          ? "bg-[#FFF8EF] border-b border-black/10 shadow-sm" 
          : "bg-transparent border-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-[80vw] mx-auto px-6 md:px-10 lg:px-12 h-full flex items-center justify-between">
        
        <div className="flex-none">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setLocation('/'); window.scrollTo(0,0); }}
            className="flex items-center hover:opacity-80 transition-opacity duration-300"
            data-testid="link-logo"
          >
            <img src={logoNavbar} alt="Logo Porto do Sol" className="h-12 md:h-14 w-auto object-contain" />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Início", "Quartos", "Sobre", "Contato"].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item)}
              className="relative font-body font-medium text-[0.85rem] uppercase tracking-[0.08em] text-[#222020] hover:text-[#EF9B1B] transition-colors duration-250 group cursor-pointer"
              data-testid={`link-nav-${item.toLowerCase()}`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#EF9B1B] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
            </a>
          ))}
        </div>

        <div className="flex-none flex items-center gap-3 relative">
          <button
            onClick={handleReserve}
            className={`font-body font-medium text-[0.9rem] uppercase tracking-[0.1em] px-6 py-3 rounded-full transition-all duration-300 ease-out flex items-center gap-2 group ${
              scrolled
                ? "bg-[#EF9B1B] text-white border-none hover:bg-[#C47D0E] hover:-translate-y-1 hover:shadow-lg"
                : "bg-transparent text-[#EF9B1B] border-[1.5px] border-[#EF9B1B] hover:bg-[#EF9B1B] hover:text-white hover:-translate-y-1 hover:shadow-lg"
            }`}
            data-testid="button-reserve-nav"
          >
            Reserve Já
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-300 -rotate-45">
              →
            </span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg transition-all duration-300 relative ${
              scrolled
                ? "text-[#222020] hover:bg-black/5 hover:text-[#EF9B1B]"
                : "text-[#EF9B1B] hover:bg-white/10"
            }`}
            data-testid="button-menu-mobile"
          >
            {menuOpen ? (
              <X size={24} className="transition-transform duration-300 rotate-90" />
            ) : (
              <Menu size={24} className="transition-transform duration-300" />
            )}
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-3 bg-[#FFF8EF] rounded-2xl shadow-xl z-50 border border-[#EF9B1B]/20 p-2 min-w-[200px]"
              data-testid="mobile-menu"
            >
              <div className="absolute -top-2 right-4 w-4 h-4 bg-[#FFF8EF] border-t border-r border-[#EF9B1B]/20 transform rotate-45" />

              <button
                onClick={handleFuncionarioArea}
                className="w-full text-left font-body font-medium text-[0.85rem] uppercase tracking-[0.08em] px-4 py-3 rounded-lg text-[#222020] hover:text-[#EF9B1B] hover:bg-white/40 transition-all duration-250 group relative flex items-center gap-3"
                data-testid="button-funcionario-area"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">👤</span>
                <span className="group-hover:translate-x-1 transition-transform duration-250">
                  Área do Funcionário
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}