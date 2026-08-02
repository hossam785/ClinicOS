import React, { useState } from 'react';
import { useBackupRestore } from '../hooks/useBackupRestore';
import { BackupFilterHeader } from '../components/BackupFilterHeader';
import { BackupLogTable } from '../components/BackupLogTable';
import { BackupDetailsModal } from '../components/BackupDetailsModal';
import { RestoreWizardModal } from '../components/RestoreWizardModal';
import type { BackupMetadata } from '../types/backupRestore';

export const BackupHistoryView: React.FC = () => {
  const {
    backups,
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

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Full Historical Backup Roster</h3>
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
        onExecuteRestore={() => {
          updateWizardState({ currentStep: 6, isExecuting: true });
          setTimeout(() => updateWizardState({ currentStep: 7, isExecuting: false }), 2500);
        }}
      />
    </div>
  );
};
