export default function About() {
  return (
    <section id="about" className="py-24 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold leading-relaxed text-slate-100">
                Informatics Engineering Students with a strong interest in System Analyst, AI,
                Computer Vision Technologies. Skilled in requirement analysis, UML, database design,
                and programming using C and C++.
              </h2>
            </div>
            
            <div className="flex flex-col gap-8">
              <p className="text-slate-400 text-lg leading-relaxed">
                Experienced in academic technology projects design and image-based technology concepts,
                with basic frontend development knowledge. Possesses strong analytical thinking, problem-solving,
                communication, and teamwork skills, with a strong willingness to learn and adapt to emerging
                technologies
              </p>
              
              <a href="https://www.linkedin.com/in/hana-syakira/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sky-400 hover:text-sky-300 font-medium group w-max transition-colors">
                More about me
                <svg className="transform group-hover:translate-x-2 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
