import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Download, Upload, ChevronRight } from 'lucide-react';
import { Student } from '../types';
import * as XLSX from 'xlsx';

interface StudentDataSectionProps {
  students: Student[];
  currentStudentId: string | null;
  setCurrentStudentId: (id: string | null) => void;
  onSave: (student: Student) => void;
  onDelete: (id: string) => void;
  onNext: () => void;
}

export default function StudentDataSection({ 
  students, currentStudentId, setCurrentStudentId, onSave, onDelete, onNext 
}: StudentDataSectionProps) {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentStudentId) {
      const student = students.find(s => s.id === currentStudentId);
      if (student) setFormData(student);
    } else {
      setFormData({});
    }
  }, [currentStudentId, students]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!formData.studentName) {
      alert('الاسم مطلوب');
      return;
    }
    const id = formData.id || 'stu_' + Date.now();
    onSave({ ...formData, id } as Student);
  };

  const handleClear = () => {
    setCurrentStudentId(null);
    setFormData({});
  };

  const downloadTemplate = () => {
    const headers = [
      'اسم الطالب', 'تاريخ الميلاد', 'الجنسية', 'ولي الأمر', 'اسم الأب', 'اسم الأم',
      'عدد الأخوة', 'عدد الأخوات', 'ترتيبه داخل الأسرة', 'الصف', 'الشعبة', 'المدرسة',
      'رقم الطالب', 'معلم الفصل', 'هاتف المدرسة', 'هاتف الأب', 'هاتف المنزل',
      'نوع المشكلة', 'تاريخ تنفيذ الخطة', 'تاريخ التشخيص', 'نوع الخطة', 'المنسق', 'حالة الطالب'
    ];
    const data = [headers];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'قالب');
    XLSX.writeFile(wb, 'قالب_استيراد_طلاب.xlsx');
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      if (data.length < 2) {
        alert('الملف فارغ');
        return;
      }

      const headers = data[0];
      const rows = data.slice(1);

      const fieldMap: Record<string, keyof Student> = {
        'اسم الطالب': 'studentName',
        'تاريخ الميلاد': 'birthDate',
        'الجنسية': 'nationality',
        'ولي الأمر': 'guardian',
        'اسم الأب': 'fatherName',
        'اسم الأم': 'motherName',
        'عدد الأخوة': 'brothers',
        'عدد الأخوات': 'sisters',
        'ترتيبه داخل الأسرة': 'familyOrder',
        'الصف': 'grade',
        'الشعبة': 'classSection',
        'المدرسة': 'school',
        'رقم الطالب': 'studentIdNumber',
        'معلم الفصل': 'classTeacher',
        'هاتف المدرسة': 'schoolPhone',
        'هاتف الأب': 'fatherPhone',
        'هاتف المنزل': 'homePhone',
        'نوع المشكلة': 'problemType',
        'تاريخ تنفيذ الخطة': 'planDate',
        'تاريخ التشخيص': 'diagnosisDate',
        'نوع الخطة': 'planType',
        'المنسق': 'coordinator',
        'حالة الطالب': 'studentStatus'
      };

      rows.forEach((row, idx) => {
        const student: any = { id: 'stu_import_' + Date.now() + '_' + idx };
        headers.forEach((header, colIdx) => {
          const field = fieldMap[header];
          if (field) {
            student[field] = row[colIdx];
          }
        });
        if (student.studentName) {
          onSave(student);
        }
      });
      alert('تم استيراد البيانات بنجاح');
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-medium flex items-center gap-3">👤 بيانات الطالب الأساسية</h2>
        <div className="flex gap-3">
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#d0ddee] hover:bg-[#eef5fc] text-sm"
          >
            <Download size={16} /> تحميل قالب Excel
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#d0ddee] hover:bg-[#eef5fc] text-sm"
          >
            <Upload size={16} /> استيراد من Excel
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportExcel} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <select 
          id="student-selector" 
          className="flex-1 px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff] focus:outline-none focus:border-[#4a9eff]"
          value={currentStudentId || ''}
          onChange={(e) => setCurrentStudentId(e.target.value || null)}
        >
          <option value="">-- اختر طالباً أو أضف جديد --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.studentName} (الصف {s.grade || '?'})</option>
          ))}
        </select>
        <button 
          onClick={handleClear}
          className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-[#d0ddee] hover:bg-[#eef5fc]"
        >
          <Plus size={20} /> جديد
        </button>
      </div>

      <form className="space-y-10">
        <div>
          <h3 className="text-lg font-medium mb-6 bg-[#eaf1fb] px-6 py-2 rounded-full inline-block">📋 البيانات الأولية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">👤 اسم الطالب/ــة</label>
              <input type="text" id="studentName" value={formData.studentName || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="الاسم الكامل" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📅 تاريخ الميلاد</label>
              <input type="date" id="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🌍 الجنسية</label>
              <input type="text" id="nationality" value={formData.nationality || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="الجنسية" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📚 الصف</label>
              <input type="text" id="grade" value={formData.grade || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="الصف" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🧑‍🏫 الشعبة</label>
              <input type="text" id="classSection" value={formData.classSection || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="مثال: أ / ب" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🏫 المدرسة</label>
              <input type="text" id="school" value={formData.school || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="المدرسة" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-6 bg-[#eaf1fb] px-6 py-2 rounded-full inline-block">⚠️ المشكلة والتشخيص</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">📌 نوع المشكلة</label>
              <input type="text" id="problemType" value={formData.problemType || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" placeholder="وصف المشكلة / الإعاقة" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📋 نوع الخطة التربوية الفردية</label>
              <select id="planType" value={formData.planType || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]">
                <option value="">-- اختر --</option>
                <option value="تكيف">تكيف</option>
                <option value="تعديل">تعديل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📅 تاريخ التشخيص</label>
              <input type="date" id="diagnosisDate" value={formData.diagnosisDate || ''} onChange={handleChange} className="w-full px-4 py-2 border border-[#dde5ed] rounded-xl bg-[#fbfdff]" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            type="button" 
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#1e2b3c] text-white px-8 py-3 rounded-full hover:bg-[#2a3b4f] transition-colors"
          >
            <Save size={20} /> حفظ بيانات الطالب
          </button>
          {currentStudentId && (
            <button 
              type="button" 
              onClick={() => onDelete(currentStudentId)}
              className="flex items-center gap-2 bg-[#fbe9e9] text-[#b33] px-8 py-3 rounded-full hover:bg-[#f8d7d7] transition-colors"
            >
              <Trash2 size={20} /> حذف الطالب
            </button>
          )}
          <button 
            type="button" 
            onClick={onNext}
            disabled={!currentStudentId}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full transition-colors
              ${currentStudentId ? 'bg-[#2a7f62] text-white hover:bg-[#359a7a]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            التالي: التقييم
          </button>
        </div>
      </form>
    </div>
  );
}
