import React, { useState } from 'react';
import { useBackupRestore } from '../hooks/useBackupRestore';
import { BackupFilterHeader } from '../components/BackupFilterHeader';
import { BackupStatisticsOverview } from '../components/BackupStatisticsOverview';
import { BackupLogTable } from '../components/BackupLogTable';
import { BackupDetailsModal } from '../components/BackupDetailsModal';
import { RestoreWizardModal } from '../components/RestoreWizardModal';
import { BackupSecurityAlertWidget } from '../components/BackupSecurityAlertWidget';
import type { BackupMetadata } from '../types/backupRestore';

export const BackupCenterView: React.FC = () => {
  const {
    backups,
    statistics,
    isLoading,
    isCreating,
    filters,
    setFilters,
    wizardState,
    startRestoreWizard,
    setWizardStep,
    updateWizardState,
    resetWizardState,
    handleCreateBackup,
    handleVerifyBackup,
    refreshData,
  } = useBackupRestore();

  const [selectedInspectBackup, setSelectedInspectBackup] = useState<BackupMetadata | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  const handleOpenRestoreWizard = (backupId?: string) => {
    const id = backupId || (backups[0] ? backups[0].backupId : '');
    if (id) {
      startRestoreWizard(id);
      setIsWizardOpen(true);
    }
  };

  const handleExecuteRestore = async () => {
    updateWizardState({ currentStep: 6, isExecuting: true });
    setTimeout(() => {
      updateWizardState({ currentStep: 7, isExecuting: false });
    }, 2500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <BackupFilterHeader
        filters={filters}
        onFilterChange={setFilters}
        onCreateBackupClick={() => handleCreateBackup('MANUAL')}
        onRestoreWizardClick={() => handleOpenRestoreWizard()}
        onRefreshClick={refreshData}
        isCreating={isCreating}
      />

      <BackupSecurityAlertWidget statistics={statistics} />

      <BackupStatisticsOverview statistics={statistics} isLoading={isLoading} />

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Backup Archives Roster</h3>
        <BackupLogTable
          backups={backups}
          isLoading={isLoading}
          onInspectClick={(b) => setSelectedInspectBackup(b)}
          onVerifyClick={handleVerifyBackup}
          onRestoreClick={(id) => handleOpenRestoreWizard(id)}
        />
      </div>

      <BackupDetailsModal
        backup={selectedInspectBackup}
        onClose={() => setSelectedInspectBackup(null)}
        onVerify={handleVerifyBackup}
        onRestore={(id) => handleOpenRestoreWizard(id)}
      />

      <RestoreWizardModal
        isOpen={isWizardOpen}
        backups={backups}
        wizardState={wizardState}
        onClose={() => {
          setIsWizardOpen(false);
          resetWizardState();
        }}
        onStepChange={setWizardStep}
        onUpdateState={updateWizardState}
        onExecuteRestore={handleExecuteRestore}
      />
    </div>
  );
};
