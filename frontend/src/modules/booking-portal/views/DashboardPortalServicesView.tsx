import React from 'react'
import { Stethoscope, Plus, Trash2 } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'

export const DashboardPortalServicesView: React.FC = () => {
  const { services, isLoading } = useBookingPortal()

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading services roster...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Stethoscope className="w-6 h-6 text-emerald-600 mr-2 rtl:ml-2" />
            Medical Services Catalog Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">Add, edit, or remove medical services offered on your public booking page.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-1.5 rtl:ml-1.5" />
          Add New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-bold">Service Title</th>
              <th className="p-4 font-bold">Duration</th>
              <th className="p-4 font-bold">Consultation Fee</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right rtl:text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {services.map((srv) => (
              <tr key={srv.serviceId} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-slate-900 block">{srv.title}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{srv.description}</span>
                </td>
                <td className="p-4 font-medium text-slate-700">{srv.duration} Mins</td>
                <td className="p-4 font-bold text-emerald-700">
                  {srv.consultationFee} {srv.currency}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </td>
                <td className="p-4 text-right rtl:text-left">
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors" title="Delete Service">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
