import React from 'react'
import { Percent, DollarSign, Layers } from 'lucide-react'
import type { CompensationModel } from '../types/doctorFinancials'

interface CompensationBadgeProps {
  model: CompensationModel
  percentage?: number
  fixedFee?: number
}

export const CompensationBadge: React.FC<CompensationBadgeProps> = ({ model, percentage, fixedFee }) => {
  if (model === 'PERCENTAGE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
        <Percent className="w-3 h-3 text-indigo-500" />
        {percentage || 60}% Revenue Share
      </span>
    )
  }
  if (model === 'FIXED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200">
        <DollarSign className="w-3 h-3 text-purple-500" />
        {fixedFee || 500} EGP / Visit
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Layers className="w-3 h-3 text-emerald-500" />
      Hybrid Contract
    </span>
  )
}
