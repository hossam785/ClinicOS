// AI Safety Disclaimer Banner Component — Module-017

import { AlertCircle } from 'lucide-react'

export function AISafetyDisclaimerBanner() {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span>
          <b>Clinical Decision Support Only:</b> Offline AI Assistant does not diagnose patients or prescribe medication. The licensed physician retains 100% clinical authority.
        </span>
      </div>
      <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded flex-shrink-0">
        Read-Only Scoping
      </span>
    </div>
  )
}
