
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCcw, Play, CheckCircle2 } from 'lucide-react';
import { Participant } from '../types';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string>("Ready?");
  const [availableList, setAvailableList] = useState<Participant[]>([]);

  useEffect(() => {
    setAvailableList(participants);
  }, [participants]);

  const spin = useCallback(() => {
    if (availableList.length === 0 && !allowDuplicates) {
      alert("No more names available for unique draw!");
      return;
    }
    if (participants.length === 0) {
      alert("Please add participants first.");
      return;
    }

    setIsSpinning(true);
    let counter = 0;
    const duration = 2000;
    const intervalTime = 80;
    const iterations = duration / intervalTime;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentDisplay(participants[randomIndex].name);
      counter++;

      if (counter >= iterations) {
        clearInterval(interval);
        
        // Final pick
        const pool = allowDuplicates ? participants : availableList;
        const finalIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[finalIndex];

        setWinners(prev => [winner, ...prev]);
        setCurrentDisplay(winner.name);
        setIsSpinning(false);
        
        if (!allowDuplicates) {
          setAvailableList(prev => prev.filter(p => p.id !== winner.id));
        }

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, intervalTime);
  }, [availableList, allowDuplicates, participants]);

  const resetDraw = () => {
    setWinners([]);
    setAvailableList(participants);
    setCurrentDisplay("Ready?");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <Trophy size={32} />
          </div>
        </div>
        
        <div className="h-40 flex items-center justify-center mb-8 bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-200">
          <span className={`text-5xl font-bold transition-all ${isSpinning ? 'scale-110 text-blue-600' : 'text-slate-800'}`}>
            {currentDisplay}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              disabled={isSpinning}
            />
            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Allow Multi-win</span>
          </label>
          <button
            onClick={resetDraw}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm"
          >
            <RefreshCcw size={16} /> Reset Draw History
          </button>
        </div>

        <button
          onClick={spin}
          disabled={isSpinning || participants.length === 0}
          className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all ${
            isSpinning || participants.length === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSpinning ? <RefreshCcw className="animate-spin" /> : <Play />}
          {isSpinning ? 'Spinning...' : 'Start Lucky Draw!'}
        </button>
      </div>

      {winners.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Winners Log ({winners.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {winners.map((winner, idx) => (
              <div key={`${winner.id}-${idx}`} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <span className="font-medium text-slate-700">{winner.name}</span>
                <span className="text-xs text-slate-400">#{winners.length - idx} Draw</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
