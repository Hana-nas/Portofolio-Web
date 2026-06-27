import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export default async function Projects() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true })

  // Fallback to empty array if no projects found or error occurs
  const displayProjects = projects || [];

  return (
    <section id="projects" className="py-24 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">Impressive <span className="text-sky-400">Works</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto lg:mx-0">
            Here's a selection of projects that showcase my passion for design and development, reflecting creativity and innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {displayProjects.map((project) => (
            <a href={project.link || '#'} target={project.link ? "_blank" : undefined} rel={project.link ? "noopener noreferrer" : undefined} key={project.id} className="group relative block rounded-3xl overflow-hidden glass-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(56,189,248,0.2)]">
              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-md mb-2">{project.title}</h3>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-sky-300 border border-sky-400/20 backdrop-blur-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {project.link && (
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-sky-400 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
