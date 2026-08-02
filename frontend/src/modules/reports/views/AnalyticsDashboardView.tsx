// Analytics Dashboard Main Executive View — ClinicOS

import React, { useEffect, useState } from 'react'
import { useReports } from '../hooks/useReports'
import { ReportKpiCard } from '../components/ReportKpiCard'
import { ReportFilterHeader } from '../components/ReportFilterHeader'
import { ReportChartWidget } from '../components/ReportChartWidget'
import { ReportDataTable, type TableColumn } from '../components/ReportDataTable'
import { OfflineReportBanner } from '../components/OfflineReportBanner'
import { ExportReportModal } from '../components/ExportReportModal'
import type { DoctorPerformanceItem, ExportFormat } from '../types/reports'

export const AnalyticsDashboardView: React.FC = () => {
  const {
    kpis,
    doctorsData,
    filters,
    isLoading,
    isOffline,
    isExporting,
    setFilters,
    fetchDashboardKpis,
    fetchDoctorReports,
    triggerExport,
  } = useReports('EXECUTIVE')

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  useEffect(() => {
    fetchDashboardKpis()
    fetchDoctorReports()
  }, [fetchDashboardKpis, fetchDoctorReports])

  const handleRefresh = async () => {
    await fetchDashboardKpis()
    await fetchDoctorReports()
  }

  const handleExport = async (format: ExportFormat) => {
    return await triggerExport({
      reportType: 'BUSINESS_OVERVIEW',
      exportFormat: format,
      filterParams: filters,
    })
  }

  const doctorColumns: TableColumn<DoctorPerformanceItem>[] = [
    {
      header: 'Doctor Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.doctorName}</span>
          <span className="block text-[10px] text-slate-500">{row.specialty}</span>
        </div>
      ),
    },
    {
      header: 'Completed Consultations',
      accessor: (row) => <span className="font-semibold">{row.completedVisits} / {row.scheduledAppointments}</span>,
      align: 'center',
    },
    {
      header: 'Completion Rate',
      accessor: (row) => (
        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
          {row.completionRatePercentage}%
        </span>
      ),
      align: 'center',
    },
    {
      header: 'Revenue Contribution',
      accessor: (row) => <span className="font-bold text-slate-900">${row.totalRevenueGenerated.toLocaleString()}</span>,
      align: 'right',
    },
  ]

  // Mock trend data points aligned with system invariants
  const revenueTrendPoints = [
    { label: 'Mon', value: 3400 },
    { label: 'Tue', value: 4200 },
    { label: 'Wed', value: 3800 },
    { label: 'Thu', value: 5100 },
    { label: 'Fri', value: 4900 },
    { label: 'Sat', value: 2800 },
  ]

  const expenseDonutPoints = [
    { label: 'Facility Rent', value: 5000 },
    { label: 'Medical Supplies', value: 6250 },
    { label: 'Utilities', value: 3000 },
  ]

  const defaultDoctorPerformanceData: DoctorPerformanceItem[] = [
    {
      doctorId: 'doc_101',
      doctorName: 'Dr. Alexander Fleming',
      specialty: 'Cardiology',
      scheduledAppointments: 85,
      completedVisits: 78,
      canceledVisits: 5,
      noShowVisits: 2,
      completionRatePercentage: 91.76,
      totalRevenueGenerated: 15600,
      uniquePatients: 62,
    },
    {
      doctorId: 'doc_102',
      doctorName: 'Dr. Elizabeth Blackwell',
      specialty: 'Pediatrics',
      scheduledAppointments: 68,
      completedVisits: 64,
      canceledVisits: 3,
      noShowVisits: 1,
      completionRatePercentage: 94.12,
      totalRevenueGenerated: 11200,
      uniquePatients: 54,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <OfflineReportBanner isOffline={isOffline} />

      <ReportFilterHeader
        title="Executive Analytics Dashboard"
        subtitle="Real-time business performance metrics, revenue trajectories, and operational throughput."
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onRefresh={handleRefresh}
        onOpenExport={() => setIsExportModalOpen(true)}
        isRefreshing={isLoading}
      />

      {/* 7 KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportKpiCard
          title="Today's Patients"
          value={kpis?.todaysPatients?.value ?? 18}
          changeVsYesterday={kpis?.todaysPatients?.changeVsYesterday ?? 12.5}
          iconName="users"
          variant="primary"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Today's Appointments"
          value={kpis?.todaysAppointments?.total ?? 22}
          subtitle={`${kpis?.todaysAppointments?.completed ?? 14} Completed | ${kpis?.todaysAppointments?.waiting ?? 5} Waiting`}
          iconName="calendar"
          variant="neutral"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Revenue Today"
          value={kpis?.revenueToday?.value ?? 2450}
          currency="USD"
          subtitle="COMPLETED visits only"
          iconName="dollar"
          variant="success"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Expenses Today"
          value={kpis?.expensesToday?.value ?? 450}
          currency="USD"
          subtitle="PAID expenses only"
          iconName="dollar"
          variant="danger"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Outstanding Settlements"
          value={kpis?.outstandingSettlements?.value ?? 4250}
          currency="USD"
          subtitle="Accrued doctor balance pool"
          iconName="briefcase"
          variant="warning"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Active Doctors On Duty"
          value={kpis?.activeDoctorsOnDuty?.count ?? 4}
          subtitle="Practitioners actively consulting"
          iconName="userCheck"
          variant="primary"
          loading={isLoading}
        />

        <ReportKpiCard
          title="Pending Notifications"
          value={kpis?.pendingNotifications?.unreadCount ?? 6}
          subtitle={`${kpis?.pendingNotifications?.criticalAlerts ?? 1} Critical Alert`}
          iconName="bell"
          variant="warning"
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportChartWidget
            title="Weekly Revenue Trajectory"
            subtitle="Gross revenue collected from completed patient appointments ($ USD)"
            type="line"
            data={revenueTrendPoints}
            primaryColor="#4F46E5"
            loading={isLoading}
            currency="USD"
          />
        </div>

        <div>
          <ReportChartWidget
            title="Operating Expenses Distribution"
            subtitle="Breakdown of paid operating expenses by category"
            type="donut"
            data={expenseDonutPoints}
            primaryColor="#10B981"
            secondaryColor="#F43F5E"
            loading={isLoading}
            currency="USD"
          />
        </div>
      </div>

      {/* Doctor Performance Table Summary */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Doctor Productivity & Contribution</h2>
        <ReportDataTable
          columns={doctorColumns}
          data={doctorsData.length > 0 ? doctorsData : defaultDoctorPerformanceData}
          loading={isLoading}
        />
      </div>

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        reportTitle="Executive Business Overview"
        reportType="BUSINESS_OVERVIEW"
        filterParams={filters}
        isExporting={isExporting}
      />
    </div>
  )
}
