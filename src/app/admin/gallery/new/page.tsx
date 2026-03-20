'use client'

import { addGalleryItem } from "@/actions/gallery"
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function NewGalleryItemPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const res = await addGalleryItem(formData) 
      
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      } else {
        router.push('/admin/gallery')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/admin/gallery" className="inline-flex items-center gap-3 text-white/30 hover:text-white transition-all mb-10 group">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Back to Gallery</span>
      </Link>
      
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Add New Vision</h1>
        <p className="text-xs text-white/40 font-medium uppercase tracking-[0.2em]">Manual Architectural Curation</p>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <label className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block ml-2">Proprietary Asset</label>
            <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-[2.5rem] hover:border-white/30 transition-all bg-black/40 aspect-video overflow-hidden shadow-inner">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                required 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 transition-all group-hover:text-white/40">
                  <UploadCloud className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 px-6 py-2.5 rounded-full border border-white/10">Select Visual Asset</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block ml-2" htmlFor="title">Vision Title</label>
              <input 
                id="title"
                name="title"
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm font-medium tracking-tight"
                placeholder="e.g. Midnight Onyx Kitchen"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block ml-2" htmlFor="style_category">Category</label>
              <input 
                id="style_category"
                name="style_category"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm font-medium tracking-tight"
                placeholder="e.g. Modern, Minimalist"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block ml-2" htmlFor="keywords">Hashtags / Keywords</label>
            <input 
              id="keywords"
              name="keywords"
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm font-medium tracking-tight"
              placeholder="#modern, livingroom, luxury (comma separated)"
            />
            <p className="text-[9px] text-white/20 uppercase tracking-widest ml-2 px-1">Used for deep search indexing and cross-vision relations.</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block ml-2" htmlFor="description">Narrative Description</label>
            <textarea 
              id="description"
              name="description"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm font-medium tracking-tight resize-none"
              placeholder="Describe the architectural soul of this vision..."
            />
          </div>
          
          <div className="pt-10 border-t border-white/5 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-12 py-5 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all flex items-center gap-3 disabled:opacity-50 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-white/20"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Synthesizing..." : "Archive Vision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
