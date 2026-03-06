import React from 'react';
import { Student, Plan, Followup } from '../types';

interface ReportsSectionProps {
  students: Student[];
  plans: Plan[];
  followups: Followup[];
}

export default function ReportsSection({ students, plans, followups }: ReportsSectionProps) {
  const sortedPlans = [...plans].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <h2 className="text-2xl font-medium mb-8">📄 التقارير الكاملة</h2>
      
      <div className="space-y-8">
        {sortedPlans.length === 0 && <p className="text-center text-gray-500 py-10">لا توجد خطط محفوظة بعد.</p>}
        {sortedPlans.map(plan => {
          const student = students.find(s => s.id === plan.studentId);
          const studentFollowups = followups.filter(f => f.studentId === plan.studentId);

          return (
            <div key={plan.id} className="bg-white rounded-3xl p-8 border border-[#e0ecf9] shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-[#e0ecf9] pb-4">
                <div className="text-xl font-bold text-[#1e3b5c]">👤 {student?.studentName || plan.studentName} | الصف {student?.grade || plan.grade}</div>
                <span className="bg-[#e5eff9] px-4 py-1 rounded-full text-sm font-medium">📅 الخطة: {plan.date}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#f8fcff] p-4 rounded-2xl border border-[#e0ecf9]">
                  <h4 className="font-bold mb-2">نقاط القوة العامة:</h4>
                  <p className="text-sm text-gray-700">{plan.strengths || '—'}</p>
                </div>
                <div className="bg-[#f8fcff] p-4 rounded-2xl border border-[#e0ecf9]">
                  <h4 className="font-bold mb-2">نقاط الضعف العامة:</h4>
                  <p className="text-sm text-gray-700">{plan.weaknesses || '—'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-lg">الأهداف ({plan.items.length} مادة)</h4>
                {plan.items.map((item, idx) => (
                  <div key={idx} className="bg-[#f9fcff] p-6 rounded-2xl border border-[#d0e0f0]">
                    <div className="font-bold text-[#1e3b5c] mb-2">📘 {item.subjectName} — {item.longTermName}</div>
                    <div className="text-sm mb-2">مستوى الأداء: {item.performanceLevel || '—'}</div>
                    <div className="text-sm mb-4 text-gray-600">📅 الهدف الطويل: {item.longStartDate} إلى {item.longEndDate}</div>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">الأهداف القصيرة:</div>
                      <ul className="list-disc list-inside mr-4 space-y-1">
                        {item.shortTerms.map((st, i) => <li key={i}>{st.name} (من {st.startDate} إلى {st.endDate})</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {studentFollowups.length > 0 && (
                <div className="bg-[#f0f6ff] p-6 rounded-2xl">
                  <h4 className="font-bold mb-4">📅 جلسات المتابعة ({studentFollowups.length})</h4>
                  <div className="space-y-4">
                    {studentFollowups.map((f, idx) => (
                      <div key={idx} className="border-b border-[#dde5f0] last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <strong>جلسة {idx + 1} - {f.date}</strong>
                          <span className="text-xs">✅ {f.goalsStatus.filter(g => g.status === 'متم').length} | ❌ {f.goalsStatus.filter(g => g.status === 'لم ينجز').length}</span>
                        </div>
                        <div className="text-sm text-gray-700">توصيات: {f.recommendations || '—'}</div>
                        <div className="text-sm text-gray-700">نتائج: {f.results || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
