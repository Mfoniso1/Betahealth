
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dna, 
  Search, 
  MessageSquare, 
  ChevronRight, 
  Info, 
  Activity, 
  Brain, 
  Heart, 
  Zap, 
  Microscope,
  Send,
  User,
  Bot,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { createStemCellChat } from './services/geminiService';
import { DiseaseInfo, ChatMessage } from './types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const DISEASES: DiseaseInfo[] = [
  {
    id: '1',
    name: 'Type 1 Diabetes',
    category: 'Autoimmune',
    description: 'Stem cell therapy aims to replace insulin-producing beta cells in the pancreas, potentially eliminating the need for daily injections.',
    therapyStatus: 'Clinical',
    impact: 'High',
    imageUrl: 'https://picsum.photos/seed/diabetes/800/600'
  },
  {
    id: '2',
    name: "Parkinson's Disease",
    category: 'Neurological',
    description: 'Using dopaminergic neurons derived from stem cells to replace those lost in the brain to restore motor function.',
    therapyStatus: 'Experimental',
    impact: 'Transformative',
    imageUrl: 'https://picsum.photos/seed/parkinsons/800/600'
  },
  {
    id: '3',
    name: 'Leukemia',
    category: 'Hematological',
    description: 'Bone marrow (hematopoietic stem cell) transplants are the gold standard for curing many types of blood cancers.',
    therapyStatus: 'Established',
    impact: 'Curative',
    imageUrl: 'https://picsum.photos/seed/leukemia/800/600'
  },
  {
    id: '4',
    name: 'Macular Degeneration',
    category: 'Ophthalmic',
    description: 'Retinal pigment epithelium cells derived from stem cells are being used to restore vision in age-related macular degeneration.',
    therapyStatus: 'Clinical',
    impact: 'High',
    imageUrl: 'https://picsum.photos/seed/eye/800/600'
  }
];

const RESEARCH_DATA = [
  { year: '2015', publications: 4500, trials: 120 },
  { year: '2016', publications: 5200, trials: 150 },
  { year: '2017', publications: 6100, trials: 190 },
  { year: '2018', publications: 7400, trials: 230 },
  { year: '2019', publications: 8800, trials: 310 },
  { year: '2020', publications: 9200, trials: 380 },
  { year: '2021', publications: 11000, trials: 450 },
  { year: '2022', publications: 12500, trials: 520 },
  { year: '2023', publications: 14000, trials: 640 },
  { year: '2024', publications: 16500, trials: 810 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'diseases' | 'chat' | 'stats'>('home');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm BetaHealth AI. How can I help you explore the world of stem cell therapy today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  useEffect(() => {
    chatInstance.current = createStemCellChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatInstance.current.sendMessage({ message: input });
      const assistantMessage: ChatMessage = { role: 'assistant', content: result.text };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                <Dna size={24} />
              </div>
              <span className="text-xl font-outfit font-bold tracking-tight text-slate-900">BetaHealth</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'home', label: 'Home' },
                { id: 'diseases', label: 'Therapeutic Areas' },
                { id: 'stats', label: 'Research Data' },
                { id: 'chat', label: 'AI Assistant' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                    ? 'text-sky-600' 
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-slate-100 p-4 space-y-2 animate-in slide-in-from-top duration-300">
            {['home', 'diseases', 'stats', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg text-sm font-medium ${
                  activeTab === tab ? 'bg-sky-50 text-sky-600' : 'text-slate-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'home' && (
          <section className="space-y-16 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-16">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                  The Regenerative Revolution
                </span>
                <h1 className="text-4xl md:text-6xl font-outfit font-extrabold leading-tight">
                  Healing from within with <span className="gradient-text">Stem Cell</span> therapy.
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Stem cell therapy is one of the most promising frontiers of modern medicine, 
                  offering potential cures for previously untreatable conditions by repairing and replacing damaged tissues.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('diseases')}
                    className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-900/40 flex items-center gap-2"
                  >
                    Explore Treatments <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    Talk to BetaHealth AI <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                  <Activity />
                </div>
                <h3 className="text-xl font-outfit font-bold mb-3">Therapeutic Potential</h3>
                <p className="text-slate-600">Stem cells can differentiate into over 200 specialized cell types, making them versatile for almost any tissue repair.</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                  <Microscope />
                </div>
                <h3 className="text-xl font-outfit font-bold mb-3">Clinical Progress</h3>
                <p className="text-slate-600">Over 5,000 active clinical trials worldwide are currently evaluating stem cell therapies for diverse conditions.</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap />
                </div>
                <h3 className="text-xl font-outfit font-bold mb-3">Faster Recovery</h3>
                <p className="text-slate-600">Regenerative medicine focuses on natural healing, often resulting in less invasive procedures and shorter hospital stays.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'diseases' && (
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-outfit font-bold">Therapeutic Applications</h2>
              <p className="text-slate-600">Explore how different types of stem cells are being utilized to tackle some of humanity's most challenging medical conditions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {DISEASES.map((disease) => (
                <div key={disease.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-2xl hover:shadow-sky-100 transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded leading-none">
                            {disease.category}
                          </span>
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded leading-none ${
                            disease.therapyStatus === 'Established' ? 'bg-green-100 text-green-700' :
                            disease.therapyStatus === 'Clinical' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {disease.therapyStatus}
                          </span>
                        </div>
                        <h3 className="text-2xl font-outfit font-bold text-slate-900">{disease.name}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{disease.description}</p>
                      </div>
                      <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                        <span className="text-xs font-semibold text-slate-400">Impact: <span className="text-sky-600">{disease.impact}</span></span>
                        <button className="text-sky-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                          Read Full Study <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'stats' && (
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-outfit font-bold">Research Acceleration</h2>
              <p className="text-slate-600">The rate of stem cell research and clinical translation has exploded in the last decade, indicating a maturing field.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-200 h-[400px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-sky-600" /> Research Publications & Trials Over Time
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={RESEARCH_DATA}>
                    <defs>
                      <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="publications" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPubs)" 
                      name="Publications"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="trials" 
                      stroke="#2dd4bf" 
                      strokeWidth={3}
                      fillOpacity={0} 
                      name="Clinical Trials"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <div className="bg-sky-600 text-white p-6 rounded-2xl shadow-lg shadow-sky-200">
                  <h4 className="text-sky-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Trials (2024)</h4>
                  <p className="text-4xl font-outfit font-extrabold">8,100+</p>
                  <div className="mt-4 pt-4 border-t border-sky-500/30 flex items-center justify-between">
                    <span className="text-sm">YoY Growth</span>
                    <span className="font-bold text-lg">+26%</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                  <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Successful Approvals</h4>
                  <p className="text-4xl font-outfit font-extrabold text-slate-900">42</p>
                  <p className="text-slate-500 text-xs mt-2">FDA/EMA approved stem cell-based products as of late 2023.</p>
                </div>
                <div className="bg-teal-500 text-white p-6 rounded-2xl shadow-lg shadow-teal-200">
                  <h4 className="text-teal-100 text-sm font-semibold uppercase tracking-wider mb-2">Funding (Est.)</h4>
                  <p className="text-4xl font-outfit font-extrabold">$24.5B</p>
                  <p className="text-teal-100 text-xs mt-2">Projected global market size by 2028.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'chat' && (
          <section className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-panel rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-slate-900">BetaHealth AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Regenerative Expert Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold">Medical Disclosure Apply</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-sky-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Mesenchymal cells, Clinical trials, or specific diseases..."
                  className="flex-grow bg-transparent border-none focus:outline-none text-sm px-4 py-2 text-slate-700"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-sky-600 text-white rounded-xl flex items-center justify-center hover:bg-sky-500 disabled:bg-slate-300 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-3">
                BetaHealth AI is for educational purposes and is not a substitute for professional medical advice.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white">
                  <Dna size={18} />
                </div>
                <span className="text-lg font-outfit font-bold text-slate-900">BetaHealth</span>
              </div>
              <p className="text-slate-500 text-sm max-w-md">
                Dedicated to bridging the gap between cutting-edge regenerative science and patient education. 
                Our mission is to advocate for ethical, evidence-based stem cell therapies worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-sky-600 transition-colors">ISSCR Guidelines</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">ClinicalTrials.gov</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">Patient Stories</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">Ethical Frameworks</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-sky-600 transition-colors">Research Partnership</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="hover:text-sky-600 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>&copy; 2024 BetaHealth Initiative. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-sky-600">Privacy Policy</a>
              <a href="#" className="hover:text-sky-600">Medical Disclaimer</a>
              <a href="#" className="hover:text-sky-600">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
