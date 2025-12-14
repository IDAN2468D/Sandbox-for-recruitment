import React from 'react';
import { AdvancedAssets } from '../types';
import { Mail, TrendingUp, Scale, Copy, ArrowRight, AlertCircle, Code2, ClipboardCheck, CalendarClock, Coins, Network } from 'lucide-react';

interface AdvancedAssetsViewProps {
  data: AdvancedAssets;
}

const AdvancedAssetsView: React.FC<AdvancedAssetsViewProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in text-right" dir="rtl">
      
      {/* 1. Outreach Message */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            1. הודעת פנייה (Outreach)
          </h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">LinkedIn / Email</span>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">נושא / כותרת</span>
            <div className="text-lg font-bold text-slate-900 mt-1">{data.outreachMessage.headline}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-wrap relative group">
            {data.outreachMessage.content}
            <button 
              onClick={() => navigator.clipboard.writeText(data.outreachMessage.content)}
              className="absolute top-2 left-2 p-2 bg-white rounded-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 text-slate-500"
              title="העתק טקסט"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 2. Hiring Challenge */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
               <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">2. אתגר גיוס (בית)</h3>
          </div>
          <div className="p-6 space-y-4">
              <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-1">מטרה</h4>
                  <p className="text-slate-800">{data.hiringChallenge.objective}</p>
              </div>
              <div className="flex gap-4">
                  <div className="bg-slate-50 px-3 py-2 rounded border border-slate-100 flex-1">
                      <span className="text-xs text-slate-500 block">משך זמן</span>
                      <span className="font-semibold text-slate-800">{data.hiringChallenge.duration}</span>
                  </div>
              </div>
              <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">תוצרים נדרשים</h4>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      {data.hiringChallenge.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
              </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">קריטריונים להערכה</h4>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      {data.hiringChallenge.evaluationCriteria.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
              </div>
          </div>
        </section>

        {/* 3. Screening Questions */}
         <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
               <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">3. שאלות סינון (Screening)</h3>
          </div>
          <div className="p-6">
              <ul className="space-y-4">
                  {data.screeningQuestions.map((q, i) => (
                      <li key={i} className="flex gap-3">
                          <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                          <div>
                              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-1 inline-block">{q.category}</span>
                              <p className="text-slate-800 font-medium">{q.question}</p>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
        </section>

        {/* 4. Success Metrics (KPIs) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
               <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">4. מדדי הצלחה (KPIs)</h3>
          </div>
          <div className="p-6 relative">
             <div className="absolute top-8 bottom-8 right-[2.25rem] w-0.5 bg-slate-200"></div>
             <div className="space-y-8">
               {data.successMetrics.map((kpi, idx) => (
                 <div key={idx} className="relative flex items-start gap-4">
                    <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-emerald-700 mb-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                            {kpi.timeframe}
                        </div>
                        <p className="text-slate-700 font-medium leading-snug">
                            {kpi.goal}
                        </p>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* 5. Onboarding Plan */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-cyan-100 p-2 rounded-lg text-cyan-600">
               <CalendarClock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">5. תכנית קליטה (30 יום)</h3>
          </div>
          <div className="p-6 space-y-6">
              <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span> שבוע 1: היכרות
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mr-4">
                      {data.onboardingPlan.week1.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
                  <h4 className="font-bold text-cyan-900 text-sm mb-1">🏆 אבן דרך (יום 30)</h4>
                  <p className="text-cyan-800 text-sm">{data.onboardingPlan.day30Milestone}</p>
              </div>
          </div>
        </section>

        {/* 6. Compensation Analysis */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
               <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">6. ניתוח שכר ומו"מ</h3>
          </div>
          <div className="p-6 space-y-4">
              <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">יתרונות תחרותיים (לא כספיים)</h4>
                   <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      {data.compAnalysis.competitiveAdvantages.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                  <h4 className="text-xs font-bold text-yellow-700 uppercase mb-1">טקטיקה לדרישת +15%</h4>
                  <p className="text-sm text-yellow-900 italic">"{data.compAnalysis.negotiationTactic}"</p>
              </div>
          </div>
        </section>
        
        {/* 7. Stakeholder Map */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-pink-100 p-2 rounded-lg text-pink-600">
               <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">7. מפת גורמי מפתח</h3>
          </div>
          <div className="p-6">
              <div className="space-y-3">
                  {data.stakeholderMap.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-100">
                          <div>
                              <div className="font-bold text-slate-800 text-sm">{s.role}</div>
                          </div>
                          <div className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500 max-w-[50%] text-left" dir="ltr">
                              Target: {s.collaborationGoal}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </section>

        {/* 8. Bias Analysis */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
               <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">8. ניתוח הטיות (DEI)</h3>
          </div>
          <div className="p-6 space-y-4">
             {data.biasAnalysis.map((item, idx) => (
               <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                 <div className="flex items-center gap-2 mb-2 text-rose-600 text-xs font-bold uppercase">
                    <AlertCircle className="w-3 h-3" />
                    זוהתה הטיה: {item.biasType}
                 </div>
                 <div className="mb-2 line-through decoration-rose-400 decoration-2 text-slate-400 text-sm">
                    "{item.originalText}"
                 </div>
                 <div className="flex items-start gap-2 text-emerald-700 font-medium text-sm">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500 transform rotate-180" />
                    <span>{item.suggestion}</span>
                 </div>
               </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdvancedAssetsView;