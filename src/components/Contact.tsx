export default function Contact() {
  const contacts = [
    {
      label: "Email",
      value: "syakirahana296@gmail.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=syakirahana296@gmail.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "(+62) 812-6653-3537",
      href: "tel:+6281266533537",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.41 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16a2 2 0 0 1 .27.92z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/hana-syakira/",
      href: "https://www.linkedin.com/in/hana-syakira/",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      value: "github.com/Hana-nas",
      href: "https://github.com/Hana-nas",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
    },
  ];

  return (
    <footer id="contact" className="py-24 px-4 relative z-10 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-600/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <span className="text-sky-400 font-medium tracking-wider uppercase text-sm mb-6 block">That's all for now.</span>

        <h2 className="text-5xl md:text-7xl font-bold font-heading mb-12 text-slate-100">
          Got a project in mind?<br />
          <span className="text-gradient">Let&apos;s talk</span>
        </h2>

        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=syakirahana296@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-block mb-16 px-8 py-4 rounded-full bg-slate-100 text-slate-900 font-semibold text-lg hover:scale-105 hover:bg-sky-400 hover:text-slate-900 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          Get in touch
        </a>

        <div className="glass-card rounded-3xl p-8 border-t border-slate-800">
          <div className="grid sm:grid-cols-2 gap-4">
            {contacts.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-4 rounded-2xl group hover:bg-sky-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:text-sky-300 transition-all duration-300 shrink-0">
                  {item.icon}
                </div>
                <div className="text-left">
                  <span className="text-slate-500 text-xs uppercase tracking-wider block mb-0.5">{item.label}</span>
                  <span className="text-slate-200 font-medium group-hover:text-sky-400 transition-colors truncate block">{item.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
