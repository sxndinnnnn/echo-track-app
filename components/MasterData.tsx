import React, { useState } from 'react';
import { EmissionFactor, EmissionCategory } from '../types';
import { StorageService } from '../services/storage';
import { Settings, Plus, Trash2 } from 'lucide-react';

interface MasterDataProps {
  factors: EmissionFactor[];
  onUpdate: (factors: EmissionFactor[]) => void;
}

export const MasterData: React.FC<MasterDataProps> = ({ factors, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFactor, setNewFactor] = useState<Partial<EmissionFactor>>({});

  const handleAdd = () => {
    if (!newFactor.name || !newFactor.factor || !newFactor.unit || !newFactor.category) return;
    
    const updated = [
      ...factors, 
      { 
        ...newFactor, 
        id: crypto.randomUUID(),
        category: newFactor.category as EmissionCategory 
      } as EmissionFactor
    ];
    
    StorageService.saveFactors(updated);
    onUpdate(updated);
    setIsAdding(false);
    setNewFactor({});
  };

  const handleDelete = (id: string) => {
    const updated = factors.filter(f => f.id !== id);
    StorageService.saveFactors(updated);
    onUpdate(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="text-slate-400" /> Master Data
            </h2>
            <p className="text-slate-500">Manage emission factors used for calculations.</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
        >
            <Plus size={18} /> Add Factor
        </button>
      </div>

      {isAdding && (
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-semibold mb-4">New Emission Factor</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    placeholder="Name (e.g. Coal)" 
                    className="p-2 rounded border"
                    value={newFactor.name || ''}
                    onChange={e => setNewFactor({...newFactor, name: e.target.value})}
                  />
                   <select 
                    className="p-2 rounded border"
                    value={newFactor.category || ''}
                    onChange={e => setNewFactor({...newFactor, category: e.target.value as EmissionCategory})}
                  >
                      <option value="">Select Category</option>
                      {Object.values(EmissionCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Factor (kgCO2e/unit)" 
                    className="p-2 rounded border"
                    value={newFactor.factor || ''}
                    onChange={e => setNewFactor({...newFactor, factor: parseFloat(e.target.value)})}
                  />
                  <input 
                    placeholder="Unit (e.g. kg)" 
                    className="p-2 rounded border"
                    value={newFactor.unit || ''}
                    onChange={e => setNewFactor({...newFactor, unit: e.target.value})}
                  />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Factor</th>
                      <th className="p-4">Unit</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {factors.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50 group">
                          <td className="p-4 font-medium text-slate-900">{f.name}</td>
                          <td className="p-4">
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">{f.category}</span>
                          </td>
                          <td className="p-4">{f.factor}</td>
                          <td className="p-4 text-slate-500">{f.unit}</td>
                          <td className="p-4 text-right">
                              <button 
                                onClick={() => handleDelete(f.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                              >
                                  <Trash2 size={18} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};