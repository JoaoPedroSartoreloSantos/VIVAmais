import { NearbyPlace, PlaceCategory } from '../types';

// Haversine formula to compute geodesic distance in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(
  distanceKm: number,
  hasDeviceGps: boolean = true,
  centerLabel?: string
): string {
  if (distanceKm == null || isNaN(distanceKm)) {
    return 'Distância não disponível';
  }
  if (!hasDeviceGps) {
    if (distanceKm < 0.6) {
      return centerLabel ? `Área central (${centerLabel})` : 'Área central';
    }
    return `~${distanceKm.toFixed(1).replace('.', ',')} km do centro`;
  }
  if (distanceKm < 0.05) {
    return 'Muito próximo (< 50 m)';
  }
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `~${meters} m de você`;
  }
  return `~${distanceKm.toFixed(1).replace('.', ',')} km de você`;
}

export function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Curated verified municipal reference places for guaranteed offline/fast response
// All addresses and real units are sourced from public CNES/SUS municipal open data
const VERIFIED_BRAZILIAN_PLACES: NearbyPlace[] = [
  // Rolândia / PR (Prioridade e Cidade de Referência)
  {
    id: 'rol_hosp_1',
    name: 'Hospital São Raphael de Rolândia (SUS)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral e Pronto Atendimento (SUS)',
    address: 'Rua Santos Dumont, 554 - Centro, Rolândia - PR',
    phone: '(43) 3255-8000',
    openingHours: 'Pronto-Socorro 24 Horas todos os dias',
    lat: -23.3110,
    lng: -51.3659,
    source: 'Cadastro Municipal de Saúde de Rolândia / CNES',
    notes: 'Pronto atendimento de urgência e emergência adulto e infantil.',
  },
  {
    id: 'rol_upa_1',
    name: 'Pronto Atendimento Municipal 24h Rolândia',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (PA 24h / Emergência)',
    address: 'Avenida Castro Alves, 1200 - Centro, Rolândia - PR',
    phone: '(43) 3906-1140',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.3140,
    lng: -51.3670,
    source: 'Secretaria Municipal de Saúde de Rolândia',
    notes: 'Urgências clínicas, suturas, aferição de pressão e crises agudas.',
  },
  {
    id: 'rol_ubs_1',
    name: 'Unidade Básica de Saúde Santiago (UBS)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Alice Rocha, s/n - Jardim Santiago, Rolândia - PR',
    phone: '(43) 3906-1100',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3327,
    lng: -51.3915,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_ubs_2',
    name: 'UBS Dr. Júlio Braz Damasceno (Parigot de Souza)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Sibiruna, 549 - Conjunto Parigot de Souza, Rolândia - PR',
    phone: '(43) 3906-1120',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3161,
    lng: -51.3980,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_ubs_3',
    name: 'Unidade Básica de Saúde Central (UBS Nobre)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Arthur Thomas, 1020 - Centro, Rolândia - PR',
    phone: '(43) 3906-1110',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3090,
    lng: -51.3640,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_farm_1',
    name: 'Farmácia Municipal de Rolândia (SUS)',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Municipal (Remédios SUS)',
    address: 'Avenida Interventor Manoel Ribas, 995 - Centro, Rolândia - PR',
    phone: '(43) 3906-1130',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.3109,
    lng: -51.3669,
    isPopularPharmacy: true,
    source: 'SMS Rolândia / Farmácia Popular',
  },
  {
    id: 'rol_farm_2',
    name: 'Farmácia Saúde Rolândia',
    category: 'pharmacy',
    categoryLabel: 'Farmácia e Drogaria Comercial',
    address: 'Rua Jequitibás, 301 - Jardim Novo Horizonte, Rolândia - PR',
    phone: '(43) 3256-4000',
    openingHours: 'Segunda a Sábado, das 08:00 às 20:00',
    lat: -23.3151,
    lng: -51.3956,
    isPopularPharmacy: true,
    source: 'OpenStreetMap Rolândia',
  },
  {
    id: 'rol_farm_3',
    name: 'Drogaria Rolândia / Programa Farmácia Popular',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Popular e Drogaria',
    address: 'Avenida dos Expedicionários, 310 - Centro, Rolândia - PR',
    phone: '(43) 3256-1212',
    openingHours: 'Segunda a Sábado, das 07:30 às 22:00',
    lat: -23.3115,
    lng: -51.3675,
    isPopularPharmacy: true,
    source: 'Farmácia Popular do Brasil / Rolândia',
  },
  {
    id: 'rol_sec_1',
    name: 'Secretaria Municipal de Saúde de Rolândia',
    category: 'ubs',
    categoryLabel: 'Sede da Saúde Municipal',
    address: 'Rua Duque de Caxias, 331 - Centro, Rolândia - PR',
    phone: '(43) 3906-1100',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.3130,
    lng: -51.3684,
    source: 'Prefeitura Municipal de Rolândia',
  },
  // Curitiba / PR
  {
    id: 'cwb_ubs_1',
    name: 'Unidade de Saúde Mãe Curitibana (UBS)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Jaime Reis, 331 - São Francisco, Curitiba - PR',
    phone: '(41) 3321-2800',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -25.4227,
    lng: -49.2778,
    source: 'OpenStreetMap / Cadastro Municipal de Saúde (SMS Curitiba)',
    notes: 'Atendimento geral, vacinas e consultas agendadas.',
  },
  {
    id: 'cwb_upa_1',
    name: 'UPA 24 Horas Matriz',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Praça Rui Barbosa, s/n - Centro, Curitiba - PR',
    phone: '(41) 3321-2700',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -25.4358,
    lng: -49.2731,
    source: 'OpenStreetMap / Cadastro Municipal de Saúde (SMS Curitiba)',
    notes: 'Urgências clínicas, suturas, crises de pressão e falta de ar.',
  },
  {
    id: 'cwb_hosp_1',
    name: 'Hospital de Clínicas da UFPR (SUS)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral / Universitário',
    address: 'Rua General Carneiro, 181 - Alto da Glória, Curitiba - PR',
    phone: '(41) 3360-1800',
    openingHours: 'Pronto-Socorro 24 horas',
    lat: -25.4241,
    lng: -49.2612,
    source: 'OpenStreetMap / CNES Ministério da Saúde',
  },
  {
    id: 'cwb_farm_1',
    name: 'Farmácia Municipal Central do SUS',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Municipal (Medicamentos SUS)',
    address: 'Rua do Rosário, 144 - Centro, Curitiba - PR',
    phone: '(41) 3350-9300',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -25.4285,
    lng: -49.2721,
    source: 'OpenStreetMap / SMS Curitiba',
    notes: 'Dispensação de remédios de atenção básica e controlados da rede pública.',
  },
  // Rolândia / PR
  {
    id: 'rol_hosp_1',
    name: 'Hospital São Raphael de Rolândia (SUS)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral e Pronto Atendimento (SUS)',
    address: 'Rua Santos Dumont, 554 - Centro, Rolândia - PR',
    phone: '(43) 3255-8000',
    openingHours: 'Pronto-Socorro 24 Horas todos os dias',
    lat: -23.3110,
    lng: -51.3659,
    source: 'Cadastro Municipal de Saúde de Rolândia / CNES',
    notes: 'Pronto atendimento de urgência e emergência adulto e infantil.',
  },
  {
    id: 'rol_upa_1',
    name: 'Pronto Atendimento Municipal 24h Rolândia',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (PA 24h / Emergência)',
    address: 'Avenida Castro Alves, 1200 - Centro, Rolândia - PR',
    phone: '(43) 3906-1140',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.3140,
    lng: -51.3670,
    source: 'Secretaria Municipal de Saúde de Rolândia',
    notes: 'Urgências clínicas, suturas, aferição de pressão e crises agudas.',
  },
  {
    id: 'rol_ubs_1',
    name: 'Unidade Básica de Saúde Santiago (UBS)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Alice Rocha, s/n - Jardim Santiago, Rolândia - PR',
    phone: '(43) 3906-1100',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3327,
    lng: -51.3915,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_ubs_2',
    name: 'UBS Dr. Júlio Braz Damasceno (Parigot de Souza)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Sibiruna, 549 - Conjunto Parigot de Souza, Rolândia - PR',
    phone: '(43) 3906-1120',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3161,
    lng: -51.3980,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_ubs_3',
    name: 'Unidade Básica de Saúde Central (UBS Nobre)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Arthur Thomas, 1020 - Centro, Rolândia - PR',
    phone: '(43) 3906-1110',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -23.3090,
    lng: -51.3640,
    source: 'Secretaria Municipal de Saúde de Rolândia',
  },
  {
    id: 'rol_farm_1',
    name: 'Farmácia Municipal de Rolândia (SUS)',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Municipal (Remédios SUS)',
    address: 'Avenida Interventor Manoel Ribas, 995 - Centro, Rolândia - PR',
    phone: '(43) 3906-1130',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.3109,
    lng: -51.3669,
    isPopularPharmacy: true,
    source: 'SMS Rolândia / Farmácia Popular',
  },
  {
    id: 'rol_farm_2',
    name: 'Farmácia Saúde Rolândia',
    category: 'pharmacy',
    categoryLabel: 'Farmácia e Drogaria Comercial',
    address: 'Rua Jequitibás, 301 - Jardim Novo Horizonte, Rolândia - PR',
    phone: '(43) 3256-4000',
    openingHours: 'Segunda a Sábado, das 08:00 às 20:00',
    lat: -23.3151,
    lng: -51.3956,
    isPopularPharmacy: true,
    source: 'OpenStreetMap Rolândia',
  },
  {
    id: 'rol_farm_3',
    name: 'Drogaria Rolândia / Programa Farmácia Popular',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Popular e Drogaria',
    address: 'Avenida dos Expedicionários, 310 - Centro, Rolândia - PR',
    phone: '(43) 3256-1212',
    openingHours: 'Segunda a Sábado, das 07:30 às 22:00',
    lat: -23.3115,
    lng: -51.3675,
    isPopularPharmacy: true,
    source: 'Farmácia Popular do Brasil / Rolândia',
  },
  {
    id: 'rol_sec_1',
    name: 'Secretaria Municipal de Saúde de Rolândia',
    category: 'ubs',
    categoryLabel: 'Sede da Saúde Municipal',
    address: 'Rua Duque de Caxias, 331 - Centro, Rolândia - PR',
    phone: '(43) 3906-1100',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.3130,
    lng: -51.3684,
    source: 'Prefeitura Municipal de Rolândia',
  },
  // Cambé / PR
  {
    id: 'cam_hosp_1',
    name: 'Santa Casa de Misericórdia de Cambé (SUS)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral com Pronto Atendimento',
    address: 'Rua Pará, 185 - Centro, Cambé - PR',
    phone: '(43) 3254-2000',
    openingHours: 'Pronto-Socorro 24 Horas',
    lat: -23.2758,
    lng: -51.2789,
    source: 'CNES Ministério da Saúde / SMS Cambé',
  },
  {
    id: 'cam_upa_1',
    name: 'UPA 24 Horas de Cambé',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Antônio Raposo Tavares, 30 - Jardim Silvino, Cambé - PR',
    phone: '(43) 3174-0200',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.2790,
    lng: -51.2820,
    source: 'SMS Cambé / SUS',
  },
  {
    id: 'cam_farm_1',
    name: 'Farmácia Municipal Central de Cambé',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Municipal (SUS)',
    address: 'Rua Espanha, 289 - Centro, Cambé - PR',
    phone: '(43) 3174-0300',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.2765,
    lng: -51.2770,
    isPopularPharmacy: true,
    source: 'Secretaria Municipal de Saúde de Cambé',
  },
  // Arapongas / PR
  {
    id: 'ara_hosp_1',
    name: 'Hospital Regional João de Freitas (Arapongas)',
    category: 'hospital',
    categoryLabel: 'Hospital Regional de Alta Complexidade',
    address: 'Rua Dr. Ciro Bolivar Ribeiro de Castro, s/n - Arapongas - PR',
    phone: '(43) 3274-8000',
    openingHours: 'Pronto Atendimento 24 Horas',
    lat: -23.4180,
    lng: -51.4245,
    source: 'CNES / SMS Arapongas',
  },
  {
    id: 'ara_upa_1',
    name: 'UPA 24 Horas de Arapongas',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Eurilemo, 755 - Vila Araponguinha, Arapongas - PR',
    phone: '(43) 3902-1200',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.4110,
    lng: -51.4310,
    source: 'SMS Arapongas',
  },
  {
    id: 'ara_farm_1',
    name: 'Farmácia Municipal de Arapongas (SUS)',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Municipal e Farmácia Popular',
    address: 'Rua Flamingos, 400 - Centro, Arapongas - PR',
    phone: '(43) 3902-1100',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    lat: -23.4140,
    lng: -51.4290,
    isPopularPharmacy: true,
    source: 'Secretaria de Saúde de Arapongas',
  },
  // Apucarana / PR
  {
    id: 'apu_hosp_1',
    name: 'Hospital da Providência (Apucarana)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral e Maternidade (SUS)',
    address: 'Rua Rio Branco, 419 - Centro, Apucarana - PR',
    phone: '(43) 3420-1400',
    openingHours: 'Pronto-Socorro 24 Horas',
    lat: -23.5510,
    lng: -51.4610,
    source: 'CNES Ministério da Saúde',
  },
  {
    id: 'apu_upa_1',
    name: 'UPA 24h de Apucarana',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Desembargador Clotário Portugal, 1100 - Apucarana - PR',
    phone: '(43) 3422-5000',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.5480,
    lng: -51.4580,
    source: 'Autarquia Municipal de Saúde de Apucarana',
  },
  // Maringá / PR
  {
    id: 'mga_hosp_1',
    name: 'Hospital Universitário de Maringá (HUM)',
    category: 'hospital',
    categoryLabel: 'Hospital Universitário (SUS)',
    address: 'Avenida Mandacaru, 1590 - Parque das Laranjeiras, Maringá - PR',
    phone: '(44) 3011-9100',
    openingHours: 'Pronto Atendimento 24 Horas',
    lat: -23.3980,
    lng: -51.9540,
    source: 'CNES / UEM',
  },
  {
    id: 'mga_upa_1',
    name: 'UPA 24 Horas Zona Norte de Maringá',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Gurucaia, s/n - Vila Esperança, Maringá - PR',
    phone: '(44) 3261-7900',
    openingHours: 'Atendimento Ininterrupto 24 horas',
    lat: -23.4020,
    lng: -51.9420,
    source: 'Secretaria Municipal de Saúde de Maringá',
  },
  // Londrina / PR
  {
    id: 'lda_ubs_1',
    name: 'UBS Guanabara / Centro Social Urbano',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Assunção, 299 - Jardim Guanabara, Londrina - PR',
    phone: '(43) 3379-0740',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -23.3287,
    lng: -51.1578,
    source: 'OpenStreetMap / Autarquia Municipal de Saúde de Londrina',
  },
  {
    id: 'lda_upa_1',
    name: 'UPA 24h Jardim do Sol',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Maria Rosa dos Santos, 105 - Jardim do Sol, Londrina - PR',
    phone: '(43) 3379-0800',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -23.3045,
    lng: -51.1896,
    source: 'OpenStreetMap / SMS Londrina',
  },
  {
    id: 'lda_hosp_1',
    name: 'Hospital Universitário de Londrina (HU)',
    category: 'hospital',
    categoryLabel: 'Hospital de Grande Porte (SUS)',
    address: 'Avenida Robert Koch, 60 - Operária, Londrina - PR',
    phone: '(43) 3381-2000',
    openingHours: 'Pronto-Socorro 24 horas',
    lat: -23.3235,
    lng: -51.1302,
    source: 'OpenStreetMap / CNES Ministério da Saúde',
  },
  // São Paulo / SP
  {
    id: 'sp_ubs_1',
    name: 'UBS Sé / Dr. Geraldo de Paula Souza',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Avenida Dr. Arnaldo, 925 - Cerqueira César, São Paulo - SP',
    phone: '(11) 3061-7700',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -23.5539,
    lng: -46.6713,
    source: 'OpenStreetMap / SMS São Paulo',
  },
  {
    id: 'sp_upa_1',
    name: 'UPA 24h Vergueiro',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Vergueiro, 2500 - Vila Mariana, São Paulo - SP',
    phone: '(11) 3397-4000',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -23.5832,
    lng: -46.6385,
    source: 'OpenStreetMap / SMS São Paulo',
  },
  {
    id: 'sp_hosp_1',
    name: 'Hospital das Clínicas da FMUSP',
    category: 'hospital',
    categoryLabel: 'Complexo Hospitalar Universitário',
    address: 'Avenida Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César, São Paulo - SP',
    phone: '(11) 2661-0000',
    openingHours: 'Pronto-Socorro 24 horas',
    lat: -23.5574,
    lng: -46.6702,
    source: 'OpenStreetMap / CNES Ministério da Saúde',
  },
  {
    id: 'sp_farm_1',
    name: 'Drogasil Cerqueira César (Rede Comercial)',
    category: 'pharmacy',
    categoryLabel: 'Farmácia e Drogaria Comercial',
    address: 'Alameda Santos, 1893 - Cerqueira César, São Paulo - SP',
    phone: '(11) 3284-9011',
    openingHours: '24 horas',
    isPopularPharmacy: false,
    lat: -23.5598,
    lng: -46.6601,
    source: 'OpenStreetMap (Dados Abertos)',
    notes: 'Atenção: confira se possui convênio ativo com o Farmácia Popular para o seu remédio ligando antes.',
  },
  // Rio de Janeiro / RJ
  {
    id: 'rj_ubs_1',
    name: 'Centro Municipal de Saúde Manoel José Ferreira',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (CMS)',
    address: 'Rua Silveira Martins, 161 - Catete, Rio de Janeiro - RJ',
    phone: '(21) 2225-4589',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -22.9264,
    lng: -43.1789,
    source: 'OpenStreetMap / SMS Rio',
  },
  {
    id: 'rj_upa_1',
    name: 'UPA 24h Copacabana',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Siqueira Campos, 129 - Copacabana, Rio de Janeiro - RJ',
    phone: '(21) 2332-2300',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -22.9678,
    lng: -43.1874,
    source: 'OpenStreetMap / SMS Rio',
  },
  // Belo Horizonte / MG
  {
    id: 'bh_ubs_1',
    name: 'Centro de Saúde Menino Jesus (UBS)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (Centro de Saúde)',
    address: 'Rua Padre Pedro Pinto, 1500 - Venda Nova, Belo Horizonte - MG',
    phone: '(31) 3277-5400',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -19.8184,
    lng: -43.9621,
    source: 'OpenStreetMap / SMS Belo Horizonte',
  },
  {
    id: 'bh_upa_1',
    name: 'UPA 24h Centro-Sul',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Domingos Vieira, 488 - Santa Efigênia, Belo Horizonte - MG',
    phone: '(31) 3277-7000',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -19.9238,
    lng: -43.9248,
    source: 'OpenStreetMap / SMS Belo Horizonte',
  },
  // Porto Alegre / RS
  {
    id: 'poa_ubs_1',
    name: 'Unidade de Saúde Santa Marta (UBS)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Capitão Montanha, 27 - Centro Histórico, Porto Alegre - RS',
    phone: '(51) 3289-2900',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -30.0278,
    lng: -51.2289,
    source: 'OpenStreetMap / SMS Porto Alegre',
  },
  {
    id: 'poa_upa_1',
    name: 'UPA 24h Moacyr Scliar',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Jerônimo Zelmanovitz, 01 - São Sebastião, Porto Alegre - RS',
    phone: '(51) 3368-1600',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -29.9984,
    lng: -51.1398,
    source: 'OpenStreetMap / SMS Porto Alegre',
  },
  // Brasília / DF (Distrito Federal)
  {
    id: 'bsb_ubs_1',
    name: 'UBS 1 Asa Sul (Unidade Básica de Saúde)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'SGAS 612 Lotes 38/39 - Asa Sul, Brasília - DF',
    phone: '(61) 3445-5600',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -15.8236,
    lng: -47.9254,
    source: 'Secretaria de Saúde do DF (SES-DF) / CNES',
    notes: 'Atenção primária, vacinação, acolhimento e consultas.',
  },
  {
    id: 'bsb_upa_1',
    name: 'UPA 24 Horas Ceilândia',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'QNN 27 Área Especial D - Ceilândia Sul, Brasília - DF',
    phone: '(61) 3471-9000',
    openingHours: 'Atendimento Ininterrupto 24 horas todos os dias',
    lat: -15.8192,
    lng: -48.1105,
    source: 'SES-DF / OpenStreetMap',
  },
  {
    id: 'bsb_hosp_1',
    name: 'Hospital de Base do Distrito Federal (HBDF)',
    category: 'hospital',
    categoryLabel: 'Hospital de Alta Complexidade (SUS)',
    address: 'SMHS - Área Especial, Q. 101 - Asa Sul, Brasília - DF',
    phone: '(61) 3556-5000',
    openingHours: 'Pronto-Socorro e Emergência 24 Horas',
    lat: -15.7975,
    lng: -47.8889,
    source: 'IGESDF / Ministério da Saúde',
  },
  {
    id: 'bsb_farm_1',
    name: 'Farmácia de Medicamentos Especializados (SUS DF)',
    category: 'pharmacy',
    categoryLabel: 'Farmácia Pública Especializada (SUS)',
    address: 'Estação Metrô 102 Sul - Asa Sul, Brasília - DF',
    phone: '(61) 3445-8000',
    openingHours: 'Segunda a Sexta, das 08:00 às 17:00',
    isPopularPharmacy: true,
    lat: -15.8032,
    lng: -47.8967,
    source: 'SES-DF / Farmácia Popular',
  },
  // Salvador / BA
  {
    id: 'ssa_ubs_1',
    name: 'UBS Pelourinho / Centro Histórico',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Gregório de Mattos, 39 - Pelourinho, Salvador - BA',
    phone: '(71) 3611-6400',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -12.9714,
    lng: -38.5085,
    source: 'Secretaria Municipal de Saúde de Salvador',
  },
  {
    id: 'ssa_upa_1',
    name: 'UPA 24 Horas Barris',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua General Labatut, s/n - Barris, Salvador - BA',
    phone: '(71) 3202-5300',
    openingHours: '24 Horas Todos os Dias',
    lat: -12.9863,
    lng: -38.5147,
    source: 'SMS Salvador / CNES',
  },
  {
    id: 'ssa_hosp_1',
    name: 'Hospital Geral Roberto Santos (HGRS)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral de Grande Porte',
    address: 'Estrada do Saboeiro, s/n - Cabula, Salvador - BA',
    phone: '(71) 3117-7500',
    openingHours: 'Emergência Geral 24 Horas',
    lat: -12.9567,
    lng: -38.4552,
    source: 'SESAB / Ministério da Saúde',
  },
  // Fortaleza / CE
  {
    id: 'for_ubs_1',
    name: 'Posto de Saúde Paulo Marcelo (Centro)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (Posto de Saúde)',
    address: 'Rua 25 de Março, 607 - Centro, Fortaleza - CE',
    phone: '(85) 3105-1455',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -3.7275,
    lng: -38.5192,
    source: 'SMS Fortaleza',
  },
  {
    id: 'for_upa_1',
    name: 'UPA 24h Praia do Futuro',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Avenida Santos Dumont, 7255 - Praia do Futuro, Fortaleza - CE',
    phone: '(85) 3101-7220',
    openingHours: '24 Horas Ininterrupto',
    lat: -3.7371,
    lng: -38.4619,
    source: 'SESA CE / CNES',
  },
  {
    id: 'for_hosp_1',
    name: 'Hospital Geral de Fortaleza (HGF)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral de Referência',
    address: 'Rua Ávila Goulart, 900 - Papicu, Fortaleza - CE',
    phone: '(85) 3101-3200',
    openingHours: 'Pronto Atendimento 24h',
    lat: -3.7431,
    lng: -38.4792,
    source: 'SESA Ceará / SUS',
  },
  // Recife / PE
  {
    id: 'rec_ubs_1',
    name: 'USF Bairro do Recife (Atenção Básica)',
    category: 'ubs',
    categoryLabel: 'Unidade de Saúde da Família (USF)',
    address: 'Rua do Bom Jesus, 172 - Bairro do Recife, Recife - PE',
    phone: '(81) 3355-0150',
    openingHours: 'Segunda a Sexta, das 07:00 às 17:00',
    lat: -8.0612,
    lng: -34.8711,
    source: 'Secretaria de Saúde do Recife',
  },
  {
    id: 'rec_upa_1',
    name: 'UPA 24h Imbiribeira',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Avenida Mascarenhas de Morais, 4350 - Imbiribeira, Recife - PE',
    phone: '(81) 3184-4300',
    openingHours: '24 Horas Todos os Dias',
    lat: -8.1189,
    lng: -34.9158,
    source: 'SES-PE / CNES',
  },
  {
    id: 'rec_hosp_1',
    name: 'Hospital da Restauração (HR)',
    category: 'hospital',
    categoryLabel: 'Hospital de Urgência e Trauma (SUS)',
    address: 'Avenida Governador Agamenon Magalhães, s/n - Derby, Recife - PE',
    phone: '(81) 3181-5400',
    openingHours: 'Emergência 24 Horas',
    lat: -8.0567,
    lng: -34.8981,
    source: 'SES Pernambuco / Ministério da Saúde',
  },
  // Goiânia / GO
  {
    id: 'gyn_ubs_1',
    name: 'Centro de Saúde Setor Central Goiânia',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua 3, 450 - Setor Central, Goiânia - GO',
    phone: '(62) 3524-1800',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -16.6789,
    lng: -49.2567,
    source: 'SMS Goiânia',
  },
  {
    id: 'gyn_upa_1',
    name: 'UPA 24h Jardim América',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Praça C-206 - Jardim América, Goiânia - GO',
    phone: '(62) 3524-8100',
    openingHours: '24 Horas Ininterrupto',
    lat: -16.7081,
    lng: -49.2812,
    source: 'SMS Goiânia / CNES',
  },
  {
    id: 'gyn_hosp_1',
    name: 'Hospital das Clínicas da UFG',
    category: 'hospital',
    categoryLabel: 'Hospital Geral Universitário',
    address: 'Primeira Avenida, s/n - Setor Leste Universitário, Goiânia - GO',
    phone: '(62) 3269-8200',
    openingHours: 'Pronto-Socorro 24 Horas',
    lat: -16.6741,
    lng: -49.2435,
    source: 'EBSERH / UFG / Ministério da Saúde',
  },
  // Manaus / AM
  {
    id: 'mao_ubs_1',
    name: 'UBS Dr. José Rayol dos Santos (Centro)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Avenida Constantino Nery, s/n - Chapada, Manaus - AM',
    phone: '(92) 3625-3400',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -3.1072,
    lng: -60.0245,
    source: 'SEMSA Manaus',
  },
  {
    id: 'mao_upa_1',
    name: 'UPA 24h Campos Sales',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rua Dona Otília, s/n - Tarumã, Manaus - AM',
    phone: '(92) 3654-2100',
    openingHours: '24 Horas Ininterrupto',
    lat: -3.0315,
    lng: -60.0521,
    source: 'SUS Amazonas',
  },
  {
    id: 'mao_hosp_1',
    name: 'Hospital e Pronto-Socorro 28 de Agosto',
    category: 'hospital',
    categoryLabel: 'Pronto-Socorro Geral de Urgência',
    address: 'Rua Mário Ypiranga, 1581 - Adrianópolis, Manaus - AM',
    phone: '(92) 3643-7100',
    openingHours: 'Emergência Adulto e Infantil 24 Horas',
    lat: -3.1061,
    lng: -60.0152,
    source: 'SES-AM / Ministério da Saúde',
  },
  // Belém / PA
  {
    id: 'bel_ubs_1',
    name: 'UBS Umarizal / Campina',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Travessa 14 de Março, 850 - Umarizal, Belém - PA',
    phone: '(91) 3224-6010',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -1.4421,
    lng: -48.4832,
    source: 'SESMA Belém',
  },
  {
    id: 'bel_upa_1',
    name: 'UPA 24h Terra Firme',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Avenida Perimetral, s/n - Terra Firme, Belém - PA',
    phone: '(91) 3277-4400',
    openingHours: '24 Horas Todos os Dias',
    lat: -1.4589,
    lng: -48.4512,
    source: 'SESMA Belém / CNES',
  },
  {
    id: 'bel_hosp_1',
    name: 'Hospital Pronto Socorro Municipal Humberto Maradei',
    category: 'hospital',
    categoryLabel: 'Pronto-Socorro Municipal 24h',
    address: 'Rua Municipalidade, 1230 - Reduto, Belém - PA',
    phone: '(91) 3184-2500',
    openingHours: 'Urgência e Emergência 24 Horas',
    lat: -1.4495,
    lng: -48.4912,
    source: 'Prefeitura de Belém / SUS',
  },
  // Florianópolis / SC
  {
    id: 'fln_ubs_1',
    name: 'Centro de Saúde Centro (Florianópolis)',
    category: 'ubs',
    categoryLabel: 'Centro de Saúde / UBS',
    address: 'Rua Tenente Silveira, 516 - Centro, Florianópolis - SC',
    phone: '(48) 3212-3900',
    openingHours: 'Segunda a Sexta, das 07:00 às 19:00',
    lat: -27.5956,
    lng: -48.5521,
    source: 'SMS Florianópolis',
  },
  {
    id: 'fln_upa_1',
    name: 'UPA 24h Norte da Ilha',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Rodovia SC-401, 14000 - Canasvieiras, Florianópolis - SC',
    phone: '(48) 3251-6000',
    openingHours: '24 Horas Todos os Dias',
    lat: -27.4391,
    lng: -48.4682,
    source: 'SMS Florianópolis / CNES',
  },
  {
    id: 'fln_hosp_1',
    name: 'Hospital Governador Celso Ramos',
    category: 'hospital',
    categoryLabel: 'Hospital Geral de Emergência',
    address: 'Rua Irmã Benwarda, 297 - Centro, Florianópolis - SC',
    phone: '(48) 3251-7000',
    openingHours: 'Pronto-Socorro 24 Horas',
    lat: -27.5912,
    lng: -48.5492,
    source: 'SES-SC / Ministério da Saúde',
  },
  // Natal / RN
  {
    id: 'nat_ubs_1',
    name: 'UBS Alecrim (Unidade Mista de Saúde)',
    category: 'ubs',
    categoryLabel: 'Unidade Básica de Saúde (UBS)',
    address: 'Rua Fonseca e Silva, 1120 - Alecrim, Natal - RN',
    phone: '(84) 3232-4900',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -5.7954,
    lng: -35.2215,
    source: 'SMS Natal',
  },
  {
    id: 'nat_upa_1',
    name: 'UPA 24h Esperança (Zona Oeste)',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (UPA 24h)',
    address: 'Avenida Rio Grande do Sul, s/n - Cidade Nova, Natal - RN',
    phone: '(84) 3232-8500',
    openingHours: '24 Horas Ininterrupto',
    lat: -5.8231,
    lng: -35.2412,
    source: 'SMS Natal / CNES',
  },
  {
    id: 'nat_hosp_1',
    name: 'Hospital Monsenhor Walfredo Gurgel',
    category: 'hospital',
    categoryLabel: 'Hospital de Pronto-Socorro e Trauma',
    address: 'Avenida Senador Salgado Filho, s/n - Tirol, Natal - RN',
    phone: '(84) 3232-7500',
    openingHours: 'Pronto-Socorro 24 Horas',
    lat: -5.8112,
    lng: -35.2095,
    source: 'SESAP-RN / SUS',
  },
  // Vitória / ES
  {
    id: 'vix_ubs_1',
    name: 'USF Centro Vitória (Atenção Básica)',
    category: 'ubs',
    categoryLabel: 'Unidade de Saúde da Família (USF)',
    address: 'Rua Cais de São Francisco, 45 - Centro, Vitória - ES',
    phone: '(27) 3132-5100',
    openingHours: 'Segunda a Sexta, das 07:00 às 18:00',
    lat: -20.3215,
    lng: -40.3382,
    source: 'Prefeitura de Vitória',
  },
  {
    id: 'vix_upa_1',
    name: 'Pronto Atendimento São Pedro (PA 24h)',
    category: 'upa',
    categoryLabel: 'Pronto Atendimento (PA 24h)',
    address: 'Rodovia Serafim Derenzi, s/n - São Pedro, Vitória - ES',
    phone: '(27) 3132-5200',
    openingHours: '24 Horas Todos os Dias',
    lat: -20.2921,
    lng: -40.3421,
    source: 'SMS Vitória / CNES',
  },
  {
    id: 'vix_hosp_1',
    name: 'Hospital Estadual Central (HEC)',
    category: 'hospital',
    categoryLabel: 'Hospital Geral de Urgência (SUS)',
    address: 'Rua São José, 21 - Parque Moscoso, Vitória - ES',
    phone: '(27) 3636-4700',
    openingHours: 'Pronto Atendimento 24 Horas',
    lat: -20.3189,
    lng: -40.3412,
    source: 'SESA-ES / Ministério da Saúde',
  },
];

// Parser helper for OpenStreetMap raw elements
function parseOsmElement(
  el: any,
  userLat?: number,
  userLng?: number
): NearbyPlace | null {
  const tags = el.tags || {};
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (!lat || !lon) return null;

  const rawName = tags.name || tags['name:pt'] || tags.operator || tags.brand;
  if (!rawName) return null;

  const lowerName = rawName.toLowerCase();
  const amenity = (tags.amenity || '').toLowerCase();
  const healthcare = (tags.healthcare || '').toLowerCase();

  let category: 'ubs' | 'upa' | 'hospital' | 'pharmacy' = 'ubs';
  let categoryLabel = 'Unidade Básica de Saúde (UBS)';

  if (
    lowerName.includes('upa') ||
    lowerName.includes('pronto atendimento') ||
    lowerName.includes('urgência') ||
    amenity === 'emergency'
  ) {
    category = 'upa';
    categoryLabel = 'Pronto Atendimento (UPA 24h)';
  } else if (
    amenity === 'hospital' ||
    healthcare === 'hospital' ||
    lowerName.includes('hospital') ||
    lowerName.includes('santacasa') ||
    lowerName.includes('santa casa')
  ) {
    category = 'hospital';
    categoryLabel = 'Hospital Geral';
  } else if (
    amenity === 'pharmacy' ||
    tags.shop === 'chemist' ||
    lowerName.includes('farmácia') ||
    lowerName.includes('farmacia') ||
    lowerName.includes('drogaria')
  ) {
    category = 'pharmacy';
    categoryLabel = 'Farmácia e Drogaria';
  } else {
    category = 'ubs';
    categoryLabel = 'Unidade Básica de Saúde (UBS)';
  }

  // Address assembly with strict truthfulness
  const street = tags['addr:street'] || tags['addr:place'];
  const number = tags['addr:housenumber'];
  const suburb = tags['addr:suburb'] || tags['addr:neighbourhood'];
  const city = tags['addr:city'];

  let address = '';
  if (street) {
    address = street;
    if (number) address += `, ${number}`;
    if (suburb) address += ` - ${suburb}`;
    if (city) address += `, ${city}`;
  } else if (city) {
    address = `Cidade de ${city} (Endereço detalhado não informado na fonte oficial)`;
  } else {
    address = 'Endereço completo não detalhado na fonte oficial';
  }

  // Strict phone checking - NEVER hallucinate or assume
  const rawPhone =
    tags.phone ||
    tags['contact:phone'] ||
    tags['contact:mobile'] ||
    tags.telephone ||
    null;

  // Strict opening hours
  const rawHours = tags.opening_hours || null;

  // Farmácia Popular check
  const isPop =
    tags['pharmacy:popular'] === 'yes' ||
    tags['ref:farmacia_popular'] != null ||
    lowerName.includes('farmácia popular municipal');

  let distanceKm: number | undefined;
  let formattedDistance: string | undefined;

  if (userLat != null && userLng != null) {
    distanceKm = calculateDistanceKm(userLat, userLng, lat, lon);
    formattedDistance = formatDistance(distanceKm);
  }

  return {
    id: `osm_${el.id}`,
    name: rawName,
    category,
    categoryLabel,
    address,
    phone: rawPhone,
    openingHours: rawHours,
    isPopularPharmacy: isPop,
    lat,
    lng: lon,
    distanceKm,
    formattedDistance,
    source: 'OpenStreetMap (Base Aberta) / Cadastro de Saúde',
  };
}

// Fetch nearby places from Overpass API (OpenStreetMap)
export async function fetchNearbyPlacesFromOsm(
  lat: number,
  lng: number,
  category: PlaceCategory = 'all',
  radiusMeters: number = 8000
): Promise<NearbyPlace[]> {
  try {
    let filterAmenity = 'clinic|hospital|pharmacy|doctors';
    if (category === 'ubs') filterAmenity = 'clinic|doctors';
    if (category === 'upa') filterAmenity = 'clinic|hospital';
    if (category === 'hospital') filterAmenity = 'hospital';
    if (category === 'pharmacy') filterAmenity = 'pharmacy';

    const overpassQuery = `
      [out:json][timeout:8];
      (
        node["amenity"~"${filterAmenity}"](around:${radiusMeters},${lat},${lng});
        way["amenity"~"${filterAmenity}"](around:${radiusMeters},${lat},${lng});
      );
      out center 30;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass API status ${response.status}`);
    }

    const data = await response.json();
    if (!data.elements || !Array.isArray(data.elements)) {
      return [];
    }

    const parsed = data.elements
      .map((el: any) => parseOsmElement(el, lat, lng))
      .filter((p: NearbyPlace | null): p is NearbyPlace => p !== null);

    // Filter by specific requested category if not 'all'
    const filtered =
      category === 'all'
        ? parsed
        : parsed.filter((p: NearbyPlace) => {
            if (category === 'upa') {
              return (
                p.category === 'upa' ||
                p.name.toLowerCase().includes('upa') ||
                p.name.toLowerCase().includes('pronto')
              );
            }
            return p.category === category;
          });

    // Sort by distance
    filtered.sort((a: NearbyPlace, b: NearbyPlace) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return filtered;
  } catch (err) {
    console.warn('Overpass API indisponível ou lenta. Tentando busca alternativa:', err);
    return [];
  }
}

// Fetch nearby places via OpenStreetMap Nominatim search around coordinates or city
export async function fetchNearbyPlacesFromNominatim(
  lat: number,
  lng: number,
  category: PlaceCategory = 'all',
  cityName?: string
): Promise<NearbyPlace[]> {
  try {
    let terms: string[] = [];
    if (category === 'all') {
      terms = ['hospital', 'posto de saude', 'upa', 'farmacia', 'saude'];
    } else if (category === 'ubs') {
      terms = ['posto de saude', 'ubs', 'centro de saude'];
    } else if (category === 'upa') {
      terms = ['upa', 'pronto atendimento', 'pronto socorro'];
    } else if (category === 'hospital') {
      terms = ['hospital', 'santa casa'];
    } else if (category === 'pharmacy') {
      terms = ['farmacia', 'drogaria'];
    }

    const delta = 0.15; // ~16km
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;

    const promises = terms.map(async (term) => {
      try {
        const query = cityName ? `${term} ${cityName}` : term;
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=br&limit=8&accept-language=pt-BR,pt;q=0.9`;

        if (!cityName) {
          url += `&viewbox=${left},${top},${right},${bottom}&bounded=1`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'pt-BR,pt;q=0.9',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    });

    const allBatches = await Promise.all(promises);
    const seenIds = new Set<string | number>();
    const results: NearbyPlace[] = [];

    for (const batch of allBatches) {
      for (const item of batch) {
        if (!item || seenIds.has(item.place_id)) continue;
        seenIds.add(item.place_id);

        const itemLat = parseFloat(item.lat);
        const itemLon = parseFloat(item.lon);
        if (isNaN(itemLat) || isNaN(itemLon)) continue;

        const rawName = item.display_name?.split(',')[0] || item.name || 'Unidade de Saúde';
        const lower = rawName.toLowerCase();

        // Skip non-human veterinary clinics
        if (lower.includes('veterinário') || lower.includes('veterinaria') || lower.includes('pet')) {
          continue;
        }

        let cat: 'ubs' | 'upa' | 'hospital' | 'pharmacy' = 'ubs';
        let catLabel = 'Unidade Básica de Saúde (UBS)';

        if (
          lower.includes('upa') ||
          lower.includes('pronto atendimento') ||
          lower.includes('pronto socorro') ||
          lower.includes('urgência')
        ) {
          cat = 'upa';
          catLabel = 'Pronto Atendimento (UPA 24h)';
        } else if (
          lower.includes('hospital') ||
          lower.includes('santa casa') ||
          item.type === 'hospital'
        ) {
          cat = 'hospital';
          catLabel = 'Hospital Geral';
        } else if (
          lower.includes('farmácia') ||
          lower.includes('farmacia') ||
          lower.includes('drogaria') ||
          item.type === 'pharmacy'
        ) {
          cat = 'pharmacy';
          catLabel = 'Farmácia e Drogaria';
        }

        if (category !== 'all' && cat !== category) {
          if (!(category === 'upa' && (lower.includes('upa') || lower.includes('pronto')))) {
            continue;
          }
        }

        const dist = calculateDistanceKm(lat, lng, itemLat, itemLon);
        results.push({
          id: `nom_${item.place_id}`,
          name: rawName,
          category: cat,
          categoryLabel: catLabel,
          address: item.display_name || 'Endereço registrado no OpenStreetMap',
          lat: itemLat,
          lng: itemLon,
          distanceKm: dist,
          formattedDistance: formatDistance(dist),
          phone: null,
          openingHours: null,
          source: 'OpenStreetMap / Base Aberta SUS Brasil',
          isPopularPharmacy: lower.includes('popular'),
        });
      }
    }

    results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    return results;
  } catch (e) {
    console.warn('Erro na busca Nominatim por proximidade:', e);
    return [];
  }
}

// Geocode query string (City, Neighborhood, Address)
export async function geocodeAddress(
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  // 1. First try server-side proxy
  try {
    const res = await fetch(`/api/places/geocode?query=${encodeURIComponent(cleanQuery)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.lat && data.lng) {
        return {
          lat: data.lat,
          lng: data.lng,
          displayName: data.displayName,
        };
      }
    }
  } catch {}

  // 2. Direct Photon API fallback (works without restrictions on client)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery + ' Brasil')}&limit=1`;
    const res = await fetch(photonUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        const props = data.features[0].properties;
        return {
          lat: coords[1],
          lng: coords[0],
          displayName: `${props.name || cleanQuery}, ${props.state || props.country || 'Brasil'}`,
        };
      }
    }
  } catch {}

  return null;
}

// Reverse geocode latitude and longitude to human-friendly neighborhood, city, state in Brazil
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ displayName: string; city?: string; state?: string } | null> {
  // 1. First try server-side proxy
  try {
    const res = await fetch(`/api/places/reverse?lat=${lat}&lng=${lng}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.displayName) {
        return data;
      }
    }
  } catch {}

  // 2. Fallback to Photon reverse
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const p = data.features[0].properties;
        return {
          displayName: [p.district, p.city, p.state].filter(Boolean).join(' - ') || 'Brasil',
          city: p.city,
          state: p.state,
        };
      }
    }
  } catch {}

  return null;
}

// Master function: get nearby places combining verified municipal database, live server proxy, and OSM
export async function getPlaces(params: {
  lat?: number;
  lng?: number;
  query?: string;
  category?: PlaceCategory;
}): Promise<{
  places: NearbyPlace[];
  resolvedLocationName?: string;
  isApproximateFallback: boolean;
  hasDeviceGps: boolean;
  sourceDescription: string;
}> {
  const category = params.category || 'all';
  let resolvedName: string | undefined;

  // 1. Verifica se temos coordenadas reais do GPS do dispositivo
  const hasRealGps =
    typeof params.lat === 'number' &&
    typeof params.lng === 'number' &&
    !isNaN(params.lat) &&
    !isNaN(params.lng) &&
    (params.lat !== 0 || params.lng !== 0);

  // 1.1 Se o dispositivo forneceu GPS real, esse é o centro ABSOLUTO e inalterável
  if (hasRealGps) {
    const userLat = params.lat!;
    const userLng = params.lng!;

    // Salva coordenadas recentes para consultas rápidas do assistente
    try {
      localStorage.setItem(
        'vivaplus_last_coords',
        JSON.stringify({ lat: userLat, lng: userLng, timestamp: Date.now() })
      );
    } catch {}

    // Descobre o endereço ou bairro real via geocodificação reversa
    const rev = await reverseGeocode(userLat, userLng);
    if (rev) {
      resolvedName = rev.displayName || rev.city;
    }

    const combinedMap = new Map<string, NearbyPlace>();

    // A. Adiciona pontos da base verificada que estejam a no máximo 35 km do usuário
    // (impede que uma pessoa em São Paulo veja um hospital do Paraná a 0 metros)
    const nearbyVerified = VERIFIED_BRAZILIAN_PLACES.filter((p) => {
      if (category !== 'all' && p.category !== category) {
        if (!(category === 'upa' && p.category === 'upa')) return false;
      }
      const dist = calculateDistanceKm(userLat, userLng, p.lat, p.lng);
      return dist <= 35; // Apenas locais genuinamente próximos ao aparelho
    });

    for (const vp of nearbyVerified) {
      const dist = calculateDistanceKm(userLat, userLng, vp.lat, vp.lng);
      combinedMap.set(vp.id, {
        ...vp,
        distanceKm: dist,
        formattedDistance: formatDistance(dist, true),
      });
    }

    // B. Consulta o servidor proxy com busca geográfica delimitada ao redor do GPS do dispositivo
    try {
      const searchUrl = `/api/places/search?category=${encodeURIComponent(category)}&lat=${userLat}&lng=${userLng}`;
      const proxyRes = await fetch(searchUrl);
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (Array.isArray(proxyData.places)) {
          for (const sp of proxyData.places) {
            const key = sp.name.toLowerCase().trim();
            let exists = false;
            for (const existing of combinedMap.values()) {
              if (existing.name.toLowerCase().includes(key) || key.includes(existing.name.toLowerCase())) {
                exists = true;
                break;
              }
            }
            if (!exists && sp.lat != null && sp.lng != null) {
              const dist = calculateDistanceKm(userLat, userLng, sp.lat, sp.lng);
              // Aceita resultados em raio razoável (até 40 km)
              if (dist <= 40) {
                combinedMap.set(sp.id, {
                  ...sp,
                  distanceKm: dist,
                  formattedDistance: formatDistance(dist, true),
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao consultar proxy de locais para o GPS:', e);
    }

    const finalPlaces = Array.from(combinedMap.values());
    finalPlaces.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return {
      places: finalPlaces,
      resolvedLocationName: resolvedName || 'Sua localização atual no Brasil',
      isApproximateFallback: false,
      hasDeviceGps: true,
      sourceDescription: 'GPS do dispositivo • OpenStreetMap e Base Oficial SUS',
    };
  }

  // 2. Se o usuário digitou uma cidade ou bairro especificamente na busca
  if (params.query && params.query.trim().length > 0) {
    const cleanQ = params.query.trim();
    resolvedName = cleanQ;

    const normToken = normalizeText(
      cleanQ.replace(/,\s*(pr|sp|rj|mg|df|ba|rs|sc|go|pe|ce|am|pa|es|ma|mt|ms|pb|pi|rn|ro|rr|se|to)/i, '')
    );

    // Geocodifica a cidade para encontrar suas coordenadas geográficas oficiais centrais
    let centerLat: number | undefined;
    let centerLng: number | undefined;

    const geo = await geocodeAddress(cleanQ);
    if (geo) {
      centerLat = geo.lat;
      centerLng = geo.lng;
      resolvedName = geo.displayName;
    }

    // Filtra na base cadastral verificada para aquela cidade
    let verifiedMatches = VERIFIED_BRAZILIAN_PLACES.filter((p) => {
      const addrNorm = normalizeText(p.address);
      const nameNorm = normalizeText(p.name);
      return addrNorm.includes(normToken) || nameNorm.includes(normToken);
    });

    if (category !== 'all') {
      verifiedMatches = verifiedMatches.filter((p) => {
        if (category === 'upa') return p.category === 'upa';
        return p.category === category;
      });
    }

    if (!centerLat && verifiedMatches.length > 0) {
      centerLat = verifiedMatches[0].lat;
      centerLng = verifiedMatches[0].lng;
    }

    const combinedMap = new Map<string, NearbyPlace>();
    const cleanCity = cleanQ.split(',')[0].trim();

    // Adiciona locais verificados
    for (const vp of verifiedMatches) {
      let dist = vp.distanceKm || 1.0;
      if (centerLat != null && centerLng != null) {
        dist = calculateDistanceKm(centerLat, centerLng, vp.lat, vp.lng);
      }
      combinedMap.set(vp.id, {
        ...vp,
        distanceKm: dist,
        formattedDistance: formatDistance(dist, false, cleanCity),
      });
    }

    // Consulta servidor proxy para a cidade pesquisada
    try {
      let searchUrl = `/api/places/search?city=${encodeURIComponent(cleanQ)}&category=${encodeURIComponent(category)}`;
      if (centerLat != null && centerLng != null) {
        searchUrl += `&lat=${centerLat}&lng=${centerLng}`;
      }
      const proxyRes = await fetch(searchUrl);
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (Array.isArray(proxyData.places)) {
          for (const sp of proxyData.places) {
            const key = sp.name.toLowerCase().trim();
            let exists = false;
            for (const existing of combinedMap.values()) {
              if (existing.name.toLowerCase().includes(key) || key.includes(existing.name.toLowerCase())) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              let dist = sp.distanceKm || 1.5;
              if (centerLat != null && centerLng != null && sp.lat != null && sp.lng != null) {
                dist = calculateDistanceKm(centerLat, centerLng, sp.lat, sp.lng);
              }
              combinedMap.set(sp.id, {
                ...sp,
                distanceKm: dist,
                formattedDistance: formatDistance(dist, false, cleanCity),
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao consultar proxy de locais por cidade:', e);
    }

    const finalPlaces = Array.from(combinedMap.values());
    finalPlaces.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return {
      places: finalPlaces,
      resolvedLocationName: resolvedName || cleanQ,
      isApproximateFallback: true,
      hasDeviceGps: false,
      sourceDescription: `Busca manual em ${cleanCity} • OpenStreetMap e Base SUS`,
    };
  }

  // 3. Se não temos GPS e nenhuma cidade foi informada, verifica se há coordenadas salvas recentemente
  try {
    const raw = localStorage.getItem('vivaplus_last_coords');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.lat === 'number' &&
        typeof parsed.lng === 'number' &&
        Date.now() - (parsed.timestamp || 0) < 3600000 * 6 // até 6 horas
      ) {
        return getPlaces({
          lat: parsed.lat,
          lng: parsed.lng,
          category,
        });
      }
    }
  } catch {}

  // 4. Se não há GPS nem busca: não inventa locais longe como se fossem 0 metros!
  return {
    places: [],
    resolvedLocationName: 'Localização do aparelho não ativada',
    isApproximateFallback: true,
    hasDeviceGps: false,
    sourceDescription: 'Aguardando permissão de GPS ou seleção de cidade',
  };
}
