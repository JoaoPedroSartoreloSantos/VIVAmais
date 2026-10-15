import { createWorker } from 'tesseract.js';

export interface OcrPrescriptionResult {
  isLegible: boolean;
  qualityIssue: 'nenhum' | 'escura' | 'tremida' | 'cortada' | 'ilegivel' | 'parcial';
  qualityAdvice: string;
  recognizedText: string;
  medicineName: string;
  dosageAndForm: string;
  instructions: string;
  highlightedFields: {
    label: string;
    value: string;
    needVerification: boolean;
    reason: string;
  }[];
  explanation: {
    whatWasRead: string;
    plainLanguageExplanation: string;
    needsConfirmation: string;
  };
  speechTexts: {
    all: string;
    whatWasRead: string;
    plainLanguage: string;
    needsConfirmation: string;
  };
  suggestedReminder: {
    hasReminder: boolean;
    medicineName: string;
    dosage: string;
    time: string;
    notes: string;
  };
  safetyWarning: string;
}

const COMMON_MEDICINES = [
  'Dipirona', 'Paracetamol', 'Losartana', 'Omeprazol', 'Enalapril',
  'Sinvastatina', 'Metformina', 'Atenolol', 'Hidroclorotiazida', 'Clonazepam',
  'Amoxicilina', 'AAS', 'Ácido Acetilsalicílico', 'Ibuprofeno', 'Rivotril',
  'Glifage', 'Neosaldina', 'Dorflex', 'Buscopan', 'Tylenol', 'Novalgina',
  'Captopril', 'Propranolol', 'Sertralina', 'Fluoxetina', 'Escitalopram',
  'Diazepam', 'Alprazolam', 'Levotiroxina', 'Puran T4', 'Anlodipino',
  'Glibenclamida', 'Pantoprazol', 'Rosuvastatina', 'Atorvastatina',
  'Prednisona', 'Cetoprofeno', 'Nimesulida', 'Diclofenaco', 'Azitromicina',
  'Ciprofloxacino', 'Cephalexina', 'Loratadina', 'Desloratadina', 'Dexclorfeniramina',
  'Aerolin', 'Salbutamol', 'Budesonida', 'Beclometasona', 'Insulina',
  'Varfarina', 'Xarelto', 'Eliquis', 'Espironolactona', 'Furosemida'
];

let sharedWorker: any = null;
let workerInitializing: Promise<any> | null = null;

async function getOcrWorker() {
  if (sharedWorker) return sharedWorker;
  if (!workerInitializing) {
    workerInitializing = (async () => {
      try {
        const worker = await createWorker('por');
        sharedWorker = worker;
        return worker;
      } catch (err) {
        console.warn('Falha ao inicializar worker compartilhado do Tesseract:', err);
        return null;
      } finally {
        workerInitializing = null;
      }
    })();
  }
  return workerInitializing;
}

export async function processPrescriptionWithLocalOcr(
  imageBase64: string,
  _mimeType = 'image/jpeg'
): Promise<OcrPrescriptionResult> {
  const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1].trim() : imageBase64.trim();
  const buffer = Buffer.from(cleanBase64, 'base64');

  let extractedText = '';
  try {
    const ocrPromise = (async () => {
      const worker = await getOcrWorker();
      if (worker) {
        const res = await worker.recognize(buffer);
        return (res.data?.text || '').trim();
      }
      return '';
    })();

    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => resolve(''), 6000);
    });

    extractedText = await Promise.race([ocrPromise, timeoutPromise]);
  } catch (ocrErr) {
    console.warn('Aviso no OCR do Tesseract:', ocrErr);
  }

  return parseMedicineText(extractedText);
}

export function parseMedicineText(rawText: string): OcrPrescriptionResult {
  const text = (rawText || '').trim();
  const hasText = text.length > 5;

  let identifiedMedicine = '';
  let identifiedDosage = '';
  let identifiedInstructions = '';

  if (hasText) {
    // 1. Check common medicines
    const lower = text.toLowerCase();
    for (const med of COMMON_MEDICINES) {
      const medLower = med.toLowerCase();
      if (lower.includes(medLower)) {
        identifiedMedicine = med;
        break;
      }
    }

    // 2. Dosage pattern
    const dosageMatch = text.match(/\b(\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|ml|gotas|comprimidos?|cápsulas?|capsulas?))\b/i);
    if (dosageMatch) {
      identifiedDosage = dosageMatch[1].trim();
    }

    // 3. Instructions pattern
    const instructionMatches = [
      /(?:tomar|ingerir|aplicar|pingar)\s+[^.\n]+/i,
      /(?:de\s+\d+\s+em\s+\d+\s+horas|\d+\s*x\s*ao\s*dia|uma\s+vez\s+ao\s*dia|a\s+cada\s+\d+\s+horas)[^.\n]*/i,
      /(?:ao\s+acordar|após\s+o\s+almoço|à\s+noite|antes\s+de\s+dormir|em\s+jejum)[^.\n]*/i,
      /(?:1|2|3)\s*(?:comprimido|comprimidos|gotas|colher)\s+[^.\n]*/i,
    ];

    for (const regex of instructionMatches) {
      const match = text.match(regex);
      if (match) {
        identifiedInstructions = match[0].trim();
        break;
      }
    }

    // If medicine still empty, look for capitalized word on first non-empty lines
    if (!identifiedMedicine) {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const words = line.split(/\s+/);
        const candidate = words.find(w => /^[A-Z][a-z]{3,}$/.test(w));
        if (candidate) {
          identifiedMedicine = candidate;
          break;
        }
      }
    }
  }

  const isLegible = hasText && Boolean(identifiedMedicine || identifiedDosage || text.length >= 15);

  const medicineName = identifiedMedicine || (isLegible ? 'Medicamento da Embalagem' : 'Não identificado');
  const dosageAndForm = identifiedDosage || (isLegible ? 'Verificar na embalagem' : 'Não identificada');
  const instructions = identifiedInstructions || (isLegible ? 'Consulte as instruções na embalagem ou com seu médico.' : 'Instrução não legível.');

  const highlightedFields = [
    {
      label: 'Nome do Medicamento',
      value: medicineName,
      needVerification: !identifiedMedicine,
      reason: identifiedMedicine ? 'Identificado no texto da foto.' : 'Confirme se o nome confere com sua receita.',
    },
    {
      label: 'Dosagem / Concentração',
      value: dosageAndForm,
      needVerification: !identifiedDosage,
      reason: identifiedDosage ? 'Concentração lida na imagem.' : 'Confirme a miligramagem correta na embalagem.',
    },
    {
      label: 'Instruções de Uso',
      value: instructions,
      needVerification: !identifiedInstructions,
      reason: identifiedInstructions ? 'Instrução identificada na imagem.' : 'Confirme os horários de tomar com seu médico.',
    },
  ];

  const whatWasRead = isLegible
    ? `Identificado: ${medicineName} ${dosageAndForm !== 'Verificar na embalagem' ? dosageAndForm : ''}. ${instructions !== 'Instrução não legível.' ? instructions : ''}`.trim()
    : 'A foto não apresentou texto claro o suficiente para identificação automática do medicamento.';

  const plainLanguageExplanation = isLegible
    ? `Foi realizada a leitura da foto do medicamento. Certifique-se de que a dosagem (${dosageAndForm}) e as orientações correspondem ao que o seu médico indicou.`
    : 'Para uma leitura precisa, aponte a câmera diretamente para o nome do remédio impresso na caixa ou cartela, em um local bem iluminado.';

  const needsConfirmation = 'Sempre confirme com o médico ou na farmácia antes de iniciar ou alterar o uso de qualquer medicamento.';

  const speechAll = isLegible
    ? `Remédio lido na imagem: ${medicineName}. Dosagem: ${dosageAndForm}. Instruções: ${instructions}. Confirme sempre com seu médico.`
    : 'Não foi possível ler com nitidez as letras da foto. Você pode tirar uma nova foto com mais iluminação ou digitar o nome do remédio no campo de texto.';

  const suggestedReminder = {
    hasReminder: isLegible && Boolean(identifiedMedicine),
    medicineName: identifiedMedicine || 'Medicamento',
    dosage: identifiedDosage || '1 comprimido',
    time: '08:00',
    notes: instructions || 'Tomar com água conforme orientação médica.',
  };

  return {
    isLegible,
    qualityIssue: isLegible ? 'nenhum' : (text.length > 0 ? 'parcial' : 'escura'),
    qualityAdvice: isLegible
      ? 'Texto identificado com sucesso. Você pode editar ou adicionar lembrete.'
      : 'Aproxime mais o celular da caixa do remédio, mantenha o aparelho firme e garanta boa luz ambiente.',
    recognizedText: text || 'Nenhum texto identificado nesta imagem.',
    medicineName,
    dosageAndForm,
    instructions,
    highlightedFields,
    explanation: {
      whatWasRead,
      plainLanguageExplanation,
      needsConfirmation,
    },
    speechTexts: {
      all: speechAll,
      whatWasRead,
      plainLanguage: plainLanguageExplanation,
      needsConfirmation,
    },
    suggestedReminder,
    safetyWarning: 'O VIVA+ é um leitor assistivo e não substitui a orientação do seu médico ou farmacêutico.',
  };
}
