import React from 'react'
import { Globe } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'
import { SeoSettingsForm } from '../components/SeoSettingsForm'

export const DashboardPortalSeoView: React.FC = () => {
  const { profile, updateSeo, isLoading } = useBookingPortal()

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading SEO settings...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Globe className="w-6 h-6 text-sky-600 mr-2 rtl:ml-2" />
          SEO Metadata & Custom URL Slug Editor
        </h1>
        <p className="text-xs text-slate-500 mt-1">Customize search engine titles, meta descriptions, OpenGraph social sharing images, and your public URL slug.</p>
      </div>

      <SeoSettingsForm seo={profile.seo} publicSlug={profile.publicSlug} onSave={updateSeo} />
    </div>
  )
}
