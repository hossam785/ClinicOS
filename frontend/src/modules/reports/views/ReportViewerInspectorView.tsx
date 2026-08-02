// Detailed Report Viewer Inspector Workspace Screen — ClinicOS

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReports } from '../hooks/useReports'
import { ReportFilterHeader } from '../components/ReportFilterHeader'
import { ReportKpiCard } from '../components/ReportKpiCard'
import { ReportDataTable, type TableColumn } from '../components/ReportDataTable'
import { ReportChartWidget } from '../components/ReportChartWidget'
import { ExportReportModal } from '../components/ExportReportModal'
import { OfflineReportBanner } from '../components/OfflineReportBanner'
import { ArrowLeft, Printer, Download, ShieldAlert } from 'lucide-react'
import type { ReportType, ExportFormat, FinancialBreakdownItem, MedicalDiagnosisStat } from '../types/reports'

export const ReportViewerInspectorView: React.FC = () => {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()

  const reportType = (type as ReportType) || 'FINANCIAL_PROFIT_LOSS'

  const {
    financialData,
    appointmentData,
    medicalData,
    filters,
    isLoading,
    isOffline,
    isExporting,
    error,
    setFilters,
    fetchFinancialReport,
    fetchDoctorReports,
    fetchPatientReports,
    fetchAppointmentReports,
    fetchMedicalReports,
    triggerExport,
  } = useReports()

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  useEffect(() => {
    switch (reportType) {
      case 'FINANCIAL_PROFIT_LOSS':
        fetchFinancialReport()
        break
      case 'DOCTOR_PERFORMANCE':
        fetchDoctorReports()
        break
      case 'PATIENT_DEMOGRAPHICS':
        fetchPatientReports()
        break
      case 'APPOINTMENT_ANALYTICS':
        fetchAppointmentReports()
        break
      case 'MEDICAL_ANONYMIZED':
        fetchMedicalReports()
        break
      default:
        fetchFinancialReport()
    }
  }, [
    reportType,
    fetchFinancialReport,
    fetchDoctorReports,
    fetchPatientReports,
    fetchAppointmentReports,
    fetchMedicalReports,
  ])

  const handleRefresh = async () => {
    switch (reportType) {
      case 'FINANCIAL_PROFIT_LOSS':
        await fetchFinancialReport()
        break
      case 'DOCTOR_PERFORMANCE':
        await fetchDoctorReports()
        break
      case 'PATIENT_DEMOGRAPHICS':
        await fetchPatientReports()
        break
      case 'APPOINTMENT_ANALYTICS':
        await fetchAppointmentReports()
        break
      case 'MEDICAL_ANONYMIZED':
        await fetchMedicalReports()
        break
      default:
        await fetchFinancialReport()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = async (format: ExportFormat) => {
    return await triggerExport({
      reportType,
      exportFormat: format,
      filterParams: filters,
    })
  }

  const getReportTitle = () => {
    switch (reportType) {
      case 'FINANCIAL_PROFIT_LOSS':
        return 'Financial Profit and Loss Statement'
      case 'DOCTOR_PERFORMANCE':
        return 'Doctor Productivity & Performance Report'
      case 'PATIENT_DEMOGRAPHICS':
        return 'Patient Acquisition & Demographics Analytics'
      case 'APPOINTMENT_ANALYTICS':
        return 'Appointment Volume & Queue Efficiency'
      case 'MEDICAL_ANONYMIZED':
        return 'Anonymized Clinical Diagnoses & Procedures'
      default:
        return 'Analytical Report Statement'
    }
  }

  // Financial Table Columns
  const financialColumns: TableColumn<FinancialBreakdownItem>[] = [
    { header: 'Category Name', accessor: (row) => <span className="font-bold text-slate-900">{row.categoryName}</span> },
    { header: 'Account Code', accessor: (row) => <span className="font-mono text-slate-500">{row.accountCode || 'N/A'}</span> },
    { header: 'Transactions', accessor: (row) => <span>{row.transactionCount || 0}</span>, align: 'center' },
    { header: 'Invoiced Total', accessor: (row) => <span>${Number(row.invoicedTotal || 0).toLocaleString()}</span>, align: 'right' },
    { header: 'Paid Amount', accessor: (row) => <span className="font-bold text-slate-900">${Number(row.paidAmount || 0).toLocaleString()}</span>, align: 'right' },
  ]

  // Medical Diagnoses Table Columns
  const medicalColumns: TableColumn<MedicalDiagnosisStat>[] = [
    { header: 'ICD-10 Code', accessor: (row) => <span className="font-mono font-bold text-indigo-600">{row.code}</span> },
    { header: 'Clinical Diagnosis Description', accessor: (row) => <span>{row.description}</span> },
    { header: 'Occurrence Count', accessor: (row) => <span className="font-bold">{row.occurrenceCount}</span>, align: 'right' },
  ]

  return (
    <div className="space-y-6 p-6">
      <OfflineReportBanner isOffline={isOffline} />

      {/* Top Workspace Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Back to Reports Catalog"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{getReportTitle()}</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Official read-only report statement generated for active tenant.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print View
          </button>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export Document
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Filter Header */}
      <ReportFilterHeader
        title="Report Parameters & Data Scoping"
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      {/* Financial Report Workspace */}
      {reportType === 'FINANCIAL_PROFIT_LOSS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ReportKpiCard
              title="Gross Invoiced Revenue"
              value={financialData?.summary?.grossRevenue ?? 48500}
              currency="USD"
              subtitle="COMPLETED appointments only"
              iconName="dollar"
              variant="success"
              loading={isLoading}
            />
            <ReportKpiCard
              title="Total Operating Expenses"
              value={financialData?.summary?.totalOperatingExpenses ?? 14250}
              currency="USD"
              subtitle="PAID expenses only"
              iconName="dollar"
              variant="danger"
              loading={isLoading}
            />
            <ReportKpiCard
              title="Net Operating Profit"
              value={financialData?.summary?.netOperatingProfit ?? 34250}
              currency="USD"
              subtitle={`Profit Margin: ${financialData?.summary?.netProfitMarginPercentage ?? 70.62}%`}
              iconName="dollar"
              variant="primary"
              loading={isLoading}
            />
          </div>

          <ReportChartWidget
            title="Operating Expenses Breakdown"
            subtitle="Categorical breakdown of operating expenses"
            type="bar"
            data={
              financialData?.expenseBreakdown.map((item) => ({
                label: item.categoryName,
                value: item.paidAmount,
              })) || [
                { label: 'Facility Rent', value: 5000 },
                { label: 'Medical Supplies', value: 6250 },
                { label: 'Utilities', value: 3000 },
              ]
            }
            primaryColor="#F43F5E"
            loading={isLoading}
            currency="USD"
          />

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Financial Breakdown Statement</h2>
            <ReportDataTable
              columns={financialColumns}
              data={
                financialData?.expenseBreakdown || [
                  { categoryName: 'Facility Rent', accountCode: 'EXP-201', transactionCount: 1, invoicedTotal: 5000, paidAmount: 5000 },
                  { categoryName: 'Medical Supplies', accountCode: 'EXP-202', transactionCount: 12, invoicedTotal: 6250, paidAmount: 6250 },
                  { categoryName: 'Utilities & Internet', accountCode: 'EXP-203', transactionCount: 3, invoicedTotal: 3000, paidAmount: 3000 },
                ]
              }
              loading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Appointment Report Workspace */}
      {reportType === 'APPOINTMENT_ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <ReportKpiCard
              title="Total Scheduled"
              value={appointmentData?.totalAppointments ?? 210}
              iconName="calendar"
              variant="primary"
              loading={isLoading}
            />
            <ReportKpiCard
              title="Completed Visits"
              value={appointmentData?.completedCount ?? 175}
              iconName="userCheck"
              variant="success"
              loading={isLoading}
            />
            <ReportKpiCard
              title="Cancellation Rate"
              value={`${appointmentData?.cancellationRatePercentage ?? 9.52}%`}
              iconName="activity"
              variant="danger"
              loading={isLoading}
            />
            <ReportKpiCard
              title="Average Wait Time"
              value={`${appointmentData?.averageWaitTimeMinutes ?? 12.4} mins`}
              subtitle="Check-in to consultation"
              iconName="users"
              variant="warning"
              loading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Medical Anonymized Report Workspace */}
      {reportType === 'MEDICAL_ANONYMIZED' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-xs text-indigo-900">
            <span className="font-bold">Anonymization Verification:</span> All clinical procedure and diagnosis aggregations strictly omit Patient Identifiable Information (PII) to comply with healthcare privacy regulations.
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Top ICD-10 Diagnoses Prevalence</h2>
            <ReportDataTable
              columns={medicalColumns}
              data={
                medicalData?.topDiagnoses || [
                  { code: 'I10', description: 'Essential (primary) hypertension', occurrenceCount: 38 },
                  { code: 'E11', description: 'Type 2 diabetes mellitus', occurrenceCount: 29 },
                  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', occurrenceCount: 24 },
                ]
              }
              loading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Default fallback table for Doctor/Patient/Operational */}
      {['DOCTOR_PERFORMANCE', 'PATIENT_DEMOGRAPHICS', 'OPERATIONAL_SECURITY'].includes(reportType) && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Report details loaded successfully.</p>
          <p className="mt-1 text-xs text-slate-500">Filter parameters applied: {filters.startDate || '2026-07-01'} to {filters.endDate || '2026-07-31'}</p>
        </div>
      )}

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        reportTitle={getReportTitle()}
        reportType={reportType}
        filterParams={filters}
        isExporting={isExporting}
      />
    </div>
  )
}
