import { useState, useEffect, useCallback } from 'react';
import type {
  BackupMetadata,
  RestoreHistoryEntry,
  RetentionPolicyConfig,
  BackupStatistics,
  BackupFilterParams,
  BackupType,
  RestoreWizardState,
} from '../types/backupRestore';
import { backupRestoreApi } from '../services/backupRestoreApi';

export function useBackupRestore() {
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [restores, setRestores] = useState<RestoreHistoryEntry[]>([]);
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicyConfig | null>(null);
  const [statistics, setStatistics] = useState<BackupStatistics | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupMetadata | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<BackupFilterParams>({
    search: '',
    backupType: 'ALL',
    integrityStatus: 'ALL',
    page: 1,
    limit: 20,
  });

  const [wizardState, setWizardState] = useState<RestoreWizardState>({
    currentStep: 1,
    selectedBackupId: null,
    confirmationPhrase: '',
    reason: '',
    isExecuting: false,
    progressPercentage: 0,
    currentStageMessage: '',
    safetyBackupGenerated: false,
    restoreError: null,
    rollbackExecuted: false,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resBackups, resRestores, resRetention, resStats] = await Promise.all([
        backupRestoreApi.getBackups(filters),
        backupRestoreApi.getRestoreHistory(),
        backupRestoreApi.getRetentionPolicy(),
        backupRestoreApi.getBackupStatistics(),
      ]);

      setBackups(resBackups.items);
      setRestores(resRestores);
      setRetentionPolicy(resRetention);
      setStatistics(resStats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load backup data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBackup = async (type: BackupType, name?: string, reason?: string) => {
    setIsCreating(true);
    try {
      const created = await backupRestoreApi.createBackup({ backupType: type, backupName: name, backupReason: reason });
      await loadData();
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backup creation failed';
      setError(msg);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyBackup = async (id: string) => {
    try {
      const report = await backupRestoreApi.verifyBackup(id);
      await loadData();
      return report;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      throw err;
    }
  };

  const handleUpdateRetention = async (updates: Partial<RetentionPolicyConfig>) => {
    try {
      const updated = await backupRestoreApi.updateRetentionPolicy(updates);
      setRetentionPolicy(updated);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update retention policy';
      setError(msg);
      throw err;
    }
  };

  const startRestoreWizard = (backupId: string) => {
    setWizardState({
      currentStep: 1,
      selectedBackupId: backupId,
      confirmationPhrase: '',
      reason: '',
      isExecuting: false,
      progressPercentage: 0,
      currentStageMessage: 'Initial Compatibility Review',
      safetyBackupGenerated: false,
      restoreError: null,
      rollbackExecuted: false,
    });
  };

  const setWizardStep = (step: number) => {
    setWizardState((prev) => ({ ...prev, currentStep: step }));
  };

  const updateWizardState = (updates: Partial<RestoreWizardState>) => {
    setWizardState((prev) => ({ ...prev, ...updates }));
  };

  const resetWizardState = () => {
    setWizardState({
      currentStep: 1,
      selectedBackupId: null,
      confirmationPhrase: '',
      reason: '',
      isExecuting: false,
      progressPercentage: 0,
      currentStageMessage: '',
      safetyBackupGenerated: false,
      restoreError: null,
      rollbackExecuted: false,
    });
  };

  return {
    backups,
    restores,
    retentionPolicy,
    statistics,
    selectedBackup,
    setSelectedBackup,
    isLoading,
    isCreating,
    error,
    filters,
    setFilters,
    wizardState,
    startRestoreWizard,
    setWizardStep,
    updateWizardState,
    resetWizardState,
    handleCreateBackup,
    handleVerifyBackup,
    handleUpdateRetention,
    refreshData: loadData,
  };
}
