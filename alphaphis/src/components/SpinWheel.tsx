import React, { useState, useRef } from 'react';
import { Smartphone, Car, Headphones, Pizza, Gift, Coffee, Sparkles, AlertTriangle } from 'lucide-react';
import { Prize } from '../types';
import { sounds } from '../utils/audio';

export const PRIZES: Prize[] = [
  {
    id: 0,
    name: 'RS 500 for free',
    tagline: 'Enjoy and spend wisely',
    color: '#0284c7', // Sky blue
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    iconName: 'Gift',
  },
  {
    id: 1,
    name: 'Free Dining',
    tagline: 'Free dining Voucher',
    color: '#059669', // Emerald green
    textColor: '#ffffff',
    accentColor: '#34d399',
    iconName: 'Pizza',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    tagline: 'Sony Noise-Canceling',
    color: '#7c3aed', // Purple
    textColor: '#ffffff',
    accentColor: '#a78bfa',
    iconName: 'Headphones',
  },
  {
    id: 3,
    name: 'Free coffee Party',
    tagline: 'Enjoy coffee as per your choice',
    color: '#ea580c', // Orange
    textColor: '#ffffff',
    accentColor: '#fb923c',
    iconName: 'Coffee',
  },
  {
    id: 4,
    name: 'Rs 100 recharge',
    tagline: 'Keep your sim upto date',
    color: '#db2777', // Pink/Rose
    textColor: '#ffffff',
    accentColor: '#f472b6',
    iconName: 'Gift',
  },
  {
    id: 5,
    name: 'Free airbuds',
    tagline: 'Free Ultima lifestyle BoomSleek Airbuds',
    color: '#0d9488', // Teal
    textColor: '#ffffff',
    accentColor: '#2dd4bf',
    iconName: 'Headphones',
  },
];

interface SpinWheelProps {
  onPrizeWon: (prize: Prize) => void;
  onOpenRedeem: () => void;
  wonPrize: Prize | null;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  onPrizeWon,
  onOpenRedeem,
  wonPrize,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const spinCountRef = useRef(0);

  const getPrizeIcon = (iconName: Prize['iconName']) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Pizza':
        return <Pizza className="w-5 h-5" />;
      case 'Gift':
        return <Gift className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    spinCountRef.current += 1;

    // Pick random prize index (0 to 5)
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[prizeIndex];

    // Total 6 segments = 60 degrees each.
    // Pointer is at the top (0 degrees / 12 o'clock).
    // Segment 0 is from 0 to 60 deg (center at 30 deg).
    // To land on segment `prizeIndex`, final pointer relative angle should be `360 - (prizeIndex * 60 + 30)`.
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);

    // Add multiple full 360 rotations (5 to 8 full spins)
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 3));
    const currentBase = Math.ceil(rotation / 360) * 360;
    const finalRotation = currentBase + extraRotations + targetAngle;

    setRotation(finalRotation);

    // Audio click ticks interval simulation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sounds.playTick();
      tickCount++;
      if (tickCount > 24) {
        clearInterval(tickInterval);
      }
    }, 140);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setHasSpun(true);
      sounds.playWin();
      onPrizeWon(selectedPrize);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Phishing lure banner tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Official Campus Spring Giveaway • 100% Win Rate</span>
      </div>

      <div className="relative flex items-center justify-center p-2 sm:p-4">
        {/* Top Pointer Needle */}
        <div className="absolute top-0 z-30 flex flex-col items-center -translate-y-2">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-red-600 drop-shadow-md" />
          <div className="w-4 h-4 rounded-full bg-red-700 -mt-7 border-2 border-white shadow-inner" />
        </div>

        {/* Wheel Container */}
        <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full p-2.5 bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-300 shadow-2xl border-4 border-white">
          <div
            id="prize-wheel-canvas"
            className="relative w-full h-full rounded-full overflow-hidden shadow-inner transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.15, 1)',
            }}
          >
            {/* SVG Wheel Graphics */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                {PRIZES.map((prize) => (
                  <linearGradient
                    key={`grad-${prize.id}`}
                    id={`wheel-grad-${prize.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={prize.color} />
                    <stop offset="100%" stopColor={prize.accentColor} />
                  </linearGradient>
                ))}
              </defs>

              {PRIZES.map((prize, idx) => {
                const angle = 360 / PRIZES.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                // SVG Arc math
                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;

                const x1 = 200 + 200 * Math.cos(startRad);
                const y1 = 200 + 200 * Math.sin(startRad);
                const x2 = 200 + 200 * Math.cos(endRad);
                const y2 = 200 + 200 * Math.sin(endRad);

                const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + angle / 2;
                const textRad = ((midAngle - 90) * Math.PI) / 180;
                const textX = 200 + 125 * Math.cos(textRad);
                const textY = 200 + 125 * Math.sin(textRad);

                return (
                  <g key={prize.id}>
                    <path
                      d={pathData}
                      fill={`url(#wheel-grad-${prize.id})`}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <g
                      transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}
                    >
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={prize.textColor}
                        fontSize="13"
                        fontWeight="700"
                        className="font-sans select-none tracking-tight drop-shadow-sm"
                      >
                        {prize.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Inner Segment Divider Dots */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[92%] h-[92%] rounded-full border border-white/40 border-dashed" />
            </div>
          </div>

          {/* Center Hub & Action Spin Button */}
          <button
            id="spin-button"
            onClick={handleSpin}
            disabled={isSpinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-18 h-18 sm:w-22 sm:h-22 rounded-full font-bold flex flex-col items-center justify-center shadow-xl transition-all duration-200 border-4 border-white ${
              isSpinning
                ? 'bg-neutral-800 text-neutral-300 cursor-not-allowed opacity-90'
                : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-neutral-950 hover:scale-105 active:scale-95 shadow-amber-500/30 ring-4 ring-amber-400/20'
            }`}
          >
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">
              {isSpinning ? 'Spinning' : 'SPIN'}
            </span>
            <span className="text-[10px] text-neutral-800 font-medium -mt-0.5">
              {isSpinning ? '...' : 'FREE'}
            </span>
          </button>
        </div>
      </div>

      {/* Prize Result Announcement Banner */}
      {wonPrize && !isSpinning && (
        <div
          id="prize-won-banner"
          className="mt-6 w-full max-w-md p-4 rounded-xl bg-white border-2 border-amber-300 shadow-lg text-center transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-2 ring-4 ring-amber-50">
            {getPrizeIcon(wonPrize.iconName)}
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-amber-800">
            🎉 Congratulations! You Won
          </p>
          <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">
            {wonPrize.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{wonPrize.tagline}</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              id="redeem-prize-button"
              onClick={onOpenRedeem}
              className="w-full py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>Redeem & Claim Prize</span>
            </button>
            <button
              id="spin-again-button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="py-2.5 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs transition-colors"
            >
              Spin Again
            </button>
          </div>

          <p className="text-[11px] text-red-600 font-medium mt-2 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            Limited time: Claim within 5 minutes or prize will be forfeited
          </p>
        </div>
      )}

      {/* Helper text before spin */}
      {!hasSpun && !isSpinning && (
        <p className="text-xs text-neutral-500 mt-4 text-center">
          Click the center <strong>SPIN</strong> button to test your luck!
        </p>
      )}
    </div>
  );
};
