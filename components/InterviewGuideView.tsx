import React from 'react';
import { InterviewQuestion } from '../types';
import { MessageSquare, Target, Code, Brain, Zap, Scale, HeartHandshake } from 'lucide-react';

interface InterviewGuideViewProps {
  questions: InterviewQuestion[];
}

const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({ questions }) => {
  const getSkillTypeHebrew = (type: string) => {
    switch(type) {
        case "Hard Skill": return "מיומנות טכנית";
        case "Soft Skill": return "מיומנות רכה";
        case "Problem Solving": return "פתרון בעיות";
        case "Conflict Resolution": return "ניהול קונפליקטים";
        case "DEI": return "גיוון והכלה (DEI)";
        default: return type;
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
        case "Hard Skill": return <Code className="w-3.5 h-3.5" />;
        case "Soft Skill": return <Brain className="w-3.5 h-3.5" />;
        case "Problem Solving": return <Zap className="w-3.5 h-3.5" />;
        case "Conflict Resolution": return <Scale className="w-3.5 h-3.5" />;
        case "DEI": return <HeartHandshake className="w-3.5 h-3.5" />;
        default: return <Target className="w-3.5 h-3.5" />;
    }
  };

  const getColor = (type: string) => {
     switch(type) {
        case "Hard Skill": return "bg-emerald-50 text-emerald-700";
        case "Soft Skill": return "bg-amber-50 text-amber-700";
        case "Problem Solving": return "bg-purple-50 text-purple-700";
        case "Conflict Resolution": return "bg-rose-50 text-rose-700";
        case "DEI": return "bg-teal-50 text-teal-700";
        default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">מדריך ראיונות התנהגותי מורחב</h2>
        <span className="bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full">
          {questions.length} שאלות
        </span>
      </div>

      <div className="grid gap-4">
        {questions.map((q, index) => (
          <div 
            key={q.id} 
            className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-slate-900 mb-2">
                  "{q.question}"
                </h4>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium ${getColor(q.type)}`}>
                    {getIcon(q.type)}
                    {getSkillTypeHebrew(q.type)}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    <Target className="w-3.5 h-3.5" />
                    מטרה: {q.targetSkill}
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                 <MessageSquare className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewGuideView;