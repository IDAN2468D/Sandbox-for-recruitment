import React, { useState } from 'react';
import InputForm from './components/InputForm';
import JobDescriptionView from './components/JobDescriptionView';
import InterviewGuideView from './components/InterviewGuideView';
import CandidateProfilesView from './components/CandidateProfilesView';
import AdvancedAssetsView from './components/AdvancedAssetsView';
import ChatWidget from './components/ChatWidget';
import { generateJobAssets, generateCandidateProfiles, generateAdvancedAssets } from './services/geminiService';
import { GeneratedAssets } from './types';
import { Layout, Users, FileCheck, BrainCircuit, PlayCircle, Briefcase, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [assets, setAssets] = useState<GeneratedAssets>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingProfiles, setIsGeneratingProfiles] = useState(false);
  const [isGeneratingAdvanced, setIsGeneratingAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'jd' | 'guide' | 'profiles' | 'advanced'>('jd');

  const handleGenerate = async (rawNotes: string) => {
    setIsGenerating(true);
    setAssets({}); // Reset
    try {
      const result = await generateJobAssets(rawNotes);
      setAssets({
        jobDescription: result.jobDescription,
        interviewQuestions: result.interviewQuestions,
      });
      setActiveTab('jd');
    } catch (error) {
      console.error("Generation failed", error);
      alert("יצירת הנכסים נכשלה. אנא נסה שנית.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProfiles = async () => {
    if (!assets.jobDescription || !assets.interviewQuestions) return;
    
    setIsGeneratingProfiles(true);
    try {
      const profiles = await generateCandidateProfiles(assets.jobDescription, assets.interviewQuestions);
      setAssets(prev => ({ ...prev, candidateProfiles: profiles }));
      setActiveTab('profiles');
    } catch (error) {
      console.error("Profile generation failed", error);
      alert("יצירת הפרופילים נכשלה.");
    } finally {
      setIsGeneratingProfiles(false);
    }
  };

  const handleGenerateAdvanced = async () => {
    if (!assets.jobDescription) return;

    setIsGeneratingAdvanced(true);
    try {
        const advanced = await generateAdvancedAssets(assets.jobDescription);
        setAssets(prev => ({ ...prev, advancedAssets: advanced }));
        setActiveTab('advanced');
    } catch (error) {
        console.error("Advanced generation failed", error);
        alert("יצירת הכלים המתקדמים נכשלה.");
    } finally {
        setIsGeneratingAdvanced(false);
    }
  };

  const hasAssets = !!assets.jobDescription;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">ארגז חול לגיוס</h1>
              <p className="text-xs text-slate-500 font-medium truncate">כלי גיוס מבוססי AI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500 flex-shrink-0">
             <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Gemini 3 Pro פעיל
             </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Main Grid: On mobile it stacks, on LG it's side-by-side with fixed height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-8rem)] min-h-[auto] lg:min-h-[600px]">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 xl:col-span-3 h-auto lg:h-full">
            <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            {!hasAssets ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Layout className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">מוכן ליצירה</h3>
                <p className="max-w-md">הזן את דרישות התפקיד מימין וראה כיצד ה-AI יוצר את מסמכי הגיוס שלך באופן מיידי.</p>
              </div>
            ) : (
              <>
                {/* Tabs - Scrollable on mobile */}
                <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-4 gap-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('jd')}
                    role="tab"
                    aria-selected={activeTab === 'jd'}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap min-w-fit
                      ${activeTab === 'jd' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                  >
                    <FileCheck className="w-4 h-4" />
                    תיאור משרה
                  </button>
                  <button
                    onClick={() => setActiveTab('guide')}
                    role="tab"
                    aria-selected={activeTab === 'guide'}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap min-w-fit
                      ${activeTab === 'guide' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                  >
                    <Users className="w-4 h-4" />
                    מדריך ראיונות
                  </button>
                  <button
                    onClick={() => setActiveTab('profiles')}
                    role="tab"
                    aria-selected={activeTab === 'profiles'}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap min-w-fit
                      ${activeTab === 'profiles' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                  >
                    <Users className="w-4 h-4" />
                    פרופילי מועמדים
                    {assets.candidateProfiles && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full mr-1">חדש</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    role="tab"
                    aria-selected={activeTab === 'advanced'}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap min-w-fit
                      ${activeTab === 'advanced' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                  >
                    <Zap className="w-4 h-4" />
                    מתקדם
                    {assets.advancedAssets && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full mr-1">חדש</span>
                    )}
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-white relative">
                  {activeTab === 'jd' && assets.jobDescription && (
                    <JobDescriptionView data={assets.jobDescription} />
                  )}
                  {activeTab === 'guide' && assets.interviewQuestions && (
                    <InterviewGuideView questions={assets.interviewQuestions} />
                  )}
                  {activeTab === 'profiles' && (
                    !assets.candidateProfiles ? (
                       <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                           <div className="max-w-md space-y-2">
                               <h3 className="text-lg font-semibold text-slate-800">העמק</h3>
                               <p className="text-slate-500">צור פרסונות מועמדים אידיאליים על סמך תיאור המשרה ומדריך הראיונות כדי לעזור במיקוד החיפוש.</p>
                           </div>
                           <button
                             onClick={handleGenerateProfiles}
                             disabled={isGeneratingProfiles}
                             className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait min-h-[44px]"
                           >
                             {isGeneratingProfiles ? (
                               <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> חושב...</>
                             ) : (
                               <><PlayCircle className="w-5 h-5" /> צור פרופילים</>
                             )}
                           </button>
                       </div>
                    ) : (
                      <CandidateProfilesView profiles={assets.candidateProfiles} />
                    )
                  )}
                  {activeTab === 'advanced' && (
                    !assets.advancedAssets ? (
                       <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                           <div className="max-w-md space-y-2">
                               <h3 className="text-lg font-semibold text-slate-800">כלים מתקדמים לגיוס</h3>
                               <p className="text-slate-500">
                                   הפק הודעות פנייה מותאמות אישית, מדדי הצלחה (KPIs) לשנה הראשונה וניתוח הטיות (Bias Analysis) של תיאור המשרה.
                               </p>
                           </div>
                           <button
                             onClick={handleGenerateAdvanced}
                             disabled={isGeneratingAdvanced}
                             className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all shadow-md disabled:opacity-70 disabled:cursor-wait min-h-[44px]"
                           >
                             {isGeneratingAdvanced ? (
                               <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> מנתח...</>
                             ) : (
                               <><Zap className="w-5 h-5" /> צור כלים מתקדמים</>
                             )}
                           </button>
                       </div>
                    ) : (
                      <AdvancedAssetsView data={assets.advancedAssets} />
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <ChatWidget contextAssets={assets} />
    </div>
  );
};

export default App;