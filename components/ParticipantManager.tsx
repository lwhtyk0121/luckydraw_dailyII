
import React, { useState, useMemo } from 'react';
import { Upload, Users, Trash2, Plus, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
}

const MOCK_NAMES = [
  "王小明", "李美玲", "張大衛", "林淑芬", "陳志強", 
  "黃雅婷", "周傑倫", "蔡依林", "吳宗憲", "楊丞琳",
  "劉德華", "張學友", "郭富城", "黎明", "林青霞",
  "王祖賢", "鍾楚紅", "關之琳", "張曼玉", "梁朝偉"
];

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // Calculate duplicates
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
      const newParticipants: Participant[] = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset
  };

  const handleAddManual = () => {
    const names = inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    if (names.length === 0) return;
    
    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    setInputText('');
  };

  const loadMockData = () => {
    const mockParticipants: Participant[] = MOCK_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...mockParticipants]);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (confirm("確定要清空名單嗎？")) {
      onUpdate([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload size={20} className="text-blue-600" />
            上傳 CSV / 文字檔
          </h3>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all flex-1">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload size={32} className="text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">點擊或拖曳檔案至此</p>
            </div>
            <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              貼上名單
            </h3>
            <button 
              onClick={loadMockData}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <Sparkles size={12} /> 載入模擬名單
            </button>
          </div>
          <textarea
            className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none mb-3"
            placeholder="輸入姓名（以換行或逗號分隔）..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddManual}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> 加入名單
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">成員清單 ({participants.length})</span>
            {duplicateNames.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle size={12} /> 有 {duplicateNames.size} 組重複姓名
                </span>
                <button 
                  onClick={removeDuplicates}
                  className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full hover:bg-slate-900 transition-all flex items-center gap-1"
                >
                  <Check size={12} /> 一鍵移除重複項
                </button>
              </div>
            )}
          </div>
          {participants.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 size={16} /> 全部清空
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          {participants.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">
              目前名單為空，請從上方新增。
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <div 
                    key={p.id} 
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                      isDuplicate 
                        ? 'bg-red-50 border-red-200 text-red-700 shadow-sm shadow-red-50' 
                        : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{p.name}</span>
                    <button
                      onClick={() => removeParticipant(p.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="移除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;
