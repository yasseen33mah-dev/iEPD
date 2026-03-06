import React from 'react';
import { Student } from '../types';
import { Trash2, FileText, UserCircle, Edit } from 'lucide-react';

interface UsersSectionProps {
  students: Student[];
  onEdit: (id: string) => void;
  onReport: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UsersSection({ students, onEdit, onReport, onDelete }: UsersSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
      <h2 className="text-2xl font-medium mb-6">👥 إدارة الطلاب</h2>
      <p className="mb-8 text-gray-500">قائمة بجميع الطلاب المسجلين مع إمكانية عرض البيانات، التقرير، التعديل، والحذف.</p>
      
      <div className="overflow-x-auto rounded-3xl border border-[#dde5f0]">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-[#e5eff9] text-[#1e3b5c]">
              <th className="px-6 py-4 text-right font-semibold">اسم الطالب</th>
              <th className="px-6 py-4 text-right font-semibold">الصف</th>
              <th className="px-6 py-4 text-right font-semibold">الشعبة</th>
              <th className="px-6 py-4 text-right font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">لا يوجد طلاب مسجلين بعد.</td>
              </tr>
            )}
            {students.map(student => (
              <tr key={student.id} className="border-b border-[#dde5f0] hover:bg-[#f9fcff] transition-colors">
                <td className="px-6 py-4 font-medium">{student.studentName}</td>
                <td className="px-6 py-4">{student.grade || '—'}</td>
                <td className="px-6 py-4">{student.classSection || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(student.id)} className="p-2 text-[#1e2b3c] hover:bg-[#eef5fc] rounded-full transition-colors" title="تعديل"><Edit size={18} /></button>
                    <button onClick={() => onReport(student.id)} className="p-2 text-[#1e2b3c] hover:bg-[#eef5fc] rounded-full transition-colors" title="عرض التقرير"><FileText size={18} /></button>
                    <button onClick={() => onDelete(student.id)} className="p-2 text-[#c44536] hover:bg-[#fbe9e9] rounded-full transition-colors" title="حذف"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
