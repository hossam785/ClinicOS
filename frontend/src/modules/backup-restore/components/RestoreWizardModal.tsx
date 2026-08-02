import React from 'react';
import type { BackupMetadata, RestoreWizardState } from '../types/backupRestore';
import { X, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  backups: BackupMetadata[];
  wizardState: RestoreWizardState;
  onClose: () => void;
  onStepChange: (step: number) => void;
  onUpdateState: (updates: Partial<RestoreWizardState>) => void;
  onExecuteRestore: () => void;
}

export const RestoreWizardModal: React.FC<Props> = ({
  isOpen,
  backups,
  wizardState,
  onClose,
  onStepChange,
  onUpdateState,
  onExecuteRestore,
}) => {
  if (!isOpen) return null;

  const targetBackup = backups.find((b) => b.backupId === wizardState.selectedBackupId || b._id === wizardState.selectedBackupId);

  const renderStepContent = () => {
    switch (wizardState.currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Step 1: Select Target Backup Archive</h3>
            <p className="text-xs text-slate-500">
              Select the verified backup archive snapshot you wish to restore your system state to.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {backups.map((b) => (
                <div
                  key={b._id}
                  onClick={() => onUpdateState({ selectedBackupId: b.backupId })}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    wizardState.selectedBackupId === b.backupId
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>{b.backupId}</span>
                    <span className="font-mono text-[10px] text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-600 mt-0.5">{b.backupName}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Step 2: Version Compatibility Review</h3>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Schema & Application Version Compatible
              </div>
              <p>Target Application Version: v{targetBackup?.applicationVersion} (Schema v{targetBackup?.schemaVersion})</p>
              <p>Current Application Version: v2.4.0 (Schema v14)</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Step 3: Disaster Recovery Risk Warning
            </h3>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
              <p className="font-bold">CRITICAL WARNING:</p>
              <p>Restoring a backup will overwrite your current active database collections, patient records, and attachment files.</p>
              <p>The system will automatically generate a mandatory pre-restore safety snapshot before applying data changes.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Step 4: Mandatory Safety Snapshot Creation</h3>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Creating EMERGENCY_SAFETY_PRE_RESTORE Snapshot
              </div>
              <p>This guarantees an automatic rollback safety net if any error occurs during database replacement.</p>
              <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Step 5: Explicit Confirmation Required</h3>
            <p className="text-xs text-slate-600">
              Type <strong className="text-slate-900 font-mono">CONFIRM_RESTORE</strong> below to authorize disaster recovery restoration.
            </p>
            <input
              type="text"
              placeholder="CONFIRM_RESTORE"
              value={wizardState.confirmationPhrase}
              onChange={(e) => onUpdateState({ confirmationPhrase: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-rose-600 text-slate-900"
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 text-center py-6">
            <RotateCcw className="w-10 h-10 text-rose-600 animate-spin mx-auto" />
            <h3 className="font-bold text-slate-900">Step 6: Executing System Restore</h3>
            <p className="text-xs text-slate-500">Overwriting active database tables and local file assets...</p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">Step 7: System Restore Completed</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              System successfully restored to backup archive <strong className="font-mono">{targetBackup?.backupId}</strong>.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            Disaster Recovery Restore Wizard
          </div>
          <button onClick={onClose} aria-label="Close Wizard" className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">{renderStepContent()}</div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {wizardState.currentStep > 1 && wizardState.currentStep < 6 ? (
            <button
              onClick={() => onStepChange(wizardState.currentStep - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {wizardState.currentStep < 5 && (
            <button
              disabled={!wizardState.selectedBackupId}
              onClick={() => onStepChange(wizardState.currentStep + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {wizardState.currentStep === 5 && (
            <button
              disabled={wizardState.confirmationPhrase !== 'CONFIRM_RESTORE'}
              onClick={onExecuteRestore}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" /> Authorize Restore
            </button>
          )}

          {wizardState.currentStep === 7 && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Close & Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
