import React, { useState, useEffect, useRef } from 'react';
import { IoTDevice, CarbonRecord, DataSource, EmissionFactor } from '../types';
import { StorageService } from '../services/storage';
import { Wifi, Activity, Power, MoreVertical, RefreshCw } from 'lucide-react';

interface IoTManagerProps {
  factors: EmissionFactor[];
  onRecordAdded: (record: CarbonRecord) => void;
}

export const IoTManager: React.FC<IoTManagerProps> = ({ factors, onRecordAdded }) => {
  const [devices, setDevices] = useState<IoTDevice[]>(StorageService.getDevices());
  const [simulating, setSimulating] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const toggleDeviceStatus = (id: string) => {
    const updated = devices.map(d => 
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ) as IoTDevice[];
    setDevices(updated);
    StorageService.saveDevices(updated);
  };

  const startSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    
    // Simulate incoming data every 3 seconds
    intervalRef.current = window.setInterval(() => {
      const activeDevices = devices.filter(d => d.status === 'active');
      
      activeDevices.forEach(device => {
        const factor = factors.find(f => f.id === device.emissionFactorId);
        if (!factor) return;

        // Random value between 1 and 10
        const randomVal = Math.random() * 9 + 1;
        
        const newRecord: CarbonRecord = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          category: device.category,
          sourceName: device.name,
          value: randomVal,
          unit: factor.unit,
          co2e: randomVal * factor.factor,
          dataSource: DataSource.IOT
        };

        StorageService.saveRecord(newRecord);
        onRecordAdded(newRecord);

        // Update last ping
        setDevices(prev => prev.map(d => d.id === device.id ? { ...d, lastPing: Date.now() } : d));
      });
    }, 3000);
  };

  const stopSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimulating(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Connected IoT Sensors</h2>
           <p className="text-slate-500">Manage your connected hardware for real-time tracking.</p>
        </div>
        <button
          onClick={simulating ? stopSimulation : startSimulation}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
            simulating 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {simulating ? <Power size={20} /> : <Activity size={20} />}
          <span>{simulating ? 'Stop Data Stream' : 'Simulate Data Stream'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-full ${device.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <Wifi size={24} />
              </div>
              <button 
                onClick={() => toggleDeviceStatus(device.id)}
                className={`text-xs font-semibold px-2 py-1 rounded border ${device.status === 'active' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500'}`}
              >
                {device.status === 'active' ? 'Active' : 'Paused'}
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">{device.name}</h3>
            <p className="text-sm text-slate-500">{device.type}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-400">Factor: {factors.find(f => f.id === device.emissionFactorId)?.name}</span>
                {simulating && device.status === 'active' && (
                    <span className="flex items-center text-emerald-600 gap-1 animate-pulse">
                        <RefreshCw size={12} className="animate-spin" /> Transmitting
                    </span>
                )}
            </div>
          </div>
        ))}
      </div>
      
      {simulating && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center gap-3">
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></div>
          <p className="text-indigo-800 text-sm">IoT Simulator is running. Dashboard is updating in real-time every 3 seconds.</p>
        </div>
      )}
    </div>
  );
};