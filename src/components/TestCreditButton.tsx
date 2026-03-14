'use client'

import { useState } from 'react'
import { addTestCredits } from '@/actions/credits'
import { Plus } from 'lucide-react'

export function TestCreditButton() {
  const [loading, setLoading] = useState(false)

  const handleAddCredits = async () => {
    setLoading(true)
    const result = await addTestCredits()
    if (result?.error) {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleAddCredits}
      disabled={loading}
      className={`w-full mt-4 bg-white/20 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-sm hover:bg-white/30 active:scale-95 transition-all text-sm tracking-wide disabled:opacity-50`}
    >
      <Plus className="w-4 h-4" />
      {loading ? 'Adding...' : 'Add 100 Test Credits'}
    </button>
  )
}
