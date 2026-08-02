import React from 'react';
import { useBackupRestore } from '../hooks/useBackupRestore';
import { RetentionPolicyCard } from '../components/RetentionPolicyCard';

export const RetentionSettingsView: React.FC = () => {
  const { retentionPolicy, handleUpdateRetention } = useBackupRestore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <RetentionPolicyCard config={retentionPolicy} onUpdate={handleUpdateRetention} />
    </div>
  );
};
