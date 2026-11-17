import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
} from 'lucide-react';

export const AlloyConversionCalculator = () => {
  const [calculationMode, setCalculationMode] = useState('PURE_TO_ALLOY'); // 'PURE_TO_ALLOY' or 'TARGET_TO_PURE'
  const [pureGoldWeight, setPureGoldWeight] = useState('50.000'); // 50 grams of 24K
  const [targetArticleWeight, setTargetArticleWeight] = useState('100.000'); // 100 grams desired
  const [targetPurity, setTargetPurity] = useState('22K_916'); // '22K_916', '18K_750', '14K_585'
  const [alloyColor, setAlloyColor] = useState('YELLOW_GOLD'); // 'YELLOW_GOLD', 'ROSE_GOLD', 'WHITE_GOLD'

  const purityRatios = {
    '22K_916': 0.9167,
    '18K_750': 0.7500,
    '14K_585': 0.5833
  };

  const ratio = purityRatios[targetPurity] || 0.9167;

  let computedPureNeeded = 0;
  let computedTotalFinishedWeight = 0;
  let computedAlloyNeeded = 0;

  if (calculationMode === 'PURE_TO_ALLOY') {
    const pureInput = parseFloat(pureGoldWeight) || 0;
    computedTotalFinishedWeight = pureInput > 0 ? pureInput / ratio : 0;
    computedAlloyNeeded = Math.max(0, computedTotalFinishedWeight - pureInput);
    computedPureNeeded = pureInput;
  } else {
    const targetInput = parseFloat(targetArticleWeight) || 0;
    computedPureNeeded = targetInput * ratio;
    computedAlloyNeeded = Math.max(0, targetInput - computedPureNeeded);
    computedTotalFinishedWeight = targetInput;
  }

  // Alloy breakdown based on color tone
  let copperPercent = 0.5;
  let silverPercent = 0.5;
  let zincNickelPercent = 0.0;

  if (alloyColor === 'ROSE_GOLD') {
    copperPercent = 0.75;
    silverPercent = 0.25;
  } else if (alloyColor === 'WHITE_GOLD') {
    copperPercent = 0.1;
    silverPercent = 0.4;
    zincNickelPercent = 0.5;
  }

  const copperWeight = +(computedAlloyNeeded * copperPercent).toFixed(3);
  const silverWeight = +(computedAlloyNeeded * silverPercent).toFixed(3);
  const zincWeight = +(computedAlloyNeeded * zincNickelPercent).toFixed(3);

  return (
    <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-5 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-surface-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-400" />
            Bullion Melting &amp; Alloy Ratio Calculator (Goldsmith Tunch Math)
          </h3>
          <p className="text-xs text-surface-400">
            Compute precise copper, silver, and master alloy additives to convert 24K pure bullion into BIS 916 / 750 hallmark gold.
          </p>
        </div>

        {/* Calculation Direction Toggle */}
        <div className="flex bg-surface-950 p-1 rounded-xl border border-surface-800 text-xs font-semibold">
          <button
            id="btn-calc-pure-to-alloy" onClick={() => setCalculationMode('PURE_TO_ALLOY')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              calculationMode === 'PURE_TO_ALLOY'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            I have Pure 24K Bar
          </button>
          <button
            id="btn-calc-target-to-pure" onClick={() => setCalculationMode('TARGET_TO_PURE')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              calculationMode === 'TARGET_TO_PURE'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            I need Finished Article Wt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4 text-xs">
          {calculationMode === 'PURE_TO_ALLOY' ? (
            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Weight of 24K Pure Bullion Bar (Grams)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  id="input-calc-pure-weight" value={pureGoldWeight}
                  onChange={(e) => setPureGoldWeight(e.target.value)}
                  className="w-full bg-surface-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">Grams</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Target Finished Ornament Weight Desired (Grams)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  id="input-calc-target-weight" value={targetArticleWeight}
                  onChange={(e) => setTargetArticleWeight(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 font-mono font-bold text-sm focus:outline-none focus:border-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">Grams</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Target Purity Standard</label>
              <select
                id="select-calc-purity" value={targetPurity}
                onChange={(e) => setTargetPurity(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 font-semibold focus:outline-none focus:border-brand-500"
              >
                <option value="22K_916">22K (91.67% BIS 916)</option>
                <option value="18K_750">18K (75.00% BIS 750)</option>
                <option value="14K_585">14K (58.33% BIS 585)</option>
              </select>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Gold Color Shade</label>
              <select
                id="select-calc-alloy-color" value={alloyColor}
                onChange={(e) => setAlloyColor(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 font-semibold focus:outline-none focus:border-brand-500"
              >
                <option value="YELLOW_GOLD">Traditional Yellow Gold</option>
                <option value="ROSE_GOLD">Rose / Pink Gold (Copper Rich)</option>
                <option value="WHITE_GOLD">White Gold (Nickel/Zinc Rich)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Recipe Card */}
        <div className="bg-surface-950 border border-surface-800 rounded-xl p-4 font-mono space-y-3">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block font-sans">
            Melting Crucible Batch Recipe
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-surface-900 border border-surface-800">
              <span className="text-surface-400 font-sans">Pure 24K Gold Required:</span>
              <span className="font-bold text-amber-400 text-sm">{computedPureNeeded.toFixed(3)} g</span>
            </div>

            <div className="flex justify-between p-2 rounded bg-surface-900 border border-surface-800">
              <span className="text-surface-400 font-sans">Total Alloy Mixture to Add:</span>
              <span className="font-bold text-sky-400 text-sm">+{computedAlloyNeeded.toFixed(3)} g</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-900/60 border border-surface-800 space-y-1 text-[11px]">
              <span className="text-surface-400 font-sans block mb-1">Constituent Alloy Blend:</span>
              <div className="flex justify-between text-surface-300">
                <span>&bull; Pure Electrolytic Copper:</span>
                <span className="font-bold text-orange-400">{copperWeight.toFixed(3)} g</span>
              </div>
              <div className="flex justify-between text-surface-300">
                <span>&bull; Fine Silver 999:</span>
                <span className="font-bold text-slate-300">{silverWeight.toFixed(3)} g</span>
              </div>
              {zincWeight > 0 && (
                <div className="flex justify-between text-surface-300">
                  <span>&bull; White Master Alloy / Nickel:</span>
                  <span className="font-bold text-sky-300">{zincWeight.toFixed(3)} g</span>
                </div>
              )}
            </div>

            <div className="border-t border-surface-800 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="font-sans text-surface-200">Total Ingot / Casting Weight:</span>
              <span className="text-emerald-400 text-base">{computedTotalFinishedWeight.toFixed(3)} g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
