import React, { useEffect } from 'react'
import { Activity } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'
import { AnalyticsDashboardWidget } from '../components/AnalyticsDashboardWidget'

export const DashboardPortalAnalyticsView: React.FC = () => {
  const { analytics, loadAnalytics } = useBookingPortal()

  useEffect(() => {
    loadAnalytics('2026-08')
  }, [loadAnalytics])

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Activity className="w-6 h-6 text-amber-600 mr-2 rtl:ml-2" />
          Public Booking Portal Conversion Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">Track monthly page views, unique visitors, total booking requests, and visitor conversion rates.</p>
      </div>

      <AnalyticsDashboardWidget analytics={analytics} />
    </div>
  )
}
