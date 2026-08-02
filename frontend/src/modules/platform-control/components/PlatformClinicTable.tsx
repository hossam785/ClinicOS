import React, { useState } from 'react';
import { Building2, Search, Lock, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { IPlatformTenant } from '../types/platformControl.types';

interface PlatformClinicTableProps {
  tenants: IPlatformTenant[];
  onAction: (actionName: string, tenantId: string) => void;
}

export const PlatformClinicTable: React.FC<PlatformClinicTableProps> = ({ tenants, onAction }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTenants = tenants.filter((t) => {
    const matchesQuery =
      t.clinicName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.tenantId.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case 'TRIAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            Trial
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Suspended
          </span>
        );
      case 'LOCKOUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Lock className="w-3.5 h-3.5" />
            Lockout
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Clinic Tenants Directory</h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {filteredTenants.length} Tenants
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinics..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="LOCKOUT">Lockout</option>
          </select>

          <button
            onClick={() => onAction('ONBOARD_CLINIC', 'NEW')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors"
          >
            Onboard Clinic
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Clinic & Tenant ID</th>
              <th className="py-3 px-4">Owner Contact</th>
              <th className="py-3 px-4">Subscription Plan</th>
              <th className="py-3 px-4">Active Devices</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No clinic tenants found.
                </td>
              </tr>
            ) : (
              filteredTenants.map((tenant) => (
                <tr key={tenant.tenantId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{tenant.clinicName}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{tenant.tenantId}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-200">{tenant.ownerName}</p>
                    <p className="text-xs text-slate-400">{tenant.ownerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400">{tenant.subscriptionPlan}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 font-semibold">{tenant.activeDevices}</span>
                    <span className="text-slate-500 text-xs"> / {tenant.maxDevices} PCs</span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(tenant.status)}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onAction('VIEW_TENANT', tenant.tenantId)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onAction('LOCKOUT_CLINIC', tenant.tenantId)}
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium rounded transition-colors"
                    >
                      Lockout
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
