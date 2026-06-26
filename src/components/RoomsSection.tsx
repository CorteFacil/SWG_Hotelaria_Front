import room1Image from "@/assets/room-1.png";
import room2Image from "@/assets/room-2.png";
import room3Image from "@/assets/room-3.png";

const rooms = [
  {
    id: 1,
    name: "Suíte Vista Mar",
    detail: "Vista mar panorâmica · Até 2 adultos",
    price: "A partir de R$ 680/noite",
    image: room1Image,
  },
  {
    id: 2,
    name: "Quarto Luxo Jardim",
    detail: "Vista jardim · Até 2 adultos",
    price: "A partir de R$ 480/noite",
    image: room2Image,
  },
  {
    id: 3,
    name: "Suíte Família Premium",
    detail: "Vista mar · Até 4 pessoas",
    price: "A partir de R$ 890/noite",
    image: room3Image,
  },
];

export function RoomsSection() {
  return (
    <section 
      id="quartos"
      className="w-full bg-[#FFF8EF] py-[clamp(3rem,5vw,5rem)]"
      data-testid="section-rooms"
    >
      <div className="max-w-[1500px] mx-auto w-full px-6 md:px-10 lg:px-12">
        <div className="gsap-section-heading mb-12 md:mb-16">
          <span className="font-body font-medium text-[0.75rem] uppercase tracking-[0.12em] text-[#EF9B1B] block mb-4">
            ACOMODAÇÕES
          </span>
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.5rem)] text-[#222020] mb-4">
            Quartos & Suítes
          </h2>
          <p className="font-body text-[#222020] text-base max-w-2xl">
            Espaços desenhados para o máximo conforto, onde a brisa do mar e a luz natural convidam ao descanso absoluto.
          </p>
        </div>

        {/* TROCAMOS O 'hide-scrollbar' POR 'custom-scroll' AQUI: */}
        <div className="gsap-rooms-container flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 custom-scroll">
          {rooms.map((room) => (
            <div 
              key={room.id}
              className="gsap-room-card flex-none w-[320px] md:w-auto h-[480px] md:h-[520px] rounded-[1.25rem] bg-[#FFF3E3] overflow-hidden flex flex-col snap-start group transition-all duration-350 ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_60px_rgba(34,32,32,0.10)] cursor-pointer"
              data-testid={`card-room-${room.id}`}
            >
              <div className="h-[65%] w-full overflow-hidden relative">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-display font-bold text-[1.3rem] text-[#222020] mb-1">
                    {room.name}
                  </h3>
                  <p className="font-body text-[0.875rem] text-[#222020]/70">
                    {room.detail}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-body font-medium text-[1.1rem] text-[#EF9B1B]">
                    {room.price}
                  </span>
                  <span className="font-body font-medium text-sm text-[#EF9B1B] flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                    Ver Quarto →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}