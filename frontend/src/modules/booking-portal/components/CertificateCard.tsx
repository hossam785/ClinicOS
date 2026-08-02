import React from 'react'
import { Award, ShieldCheck } from 'lucide-react'

interface CertificateCardProps {
  title: string
  issuer: string
  year?: string
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ title, issuer, year }) => {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3 rtl:space-x-reverse">
      <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
        <Award className="w-5 h-5" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <p className="text-xs text-slate-600">{issuer}</p>
        {year && <span className="text-[11px] text-slate-400 block">{year}</span>}
      </div>
    </div>
  )
}
