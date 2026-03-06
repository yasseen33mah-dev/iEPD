import React from 'react';
import { Plus, FileText, Calendar, UserCircle } from 'lucide-react';
import { Student, Plan, Followup } from '../types';

interface HomeSectionProps {
  students: Student[];
  plans: Plan[];
  followups: Followup[];
  currentStudent: Student | null;
  setActiveSection: (section: string) => void;
}

export default function HomeSection({ 
  students, plans, followups, currentStudent, setActiveSection 
}: HomeSectionProps) {
  const stats = [
    { label: 'إجمالي الطلاب', value: students.length },
    { label: 'الخطط النشطة', value: plans.length },
    { label: 'متابعات هذا الأسبوع', value: followups.length }, // Simplified
    { label: 'متوسط الإنجاز', value: '75%' }, // Placeholder
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">🏠 الصفحة الرئيسية</h2>
          <span className="text-[#4a6f8f]">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <p className="text-lg mb-8">مرحباً بك في نظام إدارة الخطط التربوية الفردية لأصحاب الهمم. من هنا يمكنك متابعة آخر المستجدات والوصول السريع للعمليات الرئيسية.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-[#f5f9ff] rounded-3xl p-6 text-center shadow-sm border border-[#e9f0f8]">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-[#4a6f8f]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <button 
            onClick={() => setActiveSection('student-data')}
            className="flex items-center gap-2 bg-[#eef5fc] hover:bg-[#dae9fb] px-6 py-3 rounded-full transition-colors"
          >
            <Plus size={20} /> إضافة طالب
          </button>
          <button 
            onClick={() => setActiveSection('plan')}
            className="flex items-center gap-2 bg-[#eef5fc] hover:bg-[#dae9fb] px-6 py-3 rounded-full transition-colors"
          >
            <FileText size={20} /> إنشاء خطة
          </button>
          <button 
            onClick={() => setActiveSection('followup')}
            className="flex items-center gap-2 bg-[#eef5fc] hover:bg-[#dae9fb] px-6 py-3 rounded-full transition-colors"
          >
            <Calendar size={20} /> تسجيل متابعة
          </button>
        </div>

        {currentStudent && (
          <div className="bg-[#e2f0fa] rounded-2xl p-6">
            <h4 className="text-xl font-medium mb-4 flex items-center gap-2">
              <UserCircle /> الطالب الحالي: {currentStudent.studentName}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>الصف: {currentStudent.grade || 'غير محدد'} | الشعبة: {currentStudent.classSection || 'غير محدد'}</p>
              <p>آخر خطة: {plans.filter(p => p.studentId === currentStudent.id).slice(-1)[0]?.date || 'لا توجد'}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setActiveSection('student-data')} className="bg-white px-4 py-2 rounded-lg border border-[#d0ddee] hover:bg-[#eef5fc]">عرض الملف</button>
              <button onClick={() => setActiveSection('plan')} className="bg-white px-4 py-2 rounded-lg border border-[#d0ddee] hover:bg-[#eef5fc]">الخطة</button>
              <button onClick={() => setActiveSection('followup')} className="bg-white px-4 py-2 rounded-lg border border-[#d0ddee] hover:bg-[#eef5fc]">متابعة</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
