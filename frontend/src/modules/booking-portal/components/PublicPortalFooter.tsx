import React from 'react'

interface PublicPortalFooterProps {
  clinicName: string
}

export const PublicPortalFooter: React.FC<PublicPortalFooterProps> = ({ clinicName }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <p className="font-semibold text-slate-200">{clinicName} — Online Patient Booking Portal</p>
        <p className="text-slate-500">
          Powered by <span className="text-emerald-400 font-bold">ClinicOS</span> Medical Infrastructure. All Rights Reserved &copy; {new Date().getFullYear()}.
        </p>
        <div className="flex justify-center space-x-4 rtl:space-x-reverse text-slate-500 text-[11px] pt-2">
          <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
          <span>&bull;</span>
          <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
          <span>&bull;</span>
          <a href="#accessibility" className="hover:text-slate-300">Accessibility Standard</a>
        </div>
      </div>
    </footer>
  )
}
