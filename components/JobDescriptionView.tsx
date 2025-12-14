import React, { useState, useEffect } from 'react';
import { JobDescription } from '../types';
import { Briefcase, CheckCircle2, Star, Users, Building2, Trophy, PlusCircle, Gift, Copy, Check, Pencil, Coins } from 'lucide-react';

interface JobDescriptionViewProps {
  data: JobDescription;
}

const JobDescriptionView: React.FC<JobDescriptionViewProps> = ({ data }) => {
  const [localData, setLocalData] = useState<JobDescription>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync props to local state if data changes (new generation)
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleCopy = () => {
    const textToCopy = `
${localData.title}

על החברה:
${localData.aboutUs}

למה להצטרף אלינו?
${localData.keySellingPoints?.map(p => `- ${p}`).join('\n')}

תקציר המשרה:
${localData.summary}

תחומי אחריות:
${localData.responsibilities.map(r => `- ${r}`).join('\n')}

דרישות חובה:
${localData.hardSkills.map(s => `- ${s}`).join('\n')}

יתרון משמעותי:
${localData.niceToHaves?.map(s => `- ${s}`).join('\n')}

כישורים רכים:
${localData.softSkills.map(s => `- ${s}`).join('\n')}

מה אנחנו מציעים:
${localData.whatWeOffer?.map(o => `- ${o}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleArrayChange = (field: keyof JobDescription, value: string) => {
    setLocalData(prev => ({
        ...prev,
        [field]: value.split('\n').filter(line => line.trim() !== '')
    }));
  };

  const SalaryBar = ({ min, max, currency }: { min: number, max: number, currency: string }) => {
      const midpoint = (min + max) / 2;
      return (
          <div className="bg-white p-4 rounded-lg border border-slate-200 mt-4">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  טווח שכר (חודשי)
              </h4>
              <div className="relative pt-6 pb-2 px-2">
                  {/* Bar */}
                  <div className="h-4 bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200 rounded-full w-full relative">
                      {/* Midpoint Marker */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-blue-600"></div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
                       <span className="text-xs font-bold text-slate-800">{max.toLocaleString()} {currency}</span>
                       <div className="h-2 w-0.5 bg-slate-300 mb-1"></div>
                  </div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                       <span className="text-xs font-bold text-blue-700">{midpoint.toLocaleString()}</span>
                  </div>
                   <div className="absolute top-0 right-0 translate-x-1/2 flex flex-col items-center">
                       <span className="text-xs font-bold text-slate-800">{min.toLocaleString()} {currency}</span>
                       <div className="h-2 w-0.5 bg-slate-300 mb-1"></div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      <span>מקסימום</span>
                      <span>אמצע טווח</span>
                      <span>מינימום</span>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="animate-fade-in space-y-8 text-right relative pb-8" dir="rtl">
      {/* Actions Toolbar */}
      <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-slate-100 shadow-sm z-10 mb-6">
          <div className="flex gap-2">
              <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[40px]"
              >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "הועתק!" : "העתק תיאור"}
              </button>
          </div>
          <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all min-h-[40px]
                  ${isEditing 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'}`}
          >
              {isEditing ? (
                  <> <Check className="w-4 h-4" /> סיום עריכה </>
              ) : (
                  <> <Pencil className="w-4 h-4" /> ערוך תוכן </>
              )}
          </button>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        {isEditing ? (
            <input 
                type="text" 
                value={localData.title}
                onChange={(e) => setLocalData({...localData, title: e.target.value})}
                className="w-full text-2xl md:text-3xl font-bold text-slate-900 mb-2 border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent p-1"
            />
        ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{localData.title}</h1>
        )}
        
        <div className="flex items-start gap-4 mt-4 bg-blue-50 p-4 rounded-lg">
           <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
           <div className="w-full">
               <h4 className="font-bold text-blue-900 text-sm mb-1">על החברה</h4>
               {isEditing ? (
                   <textarea
                       value={localData.aboutUs}
                       onChange={(e) => setLocalData({...localData, aboutUs: e.target.value})}
                       className="w-full bg-white/50 p-2 rounded border border-blue-200 text-sm text-blue-900 h-24 focus:ring-2 focus:ring-blue-300 outline-none"
                   />
               ) : (
                   <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">{localData.aboutUs}</p>
               )}
           </div>
        </div>
      </div>

      {/* Salary Visualization */}
      {localData.salary && (
          <SalaryBar min={localData.salary.min} max={localData.salary.max} currency={localData.salary.currency} />
      )}

      {/* Selling Points */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            למה כדאי לך להצטרף?
        </h3>
        {isEditing ? (
            <textarea
                value={localData.keySellingPoints?.join('\n')}
                onChange={(e) => handleArrayChange('keySellingPoints', e.target.value)}
                className="w-full p-3 rounded-lg border border-amber-200 bg-amber-50 focus:ring-2 focus:ring-amber-300 outline-none text-sm h-32"
                placeholder="כל נקודה בשורה חדשה..."
            />
        ) : (
            <div className="grid sm:grid-cols-3 gap-4">
                {localData.keySellingPoints?.map((point, idx) => (
                    <div key={idx} className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-sm text-amber-900 font-medium">
                        {point}
                    </div>
                ))}
            </div>
        )}
      </section>

      {/* Summary */}
      <section>
          <h3 className="text-lg font-bold text-slate-800 mb-2">תקציר המשרה</h3>
          {isEditing ? (
              <textarea
                  value={localData.summary}
                  onChange={(e) => setLocalData({...localData, summary: e.target.value})}
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-32"
              />
          ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{localData.summary}</p>
          )}
      </section>

      {/* Responsibilities */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          תחומי אחריות עיקריים
        </h3>
        {isEditing ? (
             <textarea
                value={localData.responsibilities.join('\n')}
                onChange={(e) => handleArrayChange('responsibilities', e.target.value)}
                className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none h-48 font-mono text-sm"
            />
        ) : (
            <ul className="space-y-3">
            {localData.responsibilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                <span>{item}</span>
                </li>
            ))}
            </ul>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Hard Skills */}
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            דרישות חובה
          </h3>
          {isEditing ? (
             <textarea
                value={localData.hardSkills.join('\n')}
                onChange={(e) => handleArrayChange('hardSkills', e.target.value)}
                className="w-full p-3 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none h-40 font-mono text-sm"
            />
          ) : (
            <ul className="space-y-2">
                {localData.hardSkills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                    {skill.includes("[Placeholder") ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-mono border border-emerald-200 w-full block">
                            {skill}
                        </span>
                    ) : (
                        skill
                    )}
                </li>
                ))}
            </ul>
          )}
        </section>

        {/* Nice to Haves */}
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-500" />
            יתרון משמעותי
          </h3>
          {isEditing ? (
             <textarea
                value={localData.niceToHaves?.join('\n')}
                onChange={(e) => handleArrayChange('niceToHaves', e.target.value)}
                className="w-full p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none h-40 font-mono text-sm"
            />
          ) : (
            <ul className="space-y-2">
                {localData.niceToHaves?.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                    {skill}
                </li>
                ))}
            </ul>
          )}
        </section>
      </div>
      
       {/* Soft Skills */}
        <section className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            תכונות ומיומנויות רכות
          </h3>
          {isEditing ? (
             <textarea
                value={localData.softSkills.join('\n')}
                onChange={(e) => handleArrayChange('softSkills', e.target.value)}
                className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none h-32 font-mono text-sm"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
                {localData.softSkills.map((skill, idx) => (
                <span key={idx} className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-100">
                    {skill}
                </span>
                ))}
            </div>
          )}
        </section>

      {/* What We Offer */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-700" />
          מה אנחנו מציעים?
        </h3>
         {isEditing ? (
             <textarea
                value={localData.whatWeOffer?.join('\n')}
                onChange={(e) => handleArrayChange('whatWeOffer', e.target.value)}
                className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-mono text-sm bg-white/50"
            />
          ) : (
            <ul className="grid sm:grid-cols-2 gap-3">
                {localData.whatWeOffer?.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-blue-800">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        {benefit}
                    </li>
                ))}
            </ul>
          )}
      </section>
    </div>
  );
};

export default JobDescriptionView;