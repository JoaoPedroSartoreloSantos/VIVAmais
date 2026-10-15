import React from 'react';
import { Home, HeartPulse, ScanText, MapPin, MessageSquareHeart } from 'lucide-react';
import { ActiveTab } from '../types';
import { speakText } from '../utils/speech';

interface BottomNavProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

const TAB_DESCRIPTIONS: Record<string, string> = {
  home: 'Aba Início: tela principal com atalhos e avisos.',
  reader: 'Aba Ler e Ouvir: use a câmera para ler receitas e bulas com voz em alto som.',
  health: 'Aba Minha Saúde: acompanhe remédios, doses e histórico medido de pressão e glicose.',
  places: 'Aba Ajuda Perto: encontre postos de saúde, UPAs e farmácias perto de você no Brasil.',
  assistant: 'Aba Pedir Ajuda: fale no microfone para tirar dúvidas de saúde com calma.',
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'reader' as ActiveTab,
      label: 'Ler e ouvir',
      icon: ScanText,
    },
    {
      id: 'health' as ActiveTab,
      label: 'Minha Saúde',
      icon: HeartPulse,
    },
    {
      id: 'places' as ActiveTab,
      label: 'Ajuda Perto',
      icon: MapPin,
    },
    {
      id: 'assistant' as ActiveTab,
      label: 'Pedir Ajuda',
      icon: MessageSquareHeart,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 sm:px-3 py-1.5 sm:py-2 transition-colors select-none"
      role="navigation"
      aria-label="Navegação Principal do Aplicativo"
      style={{
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(0.375rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.375rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="max-w-2xl mx-auto grid grid-cols-5 gap-0.5 min-[360px]:gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                speakText(TAB_DESCRIPTIONS[tab.id] || `Aba ${tab.label}`);
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 sm:px-1 rounded-xl sm:rounded-2xl transition font-bold text-xs min-h-[48px] sm:min-h-[54px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? 'nav-active bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 ring-2 ring-sky-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Ir para ${tab.label}`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 shrink-0 ${
                  isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500'
                }`}
              />
              <span className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold leading-tight text-center w-full px-0.5 tracking-tight truncate block">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
