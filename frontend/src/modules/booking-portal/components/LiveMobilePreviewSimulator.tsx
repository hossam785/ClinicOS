import React from 'react'
import type { IDoctorPublicProfile } from '../types/bookingPortal'

interface LiveMobilePreviewSimulatorProps {
  profile: IDoctorPublicProfile
}

export const LiveMobilePreviewSimulator: React.FC<LiveMobilePreviewSimulatorProps> = ({ profile }) => {
  const primaryColor = profile.branding.primaryColor || '#047857'

  return (
    <div className="w-full max-w-[320px] mx-auto h-[600px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
      {/* Mobile Speaker Notch */}
      <div className="w-28 h-4 bg-slate-950 rounded-b-xl mx-auto shrink-0 z-20 mb-2" />

      {/* Screen Frame */}
      <div className="bg-slate-50 flex-1 rounded-[24px] overflow-y-auto relative text-left rtl:text-right font-sans text-slate-800 border border-slate-300 shadow-inner select-none">
        {/* Cover Photo Preview */}
        <div className="h-24 w-full bg-slate-800 relative overflow-hidden">
          {profile.branding.coverImage ? (
            <img src={profile.branding.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: primaryColor }} />
          )}
        </div>

        {/* Profile Card */}
        <div className="px-3 pt-0 pb-3 relative -mt-8 text-center">
          <img
            src={profile.branding.profileImage}
            alt={profile.doctorName}
            className="w-16 h-16 rounded-full border-2 border-white mx-auto object-cover shadow-sm bg-white"
          />
          <h4 className="text-xs font-bold text-slate-900 mt-1">{profile.doctorName}</h4>
          <p className="text-[10px] text-slate-500">{profile.doctorTitle}</p>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            {profile.consultationFee} {profile.currency}
          </span>
        </div>

        {/* Services Catalog Preview */}
        <div className="px-3 space-y-2 mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Services</span>
          <div className="bg-white p-2 rounded-lg border border-slate-200 text-left">
            <span className="text-xs font-bold text-slate-900 block">Cardiology Visit</span>
            <span className="text-[10px] text-slate-500">30 mins &bull; 350 EGP</span>
          </div>
        </div>

        {/* Mobile Action Bar Preview */}
        <div className="sticky bottom-0 inset-x-0 bg-white p-2 border-t border-slate-200 shadow-md">
          <button
            style={{ backgroundColor: primaryColor }}
            className="w-full py-2 rounded-lg text-xs font-bold text-white shadow-xs"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  )
}
