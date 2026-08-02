import React, { useState } from 'react'
import { Globe, Save, Check, ExternalLink } from 'lucide-react'
import type { ISeoSettings } from '../types/bookingPortal'

interface SeoSettingsFormProps {
  seo: ISeoSettings
  publicSlug: string
  onSave: (seo: ISeoSettings) => Promise<unknown>
}

export const SeoSettingsForm: React.FC<SeoSettingsFormProps> = ({ seo, publicSlug, onSave }) => {
  const [formData, setFormData] = useState<ISeoSettings>({ ...seo })
  const [slug, setSlug] = useState(publicSlug)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Globe className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-bold text-slate-900">SEO & Custom Public URL Slug</h3>
        </div>
        {isSaved && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <Check className="w-3.5 h-3.5 mr-1 rtl:ml-1 text-emerald-600" /> SEO Saved
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Custom Slug Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Custom Public URL Slug
          </label>
          <div className="flex rounded-lg shadow-xs border border-slate-300 overflow-hidden">
            <span className="inline-flex items-center px-3 text-xs text-slate-500 bg-slate-100 border-r border-slate-300">
              https://clinic.com/book/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="flex-1 px-3 py-2 text-xs font-mono text-slate-900 outline-none"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Only lowercase letters, numbers, and hyphens.</span>
        </div>

        {/* SEO Meta Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Page Meta Title</label>
          <input
            type="text"
            value={formData.seoTitle}
            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Page Meta Description</label>
          <textarea
            rows={3}
            value={formData.seoDescription}
            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>

        {/* Search Result Live Preview Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Search Engine Result Snippet Preview
          </span>
          <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer flex items-center">
            {formData.seoTitle} <ExternalLink className="w-3.5 h-3.5 ml-1 text-blue-500" />
          </p>
          <p className="text-xs text-emerald-700">https://clinic.com/book/{slug}</p>
          <p className="text-xs text-slate-600 line-clamp-2">{formData.seoDescription}</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center"
      >
        <Save className="w-4 h-4 mr-2 rtl:ml-2" />
        Save SEO Metadata
      </button>
    </form>
  )
}
