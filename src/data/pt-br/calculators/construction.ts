import type { PtBrRegistry } from '../index';

export const constructionPtBr: PtBrRegistry = {
  'concrete-calculator': {
    name: 'Calculadora de Concreto',
    desc: 'Volume de concreto e sacos necessários para lajes, paredes, fundações e colunas.',
    metaTitle: 'Calculadora de Concreto - Estime Volume e Sacos',
    metaDescription: 'Calcule o volume exato de concreto necessário para lajes, paredes e colunas. Converta metros cúbicos em quantidade de sacos de mistura.',
    intro: 'A Calculadora de Concreto determina o volume exato de concreto necessário para lajes, fundações, paredes e colunas, convertendo esse volume na quantidade de sacos pré-misturados necessários. Empreiteiros e construtores usam essa ferramenta para pedir a quantidade certa de material.',
    tips: [
      'Adicione 10% de margem de perda para qualquer concretagem para compensar derramamentos e enchimento excessivo.'
    ],
    howToUse: [
      'Selecione o formato da área que será concretada.',
      'Insira as dimensões (comprimento, largura e profundidade).',
      'O volume será calculado automaticamente em metros cúbicos.'
    ],
    about: 'O concreto é vendido por volume, mas aplicado em dimensões de comprimento, largura e profundidade. A conversão correta evita desperdícios e faltas de material.'
  },
  'cement-calculator': {
    name: 'Calculadora de Cimento',
    desc: 'Sacos de cimento, areia e brita para qualquer proporção de mistura e volume.',
    metaTitle: 'Calculadora de Cimento e Traço',
    metaDescription: 'Descubra quantos sacos de cimento e qual a quantidade de areia e brita para sua mistura de concreto.',
    intro: 'A Calculadora de Cimento determina quantos sacos de cimento e qual a quantidade de areia e brita você precisa para uma mistura de concreto ou argamassa personalizada.',
  },
  'sand-calculator': {
    name: 'Calculadora de Areia',
    desc: 'Volume e peso de areia para paisagismo, mistura de concreto e fundações.',
    metaTitle: 'Calculadora de Areia - Volume e Peso',
    metaDescription: 'Calcule a quantidade exata de areia para seus projetos. Obtenha volume e peso rapidamente.',
    intro: 'A Calculadora de Areia calcula o volume e o peso da areia necessária para preencher ou cobrir uma área definida.',
  },
  'gravel-calculator': {
    name: 'Calculadora de Cascalho e Brita',
    desc: 'Volume e peso de brita para calçadas, caminhos e drenagem.',
    metaTitle: 'Calculadora de Cascalho e Brita',
    metaDescription: 'Estime o volume e peso de brita ou cascalho necessários para cobrir uma área.',
    intro: 'A Calculadora de Cascalho estima o volume e o peso de brita, cascalho ou agregado decorativo necessário para cobrir uma área.',
  },
  'asphalt-calculator': {
    name: 'Calculadora de Asfalto',
    desc: 'Peso e custo de asfalto para estradas e calçadas.',
    metaTitle: 'Calculadora de Asfalto - Estime Custos',
    metaDescription: 'Calcule a quantidade de asfalto necessária para pavimentação e obtenha estimativas de custo.',
    intro: 'A Calculadora de Asfalto estima o peso e o custo aproximado de material de asfalto necessário para uma estrada ou estacionamento.',
  },
  'paint-calculator': {
    name: 'Calculadora de Tinta',
    desc: 'Quantidade de tinta para paredes, tetos e cômodos com taxa de cobertura e custo.',
    metaTitle: 'Calculadora de Tinta',
    metaDescription: 'Descubra quantos litros de tinta você precisa para pintar paredes e tetos, descontando portas e janelas.',
    intro: 'A Calculadora de Tinta determina quantos litros de tinta você precisa para cobrir paredes e tetos, descontando portas e janelas.',
  },
  'roofing-calculator': {
    name: 'Calculadora de Telhado',
    desc: 'Área do telhado, telhas e custo de material com inclinação e fator de perda.',
    metaTitle: 'Calculadora de Telhado e Telhas',
    metaDescription: 'Calcule a área do seu telhado e a quantidade de telhas necessárias.',
    intro: 'A Calculadora de Telhado calcula a verdadeira área de superfície inclinada de um telhado a partir da área do solo e do ângulo de inclinação.',
  },
  'square-footage-calculator': {
    name: 'Calculadora de Área',
    desc: 'Área total para projetos de pisos, azulejos e pintura.',
    metaTitle: 'Calculadora de Metros Quadrados',
    metaDescription: 'Calcule a área de espaços regulares e irregulares em metros quadrados para pisos e reformas.',
    intro: 'A Calculadora de Área encontra a área de espaços retangulares, circulares, triangulares ou em forma de L em metros quadrados.',
  },
  'cubic-yard-calculator': {
    name: 'Calculadora de Metros Cúbicos',
    desc: 'Converta dimensões em volume para pedidos de materiais a granel.',
    metaTitle: 'Calculadora de Metros Cúbicos',
    metaDescription: 'Converta comprimento, largura e profundidade em metros cúbicos para comprar terra, areia e concreto.',
    intro: 'A Calculadora de Metros Cúbicos converte medições de comprimento, largura e profundidade em volume.',
  },
  'construction-cost-calculator': {
    name: 'Calculadora de Custo de Construção',
    desc: 'Estimativa de custo do projeto com área, taxa de mão de obra e materiais.',
    metaTitle: 'Calculadora de Custo de Construção',
    metaDescription: 'Estime o custo total de uma obra ou reforma baseando-se na área e valores de mão de obra.',
    intro: 'A Calculadora de Custo de Construção produz um orçamento de projeto combinando área, mão de obra e materiais.',
  },
  'electrical-load-calculator': {
    name: 'Calculadora de Carga Elétrica',
    desc: 'Carga elétrica total e tamanho recomendado do disjuntor para aparelhos domésticos.',
    metaTitle: 'Calculadora de Carga Elétrica e Disjuntor',
    metaDescription: 'Calcule a carga elétrica dos seus aparelhos e descubra o disjuntor adequado para seu circuito.',
    intro: 'A Calculadora de Carga Elétrica soma a potência dos aparelhos em um circuito e recomenda o tamanho mínimo do disjuntor.',
  },
  'pipe-volume-calculator': {
    name: 'Calculadora de Volume de Tubulação',
    desc: 'Capacidade de volume e vazão de tubos cilíndricos com conversão de unidades.',
    metaTitle: 'Calculadora de Volume de Tubos',
    metaDescription: 'Encontre o volume interno e a capacidade de litros de tubulações cilíndricas.',
    intro: 'A Calculadora de Volume de Tubulação encontra o volume interno de um tubo cilíndrico a partir do seu diâmetro interno e comprimento.',
  },
  'density-calculator': {
    name: 'Calculadora de Densidade',
    desc: 'Massa, volume e densidade — resolva qualquer um fornecendo os outros dois.',
    metaTitle: 'Calculadora de Densidade - Massa e Volume',
    metaDescription: 'Calcule a densidade, massa ou volume de materiais.',
    intro: 'A Calculadora de Densidade resolve a relação Densidade = Massa / Volume em qualquer direção.',
  },
  'pressure-calculator': {
    name: 'Calculadora de Pressão',
    desc: 'Pressão a partir da força e área com conversões de unidades (Pa, PSI, bar, atm).',
    metaTitle: 'Calculadora de Pressão',
    metaDescription: 'Calcule pressão, força ou área e converta entre Pa, PSI, bar e atmosferas.',
    intro: 'A Calculadora de Pressão calcula a pressão a partir da força e área, com conversão instantânea de unidades.',
  }
};
