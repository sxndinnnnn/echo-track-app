import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DataEntry } from './components/DataEntry';
import { IoTManager } from './components/IoTManager';
import { Reports } from './components/Reports';
import { MasterData } from './components/MasterData';
import { Users } from './components/Users';
import { ViewState, CarbonRecord, EmissionFactor, User } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [records, setRecords] = useState<CarbonRecord[]>([]);
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize data on mount
  useEffect(() => {
    StorageService.initializeIfNeeded();
    setRecords(StorageService.getRecords());
    setFactors(StorageService.getFactors());
    setUsers(StorageService.getUsers());
  }, []);

  const handleRecordAdded = (newRecord: CarbonRecord) => {
    setRecords(prev => [...prev, newRecord]);
  };

  const handleFactorsUpdated = (updatedFactors: EmissionFactor[]) => {
    setFactors(updatedFactors);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard records={records} />;
      case 'manual-entry':
        return <DataEntry factors={factors} onRecordAdded={handleRecordAdded} />;
      case 'iot':
        return <IoTManager factors={factors} onRecordAdded={handleRecordAdded} />;
      case 'reports':
        return <Reports records={records} />;
      case 'master-data':
        return <MasterData factors={factors} onUpdate={handleFactorsUpdated} />;
      case 'users':
        return <Users users={users} />;
      default:
        return <Dashboard records={records} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-slate-800 capitalize">
                {view.replace('-', ' ')}
            </h2>
            <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </header>
        <div className="animate-in fade-in duration-300">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;