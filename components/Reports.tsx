import React, { useState } from 'react';
import { CarbonRecord } from '../types';
import { GeminiService } from '../services/gemini';
import { FileText, Download, Sparkles } from 'lucide-react';

interface ReportsProps {
  records: CarbonRecord[];
}

export const Reports: React.FC<ReportsProps> = ({ records }) => {
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    const result = await GeminiService.generateReport(records);
    setGeneratedReport(result);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Emissions Report</h2>
        <div className="flex space-x-2">
            <button 
                onClick={handleGenerateReport}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                disabled={generating}
            >
                <Sparkles size={18} />
                {generating ? 'Drafting...' : 'Generate AI Summary'}
            </button>
            <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg transition">
                <Download size={18} /> Export CSV
            </button>
        </div>
      </div>

      {generatedReport && (
          <div className="bg-white p-8 rounded-xl border border-indigo-100 shadow-sm ring-4 ring-indigo-50">
              <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                  <FileText size={20} /> Executive Summary
              </h3>
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {generatedReport}
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Source</th>
                <th className="p-4">Category</th>
                <th className="p-4">Consumption</th>
                <th className="p-4">Emissions (kgCO2e)</th>
                <th className="p-4">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...records].sort((a,b) => b.timestamp - a.timestamp).slice(0, 50).map(record => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="p-4">{new Date(record.timestamp).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-slate-900">{record.sourceName}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                        {record.category}
                    </span>
                  </td>
                  <td className="p-4">{record.value.toFixed(2)} {record.unit}</td>
                  <td className="p-4 font-bold text-slate-800">{record.co2e.toFixed(2)}</td>
                  <td className="p-4">
                      <span className={`flex items-center gap-1 ${record.dataSource === 'IoT Sensor' ? 'text-blue-600' : 'text-slate-500'}`}>
                        {record.dataSource}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 text-center text-slate-500 text-sm">
            Showing last 50 records
        </div>
      </div>
    </div>
  );
};