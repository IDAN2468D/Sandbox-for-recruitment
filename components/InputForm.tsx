import React, { useState } from 'react';
import { Loader2, Sparkles, FileText, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface InputFormProps {
  onGenerate: (rawNotes: string) => void;
  isGenerating: boolean;
}

const DEFAULT_TEMPLATE = `תפקיד: מדען נתונים בכיר
כפיפות ל: ראש מחלקת אנליטיקה

תחומי אחריות:
- בניית מודלים לחיזוי נטישת לקוחות
- חונכות ל-2 אנליסטים זוטרים
- הטמעת מודלים בסביבת ייצור (AWS)
- הצגת ממצאים לבעלי עניין לא טכניים

דרישות קשות (Hard Skills):
- Python (Pandas, Scikit-learn)
- SQL (מתקדם)
- AWS SageMaker
- Terraform (יתרון)

מיומנויות רכות:
- תקשורת בין-אישית חזקה
- ראייה עסקית
- יוזמה וחתירה למגע

שכר ומיקום:
- 35,000 - 45,000 ש"ח
- היברידי (תל אביב)`;

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isGenerating }) => {
  const [notes, setNotes] = useState(DEFAULT_TEMPLATE);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col lg:h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center w-full lg:cursor-default cursor-pointer hover:bg-slate-100 lg:hover:bg-slate-50 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="input-content"
      >
        <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            הגדרות תפקיד
            </h2>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">קלט גולמי</span>
        </div>
        {/* Mobile Toggle Icons */}
        <div className="flex items-center gap-2 lg:hidden">
            {isCollapsed && notes.length > 50 && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    מוכן
                </span>
            )}
            {isCollapsed ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
        </div>
      </button>
      
      <div id="input-content" className={`flex-1 flex flex-col ${isCollapsed ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex-1 p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
            הערות גולמיות
            </label>
            <textarea
            className="w-full h-48 lg:h-[calc(100%-1rem)] resize-y lg:resize-none p-4 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm bg-slate-50 text-slate-700 text-right"
            placeholder="הדבק את דרישות התפקיד הגולמיות כאן..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            dir="rtl"
            />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
            onClick={() => {
                onGenerate(notes);
                // On mobile, collapse after clicking generate to see results
                if (window.innerWidth < 1024) {
                    setIsCollapsed(true);
                }
            }}
            disabled={isGenerating || !notes.trim()}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-md min-h-[44px]
                ${isGenerating || !notes.trim() 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}`}
            >
            {isGenerating ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                מעבד...
                </>
            ) : (
                <>
                <Sparkles className="w-5 h-5" />
                צור מסמכים
                </>
            )}
            </button>
            {isGenerating && (
                <p className="text-center text-xs text-slate-500 mt-2 animate-pulse">
                מצב חשיבה פעיל: מנתח דרישות...
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;