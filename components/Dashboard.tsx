
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { InventoryItem } from '../types';
import { PASTEL_COLORS, CATEGORIES, CATEGORY_STYLES, CATEGORY_CHART_COLORS } from '../constants';

interface DashboardProps {
  items: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const stats = useMemo(() => {
    const potdurCount = items.filter(i => i.status === 'POTDUR & EDIT').length;
    const previewCount = items.filter(i => i.status === 'PREVIEW').length;
    const sudahCount = items.filter(i => i.status === 'SUDAH TAYANG').length;

    const catMap = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = CATEGORIES.map(name => ({
      name,
      value: catMap[name] || 0
    }));

    const statusData = [
      { name: 'POTDUR & EDIT', value: potdurCount, color: '#CAFFBF' },
      { name: 'PREVIEW', value: previewCount, color: '#FDFFB6' },
      { name: 'SUDAH TAYANG', value: sudahCount, color: '#FFADAD' },
    ].filter(s => s.value > 0);

    return { total: items.length, statusData, categoryData, catMap };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 animate-fadeIn">
        <div className="text-gray-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-400">No Data to Analyze</h3>
        <p className="text-gray-300">Add some records to see your analytics dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Category Record Summary Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Total Records by Category</h3>
          <p className="text-[10px] font-bold text-indigo-400 uppercase">Live Database Statistics</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat} 
              className={`p-6 rounded-[2rem] border bg-gradient-to-br transition-all shadow-sm group hover:scale-[1.02] ${CATEGORY_STYLES[cat] || 'from-gray-50 to-slate-50 border-gray-100'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">{cat}</p>
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] }}
                ></div>
              </div>
              <p className="text-3xl font-bold leading-none">{stats.catMap[cat] || 0}</p>
              <p className="text-[10px] font-semibold mt-2 opacity-50">Total Records</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stat Card */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Database Capacity</h3>
          <div className="relative">
            <span className="text-7xl font-black text-indigo-500 tracking-tighter">{stats.total}</span>
            <span className="text-indigo-200 font-bold ml-2">items</span>
          </div>
          <p className="text-sm text-gray-400 mt-4 font-medium italic">Across {CATEGORIES.length} distinct categories</p>
          <div className="mt-8 w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
              <div 
                  className="h-full bg-indigo-400 rounded-full transition-all duration-1000 shadow-sm shadow-indigo-100" 
                  style={{ width: '100%' }}
              ></div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Status Overview</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
              {stats.statusData.map((s) => (
                  <div key={s.name} className="flex flex-col items-center">
                      <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: s.color }}></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{s.name}</span>
                      <span className="text-sm font-bold text-gray-600">{s.value}</span>
                  </div>
              ))}
          </div>
        </div>

        {/* Category Overview Bar Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Performance Profile</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: '#f8fafc', radius: 10 }}
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 12, 12]} 
                  barSize={32}
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_CHART_COLORS[entry.name] || '#BDB2FF'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_CHART_COLORS[cat] }}></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
