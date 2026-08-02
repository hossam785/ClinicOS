import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Calendar, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDoctorFinancialsList } from '../hooks/useDoctorFinancials'
import { SettlementHeader } from '../components/SettlementHeader'
import { SettlementStatusBadge } from '../components/SettlementStatusBadge'
import type { SettlementStatus } from '../types/doctorFinancials'

export const SettlementDirectoryView: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | ''>('')
  const [doctorFilter, setDoctorFilter] = useState('')

  const { settlements, total, page, totalPages, setPage, loading, error, refresh } = useDoctorFinancialsList({
    search: search.trim() || undefined,
    status: statusFilter || undefined,
    doctorId: doctorFilter || undefined,
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <SettlementHeader
        title="Settlement Statements Directory"
        subtitle="Full roster of doctor commission statements and payment status tracking."
        onCreateNew={() => navigate('/dashboard/doctor-financials/create')}
        onRefresh={refresh}
      />

      {error && (
        <div className="p-4 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Full-text Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by code or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Doctors</option>
            <option value="doc-101">Dr. Sarah Jenkins</option>
            <option value="doc-102">Dr. Michael Chen</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SettlementStatus | '')}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid (Partial)</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Roster Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Settlement Code</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">Gross Revenue</th>
                <th className="py-3 px-4 text-right">Doctor Share</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading settlements directory...
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No settlement records found matching active filters.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{s.settlementNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-semibold text-slate-900">{s.doctorName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {s.settlementPeriod.startDate} to {s.settlementPeriod.endDate}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">{s.grossRevenue.toLocaleString()} EGP</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-indigo-700">{s.doctorShare.toLocaleString()} EGP</td>
                    <td className="py-3.5 px-4 text-right font-semibold">
                      <span className={s.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {s.outstandingBalance.toLocaleString()} EGP
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <SettlementStatusBadge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/doctor-financials/settlements/${s._id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{settlements.length}</strong> of <strong className="text-slate-900">{total}</strong> records
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
