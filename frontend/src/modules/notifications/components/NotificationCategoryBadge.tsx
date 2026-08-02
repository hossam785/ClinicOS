import React from 'react'
import {
  Calendar,
  User,
  FileText,
  Pill,
  DollarSign,
  Server,
  ShieldAlert,
} from 'lucide-react'
import type { NotificationCategory } from '../types/notification'

interface NotificationCategoryBadgeProps {
  category: NotificationCategory
  className?: string
}

export const NotificationCategoryBadge: React.FC<NotificationCategoryBadgeProps> = ({ category, className = '' }) => {
  switch (category) {
    case 'APPOINTMENT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 ${className}`}
        >
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          Appointments
        </span>
      )
    case 'PATIENT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          <User className="w-3.5 h-3.5 text-emerald-600" />
          Patients
        </span>
      )
    case 'MEDICAL_RECORD':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          Medical Records
        </span>
      )
    case 'PRESCRIPTION':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 ${className}`}
        >
          <Pill className="w-3.5 h-3.5 text-purple-600" />
          Prescriptions
        </span>
      )
    case 'FINANCIAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 ${className}`}
        >
          <DollarSign className="w-3.5 h-3.5 text-teal-600" />
          Financials
        </span>
      )
    case 'SYSTEM':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          <Server className="w-3.5 h-3.5 text-amber-600" />
          System
        </span>
      )
    case 'ADMINISTRATIVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Administrative
        </span>
      )
    default:
      return null
  }
}
