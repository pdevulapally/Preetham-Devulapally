import { useState, useEffect } from 'react';
import { Phone, Eye, EyeOff, Shield } from 'lucide-react';
import { personal } from '../data/cv';

export function ProtectedPhone() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showShield, setShowShield] = useState(false);

  const toggleReveal = () => {
    setClickCount(prev => prev + 1);
    setIsRevealed(!isRevealed);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Show shield animation on first reveal
  useEffect(() => {
    if (isRevealed && clickCount === 1) {
      setShowShield(true);
      setTimeout(() => setShowShield(false), 2000);
    }
  }, [isRevealed, clickCount]);

  return (
    <div className="flex items-start gap-4 relative">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
        <Phone className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-neutral-900 dark:text-white">Phone</h4>
        <div className="flex items-center gap-2">
          {isRevealed ? (
            <a 
              className="text-brand hover:underline underline-offset-8 transition-colors" 
              href={`tel:${personal.phone.replace(' ', '')}`}
            >
              {personal.phone}
            </a>
          ) : (
            <span className="text-neutral-500 dark:text-neutral-400 select-none font-mono">
              {personal.phone.replace(/\d/g, '•')}
            </span>
          )}
          <button
            onClick={toggleReveal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors group relative"
            aria-label={isRevealed ? "Hide phone number" : "Reveal phone number"}
            title={isRevealed ? "Hide phone number" : "Click to reveal phone number"}
          >
            {isRevealed ? (
              <EyeOff className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
            ) : (
              <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
            )}
            {showShield && (
              <div className="absolute -top-8 -right-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-xs whitespace-nowrap border border-green-200 dark:border-green-800 animate-pulse">
                <Shield className="w-3 h-3 inline mr-1" />
                Protected
              </div>
            )}
          </button>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {isRevealed ? "Available for calls" : "Click to reveal number"}
        </p>
        {!isRevealed && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Protected from spam bots
          </p>
        )}
      </div>
    </div>
  );
}
