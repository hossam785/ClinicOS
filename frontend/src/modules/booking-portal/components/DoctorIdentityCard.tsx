import React from 'react'
import { GraduationCap, Globe, ShieldCheck } from 'lucide-react'
import type { IProfessionalInfo } from '../types/bookingPortal'

interface DoctorIdentityCardProps {
  info: IProfessionalInfo
  primaryColor?: string
}

export const DoctorIdentityCard: React.FC<DoctorIdentityCardProps> = ({ info }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-100 pb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Medical Credentials & Background</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Degrees & Board Credentials */}
        <div className="space-y-2">
          <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 mr-1.5 rtl:ml-1.5 text-indigo-600" />
            Medical Degrees
          </div>
          <ul className="space-y-1 text-sm text-slate-700">
            {info.degrees.map((deg, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 rtl:ml-2 shrink-0" />
                {deg}
              </li>
            ))}
          </ul>
        </div>

        {/* Sub-Specialties */}
        <div className="space-y-2">
          <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 mr-1.5 rtl:ml-1.5 text-emerald-600" />
            Sub-Specialties
          </div>
          <div className="flex flex-wrap gap-1.5">
            {info.subSpecialties.map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Spoken Languages */}
        <div className="space-y-2">
          <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Globe className="w-4 h-4 mr-1.5 rtl:ml-1.5 text-sky-600" />
            Languages Spoken
          </div>
          <div className="flex flex-wrap gap-1.5">
            {info.languages.map((lang, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-800 border border-sky-100"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
