import React from 'react';
import { 
  Home, LayoutDashboard, UserCircle, ClipboardList, 
  BarChart3, Wrench, Puzzle, Calendar, FileText, Users
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'student-data', label: 'بيانات الطالب', icon: UserCircle },
  { id: 'assessment', label: 'التقييم', icon: ClipboardList },
  { id: 'analysis', label: 'تحليل النتائج', icon: BarChart3 },
  { id: 'strategies', label: 'الاستراتيجيات والموائمات', icon: Wrench },
  { id: 'plan', label: 'الخطة الفردية', icon: Puzzle },
  { id: 'followup', label: 'المتابعة', icon: Calendar },
  { id: 'reports', label: 'التقارير', icon: FileText },
  { id: 'users', label: 'إدارة الطلاب', icon: Users },
];

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1e2b3c] text-white flex flex-col shadow-lg overflow-y-auto">
      <div className="p-6 border-b border-[#3a4a5a]">
        <h2 className="text-xl font-light text-[#b0c4de]">📋 نظام IEP</h2>
      </div>
      
      <nav className="flex-1 mt-4">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                px-6 py-3 my-1 cursor-pointer transition-all flex items-center gap-3
                border-r-4 hover:bg-[#253545] hover:text-white
                ${activeSection === item.id 
                  ? 'bg-[#2a3b4f] border-[#4a9eff] text-white font-medium' 
                  : 'border-transparent text-[#cfdbe9]'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
