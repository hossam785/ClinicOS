import React from 'react'
import { UserCheck, Building2 } from 'lucide-react'
import type { IPublicContent } from '../types/bookingPortal'

interface AboutDoctorSectionProps {
  content: IPublicContent
}

export const AboutDoctorSection: React.FC<AboutDoctorSectionProps> = ({ content }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">About the Doctor</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{content.aboutDoctor}</p>
      </div>

      {content.aboutClinic && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">About the Facility</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{content.aboutClinic}</p>
        </div>
      )}
    </section>
  )
}
