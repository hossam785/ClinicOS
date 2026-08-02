// Report Accessible Dynamic SVG Chart Component — ClinicOS

import React from 'react'

export interface ChartDataPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface ReportChartWidgetProps {
  title: string
  subtitle?: string
  type: 'line' | 'bar' | 'donut'
  data: ChartDataPoint[]
  primaryColor?: string
  secondaryColor?: string
  height?: number
  loading?: boolean
  currency?: string
}

export const ReportChartWidget: React.FC<ReportChartWidgetProps> = ({
  title,
  subtitle,
  type,
  data,
  primaryColor = '#4F46E5', // Indigo-600
  secondaryColor = '#F43F5E', // Rose-500
  height = 240,
  loading = false,
  currency,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-60 rounded bg-slate-200" />
        <div className="mt-6 flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full rounded-t bg-slate-200" style={{ height: `${(i + 1) * 15}%` }} />
          ))}
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)), 1)

  const renderLineChart = () => {
    const svgWidth = 500
    const svgHeight = height
    const padding = 30
    const chartWidth = svgWidth - padding * 2
    const chartHeight = svgHeight - padding * 2

    const points = data.map((d, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth
      const y = svgHeight - padding - (d.value / maxValue) * chartHeight
      return { x, y, ...d }
    })

    const pathD = points.reduce((acc, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
    }, '')

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full text-slate-400">
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = svgHeight - padding - pct * chartHeight
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {Math.round(pct * maxValue)}
                </text>
              </g>
            )
          })}

          {/* Line Path */}
          <path d={pathD} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke={primaryColor} strokeWidth="3" />
              <text x={pt.x} y={svgHeight - 10} textAnchor="middle" className="text-[10px] fill-slate-500">
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  const renderBarChart = () => {
    return (
      <div className="flex h-full flex-col justify-end gap-2 pt-4" style={{ height: `${height}px` }}>
        <div className="flex items-end gap-3 h-full border-b border-slate-200 pb-2">
          {data.map((item, idx) => {
            const pct = (item.value / maxValue) * 100
            return (
              <div key={idx} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                {/* Tooltip */}
                <div className="absolute -top-8 hidden rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block z-10">
                  {currency ? `${currency} ${item.value.toLocaleString()}` : item.value}
                </div>

                <div
                  className="w-full rounded-t-md transition-all group-hover:brightness-110"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: primaryColor,
                    minHeight: '4px',
                  }}
                />
                <span className="mt-2 truncate text-[10px] font-medium text-slate-500">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDonutChart = () => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1
    const colors = [primaryColor, secondaryColor, '#10B981', '#F59E0B', '#64748B']

    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ height: `${height}px` }}>
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
            {data.reduce(
              (acc, item, idx) => {
                const pct = item.value / total
                const strokeDasharray = `${pct * 283} 283`
                const strokeDashoffset = -acc.offset
                const color = colors[idx % colors.length]

                acc.elements.push(
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                )
                acc.offset += pct * 283
                return acc
              },
              { offset: 0, elements: [] as React.ReactNode[] }
            ).elements}
          </svg>
          <div className="absolute text-center">
            <span className="block text-xs font-semibold text-slate-500">Total</span>
            <span className="text-sm font-bold text-slate-900">
              {currency ? `${currency} ${total.toLocaleString()}` : total}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {data.map((item, idx) => {
            const color = colors[idx % colors.length]
            const pct = Math.round((item.value / total) * 100)
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="ml-auto font-bold text-slate-900">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>

      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'donut' && renderDonutChart()}
    </div>
  )
}
