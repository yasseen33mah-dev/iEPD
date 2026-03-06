export interface Student {
  id: string;
  studentName: string;
  birthDate?: string;
  nationality?: string;
  guardian?: string;
  fatherName?: string;
  motherName?: string;
  brothers?: number;
  sisters?: number;
  familyOrder?: number;
  grade?: string;
  classSection?: string;
  school?: string;
  studentIdNumber?: string;
  classTeacher?: string;
  schoolPhone?: string;
  fatherPhone?: string;
  homePhone?: string;
  problemType?: string;
  planDate?: string;
  supportTeamDate?: string;
  specialEdCenterDate?: string;
  diagnosisDate?: string;
  planType?: string;
  coordinator?: string;
  studentStatus?: string;
  assessment?: any;
  supportServices?: string[];
  adaptations?: string[];
  accommodations?: string[];
  interventions?: string[];
}

export interface PlanItem {
  subjectName: string;
  longTermName: string;
  longStartDate: string;
  longEndDate: string;
  performanceLevel: string;
  shortTerms: { name: string; startDate: string; endDate: string }[];
}

export interface Plan {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  classSection: string;
  date: string;
  strengths: string;
  weaknesses: string;
  items: PlanItem[];
}

export interface Followup {
  id: string;
  studentId: string;
  date: string;
  goalsStatus: { description: string; status: string }[];
  recommendations: string;
  results: string;
}
