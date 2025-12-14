import React, { useState } from 'react';
import { InterviewQuestion } from '../types';
import { MessageSquare, Target, Code, Brain, Zap, Scale, HeartHandshake, Volume2, Loader2, Square } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface InterviewGuideViewProps {
  questions: InterviewQuestion[];
}

const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({ questions }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode | null>(null);

  const handlePlay = async (id: string, text: string) => {
      // Stop current audio if playing
      if (currentSource) {
          currentSource.stop();
          setCurrentSource(null);
      }
      if (playingId === id) {
          setPlayingId(null);
          return;
      }

      setPlayingId(id);

      try {
          const base64Audio = await generateSpeech(text);
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioContext(ctx);

          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          
          source.onended = () => {
              setPlayingId(null);
              setCurrentSource(null);
          };

          source.start(0);
          setCurrentSource(source);

      } catch (error) {
          console.error("Audio playback error", error);
          setPlayingId(null);
          alert("שגיאה בניגון אודיו");
      }
  };

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
            className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
          >
            <div className="flex items-start gap-4 pl-10">
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
            </div>
            
            <button
                onClick={() => handlePlay(q.id, q.question)}
                className={`absolute top-5 left-5 p-2 rounded-full transition-all border
                    ${playingId === q.id 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600 hover:border-blue-200'}`}
                title="הקרא שאלה"
            >
                {playingId === q.id ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewGuideView;