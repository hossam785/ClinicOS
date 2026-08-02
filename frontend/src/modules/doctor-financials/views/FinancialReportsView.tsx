import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Download, ArrowLeft, Filter } from 'lucide-react'

export const FinancialReportsView: React.FC = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY')
  const [selectedDoctor, setSelectedDoctor] = useState('ALL')

  const reportData = [
    {
      doctorId: 'doc-101',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Cardiology',
      completedVisits: 63,
      grossRevenue: 52500,
      doctorShare: 31500,
      clinicShare: 21000,
      paidAmount: 31500,
      outstanding: 0,
    },
    {
      doctorId: 'doc-102',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      completedVisits: 22,
      grossRevenue: 19800,
      doctorShare: 11880,
      clinicShare: 7920,
      paidAmount: 5000,
      outstanding: 6880,
    },
  ]

  const filteredData = selectedDoctor === 'ALL' ? reportData : reportData.filter((d) => d.doctorId === selectedDoctor)

  const totalGross = filteredData.reduce((sum, d) => sum + d.grossRevenue, 0)
  const totalDoctorShare = filteredData.reduce((sum, d) => sum + d.doctorShare, 0)
  const totalClinicShare = filteredData.reduce((sum, d) => sum + d.clinicShare, 0)
  const totalOutstanding = filteredData.reduce((sum, d) => sum + d.outstanding, 0)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard/doctor-financials')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <button
          type="button"
          onClick={() => alert('Exporting Doctor Financial Statement Report (CSV/PDF)...')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Financial Report
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Financial Analytics & Reports</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Earnings & Commission Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed breakdown of consultation gross revenues, doctor earnings splits, and clinic retained commissions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Report Controls:</span>

          <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setPeriod('MONTHLY')}
              className={`px-3 py-1.5 font-medium ${period === 'MONTHLY' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              July 2026 (Monthly)
            </button>
            <button
              type="button"
              onClick={() => setPeriod('ANNUAL')}
              className={`px-3 py-1.5 font-medium ${period === 'ANNUAL' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              2026 (Annual YTD)
            </button>
          </div>
        </div>

        <div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">All Clinic Doctors</option>
            <option value="doc-101">Dr. Sarah Jenkins</option>
            <option value="doc-102">Dr. Michael Chen</option>
          </select>
        </div>
      </div>

      {/* KPI Totals Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Total Gross Revenue</span>
          <span className="text-xl font-bold text-slate-900">{totalGross.toLocaleString()} EGP</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-indigo-600 font-semibold block mb-1">Total Doctor Share (60%)</span>
          <span className="text-xl font-bold text-indigo-700">{totalDoctorShare.toLocaleString()} EGP</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Total Clinic Retained</span>
          <span className="text-xl font-bold text-slate-900">{totalClinicShare.toLocaleString()} EGP</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-amber-600 font-semibold block mb-1">Outstanding Pending Payout</span>
          <span className="text-xl font-bold text-amber-600">{totalOutstanding.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Report Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Doctor Performance Breakdown Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <th className="py-2.5 px-3">Doctor</th>
                <th className="py-2.5 px-3">Specialty</th>
                <th className="py-2.5 px-3 text-right">Completed Visits</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                <th className="py-2.5 px-3 text-right">Doctor Share</th>
                <th className="py-2.5 px-3 text-right">Clinic Share</th>
                <th className="py-2.5 px-3 text-right">Paid Amount</th>
                <th className="py-2.5 px-3 text-right">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map((d) => (
                <tr key={d.doctorId} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">{d.doctorName}</td>
                  <td className="py-3 px-3 text-slate-500">{d.specialty}</td>
                  <td className="py-3 px-3 text-right font-medium">{d.completedVisits}</td>
                  <td className="py-3 px-3 text-right font-medium">{d.grossRevenue.toLocaleString()} EGP</td>
                  <td className="py-3 px-3 text-right font-semibold text-indigo-700">{d.doctorShare.toLocaleString()} EGP</td>
                  <td className="py-3 px-3 text-right text-slate-600">{d.clinicShare.toLocaleString()} EGP</td>
                  <td className="py-3 px-3 text-right text-emerald-600 font-medium">{d.paidAmount.toLocaleString()} EGP</td>
                  <td className="py-3 px-3 text-right font-semibold">
                    <span className={d.outstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {d.outstanding.toLocaleString()} EGP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
