import React, { useState, useEffect } from 'react';
import { 
  Home, LayoutDashboard, UserCircle, ClipboardList, 
  BarChart3, Wrench, Puzzle, Calendar, FileText, Users,
  Plus, Trash2, Save, ChevronRight, Download, Upload,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Plan, Followup, PlanItem } from './types';
import { servicesData, modificationsData, accommodationsData, curriculumData } from './constants';

// --- Components ---
import Sidebar from './components/Sidebar';
import HomeSection from './sections/HomeSection';
import DashboardSection from './sections/DashboardSection';
import StudentDataSection from './sections/StudentDataSection';
import AssessmentSection from './sections/AssessmentSection';
import StrategiesSection from './sections/StrategiesSection';
import PlanSection from './sections/PlanSection';
import FollowupSection from './sections/FollowupSection';
import ReportsSection from './sections/ReportsSection';
import UsersSection from './sections/UsersSection';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, plansRes, followupsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/plans'),
          fetch('/api/followups')
        ]);
        
        const studentsData = await studentsRes.json();
        const plansData = await plansRes.json();
        const followupsData = await followupsRes.json();
        
        setStudents(studentsData);
        setPlans(plansData);
        setFollowups(followupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentStudent = students.find(s => s.id === currentStudentId) || null;

  const handleSaveStudent = async (studentData: Student) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        setStudents(prev => {
          const index = prev.findIndex(s => s.id === studentData.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = studentData;
            return updated;
          }
          return [...prev, studentData];
        });
        setCurrentStudentId(studentData.id);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        if (currentStudentId === id) setCurrentStudentId(null);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleSavePlan = async (planData: Plan) => {
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      if (res.ok) {
        setPlans(prev => [...prev, planData]);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleSaveFollowup = async (followupData: Followup) => {
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followupData)
      });
      if (res.ok) {
        setFollowups(prev => [...prev, followupData]);
      }
    } catch (error) {
      console.error("Error saving followup:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f4f7fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e2b3c]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f7fa] text-[#1e2b3c]" dir="rtl">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'home' && (
              <HomeSection 
                students={students} 
                plans={plans} 
                followups={followups} 
                currentStudent={currentStudent}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === 'dashboard' && (
              <DashboardSection 
                students={students} 
                plans={plans} 
                followups={followups} 
              />
            )}
            {activeSection === 'student-data' && (
              <StudentDataSection 
                students={students} 
                currentStudentId={currentStudentId}
                setCurrentStudentId={setCurrentStudentId}
                onSave={handleSaveStudent}
                onDelete={handleDeleteStudent}
                onNext={() => setActiveSection('assessment')}
              />
            )}
            {activeSection === 'assessment' && (
              <AssessmentSection 
                currentStudent={currentStudent}
                onSave={handleSaveStudent}
                onNext={() => setActiveSection('plan')}
              />
            )}
            {activeSection === 'strategies' && (
              <StrategiesSection 
                currentStudent={currentStudent}
                onSave={handleSaveStudent}
              />
            )}
            {activeSection === 'plan' && (
              <PlanSection 
                currentStudent={currentStudent}
                onSave={handleSavePlan}
              />
            )}
            {activeSection === 'followup' && (
              <FollowupSection 
                currentStudent={currentStudent}
                plans={plans}
                followups={followups}
                onSave={handleSaveFollowup}
              />
            )}
            {activeSection === 'reports' && (
              <ReportsSection 
                students={students}
                plans={plans}
                followups={followups}
              />
            )}
            {activeSection === 'users' && (
              <UsersSection 
                students={students}
                onEdit={(id) => { setCurrentStudentId(id); setActiveSection('student-data'); }}
                onReport={(id) => { setActiveSection('reports'); }}
                onDelete={handleDeleteStudent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
