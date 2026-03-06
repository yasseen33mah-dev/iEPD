import React, { useState, useEffect } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Student } from '../types';
import { servicesData, modificationsData, accommodationsData } from '../constants';

interface StrategiesSectionProps {
  currentStudent: Student | null;
  onSave: (student: Student) => void;
}

export default function StrategiesSection({ currentStudent, onSave }: StrategiesSectionProps) {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [category, setCategory] = useState('all');
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    if (currentStudent) {
      const items = [
        ...(currentStudent.supportServices || []),
        ...(currentStudent.adaptations || []),
        ...(currentStudent.accommodations || []),
        ...(currentStudent.interventions || [])
      ];
      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }
  }, [currentStudent]);

  const handleToggleItem = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    if (!selectedItems.includes(customInput.trim())) {
      setSelectedItems(prev => [...prev, customInput.trim()]);
    }
    setCustomInput('');
  };

  const handleSave = () => {
    if (!currentStudent) return;
    
    const supportServices: string[] = [];
    const adaptations: string[] = [];
    const accommodations: string[] = [];
    const interventions: string[] = [];

    selectedItems.forEach(item => {
      let found = false;
      for (const cat in servicesData) {
        if (servicesData[cat].includes(item)) { supportServices.push(item); found = true; break; }
      }
      if (found) return;
      for (const cat in modificationsData) {
        if (modificationsData[cat].includes(item)) { adaptations.push(item); found = true; break; }
      }
      if (found) return;
      for (const cat in accommodationsData) {
        if (accommodationsData[cat].includes(item)) { accommodations.push(item); found = true; break; }
      }
      if (found) return;
      interventions.push(item);
    });

    onSave({ 
      ...currentStudent, 
      supportServices, adaptations, accommodations, interventions 
    });
    alert('تم حفظ الخيارات للطالب');
  };

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6] text-center">
        <p className="text-lg text-gray-500">الرجاء اختيار طالب أولاً.</p>
      </div>
    );
  }

  const getItems = () => {
    let data: Record<string, string[]> = {};
    if (activeTab === 'services') data = servicesData;
    else if (activeTab === 'modifications') data = modificationsData;
    else if (activeTab === 'accommodations') data = accommodationsData;

    if (category === 'all') {
      return Object.values(data).flat();
    }
    return data[category] || [];
  };

  const items = getItems();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">🛠️ بنك الخدمات المساندة والتكييفات والمواءمات</h2>
        <button 
          onClick={handleSave}
          className="bg-[#2a7f62] text-white px-8 py-3 rounded-full hover:bg-[#359a7a] transition-colors flex items-center gap-2"
        >
          <Save size={20} /> حفظ الخيارات للطالب
        </button>
      </div>
      <p className="mb-8">الطالب الحالي: <strong className="text-[#4a9eff]">{currentStudent.studentName}</strong></p>

      <div className="flex border-b border-[#dde5ed] mb-8">
        <button 
          onClick={() => { setActiveTab('services'); setCategory('all'); }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'services' ? 'border-[#4a9eff] text-[#4a9eff]' : 'border-transparent text-gray-500'}`}
        >الخدمات المساندة</button>
        <button 
          onClick={() => { setActiveTab('modifications'); setCategory('all'); }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'modifications' ? 'border-[#4a9eff] text-[#4a9eff]' : 'border-transparent text-gray-500'}`}
        >التكييفات (Modifications)</button>
        <button 
          onClick={() => { setActiveTab('accommodations'); setCategory('all'); }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'accommodations' ? 'border-[#4a9eff] text-[#4a9eff]' : 'border-transparent text-gray-500'}`}
        >المواءمات (Accommodations)</button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <label className="font-medium">التصنيف:</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-[#dde5ed] rounded-full bg-white focus:outline-none focus:border-[#4a9eff] min-w-[200px]"
        >
          <option value="all">الكل</option>
          {Object.keys(activeTab === 'services' ? servicesData : activeTab === 'modifications' ? modificationsData : accommodationsData).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">({items.length} عنصر)</span>
      </div>

      <div className="bg-[#f9fcff] rounded-3xl p-6 border border-[#e6ecf5] max-h-[400px] overflow-y-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e0ecf9] cursor-pointer hover:bg-[#f0f7ff] transition-colors">
              <input 
                type="checkbox" 
                checked={selectedItems.includes(item)} 
                onChange={() => handleToggleItem(item)}
                className="w-5 h-5 rounded border-gray-300 text-[#4a9eff] focus:ring-[#4a9eff]"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-10">
        <input 
          type="text" 
          value={customInput} 
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
          className="flex-1 px-6 py-3 border border-[#dde5ed] rounded-full bg-white focus:outline-none focus:border-[#4a9eff]" 
          placeholder="أضف عنصراً مخصصاً..." 
        />
        <button 
          onClick={handleAddCustom}
          className="bg-[#1e2b3c] text-white px-8 py-3 rounded-full hover:bg-[#2a3b4f] transition-colors"
        >إضافة</button>
      </div>

      <div className="bg-[#eef5fc] rounded-2xl p-6">
        <h3 className="text-lg font-medium mb-4">العناصر المختارة</h3>
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item, i) => (
            <span key={i} className="bg-white border border-[#4a9eff] px-4 py-2 rounded-full text-sm flex items-center gap-2">
              {item}
              <button onClick={() => handleToggleItem(item)} className="text-[#c44536] hover:bg-gray-100 rounded-full p-1"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
