import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { Student, Plan, Followup } from '../types';

interface DashboardSectionProps {
  students: Student[];
  plans: Plan[];
  followups: Followup[];
}

const COLORS = ['#4a9eff', '#ffb74a', '#7acf8c', '#f06292', '#ba8cf4'];

export default function DashboardSection({ students, plans, followups }: DashboardSectionProps) {
  // Data processing for charts
  const disabilityData = students.reduce((acc: any[], s) => {
    const type = s.assessment?.disabilityType || 'غير محدد';
    const existing = acc.find(item => item.name === type);
    if (existing) existing.value += 1;
    else acc.push({ name: type, value: 1 });
    return acc;
  }, []);

  const gradeData = students.reduce((acc: any[], s) => {
    const grade = s.grade || 'غير محدد';
    const existing = acc.find(item => item.name === grade);
    if (existing) existing.value += 1;
    else acc.push({ name: grade, value: 1 });
    return acc;
  }, []);

  const stats = [
    { label: 'إجمالي الطلاب', value: students.length },
    { label: 'الخطط النشطة', value: plans.length },
    { label: 'المتابعات', value: followups.length },
    { label: 'متوسط الإنجاز', value: '75%' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#eef2f6]">
        <h2 className="text-2xl font-medium mb-8">📊 لوحة التحكم والإحصائيات</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-[#e9f0f8]">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-[#4a6f8f]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-[#eef2f6] h-[400px]">
            <h4 className="font-bold mb-6">توزيع الإعاقات</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {disabilityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#eef2f6] h-[400px]">
            <h4 className="font-bold mb-6">توزيع الصفوف</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4a9eff" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
