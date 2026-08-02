import React from 'react'
import { Stethoscope, Activity, Clock, Calendar } from 'lucide-react'
import type { IDoctorService } from '../types/bookingPortal'

interface PublicServiceCardProps {
  service: IDoctorService
  primaryColor?: string
  onBookService: (service: IDoctorService) => void
}

export const PublicServiceCard: React.FC<PublicServiceCardProps> = ({ service, primaryColor = '#047857', onBookService }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-indigo-600" />
      case 'Clock':
        return <Clock className="w-5 h-5 text-sky-600" />
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-600" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">{getIconComponent(service.icon)}</div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
            {service.duration} mins
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{service.description}</p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block">Consultation Fee</span>
          <span className="text-base font-bold text-slate-900">
            {service.consultationFee} {service.currency}
          </span>
        </div>

        <button
          onClick={() => onBookService(service)}
          style={{ backgroundColor: primaryColor }}
          className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5" />
          Book Service
        </button>
      </div>
    </div>
  )
}
