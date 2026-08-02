// Reports Center Catalog Central View — ClinicOS

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Search,
  ArrowRight,
  PieChart,
  Users,
  Calendar,
  UserCheck,
  DollarSign,
  Activity,
  ShieldCheck,
  History,
} from 'lucide-react'
import type { ReportCategory, ReportType } from '../types/reports'

export interface ReportCatalogItem {
  id: ReportType
  category: ReportCategory
  title: string
  description: string
  targetAudience: string
  icon: React.ReactNode
}

export const ReportsCenterView: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ReportCategory | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: Array<{ id: ReportCategory | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Reports' },
    { id: 'EXECUTIVE', label: 'Executive' },
    { id: 'FINANCIAL', label: 'Financial' },
    { id: 'DOCTOR', label: 'Doctor Performance' },
    { id: 'PATIENT', label: 'Patient Demographics' },
    { id: 'APPOINTMENT', label: 'Appointments' },
    { id: 'MEDICAL', label: 'Medical & Diagnoses' },
    { id: 'OPERATIONAL', label: 'Operational' },
  ]

  const reportCatalog: ReportCatalogItem[] = [
    {
      id: 'FINANCIAL_PROFIT_LOSS',
      category: 'FINANCIAL',
      title: 'Financial Profit and Loss Statement',
      description: 'Comprehensive financial report summarizing gross revenue (completed visits), paid operating expenses, net profit, and profit margin %.',
      targetAudience: 'Clinic Owner, Accountant',
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
    },
    {
      id: 'DOCTOR_PERFORMANCE',
      category: 'DOCTOR',
      title: 'Doctor Productivity & Performance Report',
      description: 'Evaluates completed consultations, scheduled volume, completion rate, revenue generated, and patient load per doctor.',
      targetAudience: 'Clinic Manager, Doctors',
      icon: <UserCheck className="h-6 w-6 text-indigo-600" />,
    },
    {
      id: 'PATIENT_DEMOGRAPHICS',
      category: 'PATIENT',
      title: 'Patient Acquisition & Demographics',
      description: 'Tracks new patient registrations, returning patient visit recurrence, age group distribution cohorts, and gender ratios.',
      targetAudience: 'Clinic Manager, Receptionist',
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      id: 'APPOINTMENT_ANALYTICS',
      category: 'APPOINTMENT',
      title: 'Appointment Volume & Queue Efficiency',
      description: 'Analyzes booking density, peak clinic hours, cancellation/no-show rates, average waiting time, and consultation duration.',
      targetAudience: 'Receptionist, Clinic Manager',
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
    },
    {
      id: 'BUSINESS_OVERVIEW',
      category: 'EXECUTIVE',
      title: 'Executive Business Overview',
      description: 'High-level business overview summarizing active revenue trends, facility capacity utilization, and key performance indicators.',
      targetAudience: 'Clinic Owner, Executive Board',
      icon: <PieChart className="h-6 w-6 text-purple-600" />,
    },
    {
      id: 'MEDICAL_ANONYMIZED',
      category: 'MEDICAL',
      title: 'Anonymized Clinical Diagnoses & Procedures',
      description: 'Aggregates ICD-10 diagnosis prevalence, common procedures, and prescription frequency. Zero Patient Identifiable Information.',
      targetAudience: 'Chief Medical Officer, Doctors',
      icon: <Activity className="h-6 w-6 text-rose-600" />,
    },
    {
      id: 'OPERATIONAL_SECURITY',
      category: 'OPERATIONAL',
      title: 'Operational Reception & Security Audit',
      description: 'Monitors check-in processing speed, staff login security activity, database backup status, and synchronization history.',
      targetAudience: 'System Administrator, Manager',
      icon: <ShieldCheck className="h-6 w-6 text-slate-700" />,
    },
  ]

  const filteredCatalog = reportCatalog.filter((item) => {
    const matchesCategory = activeTab === 'ALL' || item.category === activeTab
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Centralized Reports Center Catalog</h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a specialized report category to inspect metrics, generate analytical statements, or export documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports/history')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <History className="h-4 w-4 text-slate-500" />
            Snapshot History
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredCatalog.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Reports Found</h3>
          <p className="mt-1 text-xs text-slate-500">No report catalog items match your search query or selected category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">{item.icon}</div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-400">Target: {item.targetAudience}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/reports/view/${item.id}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View Report
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
