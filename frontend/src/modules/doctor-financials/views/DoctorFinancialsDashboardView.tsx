import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Building2, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { useDoctorFinancialsDashboard } from '../hooks/useDoctorFinancials'
import { SettlementHeader } from '../components/SettlementHeader'
import { SettlementCard } from '../components/SettlementCard'

export const DoctorFinancialsDashboardView: React.FC = () => {
  const navigate = useNavigate()
  const { summary, loading, error, refresh } = useDoctorFinancialsDashboard()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <SettlementHeader
        title="Doctor Financial Accounts"
        subtitle="Manage doctor compensation, commission splits, and settlement disbursements."
        onCreateNew={() => navigate('/dashboard/doctor-financials/create')}
        onRefresh={refresh}
        onExport={() => navigate('/dashboard/doctor-financials/reports')}
      />

      {error && (
        <div className="p-4 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Doctor Earnings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Doctor Share YTD</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? '...' : `${(summary?.totalEarningsYtd || 0).toLocaleString()} EGP`}
          </div>
          <p className="text-xs text-slate-500 mt-1">Realized earnings across completed visits</p>
        </div>

        {/* KPI 2: Total Clinic Commission */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinic Share Retained</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? '...' : `${(summary?.totalClinicShareYtd || 0).toLocaleString()} EGP`}
          </div>
          <p className="text-xs text-slate-500 mt-1">Clinic revenue commission share</p>
        </div>

        {/* KPI 3: Outstanding Unsettled Balance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Disbursal</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {loading ? '...' : `${(summary?.pendingDisbursalBalance || 0).toLocaleString()} EGP`}
          </div>
          <p className="text-xs text-slate-500 mt-1">Unsettled doctor payouts pending</p>
        </div>

        {/* KPI 4: Recent Disbursed Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Payouts</span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? '...' : `${summary?.recentPaymentsCount || 0} Paid Statements`}
          </div>
          <p className="text-xs text-slate-500 mt-1">Reconciled financial statements</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Settlement Statements</h2>
            <p className="text-xs text-slate-500">Latest settlements generated across clinic branches</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/doctor-financials/settlements')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View All Settlements
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading settlement cards...</div>
        ) : summary?.recentSettlements.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No recent financial settlements found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary?.recentSettlements.map((settlement) => (
              <SettlementCard key={settlement._id} settlement={settlement} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
