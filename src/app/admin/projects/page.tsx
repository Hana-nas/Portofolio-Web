'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminSidebar } from '../AdminSidebar'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  link: string | null
  tags: string[]
  order: number
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus project "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeleting(id)
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    await fetchProjects()
    setDeleting(null)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-100 mb-1">Projects</h1>
            <p className="text-slate-400 text-sm">{projects.length} project tersimpan</p>
          </div>
          <Link
            href="/admin/projects/new"
            id="add-project-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Project
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.5)' }}>
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <svg className="animate-spin w-6 h-6 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Memuat data...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-slate-600" style={{ background: 'rgba(30,41,59,0.5)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-slate-400 mb-1">Belum ada project</p>
              <p className="text-slate-600 text-sm">Klik tombol &quot;Tambah Project&quot; untuk mulai</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Order', 'Title', 'Link', 'Tags', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id}
                    className="transition-colors hover:bg-slate-800/30"
                    style={{ borderBottom: i < projects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-5 py-4 text-slate-500 text-sm">{p.order}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-200 font-medium text-sm">{p.title}</p>
                      {p.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
                    </td>
                    <td className="px-5 py-4">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs truncate max-w-[160px] block transition-colors">
                          {p.link.replace(/^https?:\/\//, '')}
                        </a>
                      ) : <span className="text-slate-600 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(p.tags || []).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(56,189,248,0.1)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.2)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/projects/${p.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-sky-400 transition-all"
                          style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.title)}
                          disabled={deleting === p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                          {deleting === p.id ? (
                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          )}
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
