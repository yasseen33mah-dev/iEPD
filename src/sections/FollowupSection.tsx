import React, { useState, useEffect } from 'react';
import { Save, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Student, Plan, Followup } from '../types';

interface FollowupSectionProps {
  currentStudent: Student | null;
  plans: Plan[];
  followups: Followup[];
  onSave: (followup: Followup) => void;
}

export default function FollowupSection({ currentStudent, plans, followups, onSave }: FollowupSectionProps) {
  const [goalsStatus, setGoalsStatus] = useState<{ description: string; status: string }[]>([]);
  const [recommendations, setRecommendations] = useState('');
  const [results, setResults] = useState('');

  const studentPlans = plans.filter(p => p.studentId === currentStudent?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestPlan = studentPlans[0];

  useEffect(() => {
    if (latestPlan) {
      const allShortGoals: { description: string; status: string }[] = [];
      latestPlan.items.forEach(item => {
        item.shortTerms.forEach(short => {
          allShortGoals.push({
            description: `${item.subjectName} - ${item.longTermName} / ${short.name} (${short.startDate || '?'} إلى ${short.endDate || '?'})`,
            status: 'متم'
          });
        });
      });
      setGoalsStatus(allShortGoals);
    } else {
      setGoalsStatus([]);
    }
  }, [latestPlan]);

  const handleSave = () => {
    if (!currentStudent) return;
    if (!latestPlan) { alert('لا توجد خطة للطالب'); return; }

    const newFollowup: Followup = {
      id: 'fol_' + Date.now(),
      studentId: currentStudent.id,
      date: new Date().toLocaleDateString('ar-EG'),
      goalsStatus,
      recommendations,
      results
    };

    onSave(newFollowup);
    setRecommendations('');
    setResults('');
    alert('تم حفظ المتابعة');
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
      <h2 className="text-2xl font-medium mb-6">📅 جلسة متابعة وتقييم دوري</h2>
      <p className="mb-8">الطالب: <strong className="text-[#4a9eff]">{currentStudent.studentName}</strong></p>

      {!latestPlan ? (
        <div className="bg-[#fbe9e9] text-[#b33] p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle /> لا توجد خطة علاجية سابقة لهذا الطالب. الرجاء إعداد خطة أولاً.
        </div>
      ) : (
        <div className="space-y-10">
          <div className="overflow-x-auto rounded-3xl border border-[#dde5f0]">
            <table className="w-full border-collapse bg-[#f9fcff]">
              <thead>
                <tr className="bg-[#e5eff9] text-[#1e3b5c]">
                  <th className="px-6 py-4 text-right font-semibold">الهدف (قصير المدى)</th>
                  <th className="px-6 py-4 text-right font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {goalsStatus.map((goal, idx) => (
                  <tr key={idx} className="border-b border-[#dde5f0]">
                    <td className="px-6 py-4 text-sm">{goal.description}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={goal.status} 
                        onChange={(e) => {
                          const updated = [...goalsStatus];
                          updated[idx].status = e.target.value;
                          setGoalsStatus(updated);
                        }}
                        className="w-full px-4 py-2 border border-[#bcd3e6] rounded-full bg-white text-sm"
                      >
                        <option value="متم">✅ متم</option>
                        <option value="لم ينجز">❌ لم ينجز</option>
                        <option value="في طور الإنجاز">🔄 في طور الإنجاز</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">التوصيات</label>
              <textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} rows={3} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="توصيات بعد المراجعة..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">نتائج المراجعة</label>
              <textarea value={results} onChange={(e) => setResults(e.target.value)} rows={3} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="نتائج المراجعة الحالية..."></textarea>
            </div>
          </div>

          <button onClick={handleSave} className="bg-[#1e2b3c] text-white px-8 py-3 rounded-full hover:bg-[#2a3b4f] transition-colors flex items-center gap-2">
            <Save size={20} /> حفظ المتابعة
          </button>

          <div className="bg-[#f2f7fe] rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-6">سجل المتابعات السابقة</h3>
            <div className="space-y-4">
              {followups.filter(f => f.studentId === currentStudent.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((f, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border-r-8 border-[#4a9eff] shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <strong className="text-lg flex items-center gap-2"><Calendar size={18} /> {f.date}</strong>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={16} /> متم: {f.goalsStatus.filter(g => g.status === 'متم').length}</span>
                      <span className="flex items-center gap-1 text-red-600"><XCircle size={16} /> لم ينجز: {f.goalsStatus.filter(g => g.status === 'لم ينجز').length}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2"><strong>توصيات:</strong> {f.recommendations || '—'}</p>
                  <p className="text-sm"><strong>نتائج:</strong> {f.results || '—'}</p>
                </div>
              ))}
              {followups.filter(f => f.studentId === currentStudent.id).length === 0 && <p className="text-gray-500">لا توجد متابعات سابقة.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
