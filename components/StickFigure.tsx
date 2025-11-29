import React from 'react';
import { PrepAction } from '../types';

interface Props {
  action: PrepAction;
  className?: string;
}

const StickFigure: React.FC<Props> = ({ action, className }) => {
  const getAnimation = () => {
    switch (action) {
      case PrepAction.CHOP:
      case PrepAction.SLICE:
        return (
          <g className="animate-stick-chop">
            {/* Body */}
            <line x1="50" y1="60" x2="50" y2="90" stroke="black" strokeWidth="4" />
            <circle cx="50" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
            <line x1="50" y1="90" x2="30" y2="120" stroke="black" strokeWidth="4" />
            <line x1="50" y1="90" x2="70" y2="120" stroke="black" strokeWidth="4" />
            
            {/* Chopping Arm Group */}
            <g className="origin-[50px_65px] animate-arm-chop">
               <line x1="50" y1="65" x2="80" y2="75" stroke="black" strokeWidth="4" />
               <line x1="80" y1="75" x2="70" y2="95" stroke="black" strokeWidth="4" />
               {/* Knife */}
               <path d="M70 95 L65 105 L95 105 L95 95 Z" fill="#999" stroke="black" strokeWidth="1" />
            </g>
            
            {/* Table & Veggie */}
            <line x1="20" y1="110" x2="100" y2="110" stroke="#8B4513" strokeWidth="4" />
            <circle cx="70" cy="105" r="5" fill="green" />
          </g>
        );
      case PrepAction.MIX:
        return (
          <g>
             {/* Body */}
            <line x1="40" y1="60" x2="40" y2="90" stroke="black" strokeWidth="4" />
            <circle cx="40" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
            <line x1="40" y1="90" x2="20" y2="120" stroke="black" strokeWidth="4" />
            <line x1="40" y1="90" x2="60" y2="120" stroke="black" strokeWidth="4" />

            {/* Bowl */}
            <path d="M60 90 Q80 120 100 90" fill="#ddd" stroke="black" strokeWidth="2" />

            {/* Stirring Arm */}
            <g className="origin-[40px_65px] animate-arm-stir">
                <line x1="40" y1="65" x2="65" y2="75" stroke="black" strokeWidth="4" />
                <line x1="65" y1="75" x2="80" y2="90" stroke="black" strokeWidth="4" />
                <line x1="80" y1="90" x2="80" y2="105" stroke="#666" strokeWidth="2" />
            </g>
          </g>
        );
      case PrepAction.FRY:
        return (
           <g>
            {/* Body */}
            <line x1="30" y1="60" x2="30" y2="90" stroke="black" strokeWidth="4" />
            <circle cx="30" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
            <line x1="30" y1="90" x2="15" y2="120" stroke="black" strokeWidth="4" />
            <line x1="30" y1="90" x2="45" y2="120" stroke="black" strokeWidth="4" />

            {/* Arm holding pan */}
             <g className="origin-[30px_65px] animate-arm-pan-shake">
                <line x1="30" y1="65" x2="55" y2="75" stroke="black" strokeWidth="4" />
                <line x1="55" y1="75" x2="60" y2="75" stroke="black" strokeWidth="4" />
                {/* Pan Handle */}
                <line x1="60" y1="75" x2="80" y2="75" stroke="#333" strokeWidth="4" />
                {/* Pan Body */}
                <path d="M80 75 L110 75 L105 85 L85 85 Z" fill="#333" />
                {/* Food flying */}
                <circle cx="95" cy="65" r="2" fill="orange" className="animate-food-jump" />
                <circle cx="90" cy="70" r="2" fill="yellow" className="animate-food-jump" style={{ animationDelay: '0.1s'}} />
             </g>
           </g>
        );
      case PrepAction.BOIL:
         return (
             <g>
                 {/* Body waiting */}
                <line x1="30" y1="60" x2="30" y2="90" stroke="black" strokeWidth="4" />
                <circle cx="30" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
                <line x1="30" y1="90" x2="15" y2="120" stroke="black" strokeWidth="4" />
                <line x1="30" y1="90" x2="45" y2="120" stroke="black" strokeWidth="4" />
                {/* Arms Crossed */}
                <line x1="30" y1="65" x2="20" y2="75" stroke="black" strokeWidth="4" />
                <line x1="30" y1="65" x2="40" y2="75" stroke="black" strokeWidth="4" />

                {/* Pot */}
                <rect x="60" y="80" width="40" height="30" fill="#ddd" stroke="black" strokeWidth="2" />
                {/* Bubbles */}
                <circle cx="70" cy="75" r="3" stroke="blue" fill="none" className="animate-bubble-rise" />
                <circle cx="80" cy="70" r="2" stroke="blue" fill="none" className="animate-bubble-rise" style={{ animationDelay: '0.5s'}} />
                <circle cx="90" cy="78" r="3" stroke="blue" fill="none" className="animate-bubble-rise" style={{ animationDelay: '0.2s'}} />
             </g>
         );
      case PrepAction.WASH:
          return (
              <g>
                {/* Body */}
                <line x1="60" y1="60" x2="60" y2="90" stroke="black" strokeWidth="4" />
                <circle cx="60" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
                <line x1="60" y1="90" x2="50" y2="120" stroke="black" strokeWidth="4" />
                <line x1="60" y1="90" x2="70" y2="120" stroke="black" strokeWidth="4" />

                {/* Faucet */}
                <path d="M20 100 L20 40 L40 40 L40 50" fill="none" stroke="#666" strokeWidth="4" />
                {/* Water */}
                <line x1="40" y1="50" x2="40" y2="100" stroke="blue" strokeWidth="2" strokeDasharray="4 2" className="animate-water-flow" />

                {/* Arms washing */}
                <path d="M60 65 Q50 80 40 90" stroke="black" strokeWidth="4" fill="none" className="animate-arm-wash" />
              </g>
          );
      default: // PEEL or OTHER
        return (
            <g>
                {/* Body */}
                <line x1="50" y1="60" x2="50" y2="90" stroke="black" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" stroke="black" strokeWidth="3" fill="none" />
                <line x1="50" y1="90" x2="35" y2="120" stroke="black" strokeWidth="4" />
                <line x1="50" y1="90" x2="65" y2="120" stroke="black" strokeWidth="4" />
                
                {/* Holding item */}
                <line x1="50" y1="65" x2="40" y2="80" stroke="black" strokeWidth="4" />
                <circle cx="40" cy="85" r="5" fill="orange" />

                {/* Peeling hand */}
                <line x1="50" y1="65" x2="60" y2="80" stroke="black" strokeWidth="4" className="animate-peel-motion" />
            </g>
        );
    }
  }

  return (
    <div className={`relative w-24 h-24 overflow-hidden bg-white rounded-lg border border-gray-100 ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
         <defs>
             <style>
                 {`
                    @keyframes armChop {
                        0% { transform: rotate(0deg); }
                        50% { transform: rotate(-30deg); }
                        100% { transform: rotate(0deg); }
                    }
                    .animate-arm-chop { animation: armChop 0.4s infinite; }
                    
                    @keyframes armStir {
                        0% { transform: rotate(0deg) translateX(0); }
                        25% { transform: rotate(5deg) translateX(2px); }
                        75% { transform: rotate(-5deg) translateX(-2px); }
                        100% { transform: rotate(0deg); }
                    }
                    .animate-arm-stir { animation: armStir 1s linear infinite; }

                    @keyframes panShake {
                        0% { transform: rotate(0deg); }
                        25% { transform: rotate(-5deg); }
                        75% { transform: rotate(5deg); }
                        100% { transform: rotate(0deg); }
                    }
                    .animate-arm-pan-shake { animation: panShake 0.5s infinite; }

                    @keyframes foodJump {
                        0% { cy: 65; }
                        50% { cy: 50; }
                        100% { cy: 65; }
                    }
                    .animate-food-jump { animation: foodJump 0.5s infinite; }

                    @keyframes bubbleRise {
                        0% { cy: 80; opacity: 1; }
                        100% { cy: 60; opacity: 0; }
                    }
                    .animate-bubble-rise { animation: bubbleRise 2s infinite; }
                    
                    @keyframes waterFlow {
                         0% { stroke-dashoffset: 0; }
                         100% { stroke-dashoffset: 20; }
                    }
                    .animate-water-flow { animation: waterFlow 0.5s linear infinite; }

                    @keyframes armWash {
                        0% { d: path("M60 65 Q50 80 40 90"); }
                        50% { d: path("M60 65 Q50 75 45 90"); }
                        100% { d: path("M60 65 Q50 80 40 90"); }
                    }
                    .animate-arm-wash { animation: armWash 0.5s infinite; }

                    @keyframes peelMotion {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(5px); }
                        100% { transform: translateY(0); }
                    }
                    .animate-peel-motion { animation: peelMotion 0.5s infinite; }
                 `}
             </style>
         </defs>
         {getAnimation()}
      </svg>
    </div>
  );
};

export default StickFigure;
