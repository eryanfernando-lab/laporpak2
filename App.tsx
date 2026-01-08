
import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, ItemStatus } from './types';
import { Icons, CATEGORIES, CATEGORY_STYLES } from './constants';
import Dashboard from './components/Dashboard';
import ItemForm from './components/ItemForm';

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('lapor_pak_database');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse database", e);
      }
    }
    return [
      { id: '1', name: 'Episode 1024 - Lapor Pak!', category: 'Reguler', description: 'Tim Lapor Pak mengusut kasus pencurian barang antik.', status: 'POTDUR & EDIT', lastUpdated: new Date().toISOString(), tags: ['Action'], hasEng: true },
      { id: '2', name: 'Built-in Kopi Mantap', category: 'Built In', description: 'Segmen promosi kopi di tengah interogasi.', status: 'PREVIEW', lastUpdated: new Date().toISOString(), tags: ['Sponsor'] }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'dashboard'>('records');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lapor_pak_database', JSON.stringify(items));
  }, [items]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateItemStatus = (id: string, newStatus: ItemStatus, airDate?: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status: newStatus, 
          lastUpdated: new Date().toISOString(),
          airDate: newStatus === 'SUDAH TAYANG' ? (airDate || item.airDate) : undefined
        };
      }
      return item;
    }));
  };

  const handleSaveItem = (data: any) => {
    if (data.id) {
      // Update existing
      setItems(prev => prev.map(item => item.id === data.id ? { ...item, ...data, lastUpdated: new Date().toISOString() } : item));
      showToast("Database updated");
    } else {
      // Create new
      const mainId = Math.random().toString(36).substr(2, 9);
      const newMainItem: InventoryItem = {
        id: mainId,
        name: data.name,
        category: data.category,
        description: data.description,
        status: 'PREVIEW',
        lastUpdated: new Date().toISOString(),
        tags: data.tags || [],
        hasEng: data.hasEng
      };

      let newItems = [newMainItem];

      // DUAL ENTRY LOGIC: If category is Reguler and YA (hasEng) is selected
      if (data.category === 'Reguler' && data.hasEng && data.engName) {
        const engId = Math.random().toString(36).substr(2, 9);
        const newEngItem: InventoryItem = {
          id: engId,
          name: data.engName,
          category: 'ENG',
          description: `Linked ENG for ${data.name}`,
          status: 'PREVIEW',
          lastUpdated: new Date().toISOString(),
          tags: ['ENG', 'Linked'],
          hasEng: false
        };
        newMainItem.linkedEngId = engId;
        newItems.push(newEngItem);
      }

      setItems(prev => [...newItems, ...prev]);
      showToast(newItems.length > 1 ? "Dual records committed" : "Record created");
    }
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) result = result.filter(item => item.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    }
    return result;
  }, [items, selectedCategory, searchQuery]);

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-24 font-inter text-slate-800">
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-6">Delete permanently?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setItemToDelete(null)} className="py-3 rounded-xl font-bold bg-slate-50 text-slate-400">Cancel</button>
              <button onClick={() => { setItems(prev => prev.filter(i => i.id !== itemToDelete)); setItemToDelete(null); }} className="py-3 rounded-xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] animate-bounce">
          <div className={`px-6 py-3 rounded-2xl shadow-xl font-bold text-sm bg-white border ${toast.type === 'success' ? 'text-green-600 border-green-100' : 'text-rose-600 border-rose-100'}`}>
            {toast.message}
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setSelectedCategory(null); setActiveTab('records');}}>
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">L</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Tayangan</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Lapor Pak! Production</p>
          </div>
        </div>
        <div className="hidden md:flex bg-slate-100/50 p-1 rounded-2xl">
          <button onClick={() => setActiveTab('records')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-white shadow-sm text-indigo-500' : 'text-slate-400'}`}>Database</button>
          <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-500' : 'text-slate-400'}`}>Analytics</button>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-indigo-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-100 font-bold flex items-center gap-2 active:scale-95 transition-transform">
          <Icons.Plus /> <span>New Item</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {activeTab === 'dashboard' ? <Dashboard items={items} /> : (
          <>
            {!selectedCategory && !searchQuery ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`p-10 rounded-[3rem] border-2 border-transparent text-left transition-all hover:scale-[1.02] bg-gradient-to-br shadow-sm hover:shadow-xl ${CATEGORY_STYLES[cat]}`}>
                    <h3 className="text-3xl font-bold mb-2">{cat}</h3>
                    <p className="text-sm font-bold opacity-60">Browse Records</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <button onClick={() => {setSelectedCategory(null); setSearchQuery('');}} className="flex items-center gap-2 text-indigo-500 font-bold hover:translate-x-[-4px] transition-transform">
                    <Icons.ChevronLeft /> Back to Menu
                  </button>
                  <input type="text" placeholder="Search database..." className="w-72 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 ring-indigo-50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-7 shadow-sm hover:shadow-2xl transition-all flex flex-col min-h-[460px] group">
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${CATEGORY_STYLES[item.category]}`}>{item.category}</span>
                          {item.hasEng && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-500 text-white text-[9px] font-black shadow-sm shadow-indigo-100 animate-pulse">ENG</span>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-slate-300 hover:text-indigo-500"><Icons.Pencil /></button>
                          <button onClick={() => setItemToDelete(item.id)} className="text-slate-300 hover:text-rose-500"><Icons.Trash /></button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
                      <p className="text-sm text-slate-400 font-medium line-clamp-3 mb-8 flex-grow">{item.description}</p>
                      
                      <div className="pt-6 border-t border-slate-50 space-y-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Status</p>
                        
                        <div className="space-y-2 min-h-[140px] flex flex-col justify-end">
                          {item.status === 'SUDAH TAYANG' && item.airDate ? (
                            <div className="space-y-4 animate-fadeIn">
                              <label className="block relative cursor-pointer group/label">
                                <input 
                                  type="date"
                                  className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                  value={item.airDate}
                                  onChange={(e) => e.target.value && updateItemStatus(item.id, 'SUDAH TAYANG', e.target.value)}
                                />
                                <div className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/30 shadow-md group-hover/label:border-rose-400 transition-all">
                                  <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white"><Icons.Check /></div>
                                  <span className="text-sm font-black text-rose-600 uppercase tracking-tight">SUDAH TAYANG</span>
                                </div>
                              </label>
                              <div className="p-5 bg-rose-500 rounded-[2rem] text-white shadow-lg shadow-rose-100 transform rotate-1 transition-transform hover:rotate-0">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Broadcast Schedule</p>
                                <p className="text-base font-black tracking-tight">{formatDateLabel(item.airDate)}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 animate-fadeIn">
                              {[
                                { id: 'POTDUR & EDIT', color: 'bg-emerald-500' },
                                { id: 'PREVIEW', color: 'bg-amber-500' }
                              ].map(st => (
                                <button key={st.id} onClick={() => updateItemStatus(item.id, st.id as ItemStatus)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.status === st.id ? 'bg-slate-50 border-slate-200 shadow-inner scale-[0.98]' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${item.status === st.id ? st.color + ' border-transparent text-white' : 'bg-white border-slate-200'}`}>
                                    {item.status === st.id && <Icons.Check />}
                                  </div>
                                  <span className={`text-xs font-bold uppercase tracking-tight ${item.status === st.id ? 'text-slate-800' : 'text-slate-400'}`}>{st.id}</span>
                                </button>
                              ))}

                              {/* Semantic Label for 'SUDAH TAYANG' Checkbox */}
                              <label className="block relative cursor-pointer group/label">
                                <input 
                                  type="date"
                                  className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                  onChange={(e) => {
                                    if(e.target.value) updateItemStatus(item.id, 'SUDAH TAYANG', e.target.value);
                                  }}
                                />
                                <div className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.status === 'SUDAH TAYANG' ? 'bg-rose-50 border-rose-200 shadow-md' : 'bg-white border-slate-100 group-hover/label:bg-rose-50/50 group-hover/label:border-rose-100'}`}>
                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${item.status === 'SUDAH TAYANG' ? 'bg-rose-500 border-transparent text-white' : 'bg-white border-slate-200'}`}>
                                    {item.status === 'SUDAH TAYANG' && <Icons.Check />}
                                  </div>
                                  <span className={`text-xs font-bold uppercase tracking-tight ${item.status === 'SUDAH TAYANG' ? 'text-rose-600' : 'text-slate-400'}`}>SUDAH TAYANG</span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {showForm && <ItemForm onSave={handleSaveItem} onClose={() => { setShowForm(false); setEditingItem(null); }} initialItem={editingItem} defaultCategory={selectedCategory} />}
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 py-4 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2024 LAPOR PAK! INTERNAL DATABASE • PERSISTENCE ACTIVE</p>
      </footer>
    </div>
  );
};

export default App;
