import { motion } from "framer-motion";
import { personal } from "../data/cv";
import { Download, Check, Volume2 } from "lucide-react";
import { useState, useRef } from "react";
import { trackCVDownload, trackEmailClick, trackPhoneClick, trackSocialClick } from "../lib/analytics";

export function Hero() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pronounceName = () => {
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/name-pronunciation.mp3');
    }

    const audio = audioRef.current;
    
    // Set up event listeners
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      setIsSpeaking(false);
      console.error('Error playing name pronunciation audio, falling back to TTS');
      // Fallback to text-to-speech
      fallbackToTTS();
    };

    // Play the audio
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
      // Fallback to text-to-speech
      fallbackToTTS();
    });
  };

  const fallbackToTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(personal.name);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section id="top" className="pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 card">
        {/* Mobile: Stacked layout, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
          {/* LinkedIn-style Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 order-1 sm:order-1"
          >
            <div className="relative">
              {/* Circular profile image - responsive sizing */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-white dark:border-neutral-900 shadow-lg">
                <img
                  src={personal.profileImage}
                  alt={`${personal.name} - Software Engineer`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personal.name)}&size=128&background=random&color=fff&bold=true`;
                  }}
                />
              </div>
              
              {/* Status indicator - responsive sizing */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-green-500 border-2 sm:border-3 lg:border-4 border-white dark:border-neutral-900 rounded-full w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* LinkedIn-style Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 min-w-0 order-2 sm:order-2 text-center sm:text-left"
          >
            {/* Name with badges - responsive layout */}
            <header className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-white leading-tight">
                {personal.name}
              </h1>
              
              {/* Verified badge - responsive sizing */}
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
              
              {/* Speaker icon - responsive sizing */}
              <button 
                onClick={pronounceName}
                className={`p-1 sm:p-1.5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0 ${
                  isSpeaking ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                }`}
                title="Pronounce name"
                aria-label="Pronounce name"
              >
                <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                  isSpeaking 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`} />
              </button>
            </header>

            {/* Tagline - responsive text size */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4">
              Creating with code. Small details matter.
            </p>

            {/* Role and summary - responsive text sizes */}
            <h2 className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
              {personal.role}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
              {personal.summary}
            </p>

            {/* Action buttons - responsive layout */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <a
                href="#projects"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium text-center"
              >
                View Projects
              </a>
              <a
                href={personal.resumeUrl}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCVDownload()}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download CV</span>
                <span className="sm:hidden">CV</span>
              </a>
            </div>

            {/* Contact info - responsive text and layout */}
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 flex items-center justify-center sm:justify-start gap-1 flex-wrap">
              <span>{personal.location}</span>
              <span> • </span>
              <a 
                className="underline underline-offset-4 hover:text-blue-600" 
                href={personal.linkedin}
                onClick={() => trackSocialClick('LinkedIn')}
              >
                LinkedIn
              </a>
              <span> • </span>
              <a 
                className="underline underline-offset-4 hover:text-blue-600" 
                href={`tel:${personal.phone.replace(' ', '')}`}
                onClick={() => trackPhoneClick()}
              >
                Call
              </a>
            </div>
          </motion.div>
        </div>

        {/* Background decorations - responsive positioning */}
        <div className="pointer-events-none absolute -right-10 sm:-right-16 lg:-right-20 -top-10 sm:-top-16 lg:-top-20 h-48 w-48 sm:h-64 sm:w-64 lg:h-72 lg:w-72 rounded-full bg-gradient-to-br from-brand to-fuchsia-500 opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 sm:-left-12 lg:-left-16 -bottom-8 sm:-bottom-12 lg:-bottom-16 h-40 w-40 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 opacity-20 blur-2xl" />
      </div>
    </section>
  );
}
