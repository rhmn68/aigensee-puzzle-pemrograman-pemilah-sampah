/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import logoPusbuk from '@/assets/logo-jenama.webp?v2';
import bgBackground from '@/assets/background.webp';

interface SplashProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function Splash({ onStart, isMuted, onToggleMute }: SplashProps) {
  return (
    <div className="relative max-h-screen h-screen w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden selection:bg-indigo-500/30 font-sans leading-relaxed bg-[#FEF8F0]">
      {/* Background Image with blur & opacity-60 */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${bgBackground})` }}
      />

      {/* Pusbuk Logo on Absolute Top Left */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-50 shrink-0 animate-fade-in">
        <img 
          src={logoPusbuk} 
          alt="Logo Pusbuk" 
          className="h-7 sm:h-10 md:h-14 lg:h-16 2xl:h-28 w-auto object-contain drop-shadow-[0_8px_16px_rgba(56,69,91,0.55)]"
        />
      </div>

      {/* Sound Toggle Button on Absolute Top Right */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 animate-fade-in">
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl border border-[#EED4B7] bg-white/90 hover:bg-white text-stone-600 transition-all cursor-pointer shadow-md"
          title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      {/* Centered Splash Hero Panel */}
      <div className="z-10 max-w-2xl flex flex-col items-center gap-6 animate-scale-up">
        {/* Floating container for titles to create a smooth bobbing/wiggle effect */}
        <div className="w-full flex flex-col items-center animate-float-wiggle">
          <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-950 leading-tight drop-shadow-sm">
            Puzzle Pemrograman<br />Pemilah Sampah
          </h1>
        </div>

        {/* Start Button Graphic (button-mulai.webp) */}
        <button
          onClick={onStart}
          className=" cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300 hover:brightness-110 focus:outline-none drop-shadow-2xl animate-[pulse_2s_infinite]"
          aria-label="Mulai Game"
        >
          <span className="inline-block rounded-2xl bg-emerald-700 text-white px-10 py-4 text-xl font-bold border-b-4 border-emerald-900 shadow-xl">Mulai</span>
        </button>
      </div>
    </div>
  );
}

