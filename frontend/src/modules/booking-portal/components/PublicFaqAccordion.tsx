import React, { useState } from 'react'
import { HelpCircle, ChevronRight } from 'lucide-react'
import type { IDoctorFaq } from '../types/bookingPortal'

interface PublicFaqAccordionProps {
  faqs: IDoctorFaq[]
}

export const PublicFaqAccordion: React.FC<PublicFaqAccordionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs.length > 0 ? faqs[0].faqId : null)

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-100 pb-3">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => {
          const isOpen = openId === faq.faqId
          return (
            <div key={faq.faqId} className="border border-slate-200 rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => setOpenId(isOpen ? null : faq.faqId)}
                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left rtl:text-right font-semibold text-sm text-slate-900 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 py-3 bg-white text-xs leading-relaxed text-slate-600 border-t border-slate-200">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
