import React from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Lock,
  Eye,
  Sparkles,
  HeartPulse,
  Users,
  ExternalLink,
  MapPin,
  FileCheck2,
  Heart,
  CheckCircle2,
  Shield,
  Palette,
  Compass,
} from 'lucide-react';
import { VivaLogo } from './VivaLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Sobre o VIVA+
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informações do aplicativo, objetivos ODS e fontes de dados oficiais
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fechar janela sobre o projeto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Header Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 via-white to-emerald-50 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800/90 rounded-2xl border-2 border-sky-200 dark:border-sky-800 text-center shadow-xs">
          <VivaLogo variant="full" size="md" />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-700 text-white shadow-xs">
              Acessibilidade WCAG AAA
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-xs">
              Saúde, Inclusão & Proteção
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* 1. Origem e Propósito do Projeto */}
          <section className="p-4 bg-sky-50/70 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-600 shrink-0" />
              <h4 className="font-black text-sky-950 dark:text-sky-200 text-xs sm:text-sm">
                1. Origem e Propósito Social do VIVA+
              </h4>
            </div>
            <p>
              O <strong>VIVA+</strong> foi concebido para resolver um dos maiores desafios de saúde pública e inclusão no Brasil: a exclusão digital de pessoas idosas e com dificuldades de visão ou leitura. Aplicativos comuns de saúde costumam ter letras pequenas, termos médicos complexos e telas confusas.
            </p>
            <p>
              No Brasil, vivem mais de <strong>32,1 milhões de idosos</strong> e <strong>14,4 milhões de pessoas com deficiência</strong> (Censo Demográfico IBGE 2022). O VIVA+ elimina essas barreiras ao integrar tecnologia assistiva amigável, alto contraste, leitura em áudio e ferramentas práticas de proteção contra golpes, garantindo que o cuidado com a saúde seja acessível, digno e seguro para todos.
            </p>
          </section>

          {/* 2. Os 4 Pilares da Metodologia */}
          <section className="p-4 bg-white dark:bg-slate-850 rounded-2xl border-2 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                2. Os 4 Pilares da Metodologia VIVA+
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-black text-sky-700 dark:text-sky-400 text-xs flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-sky-600" />
                  Pilar 1: ENXERGUE
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Botões de dimensões generosas, fontes com ajuste de tamanho (A- / A+), espaçamento seguro anti-toque acidental e modo de alto contraste (preto e amarelo WCAG AAA) para quem tem baixa visão, catarata ou glaucoma.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-black text-teal-700 dark:text-teal-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Pilar 2: ENTENDA
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Linguagem em português simples e acolhedor, leitura por foto de bulas e receitas médicas com o leitor inteligente, e síntese de voz (leitura falada) em cada botão tocado.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-black text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Pilar 3: DECIDA
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Autonomia nas decisões diárias: detector preventivo de golpes por mensagem (Pix falso, boletos adulterados), organizador descomplicado de horários de remédios e registro confiável de pressão arterial e glicemia.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Pilar 4: VIVA
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Paz de espírito para o idoso e familiares. Botão de SOS sempre visível com ligação direta ao SAMU 192 e aviso imediato por WhatsApp com localização exata ao contato de confiança.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Identidade Visual e Conceito */}
          <section className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-600 shrink-0" />
              <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                3. Conceito do Símbolo e Cores Funcionais
              </h4>
            </div>
            <p className="text-[11px]">
              O símbolo do VIVA+ integra em um único traço orgânico: <strong>o abraço e o acolhimento humano</strong> (coração estilizado), <strong>o olhar assistivo e a visão nítida</strong> (curvas superiores), e <strong>a vitalidade e saúde ativa</strong> (folha/gota de vida).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-600 mx-auto mb-1" />
                <strong className="block text-slate-900 dark:text-white">Azul Saúde</strong>
                <span className="text-slate-500">Confiança e foco</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 mx-auto mb-1" />
                <strong className="block text-slate-900 dark:text-white">Verde Vida</strong>
                <span className="text-slate-500">Saúde e SUS</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 mx-auto mb-1 border border-black" />
                <strong className="block text-slate-900 dark:text-white">Amarelo Contraste</strong>
                <span className="text-slate-500">WCAG 2.1 AAA</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 mx-auto mb-1" />
                <strong className="block text-slate-900 dark:text-white">Vermelho Alerta</strong>
                <span className="text-slate-500">Emergência SOS 192</span>
              </div>
            </div>
          </section>

          {/* 4. Objetivos de Desenvolvimento Sustentável (ODS) da ONU */}
          <section className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-sky-950/50 rounded-2xl border-2 border-emerald-400 dark:border-emerald-700 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                ODS
              </div>
              <div>
                <h4 className="font-black text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm leading-tight">
                  4. Alinhamento com os Objetivos da ONU (Agenda 2030)
                </h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  Compromisso formal com o desenvolvimento sustentável e a saúde global
                </p>
              </div>
            </div>

            {/* ODS 3 */}
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-black text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                  ODS 3 — Saúde e Bem-Estar (Principal)
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                  Meta 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                <strong>Meta 3.8 da ONU:</strong> Atingir a cobertura universal de saúde, incluindo o acesso a serviços de saúde essenciais de qualidade e a medicamentos e vacinas seguros, eficazes e acessíveis.
              </p>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-[10px] text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                <strong>Como o VIVA+ cumpre este objetivo:</strong> Fortalece a atenção primária à saúde, organizando horários de medicamentos para evitar esquecimentos e erros posológicos, registrando medições reais de pressão arterial e glicemia (alinhado aos PCDT do Ministério da Saúde) e localizando imediatamente Unidades Básicas de Saúde (UBS), UPAs 24h e postos do Farmácia Popular do SUS.
              </div>
              <a
                href="https://brasil.un.org/pt-br/sdgs/3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 mt-1"
              >
                Conheça a Meta 3.8 na ONU Brasil <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* ODS 10 */}
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-sky-300 dark:border-sky-800 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-black text-xs text-sky-900 dark:text-sky-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  ODS 10 — Redução das Desigualdades (Complementar)
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300">
                  Meta 10.2
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                <strong>Meta 10.2 da ONU:</strong> Empoderar e promover a inclusão social, econômica e política de todos, independentemente da idade, deficiência, gênero, raça ou condição socioeconômica.
              </p>
              <div className="p-2 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-[10px] text-sky-900 dark:text-sky-200 font-medium leading-relaxed">
                <strong>Como o VIVA+ cumpre este objetivo:</strong> Quebra barreiras de exclusão digital enfrentadas por milhões de idosos e pessoas com deficiência no país, fornecendo leitura falada em voz alta ao tocar em cada botão, modo alto contraste WCAG AAA, textos simplificados e detector de golpes financeiros (Pix, falso parente) que vitimam idosos diariamente.
              </div>
              <a
                href="https://brasil.un.org/pt-br/sdgs/10"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-sky-700 dark:text-sky-400 font-bold hover:underline inline-flex items-center gap-1 mt-1"
              >
                Conheça a Meta 10.2 na ONU Brasil <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </section>

          {/* 5. Fontes de Dados Oficiais e Seguros */}
          <section className="p-4 bg-sky-50/70 dark:bg-sky-950/60 rounded-2xl border-2 border-sky-400 dark:border-sky-700 space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <h4 className="font-black text-sky-950 dark:text-sky-100 text-xs sm:text-sm leading-tight">
                  5. Fontes Oficiais e Evidências Seguras
                </h4>
                <p className="text-[11px] text-sky-800 dark:text-sky-300">
                  De onde vêm todas as informações, parâmetros médicos e bases de dados do app
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {/* IBGE */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    1. IBGE — Censo Demográfico 2022
                  </strong>
                  <span className="text-[9px] font-bold text-sky-600 uppercase">Dados Oficiais Brasil</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  7,3% da população com 2 anos ou mais possui alguma deficiência (14,4 milhões de pessoas) e ~32,1 milhões de pessoas idosas (60+ anos) no Brasil.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] mt-1.5">
                  <a
                    href="https://www.ibge.gov.br/biblioteca/visualizacao/livros/liv102038.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    Censo 2022 (Relatório Oficial PDF) ↗
                  </a>
                  <a
                    href="https://educa.ibge.gov.br/jovens/materias-especiais/22695-censo-2022-7-3-da-populacao-com-2-anos-ou-mais-tinha-alguma-deficiencia.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    Educa IBGE Deficiência ↗
                  </a>
                </div>
                <span className="text-[9px] text-slate-400 italic block mt-1">
                  Citação oficial: “Fonte: IBGE, Censo 2022”
                </span>
              </div>

              {/* OMS e UNICEF */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    2. OMS & UNICEF — Relatório Mundial 2022
                  </strong>
                  <span className="text-[9px] font-bold text-sky-600 uppercase">Referência Global</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  <em>Global Report on Assistive Technology:</em> mais de 2,5 bilhões de pessoas necessitam de tecnologia assistiva no mundo, enfrentando barreiras de acesso e custo.
                </p>
                <a
                  href="https://www.who.int/southeastasia/publications/i/item/9789240049451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 dark:text-sky-400 hover:underline text-[10px] block mt-1"
                >
                  who.int/publications/9789240049451 ↗
                </a>
                <span className="text-[9px] text-slate-400 italic block mt-0.5">
                  Citação oficial: “Fonte: OMS e UNICEF, 2022”
                </span>
              </div>

              {/* Ministério da Saúde */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    3. Ministério da Saúde — PCDT & Caderneta do Idoso
                  </strong>
                  <span className="text-[9px] font-bold text-sky-600 uppercase">SUS Brasil</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) de Hipertensão Arterial Sistêmica (Portaria Conjunta 2025/2026) e Diabete Melito Tipo 2 (Atualização 2026), e a Caderneta de Saúde da Pessoa Idosa do SUS para parâmetros médicos seguros de medição e faixas de normalidade.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] mt-1.5">
                  <a
                    href="https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    PCDT Hipertensão 2025 ↗
                  </a>
                  <a
                    href="https://www.gov.br/saude/pt-br/assuntos/pcdt/d/diabete-melito-tipo-2.pdf/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    PCDT Diabetes 2026 ↗
                  </a>
                  <a
                    href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-pessoa-idosa/caderneta-de-saude/caderneta-de-saude"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Caderneta da Pessoa Idosa SUS ↗
                  </a>
                </div>
              </div>

              {/* ANVISA & CNES DataSUS */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    4. ANVISA & CNES / DataSUS — Medicamentos e Unidades de Saúde
                  </strong>
                  <span className="text-[9px] font-bold text-sky-600 uppercase">Bases Nacionais</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Bulário Eletrônico da ANVISA para identificação de remédios, e Cadastro Nacional de Estabelecimentos de Saúde (CNES) integrado ao OpenStreetMap para localização de UBS, UPAs 24h e postos do Farmácia Popular em todos os municípios brasileiros, de capitais a pequenas cidades do interior.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] mt-1.5">
                  <a
                    href="https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Bulário Eletrônico ANVISA ↗
                  </a>
                  <a
                    href="https://cnes.datasus.gov.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Base CNES / DataSUS ↗
                  </a>
                </div>
              </div>

              {/* WCAG 2.1 AAA */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-white font-black text-xs">
                    5. W3C / WCAG 2.1 Nível AAA — Acessibilidade Digital
                  </strong>
                  <span className="text-[9px] font-bold text-sky-600 uppercase">Padrão Internacional</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Diretrizes Internacionais de Acessibilidade para Conteúdo Web (WCAG 2.1 nível AAA), garantindo contraste mínimo de 7:1 no modo alto contraste, escalabilidade tipográfica sem distorção e suporte nativo a leitores de tela.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Privacidade e Proteção de Dados (LGPD) */}
          <section className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
            <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              6. Privacidade e Proteção de Dados (LGPD - Lei nº 13.709/2018)
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-xs">
              <li>
                <strong>Armazenamento Local Seguro:</strong> Suas medições de saúde, remédios e telefone de confiança ficam salvos na memória do seu aparelho.
              </li>
              <li>
                <strong>Sem cadastros invasivos:</strong> Não solicitamos CPF, senhas bancárias ou dados pessoais sensíveis.
              </li>
              <li>
                <strong>IA Segura e Isolada:</strong> Ao analisar mensagens suspeitas ou receitas, os dados são processados com isolamento sem salvar histórico em bancos de terceiros. Nenhum link suspeito é aberto.
              </li>
              <li>
                <strong>Direito do Usuário:</strong> Você pode consultar, baixar uma cópia em JSON ou apagar todos os seus registros a qualquer momento na tela Meu Perfil.
              </li>
            </ul>
          </section>
        </div>

        {/* Bottom Close Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold py-3 rounded-2xl transition cursor-pointer text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
