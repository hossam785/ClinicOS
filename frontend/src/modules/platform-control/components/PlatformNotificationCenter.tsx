import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Archive } from 'lucide-react';
import type { IPlatformNotification } from '../types/platformControl.types';

interface PlatformNotificationCenterProps {
  notifications: IPlatformNotification[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformNotificationCenter: React.FC<PlatformNotificationCenterProps> = ({ notifications, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Platform System Notifications & Alerts</h2>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.notificationId}
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
              notif.read ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-950 border-amber-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {notif.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAction('MARK_READ_NOTIFICATION', notif.notificationId)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Mark Read"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAction('ARCHIVE_NOTIFICATION', notif.notificationId)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
