import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, DollarSign } from 'lucide-react'
import type { Settlement } from '../types/doctorFinancials'
import { SettlementStatusBadge } from './SettlementStatusBadge'

interface SettlementCardProps {
  settlement: Settlement
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ settlement }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold text-slate-500">{settlement.settlementNumber}</span>
          <SettlementStatusBadge status={settlement.status} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {settlement.doctorName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{settlement.doctorName}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <User className="w-3 h-3" />
              <span>{settlement.completedVisitsCount} Completed Visits</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-3 text-xs mb-4">
          <div>
            <span className="text-slate-500 block">Doctor Share</span>
            <span className="font-semibold text-slate-900">{settlement.doctorShare.toLocaleString()} EGP</span>
          </div>
          <div>
            <span className="text-slate-500 block">Outstanding</span>
            <span className={`font-semibold ${settlement.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {settlement.outstandingBalance.toLocaleString()} EGP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {settlement.settlementPeriod.startDate} to {settlement.settlementPeriod.endDate}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          <span>Gross: {settlement.grossRevenue.toLocaleString()} EGP</span>
        </div>
        <Link
          to={`/dashboard/doctor-financials/settlements/${settlement._id}`}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View Statement
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
