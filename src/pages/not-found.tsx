import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF8EF] text-[#222020] font-body p-6 selection:bg-[#EF9B1B]/30 relative overflow-hidden">
      
      <div className="absolute top-10 left-10 md:top-20 md:left-20 text-[#EF9B1B]/5 rotate-12">
        <Compass size={180} strokeWidth={1} />
      </div>
      
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 text-[#EF9B1B]/5 -rotate-12">
        <Compass size={240} strokeWidth={1} />
      </div>

      <div className="text-center z-10 animate-fade-in max-w-lg flex flex-col items-center">
        
        <h1 className="font-display font-black text-[8rem] md:text-[12rem] leading-none text-[#EF9B1B] drop-shadow-sm select-none mb-16">
          404
        </h1>
        
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#222020] mb-6">
          Você se perdeu?
        </h2>
        
        <p className="text-gray-500 text-lg md:text-xl mb-10 leading-relaxed font-light">
          Parece que você acabou entrando no corredor errado do hotel. A página que você está procurando não existe ou foi movida.
        </p>

        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-[0.1em] text-sm bg-[#222020] text-white hover:bg-[#EF9B1B] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(239,155,27,0.35)] group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
      </div>
    </div>
  );
}