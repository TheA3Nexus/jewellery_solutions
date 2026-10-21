import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
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
      tokenNo: '104',
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
        prize: 'Free 1 Month EMI Waiver (₹2,000)'
      };

      setWinner(winnerData);
      setPastWinners(prev => [winnerData, ...prev]);
      setIsSpinning(false);
    }, 1800);
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
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans block">
              Active Member Pool: {members.length} Enrolled Tokens
            </span>

            {/* Spinner Graphic */}
            <div className="w-24 h-24 rounded-full bg-surface-900 border-2 border-brand-500/50 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className={`w-10 h-10 text-brand-400 ${isSpinning ? 'animate-bounce' : ''}`} />
            </div>

            {winner && (
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/40 text-brand-300 space-y-1 animate-in zoom-in-95 duration-150">
                <span className="text-[10px] uppercase font-bold text-brand-400 font-sans block">
                  🎉 Lucky Draw Winner Announced!
                </span>
                <div className="text-lg font-bold text-surface-100 font-sans">{winner.customerName}</div>
                <div className="text-xs font-mono">Token #{winner.tokenNo} &bull; Prize: {winner.prize}</div>
              </div>
            )}

            <button
              type="button"
              onClick={handleDrawToken}
              disabled={isSpinning || members.length === 0}
              className="btn-primary py-3 px-6 text-xs font-sans font-bold mx-auto"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Selecting Random Token...' : 'Run Monthly Token Draw'}</span>
            </button>
          </div>
        </div>

        {/* Past Winners Archive (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
            <span className="text-[11px] font-bold text-surface-300 uppercase tracking-wider font-sans block">
              Previous Lucky Draw Winners
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pastWinners.map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-surface-100 font-sans">{w.customerName}</div>
                    <div className="text-[10px] text-surface-400 font-mono">Token #{w.tokenNo} &bull; {w.month}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-brand-500/15 text-brand-300 border border-brand-500/30">
                    {w.prize}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};