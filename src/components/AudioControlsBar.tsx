import React from 'react';
import { Volume2, VolumeX, Volume1, Minus, Plus, Square, Play, Sparkles } from 'lucide-react';
import { useAudioPlayer } from '../utils/speech';

interface AudioControlsBarProps {
  className?: string;
  variant?: 'full' | 'compact' | 'floating';
  onPlayCurrent?: () => void;
  canPlay?: boolean;
  label?: string;
}

export const AudioControlsBar: React.FC<AudioControlsBarProps> = ({
  className = '',
  variant = 'full',
  onPlayCurrent,
  canPlay = false,
  label = 'Controles de Voz e Áudio',
}) => {
  const {
    volume,
    isMuted,
    isSpeaking,
    setVolume,
    increaseVolume,
    decreaseVolume,
    toggleMute,
    stop,
  } = useAudioPlayer();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />;
    }
    if (volume < 50) {
      return <Volume1 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 shrink-0" />;
    }
    return <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 dark:text-sky-400 shrink-0" />;
  };

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 ${className}`}
        role="region"
        aria-label={label}
      >
        {/* Mute toggle button */}
        <button
          type="button"
          data-no-speech="true"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className={`p-2 rounded-xl transition flex items-center justify-center min-h-[38px] min-w-[38px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            isMuted
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-label={isMuted ? 'Reativar som (som está mudo)' : 'Silenciar áudio do aplicativo'}
          title={isMuted ? 'Reativar som' : 'Silenciar áudio'}
          aria-pressed={isMuted}
        >
          {getVolumeIcon()}
        </button>

        {/* Volume controls */}
        <button
          type="button"
          data-no-speech="true"
          onClick={(e) => {
            e.stopPropagation();
            decreaseVolume(10);
          }}
          disabled={volume <= 0}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Diminuir volume da voz em 10%"
          title="Diminuir volume (-10%)"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span
          className="font-black text-xs min-w-[36px] text-center font-mono select-none"
          aria-live="polite"
          aria-label={`Volume atual ${isMuted ? '0%, som silenciado' : `${volume}%`}`}
        >
          {isMuted ? 'Mudo' : `${volume}%`}
        </span>

        <button
          type="button"
          data-no-speech="true"
          onClick={(e) => {
            e.stopPropagation();
            increaseVolume(10);
          }}
          disabled={volume >= 100}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Aumentar volume da voz em 10%"
          title="Aumentar volume (+10%)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Stop button when speaking */}
        {isSpeaking && (
          <button
            type="button"
            data-no-speech="true"
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
            className="ml-auto px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1 transition animate-pulse cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Parar leitura em voz alta"
            title="Parar áudio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Parar</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <section
      className={`bg-white dark:bg-slate-900/95 rounded-3xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 transition-colors ${className}`}
      role="region"
      aria-label={label}
    >
      {/* Top row: Status & Main Action */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
              isSpeaking
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 animate-pulse'
                : isMuted
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
            }`}
          >
            {getVolumeIcon()}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>Controle de Áudio da Leitura</span>
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              )}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                  isSpeaking
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : isMuted
                    ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
                aria-live="polite"
              >
                {isSpeaking ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    <span>Lendo em voz alta...</span>
                  </>
                ) : isMuted ? (
                  <>
                    <VolumeX className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Áudio silenciado</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    <span>Áudio pronto</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action button: Parar or Ouvir */}
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              type="button"
              data-no-speech="true"
              onClick={(e) => {
                e.stopPropagation();
                stop();
              }}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-2 px-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Parar leitura em voz alta imediatamente"
              title="Parar áudio agora"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Parar leitura</span>
            </button>
          ) : canPlay && onPlayCurrent ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayCurrent();
              }}
              className="btn-contrast-solid bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black py-2 px-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Iniciar leitura do texto em voz alta"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Ouvir texto</span>
            </button>
          ) : null}

          {/* Mute toggle button */}
          <button
            type="button"
            data-no-speech="true"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center gap-1.5 border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isMuted
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
            aria-label={isMuted ? 'Reativar som da leitura' : 'Silenciar som da leitura'}
            aria-pressed={isMuted}
            title={isMuted ? 'Reativar som' : 'Silenciar som'}
          >
            {isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ativar som</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Silenciar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom row: Volume - / Slider / + / % */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 shrink-0">
            Volume da voz:
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {/* Decrease button (-) */}
            <button
              type="button"
              data-no-speech="true"
              onClick={(e) => {
                e.stopPropagation();
                decreaseVolume(10);
              }}
              disabled={volume <= 0}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 disabled:opacity-40 transition cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center font-black focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
              aria-label="Diminuir volume da leitura em 10 por cento"
              title="Diminuir volume (-10%)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Increase button (+) */}
            <button
              type="button"
              data-no-speech="true"
              onClick={(e) => {
                e.stopPropagation();
                increaseVolume(10);
              }}
              disabled={volume >= 100}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 disabled:opacity-40 transition cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center font-black focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
              aria-label="Aumentar volume da leitura em 10 por cento"
              title="Aumentar volume (+10%)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Range slider 0% to 100% */}
        <div className="flex-1 w-full flex items-center gap-3 min-w-0">
          <input
            type="range"
            data-no-speech="true"
            min="0"
            max="100"
            step="5"
            value={volume}
            onChange={handleSliderChange}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#687EFF] focus:outline-none focus:ring-2 focus:ring-[#80B3FF]"
            aria-label="Controle deslizante de volume da voz de 0 a 100 por cento"
            aria-valuenow={volume}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${volume} por cento`}
          />

          {/* Volume percentage badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-center font-mono font-black text-xs shrink-0 min-w-[56px] shadow-xs select-none ${
              isMuted
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700'
            }`}
            aria-live="polite"
          >
            {isMuted ? 'Mudo' : `${volume}%`}
          </div>
        </div>
      </div>
    </section>
  );
};
