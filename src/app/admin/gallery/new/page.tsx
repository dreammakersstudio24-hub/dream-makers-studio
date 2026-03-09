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
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/gallery" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm tracking-widest uppercase">Back to Gallery</span>
      </Link>
      
      <h1 className="text-3xl font-light mb-8 tracking-wide">Add New Image</h1>

      <div className="bg-neutral-900 border border-white/10 rounded-[2rem] p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-sm font-medium tracking-widest uppercase text-neutral-400">Image File</label>
            <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-2xl hover:border-white/30 transition-colors bg-black/50 aspect-video overflow-hidden">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                required 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                  <UploadCloud className="w-8 h-8 mb-4 group-hover:text-white transition-colors" />
                  <span className="text-xs tracking-widest uppercase bg-white/5 px-4 py-2 rounded-full">Select or drag image</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium tracking-widest uppercase text-neutral-400" htmlFor="title">Title</label>
              <input 
                id="title"
                name="title"
                type="text" 
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="e.g. Modern Living Room"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium tracking-widest uppercase text-neutral-400" htmlFor="style_category">Category</label>
              <input 
                id="style_category"
                name="style_category"
                type="text"
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="e.g. Living Room, Bathroom"
              />
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-white text-black rounded-full text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "UPLOADING..." : "SAVE & UPLOAD IMAGE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
