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
      icon: <DollarSign className="h-6 w-6 text-emerald-400" />,
    },
    {
      id: 'DOCTOR_PERFORMANCE',
      category: 'DOCTOR',
      title: 'Doctor Productivity & Performance Report',
      description: 'Evaluates completed consultations, scheduled volume, completion rate, revenue generated, and patient load per doctor.',
      targetAudience: 'Clinic Manager, Doctors',
      icon: <UserCheck className="h-6 w-6 text-indigo-400" />,
    },
    {
      id: 'PATIENT_DEMOGRAPHICS',
      category: 'PATIENT',
      title: 'Patient Acquisition & Demographics',
      description: 'Tracks new patient registrations, returning patient visit recurrence, age group distribution cohorts, and gender ratios.',
      targetAudience: 'Clinic Manager, Receptionist',
      icon: <Users className="h-6 w-6 text-blue-400" />,
    },
    {
      id: 'APPOINTMENT_ANALYTICS',
      category: 'APPOINTMENT',
      title: 'Appointment Volume & Queue Efficiency',
      description: 'Analyzes booking density, peak clinic hours, cancellation/no-show rates, average waiting time, and consultation duration.',
      targetAudience: 'Receptionist, Clinic Manager',
      icon: <Calendar className="h-6 w-6 text-amber-400" />,
    },
    {
      id: 'BUSINESS_OVERVIEW',
      category: 'EXECUTIVE',
      title: 'Executive Business Overview',
      description: 'High-level business overview summarizing active revenue trends, facility capacity utilization, and key performance indicators.',
      targetAudience: 'Clinic Owner, Executive Board',
      icon: <PieChart className="h-6 w-6 text-purple-400" />,
    },
    {
      id: 'MEDICAL_ANONYMIZED',
      category: 'MEDICAL',
      title: 'Anonymized Clinical Diagnoses & Procedures',
      description: 'Aggregates ICD-10 diagnosis prevalence, common procedures, and prescription frequency. Zero Patient Identifiable Information.',
      targetAudience: 'Chief Medical Officer, Doctors',
      icon: <Activity className="h-6 w-6 text-rose-400" />,
    },
    {
      id: 'OPERATIONAL_SECURITY',
      category: 'OPERATIONAL',
      title: 'Operational Reception & Security Audit',
      description: 'Monitors check-in processing speed, staff login security activity, database backup status, and synchronization history.',
      targetAudience: 'System Administrator, Manager',
      icon: <ShieldCheck className="h-6 w-6 text-teal-400" />,
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
    <div dir="ltr" style={{ direction: 'ltr', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            Centralized Reports Center Catalog
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Select a specialized report category to inspect metrics, generate analytical statements, or export documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/reports/history')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-main)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <History size={16} />
          <span>Snapshot History</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search report catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-main)',
              fontSize: '0.8125rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredCatalog.length === 0 ? (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <FileText size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Reports Found</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>No report catalog items match your search query or selected category filter.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)' }}>
                    {item.category}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Target: {item.targetAudience}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/reports/view/${item.id}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  <span>View Report</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
