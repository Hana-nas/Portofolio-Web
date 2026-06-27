'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminSidebar } from '../AdminSidebar'

type Skill = {
  id: string
  category: string
  description: string | null
  icons: { name: string; color: string }[]
  order: number
}

type EditState = {
  category: string
  description: string
  iconsJson: string
  order: number
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ category: '', description: '', iconsJson: '[]', order: 0 })
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState<EditState>({ category: '', description: '', iconsJson: '[{"name":"JS","color":"#F7DF1E"}]', order: 0 })
  const [saving, setSaving] = useState(false)
  const [jsonError, setJsonError] = useState('')

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/skills')
    const data = await res.json()
    setSkills(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  async function handleDelete(id: string, cat: string) {
    if (!confirm(`Hapus skill "${cat}"?`)) return
    setDeleting(id)
    await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    await fetchSkills()
    setDeleting(null)
  }

  function startEdit(s: Skill) {
    setEditing(s.id)
    setEditForm({ category: s.category, description: s.description || '', iconsJson: JSON.stringify(s.icons, null, 2), order: s.order })
    setJsonError('')
  }

  async function handleSaveEdit() {
    setSaving(true)
    setJsonError('')
    let icons
    try { icons = JSON.parse(editForm.iconsJson) } catch { setJsonError('Format JSON icons tidak valid'); setSaving(false); return }

    const res = await fetch(`/api/skills/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, icons }),
    })
    if (!res.ok) { const d = await res.json(); setJsonError(d.error); setSaving(false); return }
    setEditing(null)
    await fetchSkills()
    setSaving(false)
  }

  async function handleAddNew() {
    setSaving(true)
    setJsonError('')
    let icons
    try { icons = JSON.parse(newForm.iconsJson) } catch { setJsonError('Format JSON icons tidak valid'); setSaving(false); return }

    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newForm, icons }),
    })
    if (!res.ok) { const d = await res.json(); setJsonError(d.error); setSaving(false); return }
    setAdding(false)
    setNewForm({ category: '', description: '', iconsJson: '[{"name":"JS","color":"#F7DF1E"}]', order: 0 })
    await fetchSkills()
    setSaving(false)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-100 mb-1">Skills</h1>
            <p className="text-slate-400 text-sm">{skills.length} kategori tersimpan</p>
          </div>
          <button onClick={() => { setAdding(true); setJsonError('') }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Skill
          </button>
        </div>

        {/* Add Form */}
        {adding && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <h3 className="text-slate-200 font-semibold mb-4">Tambah Skill Baru</h3>
            <SkillForm form={newForm} setForm={setNewForm} jsonError={jsonError} />
            <div className="flex gap-3 mt-4">
              <button onClick={handleAddNew} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-900" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={() => { setAdding(false); setJsonError('') }} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>Batal</button>
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Memuat...</div>
          ) : skills.map(s => (
            <div key={s.id} className="rounded-2xl p-5" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {editing === s.id ? (
                <div>
                  <SkillForm form={editForm} setForm={setEditForm} jsonError={jsonError} />
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSaveEdit} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-900" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button onClick={() => { setEditing(null); setJsonError('') }} className="px-5 py-2 rounded-xl text-sm text-slate-400" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>Batal</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1.5">
                        {s.icons.map((ic, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ color: ic.color, background: ic.color + '22', border: `1px solid ${ic.color}44` }}>{ic.name}</span>
                        ))}
                      </div>
                      <span className="text-slate-600 text-xs">#{s.order}</span>
                    </div>
                    <h3 className="text-slate-200 font-semibold">{s.category}</h3>
                    {s.description && <p className="text-slate-500 text-sm mt-1">{s.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-sky-400 transition-all" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id, s.category)} disabled={deleting === s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .admin-input { width:100%; padding:10px 14px; background:rgba(7,15,30,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:#e2e8f0; font-size:14px; outline:none; transition:border-color 0.2s; }
        .admin-input::placeholder { color:#475569; }
        .admin-input:focus { border-color:rgba(56,189,248,0.5); }
      `}</style>
    </div>
  )
}

function SkillForm({ form, setForm, jsonError }: { form: EditState; setForm: (f: EditState) => void; jsonError: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Kategori *</label>
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="admin-input" placeholder="Front-End Development" />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Urutan</label>
        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="admin-input w-24" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs text-slate-400 mb-1">Deskripsi</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="admin-input resize-none" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs text-slate-400 mb-1">Icons (JSON Array)</label>
        <textarea value={form.iconsJson} onChange={e => setForm({ ...form, iconsJson: e.target.value })} rows={4} className="admin-input resize-none font-mono text-xs"
          placeholder='[{"name":"HTML","color":"#E34F26"},{"name":"JS","color":"#F7DF1E"}]' />
        {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
        <p className="text-slate-600 text-xs mt-1">Format: {`[{"name":"JS","color":"#F7DF1E"}]`}</p>
      </div>
    </div>
  )
}
