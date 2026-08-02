import React from 'react'
import { Star, Phone, MapPin, Calendar, Award } from 'lucide-react'
import type { IDoctorPublicProfile } from '../types/bookingPortal'

interface PublicHeroBannerProps {
  profile: IDoctorPublicProfile
  onBookClick: () => void
}

export const PublicHeroBanner: React.FC<PublicHeroBannerProps> = ({ profile, onBookClick }) => {
  const primaryColor = profile.branding.primaryColor || '#047857'

  return (
    <header className="relative bg-white shadow-sm border-b border-slate-200 overflow-hidden">
      {/* Cover Banner Image */}
      <div className="h-48 md:h-64 w-full relative bg-slate-900 overflow-hidden">
        {profile.branding.coverImage ? (
          <img
            src={profile.branding.coverImage}
            alt="Clinic Cover Banner"
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, #0F172A 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
          {/* Doctor Avatar */}
          <div className="relative">
            <img
              src={profile.branding.profileImage}
              alt={profile.doctorName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-lg bg-slate-100"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available Today" />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 text-center md:text-left rtl:md:text-right space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{profile.doctorName}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Practitioner
              </span>
            </div>
            <p className="text-sm md:text-base font-medium text-slate-600">{profile.doctorTitle}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {profile.clinicName} — {profile.contact.clinicAddress}
            </p>
          </div>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden md:flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`tel:${profile.contact.clinicPhone}`}
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2 rtl:ml-2 text-slate-500" />
              Call Clinic
            </a>
            <button
              onClick={onBookClick}
              style={{ backgroundColor: primaryColor }}
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
            >
              <Calendar className="w-4 h-4 mr-2 rtl:ml-2" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Quick Badges Roster */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-center md:text-left">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Patient Rating</span>
            <div className="flex items-center justify-center md:justify-start mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1 rtl:ml-1" />
              <span className="text-sm font-bold text-slate-900">{profile.rating}</span>
              <span className="text-xs text-slate-500 ml-1 rtl:mr-1">({profile.reviewCount})</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Experience</span>
            <div className="flex items-center justify-center md:justify-start mt-0.5">
              <Award className="w-4 h-4 text-indigo-500 mr-1 rtl:ml-1" />
              <span className="text-sm font-bold text-slate-900">{profile.professionalInfo.yearsOfExperience}+ Years</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Consultation Fee</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {profile.consultationFee} {profile.currency}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-500 block">Status</span>
            <span className="text-sm font-semibold text-emerald-700 mt-0.5 block">Online Booking Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
