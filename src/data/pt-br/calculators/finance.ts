import type { PtBrRegistry } from '../index';

export const financePtBr: PtBrRegistry = {
  'loan-emi-calculator': {
    name: 'Simulador de Parcelas / Calculadora de Financiamento',
    desc: 'Calcule parcelas de financiamentos com tabela de amortização, simulação de pagamento antecipado e comparação de taxas',
    intro: 'O Simulador de Parcelas calcula sua prestação mensal exata usando a fórmula de juros compostos adotada pelos bancos brasileiros...',
    metaTitle: 'Simulador de Parcelas — Calculadora de Financiamento Online Grátis',
    metaDescription: 'Calcule a parcela do seu financiamento com tabela Price ou SAC. Parcela exata, total de juros e simulação de amortização. 100% grátis.',
    tips: ['Mesmo um pequeno pagamento extra mensal vai direto para o principal, reduzindo o prazo e os juros totais.'],
    howToUse: ['Insira o valor do empréstimo (principal).', 'Informe a taxa de juros anual.', 'Selecione o prazo em meses ou anos.', 'Clique em Calcular para ver sua parcela e o extrato completo.'],
    examples: [{ scenario: 'Financiamento de R$ 300.000 a 10% a.a. por 20 anos.', result: 'Sua parcela mensal será de R$ 2.895,10. Em 20 anos, você pagará R$ 394.824 em juros.' }],
    workedExample: {
      title: 'Calculando parcelas de um financiamento de carro',
      inputs: ['Valor: R$ 50.000', 'Taxa: 1,49% ao mês', 'Prazo: 48 meses'],
      steps: [
        'Taxa mensal r = 1,49% = 0,0149',
        'PMT = 50.000 × 0,0149 × (1+0,0149)^48 / [(1+0,0149)^48 - 1]',
        '(1,0149)^48 = 2,0373',
        'PMT = 50.000 × 0,0149 × 2,0373 / (2,0373 - 1) = 50.000 × 0,03036 / 1,0373',
        'PMT ≈ R$ 1.463,50'
      ],
      result: 'Parcela mensal de R$ 1.463,50. Total pago em 48 meses: R$ 70.248. Juros totais: R$ 20.248.'
    },
    about: 'No Brasil, os financiamentos seguem dois sistemas principais: a Tabela Price (parcelas fixas, como neste simulador) e o SAC (Sistema de Amortização Constante, com parcelas decrescentes). A maioria dos financiamentos de veículos usa a Tabela Price; os imobiliários da Caixa Econômica Federal geralmente oferecem as duas opções...',
    whenToUse: 'Use isso antes de solicitar qualquer financiamento imobiliário, de carro ou pessoal. Ajuda a entender exatamente qual será a sua saída mensal de caixa.',
    resultMeaning: 'O EMI (Parcela Mensal Equivalente) é o valor exato que você deve pagar ao banco todos os meses.'
  },
  'compound-interest-calculator': {
    name: 'Calculadora de Juros Compostos',
    desc: 'Crescimento do investimento com ajuste de inflação, imposto de renda e juros reais vs nominais',
    intro: 'A Calculadora de Juros Compostos mostra exatamente como o dinheiro cresce quando os juros são ganhos sobre o principal original e os juros acumulados.',
    metaTitle: 'Calculadora de Juros Compostos Online Grátis',
    metaDescription: 'Calcule juros compostos com capitalização diária, mensal ou anual. Veja como R$ 10.000 crescem ao longo de 10, 20 ou 30 anos.',
    tips: ['Os juros compostos são juros calculados sobre o principal inicial E todos os juros acumulados.', 'Quanto mais frequente for a capitalização dos juros, maior o rendimento efetivo.'],
    howToUse: ['Insira seu saldo inicial.', 'Defina a taxa de juros anual esperada.', 'Defina a frequência de capitalização.', 'Opcionalmente, adicione uma contribuição mensal.'],
    examples: [
      { scenario: 'Investir R$ 10.000 a 8% com capitalização anual por 30 anos.', result: 'Seu dinheiro cresce para R$ 100.626. Você ganhou mais de R$ 90.000 puramente de juros.' },
      { scenario: 'Adicionar R$ 500 mensais ao mesmo investimento.', result: 'O montante final explode para R$ 780.000.' }
    ],
    about: 'Os juros compostos são o processo de ganhar juros sobre seus juros — cada período os juros são adicionados ao principal e então passam a render juros no período seguinte.',
    whenToUse: 'Use isso ao avaliar CDBs, LCI/LCA ou investimentos a longo prazo para entender o efeito bola de neve.',
    resultMeaning: 'O valor final é sua riqueza total no final do prazo.'
  },
  'sip-calculator': {
    name: 'Simulador de Aportes Mensais / Calculadora de Investimento Regular',
    desc: 'Simulação de montante com aportes, modo progressivo e rentabilidade XIRR',
    intro: 'O Simulador de Aportes Mensais mostra como um investimento mensal fixo cresce ao longo do tempo usando juros compostos.',
    metaTitle: 'Simulador de Aportes Mensais — Planejador de Investimentos',
    metaDescription: 'Calcule o retorno dos seus aportes mensais com simulação de 3 cenários e ajuste anual progressivo.',
    tips: ['Um aporte progressivo aumenta automaticamente seu investimento mensal em uma certa porcentagem todos os anos.'],
    howToUse: ['Insira o valor do seu aporte mensal.', 'Insira a taxa de retorno anual esperada.', 'Insira o horizonte de tempo em anos.', 'Alterne a opção Progressivo se planeja aumentar seu aporte.'],
    examples: [
      { scenario: 'Investindo R$ 5.000 por mês a uma taxa de retorno esperada de 10% ao ano por 20 anos.', result: 'Seu investimento total será de R$ 1.200.000, mas o saldo final será bem superior.' },
      { scenario: 'Aplicando um reajuste de 10% anualmente.', result: 'Apenas aumentando o aporte junto com sua renda, o valor final é potencializado de forma dramática.' }
    ],
    about: 'Um Plano de Investimento Sistemático (SIP) permite que os investidores invistam um valor fixo em intervalos regulares, essencial para formar patrimônio.',
    whenToUse: 'Use para planejar a aposentadoria, a educação dos filhos ou a construção de riqueza via fundos imobiliários ou ações.',
    resultMeaning: 'Os resultados projetam sua riqueza futura estimada, separando o total investido do rendimento.'
  },
  'salary-calculator': {
    name: 'Calculadora de Salário Líquido',
    desc: 'Conversor de período de pagamento com regras tributárias locais e descontos de INSS/IR',
    intro: 'A Calculadora de Salário Líquido converte um salário bruto em seu pagamento líquido após aplicar faixas de imposto e deduções padrão.',
    metaTitle: 'Calculadora de Salário Líquido — Simule seu Pagamento Real',
    metaDescription: 'Calcule o seu salário líquido a partir do salário bruto, considerando os descontos de imposto de renda e INSS.',
    tips: ['O salário bruto é o que você ganha antes de impostos e deduções. O pagamento líquido é o dinheiro que de fato entra na sua conta.'],
    howToUse: ['Insira seu salário bruto.', 'Selecione o período (anual, mensal, etc).', 'Veja o detalhamento dos descontos.'],
    examples: [{ scenario: 'Salário de R$ 10.000 bruto por mês.', result: 'Após INSS e IR, o valor líquido será menor, refletindo os descontos oficiais.' }],
    about: 'Compreender a diferença entre o seu salário bruto e o seu salário líquido é essencial ao avaliar uma oferta de emprego.',
    whenToUse: 'Para analisar propostas de trabalho e organizar orçamentos mensais.',
    resultMeaning: 'O salário líquido é quanto você recebe livre de impostos e encargos descontados na fonte.'
  },
  'break-even-calculator': {
    name: 'Ponto de Equilíbrio',
    desc: 'Calcule o ponto de equilíbrio em unidades e receita com gráfico de margem de contribuição',
    intro: 'A Calculadora de Ponto de Equilíbrio encontra o volume de vendas no qual a receita total se iguala aos custos totais — o ponto onde o negócio não tem lucro nem prejuízo.',
    metaTitle: 'Calculadora de Ponto de Equilíbrio (Break-Even)',
    metaDescription: 'Descubra exatamente o quanto você precisa vender para não ter prejuízo e começar a ter lucro de verdade.',
    tips: ['A margem de contribuição é o valor de venda menos os custos variáveis unitários.'],
    howToUse: ['Insira os custos fixos mensais.', 'Insira o custo variável por unidade.', 'Insira o preço de venda da unidade.'],
    examples: [
      { scenario: 'Venda de lanches a R$ 15, com custo de R$ 6. Custos fixos de R$ 9.000.', result: 'Margem de contribuição = R$ 9. Break-even = 1.000 unidades.' }
    ],
    about: 'A análise de ponto de equilíbrio é uma das primeiras contas que qualquer empreendedor deve fazer antes de lançar um produto.',
    whenToUse: 'Ao planejar um novo negócio, novo produto ou avaliar a sustentabilidade de uma operação de vendas.',
    resultMeaning: 'Acima do ponto de equilíbrio, cada unidade adicional gera lucro puro.'
  },
  'roi-calculator': {
    name: 'Retorno sobre Investimento (ROI)',
    desc: 'Calcule o ROI total e anualizado com retornos ajustados pela inflação',
    intro: 'A Calculadora de ROI mede o quanto você ganhou ou perdeu em um investimento em relação ao que você colocou.',
    metaTitle: 'Calculadora de Retorno sobre Investimento (ROI)',
    metaDescription: 'Descubra a taxa de retorno (ROI) sobre qualquer investimento ou projeto com nossa ferramenta gratuita.',
    tips: ['Sempre compare o ROI anualizado ao invés do total para investimentos de períodos diferentes.'],
    howToUse: ['Insira o valor inicial investido.', 'Insira o valor final recebido.', 'Informe a duração do investimento.'],
    examples: [
      { scenario: 'Imóvel comprado por R$ 250.000 e vendido por R$ 380.000 após 5 anos.', result: 'ROI Total = 52%. ROI Anualizado (CAGR) = 8,8%.' }
    ],
    about: 'O Retorno sobre Investimento (ROI) expressa a porcentagem de ganho ou perda de um projeto ou investimento em relação ao custo inicial.',
    whenToUse: 'Ideal para avaliar compra de ações, imóveis, empresas ou campanhas de marketing.',
    resultMeaning: 'Um ROI positivo significa lucro, um ROI negativo representa perda de dinheiro.'
  },
  'profit-margin-calculator': {
    name: 'Margem de Lucro',
    desc: 'Calcule a margem bruta, o markup e entenda os indicadores de saúde',
    intro: 'A Calculadora de Margem de Lucro computa a margem e o markup a partir de valores de receita e custo.',
    metaTitle: 'Calculadora de Margem de Lucro',
    metaDescription: 'Calcule rapidamente a margem de lucro do seu produto.'
  },
  'simple-interest-calculator': {
    name: 'Calculadora de Juros Simples',
    desc: 'Juros calculados diretamente sobre o valor original sem capitalização',
    intro: 'A Calculadora de Juros Simples foca no montante sem incluir juros sobre juros.',
    metaTitle: 'Calculadora de Juros Simples',
    metaDescription: 'Uma ferramenta fácil para operações de juros simples no dia a dia.'
  },
  'discount-calculator': {
    name: 'Calculadora de Desconto',
    desc: 'Calcule descontos sobrepostos e o valor final de compra',
    intro: 'A Calculadora de Desconto acha o preço de venda de um item que possui promoções.',
    metaTitle: 'Calculadora de Desconto',
    metaDescription: 'Aplique e some descontos para saber o preço com antecedência.'
  },
  'down-payment-calculator': {
    name: 'Calculadora de Entrada',
    desc: 'Projete sua entrada em financiamento imobiliário e o tempo necessário',
    intro: 'A Calculadora de Entrada ajuda a ver como economizar para a casa própria.',
    metaTitle: 'Calculadora de Entrada Imobiliária',
    metaDescription: 'Saiba o quanto guardar para a entrada do imóvel.'
  },
  'debt-payoff-calculator': {
    name: 'Calculadora de Quitação de Dívidas',
    desc: 'Organize suas finanças com métodos como Avalanche e Bola de Neve',
    intro: 'Esta Calculadora monta um cronograma de pagamento para zerar seus débitos.',
    metaTitle: 'Calculadora de Pagamento de Dívidas',
    metaDescription: 'Encontre o caminho mais rápido para ficar livre das dívidas.'
  },
  'present-value-calculator': {
    name: 'VPL (Valor Presente Líquido)',
    desc: 'Veja o valor atual de quantias recebidas no futuro',
    intro: 'A Calculadora de Valor Presente traz a fluxos de caixa um desconto no tempo.',
    metaTitle: 'Calculadora VPL',
    metaDescription: 'Avalie rapidamente quantias financeiras futuras.'
  },
  'irr-calculator': {
    name: 'TIR (Taxa Interna de Retorno)',
    desc: 'Viabilidade de investimentos através do retorno dos fluxos de caixa',
    intro: 'A Calculadora de TIR iguala os valores futuros e presentes.',
    metaTitle: 'Calculadora de TIR',
    metaDescription: 'Descubra a rentabilidade percentual dos seus projetos.'
  },
  '401k-calculator': {
    name: 'Calculadora de Previdência Privada',
    desc: 'Estudo do acúmulo de riqueza para a aposentadoria',
    intro: 'Projete a aposentadoria baseada em contribuições mensais isentas de imposto até a retirada.',
    metaTitle: 'Calculadora de Previdência',
    metaDescription: 'Gerencie e visualize sua aposentadoria no longo prazo.'
  },
  'commission-calculator': {
    name: 'Calculadora de Comissão',
    desc: 'Simule seus ganhos a partir das porcentagens combinadas em vendas',
    intro: 'Calcule rapidamente quanto dinheiro você receberá no seu sistema de comissões.',
    metaTitle: 'Calculadora de Comissões de Vendas',
    metaDescription: 'Descubra a comissão exata a receber sobre as suas vendas.'
  },
  'depreciation-calculator': {
    name: 'Depreciação',
    desc: 'Calcule a perda de valor do seu bem',
    intro: 'Avalie como equipamentos ou carros desvalorizam durante o uso.',
    metaTitle: 'Calculadora de Depreciação de Bens',
    metaDescription: 'Simule rapidamente quanto de valor o ativo perdeu.'
  },
  'budget-calculator': {
    name: 'Calculadora de Orçamento',
    desc: 'Veja como 50/30/20 divide as despesas e receitas',
    intro: 'Crie um orçamento para categorizar as suas finanças pessoais.',
    metaTitle: 'Orçamento Pessoal - Calculadora',
    metaDescription: 'Controle seu dinheiro definindo metas e gastos mensais.'
  },
  'college-cost-calculator': {
    name: 'Custo de Faculdade',
    desc: 'Descubra o custo do ensino e quando iniciar a poupança',
    intro: 'Projete gastos inflacionados do ensino superior.',
    metaTitle: 'Planejador de Universidade',
    metaDescription: 'Saiba o quanto os estudos podem custar e como se preparar.'
  },
  'heloc-calculator': {
    name: 'Calculadora de Empréstimo',
    desc: 'Visualize como pegar um empréstimo assegurado',
    intro: 'Analise uma linha de crédito utilizando como garantia o seu imóvel ou patrimônio.',
    metaTitle: 'Simulador de Crédito',
    metaDescription: 'Consiga as melhores parcelas para seus empréstimos.'
  },
  'auto-lease-calculator': {
    name: 'Calculadora de Leasing Automotivo',
    desc: 'Estime pagamentos do seu carro alugado/arrendado',
    intro: 'Compare e decida se é melhor comprar ou assinar/leasar um carro.',
    metaTitle: 'Calculadora de Leasing de Carro',
    metaDescription: 'Verifique se um leasing automotivo faz sentido para você.'
  },
  'bond-calculator': {
    name: 'Calculadora de Títulos',
    desc: 'Acompanhe os retornos do título com valor de mercado e cupom',
    intro: 'Calcule qual é o rendimento até o vencimento e valores presentes dos seus cupons.',
    metaTitle: 'Calculadora de Rendimentos de Títulos',
    metaDescription: 'Obtenha a precificação completa de papéis e debêntures.'
  },
  'cd-calculator': {
    name: 'Calculadora de CDB / Renda Fixa',
    desc: 'Compare as taxas e certificados no rendimento bancário',
    intro: 'Verifique se deixar o dinheiro rendendo no CDB é rentável ao longo do tempo estipulado.',
    metaTitle: 'Calculadora de CDB Bancário',
    metaDescription: 'Acesse o retorno gerado por Certificados de Depósitos Bancários.'
  },
  'roth-ira-calculator': {
    name: 'Calculadora de Investimento com Isenção',
    desc: 'Avalie como a conta livre de impostos aumenta a riqueza',
    intro: 'Projete sua conta equivalente no longo prazo que conta com benefícios fiscais sobre lucros.',
    metaTitle: 'Simulador Roth IRA (Benefícios Fiscais)',
    metaDescription: 'Planeje sua reserva de isenção de impostos.'
  },
  'annuity-calculator': {
    name: 'Calculadora de Anuidade',
    desc: 'Fluxo contínuo de dinheiro na forma de anuidade',
    intro: 'Saiba o valor real de fluxos periódicos.',
    metaTitle: 'Calculadora PV FV Anuidades',
    metaDescription: 'Estime os valores recebidos da sua anuidade.'
  },
  'pension-calculator': {
    name: 'Calculadora de Pensão',
    desc: 'Planeje sua pensão nos serviços',
    intro: 'Veja a proporção salarial que a pensão trará usando as métricas corretas de benefício definido.',
    metaTitle: 'Calculadora de Pensão Definida',
    metaDescription: 'Conheça o valor esperado da pensão após seus anos de contribuição.'
  },
  'social-security-calculator': {
    name: 'Calculadora INSS',
    desc: 'Reivindicações baseadas na idade mínima da seguridade',
    intro: 'Projete o montante pago pelo benefício dependendo de quando se aposenta.',
    metaTitle: 'Simulador INSS Aposentadoria',
    metaDescription: 'Estime de forma justa o valor da sua previdência pública.'
  },
  'rmd-calculator': {
    name: 'Calculadora RMD',
    desc: 'Distribuição necessária para a aposentadoria',
    intro: 'Calcule as distribuições obrigatórias.',
    metaTitle: 'Retiradas de Contas RMD',
    metaDescription: 'Saiba sobre as retiradas regulares com contas específicas de aposentadoria.'
  },
  'estate-tax-calculator': {
    name: 'Calculadora de Imposto Sobre Herança',
    desc: 'Entenda descontos federais nos valores de transmissões',
    intro: 'Veja o cálculo sobre a taxação de impostos a propriedades imobiliárias e espólios.',
    metaTitle: 'Calculadora de Imposto (ITCMD/Estate)',
    metaDescription: 'Planeje os pagamentos e sucessão dos bens.'
  },
  'marriage-tax-calculator': {
    name: 'Imposto / IR em Casamento',
    desc: 'Veja o diferencial sobre as tributações de solteiro ou casal',
    intro: 'A calculadora determina penalidades e bonificações na época da declaração de impostos.',
    metaTitle: 'Calculadora de Imposto Conjunto',
    metaDescription: 'Compare a prestação do imposto entre declarar separado ou junto.'
  },
  'boat-loan-calculator': {
    name: 'Calculadora de Empréstimo de Barco',
    desc: 'Veja parcelas atreladas com custos da lancha ou barco',
    intro: 'Leve em conta as despesas reais mensais.',
    metaTitle: 'Empréstimo Barco / Náutico',
    metaDescription: 'Descubra a parcela exata do crédito e os custos da manutenção de barcos.'
  },
  'debt-consolidation-calculator': {
    name: 'Consolidação de Dívidas',
    desc: 'Agrupe diversos empréstimos com apenas uma fatura',
    intro: 'Veja qual seria o custo consolidado unindo todas os seus cartões de crédito em uma única taxa de juros.',
    metaTitle: 'Calculadora de Consolidação Financeira',
    metaDescription: 'Compare o valor final e veja como consolidar suas faturas e débitos ajudará a sair do aperto.'
  },
  'future-value-calculator': {
    name: 'Calculadora de Valor Futuro',
    desc: 'Variações no fluxo para projeções futuras',
    intro: 'Projete um número sobre a passagem de muito tempo baseando as contas no CAGR.',
    metaTitle: 'Simulador Valor Futuro FV',
    metaDescription: 'O tempo muda tudo. Entenda o impacto a longo prazo sobre o investimento.'
  },
  'average-return-calculator': {
    name: 'Calculadora CAGR',
    desc: 'Variações anuais e de longo prazo de retorno sobre patrimônio',
    intro: 'Calcule retornos realistas nas flutuações das taxas compostas de crescimento.',
    metaTitle: 'Calculadora de Crescimento Anual Composto',
    metaDescription: 'Verifique se o seu crescimento em bolsa condiz com os números médios.'
  },
  'amortization-calculator': {
    name: 'Amortização / Tabela Price / SAC',
    desc: 'Demonstrativo e agenda do saldo ao longo do financiamento',
    intro: 'Faça tabelas perfeitas que exibem quais partes estão indo em direções como principal da dívida e despesas com encargos.',
    metaTitle: 'Amortização de Empréstimos Detalhada',
    metaDescription: 'Faça o balanço preciso do sistema de amortização do seu financiamento com acompanhamento exato.'
  }
};
