import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage, GeneratedAssets } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatWidgetProps {
  contextAssets: GeneratedAssets;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ contextAssets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'היי! אני יכול לעזור לך לחדד את מסמכי הגיוס או לענות על שאלות. שאל אותי כל דבר!', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare context string
      let contextStr = "";
      if (contextAssets.jobDescription) {
        contextStr += `Current Job Title: ${contextAssets.jobDescription.title}\nSummary: ${contextAssets.jobDescription.summary}\n`;
      }
      
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const stream = await streamChatResponse(history, userMsg.text, contextStr);
      
      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of stream) {
         const text = chunk.text || ""; // Use .text property instead of .text() method
         fullResponse += text;
         setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullResponse } : m));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "אני מצטער, נתקלתי בשגיאה בזמן החשיבה. אנא נסה שנית.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-all z-50 flex items-center gap-2 group min-w-[44px] min-h-[44px]"
        aria-label="פתח עוזר גיוס"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-medium whitespace-nowrap">
          עוזר AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[80vh] md:h-[600px] max-h-[800px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-sm">עוזר גיוס</h3>
                <p className="text-xs text-slate-400">מופעל ע"י Gemini 3 Pro</p>
            </div>
        </div>
        <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="סגור צ'אט"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-blue-600" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mr-10">
                <Loader2 className="w-3 h-3 animate-spin" />
                חושב...
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none h-10"
            placeholder="שאל על המשרה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="שלח הודעה"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;