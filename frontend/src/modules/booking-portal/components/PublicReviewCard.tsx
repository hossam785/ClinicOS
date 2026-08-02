import React from 'react'
import { Star, ShieldCheck } from 'lucide-react'
import type { IDoctorReview } from '../types/bookingPortal'

interface PublicReviewCardProps {
  review: IDoctorReview
}

export const PublicReviewCard: React.FC<PublicReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${
                idx < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-400">
          {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed italic">"{review.reviewText}"</p>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-900">{review.patientName}</span>
        <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          <ShieldCheck className="w-3 h-3 mr-1 rtl:ml-1 text-emerald-600" />
          Verified Patient
        </span>
      </div>
    </div>
  )
}
