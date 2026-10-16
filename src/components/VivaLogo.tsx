import React from 'react';

export type LogoVariant = 'full' | 'header' | 'app-icon';
export type LogoTheme = 'light' | 'dark' | 'auto';

export interface VivaLogoProps {
  variant?: LogoVariant;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showTagline?: boolean;
  theme?: LogoTheme;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

/**
 * Logotipo oficial do VIVA+
 * Renderiza a tag HTML <img> com o arquivo viva-logo.png da pasta public,
 * com max-width: 200px e proporção de aspecto estritamente preservada.
 */
export const VivaLogo: React.FC<VivaLogoProps> = ({
  variant,
  layout = 'horizontal',
  size = 'md',
  showTagline = false,
  className = '',
  style = {},
  alt = 'Logotipo VIVA+ | Tecnologia Assistiva e Saúde',
}) => {
  const effectiveVariant: LogoVariant = variant || (layout === 'horizontal' ? 'header' : 'full');
  
  // Caminho do viva-logo.png na pasta public (suporta subpastas de GitHub Pages e raiz Vercel)
  const baseUrl = import.meta.env.BASE_URL || './';
  const logoUrl = `${baseUrl}viva-logo.png`.replace(/\/+/g, '/');

  // Ajustes de proporção responsivos mantendo estritamente max-width: 200px
  const sizeClasses: Record<string, string> = {
    sm: 'max-w-[120px] max-h-9',
    md: 'max-w-[170px] sm:max-w-[200px] max-h-12',
    lg: 'max-w-[200px] max-h-16',
    xl: 'max-w-[200px] max-h-24',
    custom: 'max-w-[200px]',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  if (effectiveVariant === 'full') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center select-none ${className}`}
        aria-label="Logotipo oficial VIVA+: Tecnologia Assistiva e Saúde"
      >
        <img
          src={logoUrl}
          alt={alt}
          style={{
            maxWidth: '200px',
            width: 'auto',
            height: 'auto',
            ...style,
          }}
          className="brand-logo-img object-contain max-w-[200px] w-auto h-auto select-none"
          loading="eager"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = '/viva-logo.png';
            }
          }}
        />
        {showTagline && (
          <div className="mt-2 text-center">
            <p className="text-xs sm:text-sm font-black tracking-[0.16em] uppercase text-slate-800 dark:text-slate-200">
              TECNOLOGIA QUE ENTENDE VOCÊ
            </p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              Enxergue • Entenda • Decida • Viva.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={alt}
      style={{
        maxWidth: '200px',
        width: 'auto',
        height: 'auto',
        ...style,
      }}
      className={`brand-logo-img object-contain max-w-[200px] w-auto h-auto select-none ${selectedSizeClass} ${className}`}
      loading="eager"
      decoding="async"
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.dataset.triedFallback) {
          target.dataset.triedFallback = 'true';
          target.src = '/viva-logo.png';
        }
      }}
    />
  );
};
