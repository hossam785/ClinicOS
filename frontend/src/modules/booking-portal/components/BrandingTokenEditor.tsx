import React, { useState } from 'react'
import { Sparkles, Image as ImageIcon, Save, Check } from 'lucide-react'
import type { IBrandingTokens } from '../types/bookingPortal'

interface BrandingTokenEditorProps {
  branding: IBrandingTokens
  onSave: (branding: IBrandingTokens) => Promise<unknown>
}

const PRESET_COLORS = [
  { name: 'Emerald', hex: '#047857' },
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Purple', hex: '#6D28D9' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Slate Dark', hex: '#0F172A' },
]

export const BrandingTokenEditor: React.FC<BrandingTokenEditorProps> = ({ branding, onSave }) => {
  const [formData, setFormData] = useState<IBrandingTokens>({ ...branding })
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(formData)
    setIsSaving(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Visual Branding & Color Tokens</h3>
        </div>
        {isSaved && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <Check className="w-3.5 h-3.5 mr-1 rtl:ml-1 text-emerald-600" /> Saved Live
          </span>
        )}
      </div>

      {/* Color Presets Picker */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Primary Accent Color Theme
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setFormData({ ...formData, primaryColor: c.hex })}
              className={`flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                formData.primaryColor === c.hex ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full mr-2 rtl:ml-2 shadow-xs" style={{ backgroundColor: c.hex }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Color Hex</label>
          <input
            type="text"
            value={formData.primaryColor}
            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Secondary Color Hex</label>
          <input
            type="text"
            value={formData.secondaryColor}
            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Accent Highlight Hex</label>
          <input
            type="text"
            value={formData.accentColor}
            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none"
          />
        </div>
      </div>

      {/* Image URLs */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-slate-500" /> Cover Banner Image URL
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-slate-500" /> Doctor Avatar Image URL
          </label>
          <input
            type="url"
            value={formData.profileImage}
            onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center"
      >
        <Save className="w-4 h-4 mr-2 rtl:ml-2" />
        {isSaving ? 'Publishing Branding Updates...' : 'Publish Branding Updates'}
      </button>
    </form>
  )
}
