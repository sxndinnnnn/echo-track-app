import React from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { User as UserIcon, Shield, Mail } from 'lucide-react';

interface UsersProps {
  users: User[];
}

export const Users: React.FC<UsersProps> = ({ users }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
            <p className="text-slate-500">Manage access and roles for the platform.</p>
         </div>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{user.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Shield size={14} /> {user.role}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};