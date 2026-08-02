import React, { useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import type { IDoctorGalleryItem } from '../types/bookingPortal'

interface PublicGalleryGridProps {
  gallery: IDoctorGalleryItem[]
}

export const PublicGalleryGrid: React.FC<PublicGalleryGridProps> = ({ gallery }) => {
  const [activeLightboxImage, setActiveLightboxImage] = useState<IDoctorGalleryItem | null>(null)

  if (!gallery || gallery.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-100 pb-3">
        <ImageIcon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">Clinic Gallery & Facilities</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div
            key={item.imageId}
            onClick={() => setActiveLightboxImage(item)}
            className="group relative h-48 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 transition-opacity" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white mb-1 inline-block">
                {item.imageType}
              </span>
              <p className="text-sm font-semibold truncate">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full text-center space-y-3">
            <img
              src={activeLightboxImage.imageUrl}
              alt={activeLightboxImage.title}
              className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-2xl object-contain"
            />
            <p className="text-lg font-medium text-white">{activeLightboxImage.title}</p>
          </div>
        </div>
      )}
    </section>
  )
}
