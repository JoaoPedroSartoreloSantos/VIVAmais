/**
 * Client-Side Resilient Assistive AI Engine for VIVA+
 * Provides instant, clinically safe health and navigational guidance
 * even on static deployments (GitHub Pages, Vercel) or when offline.
 * Grounded in SUS Guidelines, PCDT and Senior Health Notebook.
 */

export interface LocalAssistantResponse {
  reply: string;
  speechText: string;
  isEmergency: boolean;
  placesCategory?: 'all' | 'ubs' | 'upa' | 'hospital' | 'pharmacy' | 'none';
}

export function generateLocalHealthAssistantResponse(
  userQuestion: string,
  context?: {
    healthLogsCount?: number;
    latestHealthLog?: any;
    medicationsCount?: number;
    medications?: string[];
    hasTrustedContact?: boolean;
  }
): LocalAssistantResponse {
  const q = userQuestion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. EMERGÊNCIAS GRAVES
  const isEmergency =
    q.includes('dor no peito') ||
    q.includes('infarto') ||
    q.includes('avc') ||
    q.includes('derrame') ||
    q.includes('falta de ar') ||
    q.includes('nao consigo respirar') ||
    q.includes('desmaio') ||
    q.includes('perdi a forca') ||
    q.includes('boca torta') ||
    q.includes('dor muito forte');

  if (isEmergency) {
    return {
      isEmergency: true,
      placesCategory: 'upa',
      reply:
        '🚨 ATENÇÃO: Os sintomas que você descreveu podem indicar uma urgência médica que precisa de avaliação imediata.\n\n' +
        '• Ligue para o SAMU 192 (ligação gratuita de qualquer telefone) ou acione o botão SOS vermelho na tela.\n' +
        '• Se estiver sozinho(a), avise um familiar ou vizinho agora.\n' +
        '• Fique em repouso e não faça esforços físicos até a ajuda chegar.',
      speechText:
        'Atenção: seus sintomas necessitam de atendimento médico imediato. Ligue para o SAMU no número 192 ou use o botão vermelho de emergência.',
    };
  }

  // 2. PRESSÃO ARTERIAL (HIPERTENSÃO / HIPOTENSÃO)
  if (
    q.includes('pressao') ||
    q.includes('hipertensao') ||
    q.includes('pressao alta') ||
    q.includes('pressao baixa') ||
    q.includes('sistolica') ||
    q.includes('diastolica')
  ) {
    let extraContext = '';
    if (context?.latestHealthLog && context.latestHealthLog.type === 'blood_pressure') {
      extraContext = `Sua última medição registrada foi ${context.latestHealthLog.systolic} por ${context.latestHealthLog.diastolic} mmHg. `;
    }

    return {
      isEmergency: false,
      placesCategory: 'ubs',
      reply:
        `📊 Orientação sobre Pressão Arterial (Parâmetros Oficiais do SUS):\n\n` +
        `${extraContext}` +
        `• Pressão Ótima / Normal: Até 12 por 8 (120/80 mmHg).\n` +
        `• Atenção (Pré-Hipertensão): Entre 12 por 8 e 13 por 8 (121 a 139 sistólica).\n` +
        `• Hipertensão: A partir de 14 por 9 (140/90 mmHg) em medições repetidas.\n\n` +
        `Dicas Importantes para Idosos:\n` +
        `1. Meça a pressão sentado(a), em repouso de 5 minutos, sem ter tomado café nos últimos 30 minutos.\n` +
        `2. Beba bastante água ao longo do dia e reduza o sal das refeições.\n` +
        `3. Tome seus remédios de pressão sempre nos horários receitados pelo médico.\n` +
        `4. Se a pressão passar de 18 por 11 com dor de cabeça forte ou visão turva, procure a UPA ou chame o SAMU 192.`,
      speechText:
        `A pressão arterial ideal para a maioria das pessoas é em torno de 12 por 8. Meça sempre em repouso de 5 minutos e tome seus remédios no horário correto.`,
    };
  }

  // 3. GLICEMIA / DIABETES
  if (
    q.includes('glicemia') ||
    q.includes('diabetes') ||
    q.includes('acucar no sangue') ||
    q.includes('glicosimetro') ||
    q.includes('insulina')
  ) {
    return {
      isEmergency: false,
      placesCategory: 'ubs',
      reply:
        `🩸 Parâmetros de Glicemia (Diretrizes SUS / Caderneta do Idoso):\n\n` +
        `• Em Jejum:\n` +
        `  - Normal: Menor que 100 mg/dL\n` +
        `  - Atenção / Pré-diabetes: 100 a 125 mg/dL\n` +
        `  - Sugestivo de Diabetes: 126 mg/dL ou mais (em 2 exames)\n\n` +
        `• Após as Refeições (2 horas depois):\n` +
        `  - Esperado: Menor que 140 mg/dL (para idosos, até 160-180 mg/dL pode ser aceito conforme plano médico).\n\n` +
        `⚠️ Atenção à Hipoglicemia (Glicemia abaixo de 70 mg/dL):\n` +
        `Se sentir tremores, suor frio, fraqueza ou tontura: tome imediatamente 1 copo de água com 1 colher de sopa de açúcar ou meio copo de suco de frutas. Meça novamente após 15 minutos.`,
      speechText:
        `A glicemia em jejum geralmente deve ficar abaixo de 100 miligramas por decilitro. Se sentir fraqueza ou suor frio, tome água com açúcar e meça a glicemia.`,
    };
  }

  // 4. REMÉDIOS E LEMBRETES DO USUÁRIO
  if (
    q.includes('remedio') ||
    q.includes('medicamento') ||
    q.includes('remedios') ||
    q.includes('horario') ||
    q.includes('dose') ||
    q.includes('lembrete')
  ) {
    let medsList = '';
    if (context?.medications && context.medications.length > 0) {
      medsList = `\n\nSeus remédios cadastrados no VIVA+:\n• ` + context.medications.join('\n• ');
    } else {
      medsList = '\n\nVocê ainda não cadastrou remédios no VIVA+. Você pode usar a câmera na aba "Ler e Ouvir" para cadastrar com segurança!';
    }

    return {
      isEmergency: false,
      placesCategory: 'pharmacy',
      reply:
        `💊 Dicas de Segurança com Medicamentos:` +
        medsList +
        `\n\nOrientações Seguras:\n` +
        `• Tome os remédios sempre com um copo cheio de água (evite tomar com leite, café ou refrigerante a menos que orientado).\n` +
        `• Nunca altere a dosagem nem pare de tomar sem conversar com seu médico ou farmacêutico.\n` +
        `• Mantenha os remédios em local arejado, longe do calor e fora do alcance de crianças.`,
      speechText:
        `Tome seus remédios sempre nos horários corretos com água. Nunca mude a dose sem falar com seu médico.`,
    };
  }

  // 5. POSTO DE SAÚDE / UPA / FARMÁCIA / HOSPITAL
  if (
    q.includes('posto de saude') ||
    q.includes('ubs') ||
    q.includes('esf') ||
    q.includes('upa') ||
    q.includes('pronto atendimento') ||
    q.includes('hospital') ||
    q.includes('farmacia') ||
    q.includes('farmacia popular')
  ) {
    let cat: 'ubs' | 'upa' | 'hospital' | 'pharmacy' = 'ubs';
    let label = 'postos de saúde';
    if (q.includes('farmacia')) {
      cat = 'pharmacy';
      label = 'farmácias e drograrias com Farmácia Popular';
    } else if (q.includes('upa') || q.includes('pronto atendimento')) {
      cat = 'upa';
      label = 'Unidades de Pronto Atendimento (UPA 24h)';
    } else if (q.includes('hospital')) {
      cat = 'hospital';
      label = 'hospitais gerais';
    }

    return {
      isEmergency: false,
      placesCategory: cat,
      reply:
        `📍 Localização de Saúde Próxima:\n\n` +
        `Identifiquei que você procura por ${label}. Abaixo estão as unidades mais próximas da sua localização atual com endereço, telefone e distância estimada.\n\n` +
        `Dica: Toque no botão "Ver rota no mapa" ou "Ligar para o local" para ser atendido(a).`,
      speechText: `Localizei as unidades de saúde e farmácias mais próximas de você. Veja os detalhes na tela.`,
    };
  }

  // 6. GOLPES / WHATSAPP / BANCO / SEGURANÇA
  if (
    q.includes('golpe') ||
    q.includes('whatsapp') ||
    q.includes('mensagem suspeita') ||
    q.includes('banco') ||
    q.includes('pix') ||
    q.includes('ligacao') ||
    q.includes('dinheiro') ||
    q.includes('premio')
  ) {
    return {
      isEmergency: false,
      placesCategory: 'none',
      reply:
        `🛡️ Proteção Anti-Golpe VIVA+:\n\n` +
        `Regras de Ouro de Segurança:\n` +
        `1. Banco NUNCA pede sua senha ou pede para você fazer PIX para "proteger" sua conta.\n` +
        `2. Se alguém no WhatsApp disser que é seu filho(a) ou parente e mudou de número pedindo dinheiro: NÃO transfira! Ligue para o número antigo do seu familiar.\n` +
        `3. Não clique em links enviados por SMS ou WhatsApp prometendo brindes, aposentadoria ou liberação de valores.\n\n` +
        `Você pode usar a aba "Anti-Golpe" no VIVA+ para analisar qualquer mensagem ou print com segurança!`,
      speechText:
        `Cuidado com pedidos de dinheiro ou mensagens de números desconhecidos. Bancos nunca pedem senhas nem transferências para segurança.`,
    };
  }

  // 7. CONTATO DE CONFIANÇA / REDE DE CUIDADO
  if (q.includes('familiar') || q.includes('filho') || q.includes('cuidador') || q.includes('contato')) {
    return {
      isEmergency: false,
      placesCategory: 'none',
      reply:
        `👥 Rede de Apoio e Pessoa de Confiança:\n\n` +
        (context?.hasTrustedContact
          ? 'Você já tem uma pessoa de confiança cadastrada no VIVA+! Em caso de necessidade, você pode usar a aba SOS para avisá-la com um toque.'
          : 'Recomendamos cadastrar o celular de um filho, filha ou amigo de confiança na aba SOS. Assim, se você precisar de ajuda, o VIVA+ pode enviar uma mensagem rápida com sua localização.') +
        `\n\nAlém disso, você pode convidar cuidadores ou familiares na aba "Rede de Cuidado" para acompanharem seus remédios e pressão.`,
      speechText:
        `Ter um contato de confiança cadastrado é essencial para sua segurança. Acesse a aba SOS para conferir.`,
    };
  }

  // 8. MEDICAMENTOS ESPECÍFICOS COMUNS (SUS / FARMÁCIA POPULAR)
  if (q.includes('losartana')) {
    return {
      isEmergency: false,
      placesCategory: 'pharmacy',
      reply:
        `💊 Losartana Potássica:\n\n` +
        `• Para que serve: Medicamento anti-hipertensivo utilizado para controlar a pressão arterial e proteger o coração e rins.\n` +
        `• Farmácia Popular: Disponível gratuitamente pelo programa Farmácia Popular em drogarias credenciadas.\n` +
        `• Cuidados: Tome sempre no mesmo horário com água. Não interrompa o tratamento mesmo se a pressão estiver boa.`,
      speechText: `A Losartana é um remédio para controle da pressão arterial disponível no programa Farmácia Popular. Tome sempre no mesmo horário com água.`,
    };
  }

  if (q.includes('metformina')) {
    return {
      isEmergency: false,
      placesCategory: 'pharmacy',
      reply:
        `💊 Cloridrato de Metformina:\n\n` +
        `• Para que serve: Medicamento para controle do diabetes mellitus tipo 2, ajudando o organismo a usar a glicose de forma adequada.\n` +
        `• Farmácia Popular: Gratuito nas drogarias credenciadas com receita do SUS ou particular.\n` +
        `• Como tomar: Tome junto ou logo após as refeições (almoço/jantar) para evitar desconforto no estômago.`,
      speechText: `A Metformina ajuda no controle do diabetes. É recomendável tomar junto ou logo após as refeições para não pesar no estômago.`,
    };
  }

  if (q.includes('omeprazol') || q.includes('pantoprazol')) {
    return {
      isEmergency: false,
      placesCategory: 'pharmacy',
      reply:
        `💊 Omeprazol / Pantoprazol:\n\n` +
        `• Para que serve: Reduz a acidez gástrica, protegendo o estômago contra azia, gastrite e queimação.\n` +
        `• Dica de ouro: Tome pela manhã, cerca de 30 minutos antes do café da manhã, em jejum.\n` +
        `• Disponibilidade: Disponível na rede pública de postos de saúde (UBS).`,
      speechText: `O Omeprazol protege o estômago contra azia e gastrite. Tome de manhã em jejum, 30 minutos antes do café.`,
    };
  }

  if (q.includes('dipirona') || q.includes('paracetamol')) {
    return {
      isEmergency: false,
      placesCategory: 'pharmacy',
      reply:
        `💊 Dipirona / Paracetamol:\n\n` +
        `• Para que serve: Analgésicos e antitérmicos usados para dor leve a moderada e febre.\n` +
        `• Atenção: Respeite o intervalo mínimo de 6 horas entre as doses. Não use doses dobradas.\n` +
        `• Se a dor persistir por mais de 2 dias ou vier acompanhada de outros sintomas fortes, procure avaliação médica na UBS.`,
      speechText: `Dipirona e Paracetamol são para alívio de dor e febre. Respeite o intervalo mínimo de 6 horas entre as doses.`,
    };
  }

  // 9. DÚVIDAS DE USO DO APLICATIVO (COMO CADASTRAR REMÉDIO, LER RECEITA, MEDIÇÃO)
  if (q.includes('como cadastrar') || q.includes('como adicionar') || q.includes('cadastrar remedio') || q.includes('adicionar remedio')) {
    return {
      isEmergency: false,
      placesCategory: 'none',
      reply:
        `📝 Como Cadastrar seus Remédios no VIVA+:\n\n` +
        `Você tem duas formas simples e práticas:\n\n` +
        `1. Pela Câmera (Aba "Ler e Ouvir"):\n` +
        `   • Aponte a câmera para a caixa do remédio ou receita.\n` +
        `   • O VIVA+ identifica o nome e dosagem para você criar o lembrete.\n\n` +
        `2. Manualmente (Aba "Minha Saúde"):\n` +
        `   • Vá em Minha Saúde e toque em "Cadastrar Remédio".\n` +
        `   • Digite o nome do remédio e toque em "Confirmar Nome".\n` +
        `   • Defina o horário e salve seu lembrete com segurança!`,
      speechText: `Para cadastrar um remédio, acesse Minha Saúde e toque em Cadastrar Remédio, ou use a câmera na aba Ler e Ouvir.`,
    };
  }

  // 10. CUMPRIMENTOS E SAUDAÇÕES
  if (
    q === 'oi' ||
    q === 'ola' ||
    q === 'ola!' ||
    q === 'bom dia' ||
    q === 'boa tarde' ||
    q === 'boa noite' ||
    q.includes('tudo bem')
  ) {
    return {
      isEmergency: false,
      placesCategory: 'none',
      reply:
        `Olá! É um prazer falar com você no VIVA+. 😊\n\n` +
        `Estou aqui para acompanhar sua rotina com todo o carinho e segurança. Você pode me perguntar sobre:\n\n` +
        `• O que significam seus números de pressão ou glicemia\n` +
        `• Cuidados e horários dos seus remédios\n` +
        `• Como achar a UBS, UPA ou Farmácia Popular mais perto\n` +
        `• Como conferir se uma mensagem ou pedido de dinheiro é golpe\n\n` +
        `Como posso te ajudar hoje? Pode falar pelo microfone ou digitar!`,
      speechText: `Olá! Sou o Assistente VIVA+. Como posso ajudar você hoje? Fale comigo pelo microfone ou digite sua dúvida.`,
    };
  }

  // 11. RESPOSTA GERAL DE SAÚDE E APOIO
  return {
    isEmergency: false,
    placesCategory: 'none',
    reply:
      `Entendi sua mensagem. Como assistente de saúde e proteção do VIVA+, estou pronto para te orientar em linguagem simples e acolhedora.\n\n` +
      `Você pode tocar em um dos atalhos rápidos abaixo ou me perguntar sobre:\n` +
      `• Medições de pressão arterial e glicemia\n` +
      `• Explicação de remédios e receitas médicas\n` +
      `• Localização de postos de saúde e farmácias\n` +
      `• Dúvidas sobre o funcionamento do aplicativo`,
    speechText:
      `Entendi sua pergunta. Posso te orientar sobre remédios, suas medições de saúde, postos de atendimento e dicas de proteção.`,
  };
}
