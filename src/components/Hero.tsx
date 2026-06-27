import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-500/20 rounded-full blur-[100px] md:blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-500/20 rounded-full blur-[100px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto z-10 flex flex-col items-center text-center">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-full p-2 glass border-sky-500/30 group transition-all duration-700 hover:scale-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.3)]">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image 
              src="/hana porto.png" 
              alt="Hero Background" 
              fill
              sizes="(max-width: 768px) 192px, 256px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-10 tracking-tight">
          <span className="text-gradient">Creative Developer</span>
        </h1>

        <a href="#about" className="mt-8 animate-bounce p-4 rounded-full glass text-sky-400 hover:text-sky-300 hover:bg-sky-900/30 transition-all cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    </section>
  );
}
