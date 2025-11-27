import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PenTool, Radio, FileBarChart, Database, Users, Leaf } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manual-entry', label: 'Manual Entry', icon: PenTool },
    { id: 'iot', label: 'IoT Devices', icon: Radio },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'master-data', label: 'Master Data', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
            <Leaf className="text-white" size={20} />
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight">EcoTrack AI</h1>
            <p className="text-xs text-slate-400">Carbon Analyzer</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
              currentView === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Connected as</p>
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs">
                    AA
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">Alice Admin</p>
                    <p className="text-xs text-slate-400">Admin</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};