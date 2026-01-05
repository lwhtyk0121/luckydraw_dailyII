
import React, { useState } from 'react';
import { Users2, Wand2, RefreshCw, LayoutGrid, Download } from 'lucide-react';
import { Participant, Group } from '../types';
import { generateCreativeGroupNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const GroupingTool: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isNaming, setIsNaming] = useState(false);
  const [theme, setTheme] = useState("現代科技");

  const generateGroups = () => {
    if (participants.length === 0) {
      alert("請先在名單頁面加入成員。");
      return;
    }
    
    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${newGroups.length + 1} 組`,
        members: shuffled.slice(i, i + groupSize)
      });
    }
    
    setGroups(newGroups);
  };

  const getCreativeNames = async () => {
    if (groups.length === 0) return;
    setIsNaming(true);
    const names = await generateCreativeGroupNames(groups.length, theme);
    setGroups(prev => prev.map((g, idx) => ({
      ...g,
      name: names[idx] || g.name
    })));
    setIsNaming(false);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    // Build CSV content
    const header = "組別名稱,成員姓名\n";
    const rows = groups.flatMap(group => 
      group.members.map(member => `"${group.name}","${member.name}"`)
    ).join("\n");
    
    const csvContent = "\uFEFF" + header + rows; // Add BOM for Excel UTF-8 support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">每組人數</label>
            <input
              type="number"
              min="1"
              max={participants.length || 1}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={generateGroups}
            className="bg-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100"
          >
            <Users2 size={18} /> 開始分組
          </button>
          
          <div className="relative">
             <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
               <Wand2 size={14} className="text-purple-500" />
               AI 創意組名
             </label>
             <div className="flex gap-2">
               <input
                 type="text"
                 placeholder="主題 (如: 復仇者聯盟)"
                 value={theme}
                 onChange={(e) => setTheme(e.target.value)}
                 className="flex-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-500"
               />
               <button
                 disabled={groups.length === 0 || isNaming}
                 onClick={getCreativeNames}
                 className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                 title="使用 AI 重新命名"
               >
                 {isNaming ? <RefreshCw size={18} className="animate-spin" /> : <Wand2 size={18} />}
               </button>
             </div>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">分組結果</h3>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
            >
              <Download size={16} /> 下載 CSV 紀錄
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-blue-600 truncate mr-2">{group.name}</span>
                  <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider border">
                    {group.members.length} 人
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {group.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {participants.length > 0 && groups.length === 0 && (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <LayoutGrid className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">準備將 {participants.length} 位成員進行分組嗎？</p>
        </div>
      )}
    </div>
  );
};

export default GroupingTool;
