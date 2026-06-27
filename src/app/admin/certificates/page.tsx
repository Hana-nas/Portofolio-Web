'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminSidebar } from '../AdminSidebar'
import Image from 'next/image'

type Certificate = {
  id: string
  title: string
  image_url: string
  order: number
}

type EditState = {
  title: string
  image_url: string
  order: number
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState<EditState>({ title: '', image_url: '', order: 0 })
  
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ title: '', image_url: '', order: 0 })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCerts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/certificates')
    const data = await res.json()
    setCerts(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchCerts() }, [fetchCerts])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus sertifikat "${title}"?`)) return
    setDeleting(id)
    await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
    await fetchCerts()
    setDeleting(null)
  }

  function startEdit(c: Certificate) {
    setEditing(c.id)
    setEditForm({ title: c.title, image_url: c.image_url, order: c.order })
    setError('')
  }

  async function handleSaveEdit() {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/certificates/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error); setSaving(false); return }
    setEditing(null)
    await fetchCerts()
    setSaving(false)
  }

  async function handleAddNew() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error); setSaving(false); return }
    setAdding(false)
    setNewForm({ title: '', image_url: '', order: 0 })
    await fetchCerts()
    setSaving(false)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-100 mb-1">Certificates</h1>
            <p className="text-slate-400 text-sm">{certs.length} sertifikat tersimpan</p>
          </div>
          <button onClick={() => { setAdding(true); setError('') }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Sertifikat
          </button>
        </div>

        {/* Add Form */}
        {adding && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <h3 className="text-slate-200 font-semibold mb-4">Tambah Sertifikat Baru</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Judul Sertifikat *</label>
                <input value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} className="admin-input" placeholder="Sertifikat Web Dev..." />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Urutan</label>
                <input type="number" value={newForm.order} onChange={e => setNewForm({ ...newForm, order: Number(e.target.value) })} className="admin-input" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">URL Gambar *</label>
                <input value={newForm.image_url} onChange={e => setNewForm({ ...newForm, image_url: e.target.value })} className="admin-input" placeholder="/sertifikat.png" />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={handleAddNew} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-900" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={() => { setAdding(false); setError('') }} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>Batal</button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">Memuat...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map(c => (
              <div key={c.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {editing === c.id ? (
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="space-y-3 mb-4 flex-1">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Judul</label>
                        <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">URL Gambar</label>
                        <input value={editForm.image_url} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} className="admin-input" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Urutan</label>
                        <input type="number" value={editForm.order} onChange={e => setEditForm({ ...editForm, order: Number(e.target.value) })} className="admin-input" />
                      </div>
                      {error && <p className="text-red-400 text-xs">{error}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveEdit} disabled={saving} className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-900" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
                        Simpan
                      </button>
                      <button onClick={() => { setEditing(null); setError('') }} className="flex-1 py-2 rounded-xl text-xs text-slate-400" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-48 w-full bg-slate-900">
                      {c.image_url && (
                        <Image src={c.image_url} alt={c.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-slate-200 font-semibold mb-1 line-clamp-1">{c.title}</p>
                          <p className="text-slate-500 text-xs">Urutan: {c.order}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-slate-300 hover:text-sky-400 transition-all" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(c.id, c.title)} disabled={deleting === c.id} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .admin-input { width:100%; padding:8px 12px; background:rgba(7,15,30,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#e2e8f0; font-size:13px; outline:none; transition:border-color 0.2s; }
        .admin-input::placeholder { color:#475569; }
        .admin-input:focus { border-color:rgba(56,189,248,0.5); }
      `}</style>
    </div>
  )
}
