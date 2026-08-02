import type { RouteObject } from 'react-router-dom';
import { BackupCenterView } from './views/BackupCenterView';
import { BackupHistoryView } from './views/BackupHistoryView';
import { VerificationCenterView } from './views/VerificationCenterView';
import { RetentionSettingsView } from './views/RetentionSettingsView';
import { BackupStatisticsView } from './views/BackupStatisticsView';

export const backupRestoreDashboardRoutes: RouteObject[] = [
  {
    path: 'backup',
    element: <BackupCenterView />,
  },
  {
    path: 'backup/history',
    element: <BackupHistoryView />,
  },
  {
    path: 'backup/verify',
    element: <VerificationCenterView />,
  },
  {
    path: 'backup/retention',
    element: <RetentionSettingsView />,
  },
  {
    path: 'backup/stats',
    element: <BackupStatisticsView />,
  },
];
