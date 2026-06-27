import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export default async function Skills() {
  const supabase = await createClient()
  
  const [
    { data: skills },
    { data: certificates }
  ] = await Promise.all([
    supabase.from('skills').select('*').order('order', { ascending: true }),
    supabase.from('certificates').select('*').order('order', { ascending: true }),
  ])

  const displaySkills = skills || [];
  const displayCertificates = certificates || [];

  return (
    <section id="skills" className="py-24 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-16 text-center">
          Skills that <span className="text-sky-400">fuel my passion</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displaySkills.map((skill) => (
            <div key={skill.id} className="glass-card rounded-2xl p-8 group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(56,189,248,0.15)] transition-all duration-300">
              <div className="flex gap-3 mb-6">
                {(skill.icons || []).map((icon: { name: string; color: string }, idx: number) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-lg glass flex items-center justify-center text-sm font-bold shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ color: icon.color }}
                  >
                    {icon.name}
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">{skill.category}</h3>
              {skill.description && (
                <p className="text-slate-400 text-sm leading-relaxed">{skill.description}</p>
              )}
            </div>
          ))}
        </div>

        {displayCertificates.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {displayCertificates.map((cert) => (
              <a
                key={cert.id}
                href={cert.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(56,189,248,0.15)] transition-all duration-300 block relative h-56 md:h-64"
              >
                <Image
                  src={cert.image_url}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium bg-slate-900/80 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14 21 3"></path>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    </svg>
                    View Full
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
