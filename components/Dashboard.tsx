import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CarbonRecord, EmissionCategory } from '../types';
import { GeminiService } from '../services/gemini';
import { Loader2, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface DashboardProps {
  records: CarbonRecord[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const [insight, setInsight] = useState<{ trend: string; anomaly: string; recommendation: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Aggregations
  const totalEmissions = useMemo(() => records.reduce((sum, r) => sum + r.co2e, 0), [records]);
  
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach(r => {
      map.set(r.category, (map.get(r.category) || 0) + r.co2e);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [records]);

  const timeData = useMemo(() => {
    // Group by day for the last 30 days
    const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
    const dailyMap = new Map<string, number>();
    
    sorted.forEach(r => {
      const date = new Date(r.timestamp).toLocaleDateString();
      dailyMap.set(date, (dailyMap.get(date) || 0) + r.co2e);
    });

    return Array.from(dailyMap.entries()).map(([date, co2]) => ({ date, co2 }));
  }, [records]);

  useEffect(() => {
    if (records.length > 0) {
      setLoadingInsight(true);
      // Debounce slightly to prevent spamming API on every minor update if records change rapidly (e.g. IoT)
      const timer = setTimeout(() => {
        GeminiService.getInsights(records).then((jsonStr) => {
            try {
                const parsed = JSON.parse(jsonStr);
                setInsight(parsed);
            } catch (e) {
                console.error("Failed to parse insight", e);
            } finally {
                setLoadingInsight(false);
            }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [records]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Total Carbon Footprint</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalEmissions.toFixed(1)} <span className="text-sm font-normal text-slate-400">kgCO2e</span></p>
          <div className="mt-4 flex items-center text-emerald-600 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>Updates live</span>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Records Analyzed</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{records.length}</p>
          <p className="text-sm text-slate-400 mt-2">Across {categoryData.length} categories</p>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Lightbulb size={64} />
          </div>
          <h3 className="text-indigo-900 text-sm font-bold flex items-center gap-2">
            AI INSIGHTS
            {loadingInsight && <Loader2 className="animate-spin h-3 w-3" />}
          </h3>
          {insight ? (
             <div className="mt-3 space-y-2 text-sm">
                <p className="text-indigo-800"><strong>Trend:</strong> {insight.trend}</p>
                <p className="text-indigo-800"><strong>Action:</strong> {insight.recommendation}</p>
             </div>
          ) : (
             <p className="text-indigo-400 text-sm mt-3">Analyzing data patterns...</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Emissions Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="co2" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Source Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};