import React, { useState } from 'react';
import { CarbonRecord, EmissionCategory, DataSource, EmissionFactor } from '../types';
import { StorageService } from '../services/storage';

interface DataEntryProps {
  factors: EmissionFactor[];
  onRecordAdded: (record: CarbonRecord) => void;
}

export const DataEntry: React.FC<DataEntryProps> = ({ factors, onRecordAdded }) => {
  const [selectedFactorId, setSelectedFactorId] = useState<string>(factors[0]?.id || '');
  const [value, setValue] = useState<string>('');
  const [sourceName, setSourceName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const factor = factors.find(f => f.id === selectedFactorId);
    if (!factor || !value) return;

    const numValue = parseFloat(value);
    
    const newRecord: CarbonRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date(date).getTime(),
      category: factor.category,
      sourceName: sourceName || factor.name,
      value: numValue,
      unit: factor.unit,
      co2e: numValue * factor.factor,
      dataSource: DataSource.MANUAL
    };

    StorageService.saveRecord(newRecord);
    onRecordAdded(newRecord);
    
    // Reset
    setValue('');
    setSourceName('');
  };

  const selectedFactor = factors.find(f => f.id === selectedFactorId);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Manual Data Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Emission Source Type</label>
          <select 
            value={selectedFactorId}
            onChange={(e) => setSelectedFactorId(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          >
            {factors.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Consumption Value ({selectedFactor?.unit})
            </label>
            <input 
              type="number" 
              step="0.01"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source Description (Optional)</label>
            <input 
              type="text" 
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Utility Bill #1234, Fleet Truck A"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Add Record
          </button>
        </div>
      </form>
    </div>
  );
};