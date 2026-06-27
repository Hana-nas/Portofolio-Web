'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '../../AdminSidebar'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link: '',
    order: 0,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'order' ? Number(value) : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...form, tags }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Terjadi kesalahan')
      setLoading(false)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/admin/projects" className="text-slate-500 hover:text-slate-300 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-100">Tambah Project Baru</h1>
              <p className="text-slate-500 text-sm mt-0.5">Isi semua field yang diperlukan</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Field label="Judul Project *" id="proj-title">
                <input id="proj-title" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Campus Lost Tracker"
                  className="admin-input" />
              </Field>

              <Field label="Deskripsi" id="proj-desc">
                <textarea id="proj-desc" name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi singkat project..." rows={3}
                  className="admin-input resize-none" />
              </Field>

              <Field label="URL Gambar" id="proj-image" hint="URL gambar project (dari /public atau URL eksternal)">
                <input id="proj-image" name="image_url" value={form.image_url} onChange={handleChange} placeholder="/Poster PPM.png atau https://..."
                  className="admin-input" />
              </Field>

              <Field label="Link Project" id="proj-link" hint="URL GitHub, demo, atau website">
                <input id="proj-link" name="link" value={form.link} onChange={handleChange} placeholder="https://github.com/..."
                  className="admin-input" />
              </Field>

              <Field label="Tags" id="proj-tags" hint="Pisahkan dengan koma, contoh: React, TypeScript, Node.js">
                <input id="proj-tags" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="HTML, CSS, JavaScript"
                  className="admin-input" />
              </Field>

              <Field label="Urutan Tampil" id="proj-order" hint="Angka kecil = tampil lebih dulu">
                <input id="proj-order" name="order" type="number" value={form.order} onChange={handleChange}
                  className="admin-input w-24" />
              </Field>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} id="save-project-btn"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-900 transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
                {loading ? 'Menyimpan...' : 'Simpan Project'}
              </button>
              <Link href="/admin/projects"
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                Batal
              </Link>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 10px 14px;
          background: rgba(7,15,30,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input::placeholder { color: #475569; }
        .admin-input:focus { border-color: rgba(56,189,248,0.5); }
      `}</style>
    </div>
  )
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600 mt-1.5">{hint}</p>}
    </div>
  )
}
