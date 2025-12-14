import React from 'react';
import { CandidateProfile } from '../types';
import { User, AlertTriangle, Zap, GraduationCap, Briefcase, Award } from 'lucide-react';

interface CandidateProfilesViewProps {
  profiles: CandidateProfile[];
}

const CandidateProfilesView: React.FC<CandidateProfilesViewProps> = ({ profiles }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'High-Potential Junior': return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'Core Mid-Level': return <Briefcase className="w-6 h-6 text-purple-600" />;
      case 'Veteran Specialist': return <Award className="w-6 h-6 text-amber-600" />;
      default: return <User className="w-6 h-6 text-slate-600" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'High-Potential Junior': return 'border-r-4 border-r-blue-500';
      case 'Core Mid-Level': return 'border-r-4 border-r-purple-500';
      case 'Veteran Specialist': return 'border-r-4 border-r-amber-500';
      default: return 'border-r-4 border-r-slate-500';
    }
  };

  const getHebrewTitle = (type: string) => {
    switch (type) {
      case 'High-Potential Junior': return "ג'וניור עם פוטנציאל גבוה";
      case 'Core Mid-Level': return 'הליבה (Mid-Level)';
      case 'Veteran Specialist': return 'המומחה הוותיק';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">פרופילי מועמדים אידיאליים</h2>
        <p className="text-slate-600">שלוש פרסונות שונות למיקוד החיפוש.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div 
            key={profile.id}
            className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all ${getColorClass(profile.type)}`}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                  {getIcon(profile.type)}
                </div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">
                  {getHebrewTitle(profile.type)}
                </h3>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {profile.description}
              </p>

              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">נקודת מכירה</span>
                  </div>
                  <p className="text-sm text-emerald-900 font-medium">
                    "{profile.keySellingPoint}"
                  </p>
                </div>

                <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">נורה אדומה פוטנציאלית</span>
                  </div>
                  <p className="text-sm text-rose-900 font-medium">
                    {profile.redFlag}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateProfilesView;