import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { notificationApi } from '../services/notificationApi'
import Loader from '@/design-system/components/Loader'

export const NotificationPreferencesView: React.FC = () => {
  const { preferences, loading: hookLoading } = useNotifications()

  const [enableAppointments, setEnableAppointments] = useState<boolean>(true)
  const [enableFinancials, setEnableFinancials] = useState<boolean>(true)
  const [enableAdministrative, setEnableAdministrative] = useState<boolean>(true)
  const [enableSystem, setEnableSystem] = useState<boolean>(true)

  const [saving, setSaving] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (preferences) {
      setEnableAppointments(preferences.enableAppointmentNotifications ?? true)
      setEnableFinancials(preferences.enableFinancialNotifications ?? true)
      setEnableAdministrative(preferences.enableAdministrativeNotifications ?? true)
      setEnableSystem(preferences.enableSystemNotifications ?? true)
    }
  }, [preferences])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      const response = await notificationApi.updatePreferences({
        enableAppointmentNotifications: enableAppointments,
        enableFinancialNotifications: enableFinancials,
        enableAdministrativeNotifications: enableAdministrative,
        enableSystemNotifications: enableSystem,
      })

      if (response.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 4000)
      }
    } catch (err: unknown) {
      console.error('Failed to update notification preferences:', err)
      const message = err instanceof Error ? err.message : 'Failed to update preferences.'
      setSaveError(message)
    } finally {
      setSaving(false)
    }
  }

  if (hookLoading && !preferences) {
    return (
      <div className="p-12 text-center">
        <Loader size="medium" />
        <p className="text-xs text-slate-500 mt-2">Loading preferences...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/dashboard/notifications"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Notification Center
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Notification Preferences</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure which category notifications are delivered to your desktop workspace.
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Critical Alert Exemption: </span>
          Critical priority alerts (e.g. database backup failures, license expiration, account security lockouts)
          bypass category toggles and are always delivered.
        </div>
      </div>

      {/* Save Status Banners */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Notification preferences saved successfully.
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-800 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {saveError}
        </div>
      )}

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            In-App Category Delivery Toggles
          </h3>

          {/* Toggle 1: Appointments */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Appointment Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Receive alerts for new appointment bookings, updates, cancellations, reschedules, and patient arrivals in the waiting room.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableAppointments}
                onChange={(e) => setEnableAppointments(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Toggle 2: Financials */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Financial Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Receive alerts for expense submissions requiring approval, disbursed payments, and doctor monthly financial settlement statements.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableFinancials}
                onChange={(e) => setEnableFinancials(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Toggle 3: Administrative */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Administrative Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Receive alerts for user provisioning, permission changes, role updates, and security lockout events.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableAdministrative}
                onChange={(e) => setEnableAdministrative(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Toggle 4: System */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800">System Infrastructure Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Receive alerts for automated database backup jobs, desktop offline synchronization status, and software updates.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enableSystem}
                onChange={(e) => setEnableSystem(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Future Channel Preferences (V2 Reservation) */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-700">
              Future External Delivery Channels (V2 Reservation)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
              V2 Extension Slot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 opacity-60">
              <span className="font-semibold text-slate-800 block">WhatsApp Integration</span>
              <span className="text-slate-400">Template messages to patient & doctor.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 opacity-60">
              <span className="font-semibold text-slate-800 block">SMS Gateway</span>
              <span className="text-slate-400">Mobile SMS text alerts.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 opacity-60">
              <span className="font-semibold text-slate-800 block">Email Summaries</span>
              <span className="text-slate-400">HTML email digests & statements.</span>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard/notifications"
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader size="small" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
