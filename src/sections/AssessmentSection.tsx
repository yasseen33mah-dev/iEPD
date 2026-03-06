import React, { useState, useEffect } from 'react';
import { Save, ChevronRight } from 'lucide-react';
import { Student } from '../types';

interface AssessmentSectionProps {
  currentStudent: Student | null;
  onSave: (student: Student) => void;
  onNext: () => void;
}

export default function AssessmentSection({ currentStudent, onSave, onNext }: AssessmentSectionProps) {
  const [assessment, setAssessment] = useState<any>({});

  useEffect(() => {
    if (currentStudent?.assessment) {
      setAssessment(currentStudent.assessment);
    } else {
      setAssessment({});
    }
  }, [currentStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAssessment((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!currentStudent) return;
    onSave({ ...currentStudent, assessment });
    alert('تم حفظ التقييم');
  };

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6] text-center">
        <p className="text-lg text-gray-500">الرجاء اختيار طالب من قسم "بيانات الطالب" أولاً.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <h2 className="text-2xl font-medium mb-4">📝 التقييم والتشخيص الشامل</h2>
      <p className="mb-8">الطالب الحالي: <strong className="text-[#4a9eff]">{currentStudent.studentName}</strong></p>

      <form className="space-y-10">
        <div>
          <h3 className="text-lg font-medium mb-6 bg-[#eaf1fb] px-6 py-2 rounded-full inline-block">📋 التشخيص الأولي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">نوع الإعاقة</label>
              <input type="text" id="disabilityType" value={assessment.disabilityType || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="مثال: صعوبات تعلم / توحد" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">صعوبات التعلم المحددة</label>
              <input type="text" id="specificLD" value={assessment.specificLD || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="مثل: عسر القراءة" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">حالة الطالب</label>
              <select id="studentEvalStatus" value={assessment.studentEvalStatus || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]">
                <option value="">-- اختر --</option>
                <option value="غير مقيم تقييم رسمي">غير مقيم تقييم رسمي</option>
                <option value="مقيم وضمن الخدمة">مقيم وضمن الخدمة</option>
                <option value="مقيم وينتظر الخدمة">مقيم وينتظر الخدمة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تاريخ التقييم</label>
              <input type="date" id="assessmentDate" value={assessment.assessmentDate || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-6 bg-[#eaf1fb] px-6 py-2 rounded-full inline-block">🧠 العمليات الإدراكية واللغوية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">ملخص التشخيص الإدراكي</label>
              <textarea id="cognitiveSummary" value={assessment.cognitiveSummary || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" rows={3} placeholder="وصف للعمليات الأساسية والإدراكية..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اللغة الاستقبالية</label>
              <input type="text" id="receptiveLang" value={assessment.receptiveLang || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اللغة التعبيرية</label>
              <input type="text" id="expressiveLang" value={assessment.expressiveLang || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            type="button" 
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#1e2b3c] text-white px-8 py-3 rounded-full hover:bg-[#2a3b4f] transition-colors"
          >
            <Save size={20} /> حفظ التقييم
          </button>
          <button 
            type="button" 
            onClick={onNext}
            className="flex items-center gap-2 bg-[#2a7f62] text-white px-8 py-3 rounded-full hover:bg-[#359a7a] transition-colors"
          >
            التالي: الخطة العلاجية <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
