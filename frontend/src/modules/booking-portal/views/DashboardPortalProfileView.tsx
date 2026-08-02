import React, { useState } from 'react'
import { User, Save, Check } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'

export const DashboardPortalProfileView: React.FC = () => {
  const { profile, reload, isLoading } = useBookingPortal()
  const [isSaved, setIsSaved] = useState(false)

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading profile editor...</div>
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
    reload()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <User className="w-6 h-6 text-indigo-600 mr-2 rtl:ml-2" />
            Doctor Profile & Bio Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage public doctor title, biography, languages, and clinic contact information.</p>
        </div>
        {isSaved && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 mr-1.5 rtl:ml-1.5 text-emerald-600" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Doctor Name</label>
            <input
              type="text"
              defaultValue={profile.doctorName}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title</label>
            <input
              type="text"
              defaultValue={profile.doctorTitle}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Default Consultation Fee (EGP)</label>
            <input
              type="number"
              defaultValue={profile.consultationFee}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              defaultValue={profile.professionalInfo.yearsOfExperience}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Biography (Public)</label>
          <textarea
            rows={4}
            defaultValue={profile.publicContent.aboutDoctor}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Description (Public)</label>
          <textarea
            rows={3}
            defaultValue={profile.publicContent.aboutClinic}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
          />
        </div>

        <button
          type="submit"
          className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2 rtl:ml-2" />
          Save Profile Updates
        </button>
      </form>
    </div>
  )
}
