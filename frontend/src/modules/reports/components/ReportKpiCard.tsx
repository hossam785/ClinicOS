// Report KPI Card Component — ClinicOS

import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  UserCheck,
  Bell,
  Activity,
} from 'lucide-react'

export interface ReportKpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  changeVsYesterday?: number
  currency?: string
  iconName: 'users' | 'calendar' | 'dollar' | 'briefcase' | 'userCheck' | 'bell' | 'activity'
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral'
  loading?: boolean
}

export const ReportKpiCard: React.FC<ReportKpiCardProps> = ({
  title,
  value,
  subtitle,
  changeVsYesterday,
  currency,
  iconName,
  variant = 'neutral',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-9 w-9 rounded-lg bg-slate-200" />
        </div>
        <div className="mt-4 h-8 w-24 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-36 rounded bg-slate-200" />
      </div>
    )
  }

  const renderIcon = () => {
    const className = 'h-5 w-5'
    switch (iconName) {
      case 'users':
        return <Users className={className} />
      case 'calendar':
        return <Calendar className={className} />
      case 'dollar':
        return <DollarSign className={className} />
      case 'briefcase':
        return <Briefcase className={className} />
      case 'userCheck':
        return <UserCheck className={className} />
      case 'bell':
        return <Bell className={className} />
      case 'activity':
      default:
        return <Activity className={className} />
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600',
          border: 'border-slate-200',
        }
      case 'success':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          border: 'border-slate-200',
        }
      case 'danger':
        return {
          iconBg: 'bg-rose-50 text-rose-600',
          border: 'border-slate-200',
        }
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
          border: 'border-slate-200',
        }
      case 'neutral':
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700',
          border: 'border-slate-200',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`rounded-xl border ${styles.border} bg-white p-5 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.iconBg}`}>{renderIcon()}</div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {currency ? `${currency} ${typeof value === 'number' ? value.toLocaleString() : value}` : value}
        </span>

        {changeVsYesterday !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              changeVsYesterday >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {changeVsYesterday >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(changeVsYesterday)}%
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
