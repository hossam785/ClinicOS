import React from 'react'
import { User, Wallet, DollarSign, Clock, Download } from 'lucide-react'
import { useDoctorFinancialAccountSummary, useDoctorFinancialsList } from '../hooks/useDoctorFinancials'
import { SettlementStatusBadge } from '../components/SettlementStatusBadge'

export const DoctorFinancialPortalView: React.FC = () => {
  const currentDoctorId = 'doc-101' // Doctor self context
  const { account, loading: accountLoading } = useDoctorFinancialAccountSummary(currentDoctorId)
  const { settlements, loading: listLoading } = useDoctorFinancialsList({ doctorId: currentDoctorId })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Portal Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
          <User className="w-4 h-4" />
          <span>Doctor Self-Service Financial Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">My Financial Account & Earnings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your realized consultation earnings, payout history, and download settlement statements.
        </p>
      </div>

      {/* Doctor Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Realized Earnings</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {accountLoading ? '...' : `${(account?.totalRealizedEarnings || 0).toLocaleString()} EGP`}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Contract: {account?.compensationPercentage || 60}% Revenue Split</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Disbursed Paid</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {accountLoading ? '...' : `${(account?.totalDisbursedPaid || 0).toLocaleString()} EGP`}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Payouts received to date</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unsettled Pending Balance</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {accountLoading ? '...' : `${(account?.unsettledBalance || 0).toLocaleString()} EGP`}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Awaiting next payout disbursement</span>
        </div>
      </div>

      {/* Settlement Statements Roster */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Settlement Statements History</h2>
          <span className="text-xs text-slate-500">{settlements.length} Statements Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <th className="py-2.5 px-3">Statement Code</th>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Visits</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                <th className="py-2.5 px-3 text-right">My Share (60%)</th>
                <th className="py-2.5 px-3 text-right">Outstanding</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {listLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading your statements...
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No settlement statements found.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">{s.settlementNumber}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {s.settlementPeriod.startDate} to {s.settlementPeriod.endDate}
                    </td>
                    <td className="py-3 px-3 text-right font-medium">{s.completedVisitsCount}</td>
                    <td className="py-3 px-3 text-right font-medium">{s.grossRevenue.toLocaleString()} EGP</td>
                    <td className="py-3 px-3 text-right font-semibold text-indigo-700">{s.doctorShare.toLocaleString()} EGP</td>
                    <td className="py-3 px-3 text-right font-semibold">
                      <span className={s.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {s.outstandingBalance.toLocaleString()} EGP
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <SettlementStatusBadge status={s.status} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Downloading PDF Statement for ${s.settlementNumber}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
