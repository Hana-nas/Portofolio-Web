import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './AdminSidebar'

async function getStats() {
  const supabase = await createClient()
  const [
    { count: projectsCount },
    { count: skillsCount },
    { count: certsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
  ])

  return {
    projects: projectsCount ?? 0,
    skills: skillsCount ?? 0,
    certificates: certsCount ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      label: 'Projects',
      count: stats.projects,
      href: '/admin/projects',
      color: '#38bdf8',
      bg: 'rgba(56,189,248,0.1)',
      border: 'rgba(56,189,248,0.2)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: 'Skill Categories',
      count: stats.skills,
      href: '/admin/skills',
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.1)',
      border: 'rgba(129,140,248,0.2)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: 'Certificates',
      count: stats.certificates,
      href: '/admin/certificates',
      color: '#c084fc',
      bg: 'rgba(192,132,252,0.1)',
      border: 'rgba(192,132,252,0.2)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-heading text-slate-100 mb-1">Dashboard</h1>
          <p className="text-slate-400 text-sm">Selamat datang kembali! Kelola konten portfolio kamu di sini.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] group"
              style={{ background: card.bg, border: `1px solid ${card.border}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: card.bg, border: `1px solid ${card.border}`, color: card.color }}>
                  {card.icon}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 group-hover:text-slate-400 transition-colors">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <p className="text-4xl font-bold mb-1" style={{ color: card.color }}>{card.count}</p>
              <p className="text-slate-400 text-sm">{card.label}</p>
            </a>
          ))}
        </div>

        {/* Quick Guide */}
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-slate-200 font-semibold mb-4">Cara Menggunakan</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">①</span>
              <span>Klik <strong className="text-slate-300">Projects</strong> di sidebar untuk menambah/edit/hapus project portfolio.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">②</span>
              <span>Klik <strong className="text-slate-300">Skills</strong> untuk mengelola kategori skill dan icon-nya.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">③</span>
              <span>Klik <strong className="text-slate-300">Certificates</strong> untuk upload/edit sertifikat yang ditampilkan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">④</span>
              <span>Perubahan langsung tampil di halaman portfolio secara <strong className="text-slate-300">real-time</strong>.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
