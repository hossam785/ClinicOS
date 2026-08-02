import React from 'react'
import { Activity, Eye, Users, Calendar, TrendingUp } from 'lucide-react'
import type { IBookingAnalytics } from '../types/bookingPortal'

interface AnalyticsDashboardWidgetProps {
  analytics: IBookingAnalytics | null
}

export const AnalyticsDashboardWidget: React.FC<AnalyticsDashboardWidgetProps> = ({ analytics }) => {
  if (!analytics) {
    return <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-400">Loading analytics metrics...</div>
  }

  const { summary, topServices } = analytics

  return (
    <div className="space-y-6">
      {/* 4 Summary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Page Views</span>
            <Eye className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary.pageViews.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1" /> +12.4% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unique Visitors</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary.uniqueVisitors.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1" /> +8.1% unique reach
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Booking Requests</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary.bookingRequests.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1" /> High demand
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Conversion Rate</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{summary.conversionRate}%</p>
          <span className="text-[11px] text-slate-400">Visitor to booking conversion</span>
        </div>
      </div>

      {/* Top Booked Services Roster */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Top Booked Medical Services</h4>
        <div className="space-y-3">
          {topServices.map((srv, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-800">{srv.serviceTitle}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {srv.bookings} Bookings
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
