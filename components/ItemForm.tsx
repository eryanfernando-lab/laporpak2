
import React, { useState, useEffect } from 'react';
import { getSmartItemDetails } from '../services/geminiService';
import { CATEGORIES, Icons } from '../constants';
import { InventoryItem } from '../types';

interface ItemFormProps {
  onSave: (item: { id?: string; name: string; category: string; description: string; tags: string[]; hasEng?: boolean; engName?: string }) => void;
  onClose: () => void;
  initialItem?: InventoryItem | null;
  defaultCategory?: string | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSave, onClose, initialItem, defaultCategory }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // ENG Link states
  const [hasEngOption, setHasEngOption] = useState<boolean | null>(null);
  const [engName, setEngName] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setDescription(initialItem.description);
      setTags(initialItem.tags);
    } else if (defaultCategory && CATEGORIES.includes(defaultCategory)) {
      setCategory(defaultCategory);
    }
  }, [initialItem, defaultCategory]);

  const handleAiAutoFill = async () => {
    if (!name.trim()) return;
    setIsAiLoading(true);
    const details = await getSmartItemDetails(name);
    if (details) {
      setDescription(details.description || "");
      if (details.category && CATEGORIES.includes(details.category)) {
        setCategory(details.category);
      } else {
        const match = CATEGORIES.find(c => c.toLowerCase() === details.category?.toLowerCase());
        if (match) setCategory(match);
      }
      setTags(details.tags || []);
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({ 
      id: initialItem?.id, 
      name: name.trim(), 
      category, 
      description: description.trim(), 
      tags,
      hasEng: (category === 'Reguler' && hasEngOption === true),
      engName: (category === 'Reguler' && hasEngOption === true) ? engName.trim() : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-slideUp border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400">
                {initialItem ? <Icons.Pencil /> : <Icons.Plus />}
             </div>
             <h2 className="text-2xl font-bold text-black">
               {initialItem ? 'Edit Record' : 'Create New Record'}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Item Title / Episode</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (hasEngOption) setEngName(`ENG - ${e.target.value}`);
                }}
                placeholder="e.g. Episode 1025"
                className="flex-1 px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none transition-all text-black font-medium"
                required
              />
              {!initialItem && (
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={!name || isAiLoading}
                  className="bg-indigo-50 text-indigo-500 px-4 rounded-2xl hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[3.5rem] shadow-sm active:scale-95"
                  title="Generate details with AI"
                >
                  {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Icons.Sparkles />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category Bucket</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none transition-all appearance-none text-black font-medium cursor-pointer"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Continuous Integration: Reguler -> ENG Question */}
          {!initialItem && category === 'Reguler' && (
            <div className="p-6 bg-indigo-50/40 rounded-[2.5rem] border border-indigo-100 space-y-5 animate-fadeIn">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-black text-indigo-500 uppercase tracking-widest">Apakah ada ENG nya?</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setHasEngOption(true); setEngName(`ENG - ${name}`); }}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border-2 flex items-center justify-center gap-2 ${hasEngOption === true ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02]' : 'bg-white text-indigo-300 border-indigo-50 hover:border-indigo-100'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${hasEngOption === true ? 'bg-white text-indigo-500 border-white' : 'border-indigo-100'}`}>
                      {hasEngOption === true && <Icons.Check />}
                    </div>
                    YA
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHasEngOption(false); setEngName(''); }}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border-2 flex items-center justify-center gap-2 ${hasEngOption === false ? 'bg-slate-400 text-white border-slate-400 shadow-lg shadow-slate-100 scale-[1.02]' : 'bg-white text-slate-300 border-slate-50 hover:border-slate-100'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${hasEngOption === false ? 'bg-white text-slate-400 border-white' : 'border-slate-100'}`}>
                      {hasEngOption === false && <Icons.Check />}
                    </div>
                    TIDAK
                  </button>
                </div>
              </div>
              
              {hasEngOption === true && (
                <div className="space-y-2 animate-slideDown">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">ENG Item Title Box</label>
                  <input
                    type="text"
                    value={engName}
                    onChange={(e) => setEngName(e.target.value)}
                    placeholder="Auto-generated ENG title..."
                    className="w-full px-4 py-4 bg-white border-2 border-indigo-200 rounded-2xl outline-none text-indigo-900 font-bold text-sm focus:ring-4 ring-indigo-50 transition-all shadow-sm"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Brief Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Case summary or production notes..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none transition-all resize-none text-black font-medium"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-[1.8rem] font-black hover:shadow-2xl hover:shadow-indigo-200 transition-all transform active:scale-[0.97] flex items-center justify-center gap-2 text-lg tracking-tight"
            >
              <Icons.Plus />
              {initialItem ? 'Update Database' : (hasEngOption === true ? 'Commit Dual Records' : 'Commit to Database')}
            </button>
            <p className="text-center text-[10px] text-slate-300 mt-5 uppercase font-black tracking-[0.3em]">Persistent Database Sync Active</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
