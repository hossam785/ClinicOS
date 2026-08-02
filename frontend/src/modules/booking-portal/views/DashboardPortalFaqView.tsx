import React from 'react'
import { HelpCircle, Plus, Trash2 } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'

export const DashboardPortalFaqView: React.FC = () => {
  const { faqs, isLoading } = useBookingPortal()

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading FAQs builder...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <HelpCircle className="w-6 h-6 text-sky-600 mr-2 rtl:ml-2" />
            Frequently Asked Questions Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create expandable question and answer accordions to inform patients about clinic policies.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-1.5 rtl:ml-1.5" />
          Add New FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.faqId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
            <button className="text-slate-400 hover:text-rose-600 p-1 shrink-0 ml-4 rtl:mr-4" title="Delete FAQ">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
