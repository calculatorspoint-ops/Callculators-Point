import type { PtBrRegistry } from '../index';

export const businessPtBr: PtBrRegistry = {
  'markup-calculator': {
    name: 'Calculadora de Markup',
    desc: 'Calcule o preço de venda a partir do custo e da porcentagem de markup ou calcule a margem inversa',
    intro: 'A Calculadora de Markup determina o preço de venda de um produto a partir do seu custo e de uma porcentagem de markup desejada. Também permite encontrar o markup embutido em um preço.',
    metaTitle: 'Calculadora de Markup — Defina o Preço de Venda Ideal',
    metaDescription: 'Calcule o markup, margem de lucro e preço de venda com facilidade de forma gratuita e transparente.',
    tips: ['Um markup de 50% resulta em uma margem de 33,3% — markup e margem não são a mesma coisa.'],
    howToUse: ['Insira o custo do produto.', 'Insira o percentual de markup.', 'Veja o preço de venda e a margem de lucro resultante.'],
    examples: [
      { scenario: 'Definindo o preço para um produto que custa R$ 42 com um alvo de 65% de markup.', result: 'Preço de Venda = R$ 69,30. Margem de lucro de 39,4%.' }
    ],
    workedExample: {
      title: 'Configurando preço de varejo de um produto a R$ 42 com 65% de markup',
      inputs: ['Preço de Custo: R$ 42,00', 'Markup: 65%'],
      steps: [
        'Preço de Venda = Custo × (1 + Markup/100)',
        'Preço de Venda = R$ 42 × 1,65 = R$ 69,30',
        'Lucro Bruto = R$ 69,30 − R$ 42 = R$ 27,30',
        'Margem de Lucro = R$ 27,30 ÷ R$ 69,30 × 100 = 39,4%'
      ],
      result: 'Preço de venda é R$ 69,30 com lucro bruto de R$ 27,30.'
    },
    about: 'Markup e margem são duas formas diferentes de expressar o mesmo lucro — e confundi-los é um dos erros mais comuns de precificação.',
    whenToUse: 'Ideal para varejistas montando tabela de preços, fabricantes ou prestadores de serviço.',
    resultMeaning: 'O preço de venda assegura que você está cobrindo seus custos e ganhando o lucro alvo.'
  },
  'inventory-turnover-calculator': {
    name: 'Calculadora de Giro de Estoque',
    desc: 'Eficiência sobre fluxo dos estoques na gestão varejista',
    intro: 'Verifique quantas vezes o seu inventário circulou por completo durante o ano todo.',
    metaTitle: 'Calculadora e Indicadores de Giro',
    metaDescription: 'Calcule a velocidade que as suas mercadorias são vendidas no sistema da companhia.'
  },
  'eoq-calculator': {
    name: 'Calculadora EOQ (Lote Econômico)',
    desc: 'Otimização nas decisões dos tamanhos de pedidos e demanda com foco na redução de custos',
    intro: 'Minimize custos descobrindo exatamente qual a quantia ideal das encomendas que deve pedir com o modelo Wilson.',
    metaTitle: 'EOQ: Calculadora de Lote Econômico',
    metaDescription: 'Mensure lotes, pedidos e saiba o reorder point da rede.'
  },
  'time-card-calculator': {
    name: 'Cartão de Ponto / Folha de Horas',
    desc: 'Folha para acompanhar o quadro semanal do time',
    intro: 'Converta horas, deduzindo os tempos de repousos ou refeições da sua jornada.',
    metaTitle: 'Calculadora do Cartão de Ponto (Timesheet)',
    metaDescription: 'Registre, calcule e gerencie os horários dos trabalhadores da equipe.'
  },
  'overtime-calculator': {
    name: 'Calculadora de Horas Extras',
    desc: 'Contabilidade do excesso da jornada com adicionais de pagamentos ou percentual de folga',
    intro: 'Entenda os valores devidos para pagamentos sobre trabalho prestado excedendo limites da jornada de horários.',
    metaTitle: 'Calculadora Pessoal de Horas Extras',
    metaDescription: 'Verifique o montante financeiro da sua remuneração de jornada.'
  },
  'salary-to-hourly-calculator': {
    name: 'Salário x Hora de Trabalho',
    desc: 'Desdobramento do recebível conforme sua base semanal/mensal para tarifa horária correspondente',
    intro: 'Mude da visão mensal total para o rendimento específico recebido em horas diárias de labor.',
    metaTitle: 'Conversor de Salário Fixo para Rendimento-Hora',
    metaDescription: 'Conecte seu salário ao seu tempo, compreendendo os limites na precificação dos afazeres.'
  },
  'meeting-cost-calculator': {
    name: 'Custo da Reunião',
    desc: 'Verifique quanto cada minuto na reunião custa a empresa',
    intro: 'Traga consciência aos valores intrínsecos no tempo parado para discutir pautas.',
    metaTitle: 'Analista de Custos de Reunião',
    metaDescription: 'Descubra qual a verdadeira conta sobre as reuniões desnecessárias do time corporativo.'
  },
  'conversion-rate-calculator': {
    name: 'Taxa de Conversão Digital',
    desc: 'Avalie performance em publicidades convertendo cliques aos resultados estipulados no marketing',
    intro: 'Entenda perfeitamente o volume do fluxo necessário nos canais frente os negócios fechados.',
    metaTitle: 'Calculadora da Taxa de Conversão (CR)',
    metaDescription: 'Obtenha visão dos dados da conversão da suas campanhas, websites e portais.'
  },
  'customer-lifetime-value-calculator': {
    name: 'LTV (Lifetime Value)',
    desc: 'Tempo e vida útil na monetização ao fidelizar consumidores à sua jornada de aquisições',
    intro: 'O LTV expressa sua renda projetada sob totalidade contínua no engajamento por indivíduo das carteiras do público.',
    metaTitle: 'Calculadora LTV/CAC - Retorno de Assinantes',
    metaDescription: 'Avalie investimentos na base da receita proveniente sobre vida e manutenção contínua aos clientes fiéis.'
  },
  'cpc-cpa-calculator': {
    name: 'Custo por Clique/Ação',
    desc: 'Auditoria de mídia paga e retorno do tráfego nas conversões digitais',
    intro: 'Cheque a margem correta para lances em leilões focados na eficiência na hora das aquisições e publicidade.',
    metaTitle: 'Calculadora Ad/CPC/CPA e ROAS',
    metaDescription: 'Examine e acompanhe o ROI/ROAS no ecossistema e redes das suas campanhas (Ads).'
  },
  'employee-cost-calculator': {
    name: 'Folha de Pagamento',
    desc: 'Custos atrelados indiretamente ou de maneira direta ao contratar',
    intro: 'Conheça o multiplicador total nos encargos aos novos empregados.',
    metaTitle: 'Calculadora Geral do Custo Trabalhista (CLT)',
    metaDescription: 'Mapeie o montante que a contratação exigirá.'
  }
};
