import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Student, Plan, PlanItem } from '../types';
import { curriculumData } from '../constants';

interface PlanSectionProps {
  currentStudent: Student | null;
  onSave: (plan: Plan) => void;
}

export default function PlanSection({ currentStudent, onSave }: PlanSectionProps) {
  const [subject, setSubject] = useState('');
  const [stage, setStage] = useState('');
  const [longTerm, setLongTerm] = useState('');
  const [performanceLevel, setPerformanceLevel] = useState('');
  const [longStartDate, setLongStartDate] = useState('');
  const [longEndDate, setLongEndDate] = useState('');
  const [shortTerms, setShortTerms] = useState<{ name: string; startDate: string; endDate: string; checked: boolean }[]>([]);
  
  const [currentPlanItems, setCurrentPlanItems] = useState<PlanItem[]>([]);
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');

  useEffect(() => {
    if (subject && stage && longTerm) {
      const goals = curriculumData[subject]?.[stage]?.[longTerm] || [];
      setShortTerms(goals.map((g: string) => ({ name: g, startDate: '', endDate: '', checked: false })));
    } else {
      setShortTerms([]);
    }
  }, [subject, stage, longTerm]);

  const handleAddSubject = () => {
    if (!subject || !longTerm) { alert('اختر مادة وهدفاً طويلاً'); return; }
    
    const selectedShortTerms = shortTerms.filter(st => st.checked);
    if (selectedShortTerms.length === 0) { alert('اختر هدفاً قصيراً واحداً على الأقل'); return; }

    const newItem: PlanItem = {
      subjectName: subject,
      longTermName: longTerm,
      longStartDate,
      longEndDate,
      performanceLevel,
      shortTerms: selectedShortTerms.map(st => ({ name: st.name, startDate: st.startDate, endDate: st.endDate }))
    };

    setCurrentPlanItems(prev => [...prev, newItem]);
    
    // Reset inputs
    setSubject(''); setStage(''); setLongTerm(''); setPerformanceLevel(''); setLongStartDate(''); setLongEndDate(''); setShortTerms([]);
  };

  const handleSavePlan = () => {
    if (!currentStudent) { alert('اختر طالباً أولاً'); return; }
    if (currentPlanItems.length === 0) { alert('أضف أهدافاً للخطة'); return; }

    const newPlan: Plan = {
      id: 'plan_' + Date.now(),
      studentId: currentStudent.id,
      studentName: currentStudent.studentName,
      grade: currentStudent.grade || '',
      classSection: currentStudent.classSection || '',
      date: new Date().toLocaleDateString('ar-EG'),
      strengths,
      weaknesses,
      items: currentPlanItems
    };

    onSave(newPlan);
    setCurrentPlanItems([]);
    setStrengths('');
    setWeaknesses('');
    alert('تم حفظ الخطة بنجاح');
  };

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6] text-center">
        <p className="text-lg text-gray-500">الرجاء اختيار طالب أولاً.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">✏️ إعداد الخطة العلاجية</h2>
        <div className="flex gap-3">
          <button onClick={() => setCurrentPlanItems([])} className="bg-[#f39c12] text-white px-6 py-2 rounded-full hover:bg-[#e67e22] transition-colors flex items-center gap-2">
            <RotateCcw size={18} /> بدء خطة جديدة
          </button>
        </div>
      </div>
      <p className="mb-8">الطالب: <strong className="text-[#4a9eff]">{currentStudent.studentName}</strong></p>

      <div className="space-y-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">نقاط القوة العامة (اختياري)</label>
            <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="نقاط القوة ..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">نقاط الضعف العامة (اختياري)</label>
            <textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={2} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="نقاط الضعف ..."></textarea>
          </div>
        </div>
      </div>

      <hr className="mb-10" />

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">المادة</label>
            <select value={subject} onChange={(e) => { setSubject(e.target.value); setStage(''); setLongTerm(''); }} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]">
              <option value="">-- اختر المادة --</option>
              {Object.keys(curriculumData).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">المرحلة</label>
            <select value={stage} onChange={(e) => { setStage(e.target.value); setLongTerm(''); }} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]">
              <option value="">-- اختر المرحلة --</option>
              {subject && Object.keys(curriculumData[subject]).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">الهدف طويل المدى</label>
            <select value={longTerm} onChange={(e) => setLongTerm(e.target.value)} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]">
              <option value="">-- اختر هدفاً --</option>
              {subject && stage && Object.keys(curriculumData[subject][stage]).map(lt => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>
        </div>

        {longTerm && (
          <div className="space-y-6 bg-[#f9fcff] p-6 rounded-3xl border border-[#d0e0f0]">
            <div>
              <label className="block text-sm font-medium mb-2">مستوى الأداء الحالي (نقاط القوة والضعف لهذا المجال)</label>
              <textarea value={performanceLevel} onChange={(e) => setPerformanceLevel(e.target.value)} rows={3} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-white" placeholder="صف مستوى الأداء الحالي..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ بدء الهدف الطويل</label>
                <input type="date" value={longStartDate} onChange={(e) => setLongStartDate(e.target.value)} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ انتهاء الهدف الطويل</label>
                <input type="date" value={longEndDate} onChange={(e) => setLongEndDate(e.target.value)} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-white" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-2">الأهداف القصيرة (حدد التواريخ لكل هدف):</label>
              {shortTerms.map((st, i) => (
                <div key={i} className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-xl border border-[#e0ecf9]">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={st.checked} 
                      onChange={() => {
                        const updated = [...shortTerms];
                        updated[i].checked = !updated[i].checked;
                        setShortTerms(updated);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-[#4a9eff]"
                    />
                    <span className="text-sm">{st.name}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      value={st.startDate} 
                      onChange={(e) => {
                        const updated = [...shortTerms];
                        updated[i].startDate = e.target.value;
                        setShortTerms(updated);
                      }}
                      className="text-xs px-2 py-1 border border-[#dde5ed] rounded-lg" 
                      placeholder="بدء" 
                    />
                    <input 
                      type="date" 
                      value={st.endDate} 
                      onChange={(e) => {
                        const updated = [...shortTerms];
                        updated[i].endDate = e.target.value;
                        setShortTerms(updated);
                      }}
                      className="text-xs px-2 py-1 border border-[#dde5ed] rounded-lg" 
                      placeholder="انتهاء" 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleAddSubject} className="bg-[#1e2b3c] text-white px-8 py-3 rounded-full hover:bg-[#2a3b4f] transition-colors flex items-center gap-2">
              <Plus size={20} /> إضافة إلى الخطة
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 bg-[#eef5fc] rounded-3xl p-8">
        <h3 className="text-xl font-medium mb-6">الموضوعات المضافة في الخطة</h3>
        <div className="space-y-4">
          {currentPlanItems.length === 0 && <p className="text-gray-500">لم يتم إضافة أي أهداف بعد.</p>}
          {currentPlanItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#e0ecf9] relative">
              <button onClick={() => setCurrentPlanItems(prev => prev.filter((_, i) => i !== idx))} className="absolute top-4 left-4 text-[#c44536] hover:bg-gray-100 p-2 rounded-full"><Trash2 size={18} /></button>
              <div className="font-bold text-lg mb-2">📘 {item.subjectName} - {item.longTermName}</div>
              <div className="text-sm text-gray-600 mb-4">📅 {item.longStartDate} إلى {item.longEndDate}</div>
              <div className="text-sm mb-4"><strong>مستوى الأداء:</strong> {item.performanceLevel}</div>
              <div className="text-sm">
                <strong>الأهداف القصيرة:</strong>
                <ul className="list-disc list-inside mr-4 mt-2">
                  {item.shortTerms.map((st, i) => <li key={i}>{st.name} ({st.startDate} إلى {st.endDate})</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSavePlan}
        className="mt-10 w-full bg-[#2a7f62] text-white px-8 py-4 rounded-full hover:bg-[#359a7a] transition-colors font-bold text-lg flex items-center justify-center gap-2"
      >
        <Save size={24} /> حفظ الخطة كاملة
      </button>
    </div>
  );
}
