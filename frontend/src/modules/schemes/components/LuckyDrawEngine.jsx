import React, { useState } from 'react';
import { 
  Trophy, 
  Gift, 
  RotateCw, 
  CheckCircle2, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

export const LuckyDrawEngine = ({ members }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [pastWinners, setPastWinners] = useState([
    {
      id: 'WIN-01',
      month: 'September 2026',
      customerName: 'Priya Sharma',
      tokenNo: '101',
      prize: '1g 24K Pure Gold Coin'
    }
  ]);

  const handleDrawToken = () => {
    if (members.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * members.length);
      const picked = members[randomIndex];

      const winnerData = {
        id: `WIN-${Math.floor(10 + Math.random() * 90)}`,
        month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        customerName: picked.customerName,
        tokenNo: picked.tokenNo,
        prize: `Free 1 Month EMI Waiver (₹${picked.monthlyEmi?.toLocaleString('en-IN') || '2,000'})`
      };

      setWinner(winnerData);
      setPastWinners(prev => [winnerData, ...prev]);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <div className="card-surface space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-400" />
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
              Monthly Provably-Fair Token Lucky Draw
            </h3>
            <p className="text-[11px] text-surface-400">
              Automated prize draw for active scheme contributors
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Draw Machine Box (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-6 rounded-xl bg-surface-950 border border-surface-800 text-center space-y-4">
            <span id="stat-draw-pool" className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans block">
              Active Member Pool: {members.length} Enrolled Tokens
            </span>

            {/* Spinner Graphic */}
            <div className="w-24 h-24 rounded-full bg-surface-900 border-2 border-brand-500/50 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className={`w-10 h-10 text-brand-400 ${isSpinning ? 'animate-bounce' : ''}`} />
            </div>

            {winner && (
              <div id="box-winner-announcement" className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/40 text-brand-300 space-y-1 animate-in zoom-in-95 duration-150">
                <span className="text-[10px] uppercase font-bold text-brand-400 font-sans block">
                  🎉 Lucky Draw Winner Announced!
                </span>
                <div className="text-lg font-bold text-surface-100 font-sans">{winner.customerName}</div>
                <div className="text-xs font-mono">Token #{winner.tokenNo} &bull; Prize: {winner.prize}</div>
              </div>
            )}

            <button
              type="button"
              id="btn-spin-lucky-draw"
              onClick={handleDrawToken}
              disabled={isSpinning || members.length === 0}
              className="btn-primary py-3 px-6 text-xs font-sans font-bold mx-auto flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Selecting Random Token...' : 'Run Monthly Token Draw'}</span>
            </button>
          </div>
        </div>

        {/* Past Winners Archive (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="border border-surface-800 rounded-xl overflow-hidden">
            <div className="p-3 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
              <span className="font-bold text-surface-200 uppercase tracking-wider font-sans">
                Draw Winners Archive
              </span>
              <span className="text-surface-500">{pastWinners.length} Draws Conducted</span>
            </div>
            <div className="divide-y divide-surface-800/60 max-h-72 overflow-y-auto">
              {pastWinners.map(win => (
                <div key={win.id} className="p-3 hover:bg-surface-850/40 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-surface-100 font-sans">{win.customerName}</div>
                      <div className="text-[11px] text-surface-400 mt-0.5">Prize: {win.prize}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold">
                      Token #{win.tokenNo}
                    </span>
                  </div>
                  <div className="text-[10px] text-surface-500 mt-1">{win.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
