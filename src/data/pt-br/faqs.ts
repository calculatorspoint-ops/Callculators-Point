/**
 * src/data/pt-br/faqs.ts
 *
 * Brazilian Portuguese translations of BASE_FAQS and key CALC_FAQS.
 */

/** Base FAQs shown on every calculator page */
export const BASE_FAQS_PT_BR: { q: string; a: string }[] = [
  {
    q: 'Esta calculadora é gratuita?',
    a: 'Sim, 100% gratuita. Sem cadastro, sem plano premium, sem limitações. Todas as calculadoras da Calculators Point são e sempre serão gratuitas.',
  },
  {
    q: 'Os meus dados são armazenados?',
    a: 'Não. Todos os cálculos acontecem no seu dispositivo (no navegador). Nenhum dado inserido é enviado para nossos servidores. Sua privacidade é preservada.',
  },
  {
    q: 'Os resultados são precisos?',
    a: 'Sim. Usamos as mesmas fórmulas matemáticas empregadas por instituições financeiras, profissionais de saúde e sistemas acadêmicos. Os resultados são estimativas precisas, mas podem diferir ligeiramente de cálculos oficiais por arredondamento.',
  },
  {
    q: 'Posso usar no celular?',
    a: 'Sim. O site é totalmente responsivo e funciona em qualquer dispositivo — celular, tablet ou computador. Também está disponível como PWA: você pode instalá-lo na tela inicial do seu celular para acesso rápido sem precisar do navegador.',
  },
  {
    q: 'Os resultados substituem orientação profissional?',
    a: 'Não. Os resultados são para fins informativos e educacionais. Para decisões financeiras, de saúde ou jurídicas importantes, consulte sempre um profissional qualificado — assessor financeiro, médico, contador ou advogado.',
  },
  {
    q: 'Como posso sugerir uma nova calculadora?',
    a: 'Entre em contato pelo formulário na página de contato ou diretamente pelo e-mail contact@calculatorspoint.com. Analisamos todas as sugestões.',
  },
];

/** Calculator-specific FAQs in pt-BR */
export const CALC_FAQS_PT_BR: Record<string, { q: string; a: string }[]> = {
  'bmi-calculator': [
    { q: 'O IMC é a melhor medida de saúde?', a: 'O IMC é uma triagem inicial útil, mas não distingue músculo de gordura. Atletas musculosos podem ter IMC elevado mesmo sendo saudáveis. Use em conjunto com medidas de circunferência abdominal e percentual de gordura.' },
    { q: 'Qual IMC é considerado normal pela OMS?', a: 'A OMS classifica IMC entre 18,5 e 24,9 como "Peso Normal". Abaixo de 18,5 é Abaixo do Peso; entre 25 e 29,9 é Sobrepeso; 30 ou mais é Obesidade.' },
    { q: 'O cálculo de IMC é diferente para crianças?', a: 'Sim. Para crianças e adolescentes (2–19 anos), o IMC é avaliado por percentis de acordo com sexo e idade. Esta calculadora usa os critérios da OMS para adultos.' },
  ],
  'calorie-calculator': [
    { q: 'O que é TDEE?', a: 'TDEE (Total Daily Energy Expenditure, ou Gasto Energético Total Diário) é o total de calorias que você queima por dia, incluindo metabolismo basal e todas as atividades físicas.' },
    { q: 'Quantas calorias devo cortar para emagrecer?', a: 'Um déficit de 500 kcal/dia resulta em aproximadamente 0,5 kg de perda de peso por semana. Déficits muito grandes (>1.000 kcal) podem levar à perda de massa muscular. Consulte um nutricionista.' },
    { q: 'Qual a diferença entre as fórmulas Mifflin-St Jeor e Harris-Benedict?', a: 'Mifflin-St Jeor (1990) é considerada mais precisa para a maioria das pessoas e é a recomendada pela Academy of Nutrition and Dietetics. Harris-Benedict (revisada 1984) ainda é amplamente usada e produz resultados similares.' },
  ],
  'loan-emi-calculator': [
    { q: 'O que é a Tabela Price?', a: 'A Tabela Price é um sistema de amortização com parcelas fixas. Cada parcela tem uma parte de juros e uma de amortização do principal. No início, os juros são maiores; com o tempo, a amortização aumenta.' },
    { q: 'Qual a diferença entre Tabela Price e SAC?', a: 'No SAC (Sistema de Amortização Constante), as parcelas são decrescentes — você amortiza sempre o mesmo valor do principal, mas os juros diminuem a cada mês. No total, o SAC costuma ser mais barato.' },
    { q: 'Vale a pena fazer amortização extra?', a: 'Sim, geralmente muito. Pagamentos extras vão direto ao principal, reduzindo os juros futuros. Em financiamentos longos (como imóveis de 20–30 anos), uma amortização extra no início pode economizar dezenas de milhares de reais.' },
  ],
  'compound-interest-calculator': [
    { q: 'Juros compostos são a mesma coisa que CDI?', a: 'O CDI é uma taxa de referência, mas os rendimentos seguem o regime de juros compostos. Quando um CDB rende "100% do CDI", os juros são capitalizados diariamente sobre o saldo total, incluindo juros já acumulados.' },
    { q: 'Com que frequência os juros devem ser capitalizados?', a: 'Quanto maior a frequência de capitalização, maior o rendimento efetivo. Capitalização diária rende mais que mensal, que rende mais que anual — mesmo à mesma taxa nominal.' },
    { q: 'Como calcular a taxa real (descontando inflação)?', a: 'Taxa real ≈ Taxa nominal − Inflação (IPCA). Para cálculo exato: (1 + taxa nominal) / (1 + inflação) − 1. A calculadora tem opção de visualização com ajuste pela inflação.' },
  ],
  'gpa-calculator': [
    { q: 'O GPA equivale ao IRA no Brasil?', a: 'O GPA americano (escala 0–4,0) é similar ao IRA (Índice de Rendimento Acadêmico) usado por universidades brasileiras, mas as escalas variam. Cada universidade define sua própria fórmula de IRA.' },
    { q: 'Como converter notas brasileiras para o GPA americano?', a: 'Uma regra comum: 9,0–10 = A (4,0); 8,0–8,9 = B+ (3,3–3,7); 7,0–7,9 = B (3,0); 6,0–6,9 = C (2,0); abaixo de 6 = F (0). Mas a conversão varia por instituição.' },
  ],
  'sip-calculator': [
    { q: 'O equivalente brasileiro ao SIP são os aportes mensais em fundos?', a: 'Sim. O equivalente mais próximo ao SIP indiano são os aportes mensais programados em fundos de investimento, previdência privada (PGBL/VGBL) ou Tesouro Direto.' },
    { q: 'Qual rentabilidade usar como referência?', a: 'Para cenários conservadores, use 100% do CDI (hoje ~11% a.a.). Para moderado, use 12–14% a.a. (fundos multimercado). Para agressivo, 15–20% a.a. (fundos de ações). Esses valores variam com o tempo.' },
  ],
};
