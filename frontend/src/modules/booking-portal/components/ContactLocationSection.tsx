import React from 'react'
import { MapPin, Phone, ExternalLink } from 'lucide-react'
import type { IClinicContact } from '../types/bookingPortal'

interface ContactLocationSectionProps {
  contact: IClinicContact
  clinicName: string
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({ contact, clinicName }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-100 pb-3">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-900">Location & Directions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-4 md:col-span-1">
          <div>
            <h3 className="text-base font-bold text-slate-900">{clinicName}</h3>
            <p className="text-xs text-slate-600 mt-1">{contact.clinicAddress}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href={`tel:${contact.clinicPhone}`}
              className="flex items-center text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600 mr-2 rtl:ml-2" />
              {contact.clinicPhone}
            </a>

            <a
              href={contact.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5" />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Google Maps Container Placeholder / Embed */}
        <div className="md:col-span-2 h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
          <div className="text-center p-4 space-y-2">
            <MapPin className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-xs font-semibold text-slate-700">{contact.clinicAddress}</p>
            <span className="text-[11px] text-slate-500 block">Interactive Google Maps Embed Area</span>
          </div>
        </div>
      </div>
    </section>
  )
}
