import React from 'react'
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'

export const DashboardPortalGalleryView: React.FC = () => {
  const { gallery, isLoading } = useBookingPortal()

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading clinic gallery...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <ImageIcon className="w-6 h-6 text-indigo-600 mr-2 rtl:ml-2" />
            Clinic Gallery & Credentials Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">Upload high-resolution facility photos, reception lounges, and medical board degrees.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
          <Upload className="w-4 h-4 mr-1.5 rtl:ml-1.5" />
          Upload Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((img) => (
          <div key={img.imageId} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-2 pb-3">
            <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
              <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                {img.imageType}
              </span>
            </div>
            <div className="px-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 truncate">{img.title}</span>
              <button className="text-slate-400 hover:text-rose-600 p-1" title="Delete Image">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
