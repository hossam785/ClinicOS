import React from 'react'
import { Sparkles } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'
import { BrandingTokenEditor } from '../components/BrandingTokenEditor'
import { LiveMobilePreviewSimulator } from '../components/LiveMobilePreviewSimulator'

export const DashboardPortalBrandingView: React.FC = () => {
  const { profile, updateBranding, isLoading } = useBookingPortal()

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading branding editor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Sparkles className="w-6 h-6 text-emerald-600 mr-2 rtl:ml-2" />
          Public Portal Branding & Theme Editor
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your public landing page cover photo, avatar, and color theme tokens. Live mobile preview simulator updates instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <BrandingTokenEditor branding={profile.branding} onSave={updateBranding} />
        </div>

        <div className="lg:col-span-5 bg-slate-100/80 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Live Mobile Simulator Preview
          </span>
          <LiveMobilePreviewSimulator profile={profile} />
        </div>
      </div>
    </div>
  )
}
