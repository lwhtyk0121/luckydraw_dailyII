
import React, { useState } from 'react';
import { UserPlus, Trophy, Users2, LayoutDashboard } from 'lucide-react';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import GroupingTool from './components/GroupingTool';
import { Participant, ViewMode } from './types';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [view, setView] = useState<ViewMode>('list');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                HR Pro Toolbox
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <UserPlus size={18} /> Participants
              </button>
              <button
                onClick={() => setView('draw')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === 'draw' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Trophy size={18} /> Lucky Draw
              </button>
              <button
                onClick={() => setView('grouping')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === 'grouping' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Users2 size={18} /> Grouping
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-blue-600 rounded-3xl p-8 text-white mb-8 overflow-hidden relative shadow-2xl shadow-blue-200">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Participant List</h2>
                <p className="text-blue-100 max-w-lg opacity-90">
                  Manage your event roster. You can upload a CSV, text file, or simply paste names to get started.
                </p>
              </div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
            </div>
            <ParticipantManager participants={participants} onUpdate={setParticipants} />
          </div>
        )}

        {view === 'draw' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Lucky Draw</h2>
              <p className="text-slate-500 mt-2">Spin the wheel and pick a lucky winner!</p>
            </div>
            <LuckyDraw participants={participants} />
          </div>
        )}

        {view === 'grouping' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Auto Grouping</h2>
              <p className="text-slate-500 mt-2">Divide your participants into teams automatically.</p>
            </div>
            <GroupingTool participants={participants} />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around p-3 z-50">
        <button onClick={() => setView('list')} className={`flex flex-col items-center gap-1 ${view === 'list' ? 'text-blue-600' : 'text-slate-400'}`}>
          <UserPlus size={20} />
          <span className="text-[10px] font-medium">List</span>
        </button>
        <button onClick={() => setView('draw')} className={`flex flex-col items-center gap-1 ${view === 'draw' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Trophy size={20} />
          <span className="text-[10px] font-medium">Draw</span>
        </button>
        <button onClick={() => setView('grouping')} className={`flex flex-col items-center gap-1 ${view === 'grouping' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Users2 size={20} />
          <span className="text-[10px] font-medium">Grouping</span>
        </button>
      </div>
    </div>
  );
};

export default App;
