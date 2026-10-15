import React from 'react';
import {
  Volume2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Eye,
  Info,
  User,
  Smartphone,
} from 'lucide-react';
import { AccessibilitySettings, UserProfile } from '../types';
import { VivaLogo } from './VivaLogo';
import { speakText } from '../utils/speech';

interface HeaderProps {
  settings: AccessibilitySettings;
  currentUser: UserProfile;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onOpenAbout: () => void;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAuth: () => void;
  screenDescription: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentUser,
  onUpdateSettings,
  onOpenAbout,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAuth,
  screenDescription,
}) => {
  const handleFontChange = (delta: number) => {
    let nextScale = Math.round((settings.fontScale + delta) * 100) / 100;
    if (nextScale < 0.85) nextScale = 0.85;
    if (nextScale > 1.45) nextScale = 1.45;
    const updated = { ...settings, fontScale: nextScale };
    onUpdateSettings(updated);
    document.documentElement.style.setProperty('--font-scale', `${nextScale}`);
    speakText(delta > 0 ? 'Tamanho da letra aumentado.' : 'Tamanho da letra diminuído.');
  };

  const handleThemeChange = (theme: 'normal' | 'contrast' | 'rest') => {
    const updated = { ...settings, theme };
    onUpdateSettings(updated);
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    speakText(
      `Tema ${
        theme === 'contrast'
          ? 'alto contraste preto e amarelo'
          : theme === 'rest'
          ? 'descanso noturno'
          : 'padrão saúde claro'
      } ativado.`
    );
  };

  const handleReadScreen = () => {
    speakText(screenDescription);
  };

  // Botões de apoio reutilizados no mobile (linha 1) e desktop (barra horizontal unificada)
  const renderSupportActions = (isDesktop = false) => (
    <div
      className={`items-center gap-1.5 sm:gap-2 shrink-0 ${
        isDesktop ? 'hidden md:flex' : 'flex md:hidden'
      }`}
    >
      {/* Botão Ouvir Tela */}
      <button
        type="button"
        onClick={handleReadScreen}
        className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shrink-0 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
        aria-label="Ouvir instruções da tela atual em voz alta"
        title="Ouvir esta tela"
      >
        <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-300 shrink-0" />
        <span className="hidden min-[480px]:inline md:inline text-xs font-black">Ouvir</span>
      </button>

      {/* Botão Sobre o App (ODS e Fontes Oficiais) */}
      <button
        type="button"
        onClick={() => {
          speakText('Abrindo informações sobre o aplicativo VIVA Plus, objetivos ODS da ONU e fontes de dados oficiais.');
          onOpenAbout();
        }}
        className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-slate-700 p-2.5 rounded-xl transition shrink-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-500"
        aria-label="Sobre o app: ODS da ONU e Fontes de Dados Oficiais"
        title="Sobre o app (ODS & Dados Oficiais)"
      >
        <Info className="w-4 h-4 shrink-0" />
      </button>

      {/* Botão Conta: Entrar com Celular (se Convidado) ou Meu Perfil (se autenticado) */}
      {currentUser.isGuest ? (
        <button
          type="button"
          onClick={onNavigateAuth}
          className="bg-sky-50 hover:bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200 border-2 border-sky-400 dark:border-sky-600 px-2.5 min-[360px]:px-3 py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition shrink-0 min-h-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 whitespace-nowrap"
          aria-label="Entrar ou criar conta com celular no VIVA+"
          title="Entrar com celular"
        >
          <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-300 shrink-0" />
          <span className="text-xs font-black">Entrar</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onNavigateProfile}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-700 px-2.5 min-[360px]:px-3 py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition shrink-0 min-h-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 whitespace-nowrap"
          aria-label="Acessar meu perfil e configurações"
          title="Meu perfil"
        >
          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0" />
          <span className="text-xs font-black">Perfil</span>
        </button>
      )}
    </div>
  );

  return (
    <header
      className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors shadow-xs"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
        paddingLeft: 'max(0.625rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.625rem, env(safe-area-inset-right, 0px))',
        paddingBottom: '0.5rem',
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 sm:gap-2">
        {/* ============================================================ */}
        {/* PRIMEIRA LINHA NO CELULAR (Android e iOS)                    */}
        {/* Logotipo VIVA+ à esquerda e Ações de Apoio (Áudio, Info,     */}
        {/* Conta/Menu) à direita                                        */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Logotipo VIVA+ */}
          <button
            type="button"
            onClick={() => {
              speakText('Voltando para a tela inicial do VIVA+.');
              onNavigateHome();
            }}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-2xl p-1 -ml-1 transition hover:opacity-90 shrink-0 cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="VIVA+ Início - Toque para voltar à tela inicial"
            title="VIVA+ Início"
          >
            <VivaLogo variant="header" size="md" className="origin-left scale-95 sm:scale-100" />
          </button>

          {/* Ações da primeira linha no celular (Áudio, Info e Conta/Menu) */}
          {renderSupportActions(false)}
        </div>

        {/* ============================================================ */}
        {/* SEGUNDA LINHA NO CELULAR / LADO DIREITO NO COMPUTADOR        */}
        {/* Controles de Acessibilidade: Fontes (A− / A+) e Temas        */}
        {/* (Claro, Alto Contraste WCAG AAA, Descanso Noturno)           */}
        {/* + Ações de apoio agrupadas no desktop                        */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto pt-1 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
          {/* Grupo 1: Controles de Tamanho de Fonte (A− e A+) */}
          <div
            className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-0.5 shrink-0"
            role="group"
            aria-label="Ajustar tamanho da fonte"
          >
            <button
              type="button"
              onClick={() => handleFontChange(-0.1)}
              className="flex items-center justify-center gap-0.5 px-2.5 py-1 text-slate-800 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl font-black text-xs min-h-[44px] min-w-[44px] transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Diminuir tamanho da letra"
              title="Diminuir fonte (A−)"
            >
              <ZoomOut className="w-4 h-4 shrink-0" />
              <span className="text-xs font-black">A−</span>
            </button>

            <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-600" aria-hidden="true" />

            <button
              type="button"
              onClick={() => handleFontChange(0.1)}
              className="flex items-center justify-center gap-0.5 px-2.5 py-1 text-slate-800 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl font-black text-xs min-h-[44px] min-w-[44px] transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Aumentar tamanho da letra"
              title="Aumentar fonte (A+)"
            >
              <ZoomIn className="w-4 h-4 shrink-0" />
              <span className="text-xs font-black">A+</span>
            </button>
          </div>

          {/* Grupo 2: Seletor de Temas (Claro, Alto Contraste e Descanso Noturno) */}
          <div
            className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-0.5 shrink-0"
            role="group"
            aria-label="Selecionar tema visual"
          >
            {/* Modo Claro (Saúde) */}
            <button
              type="button"
              onClick={() => handleThemeChange('normal')}
              className={`px-2.5 min-[360px]:px-3 py-1 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                settings.theme === 'normal'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tema Padrão Saúde (Claro)"
              aria-label="Ativar tema Claro Padrão Saúde"
              aria-pressed={settings.theme === 'normal'}
            >
              <Sun className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="hidden min-[600px]:inline text-xs">Claro</span>
            </button>

            {/* Modo Alto Contraste (WCAG AAA Preto e Amarelo) */}
            <button
              type="button"
              onClick={() => handleThemeChange('contrast')}
              className={`px-2.5 min-[360px]:px-3 py-1 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                settings.theme === 'contrast'
                  ? 'bg-yellow-400 text-black shadow-xs ring-2 ring-yellow-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tema Alto Contraste (Preto e Amarelo WCAG AAA)"
              aria-label="Ativar tema de Alto Contraste preto e amarelo"
              aria-pressed={settings.theme === 'contrast'}
            >
              <Eye className="w-4 h-4 shrink-0 text-yellow-500" />
              <span className="hidden min-[600px]:inline text-xs">Contraste</span>
            </button>

            {/* Modo Noturno / Descanso Suave */}
            <button
              type="button"
              onClick={() => handleThemeChange('rest')}
              className={`px-2.5 min-[360px]:px-3 py-1 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                settings.theme === 'rest'
                  ? 'bg-slate-800 text-white shadow-xs ring-1 ring-slate-600'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tema Descanso (Modo Noturno Suave)"
              aria-label="Ativar tema Descanso noturno"
              aria-pressed={settings.theme === 'rest'}
            >
              <Moon className="w-4 h-4 shrink-0 text-sky-400" />
              <span className="hidden min-[600px]:inline text-xs">Noite</span>
            </button>
          </div>

          {/* No desktop: Ações de Apoio (Áudio, Info, Conta) alinhadas na mesma barra horizontal */}
          {renderSupportActions(true)}
        </div>
      </div>
    </header>
  );
};
