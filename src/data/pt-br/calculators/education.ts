import type { PtBrRegistry } from '../index';

export const educationPtBr: PtBrRegistry = {
  'gpa-calculator': {
    name: 'Calculadora de Média / IRA',
    desc: 'Calcule o seu Índice de Rendimento Acadêmico ponderado e preveja cenários',
    intro: 'A Calculadora de Média (GPA / IRA) calcula sua média ponderada usando pontos e créditos. Insira quantas matérias desejar, veja sua situação instantaneamente e simule cenários para descobrir exatamente quais notas você precisa para atingir o seu alvo.',
    metaTitle: 'Calculadora de Média e IRA Online Grátis',
    metaDescription: 'Calcule o seu IRA e médias escolares. Suporta escalas personalizadas. Monitore seu rendimento acadêmico.',
    tips: [
      'Aumentar a nota de uma matéria com muitos créditos impacta muito mais a sua média geral.',
      'A maioria dos programas de pós-graduação exige médias altas; muitas vezes focam no seu histórico.',
    ],
    workedExample: {
      title: 'Calculando a média do semestre para um universitário',
      inputs: [
        'Cálculo II — 4 créditos, nota 8,0',
        'Física Geral — 3 créditos, nota 7,0',
        'História 101 — 3 créditos, nota 9,0',
      ],
      steps: [
        'Pontos por curso: Cálculo = 4 × 8,0 = 32,0 | Física = 3 × 7,0 = 21,0 | História = 3 × 9,0 = 27,0',
        'Total de pontos de qualidade = 32,0 + 21,0 + 27,0 = 80,0',
        'Total de horas de crédito = 4 + 3 + 3 = 10',
        'IRA = 80,0 ÷ 10 = 8,0',
      ],
      result: 'Sua média é 8,0. Muito bom para manter uma bolsa de estudos.'
    },
    about: 'O GPA (Grade Point Average) ou IRA (Índice de Rendimento Acadêmico) é a medida mais amplamente usada de desempenho acadêmico em universidades. Ele pondera cada curso pelas horas de crédito, significando que um curso de 4 créditos tem mais influência do que uma eletiva de 1 crédito no seu número final.\n\nEsta calculadora lida com várias escalas. Adicione cursos, ajuste notas, e a média ponderada é atualizada instantaneamente.\n\nO simulador de cenários é mais útil antes das provas finais: deixe a nota de um curso em branco ou defina-a para o seu alvo, e a calculadora resolve o impacto. Útil para decidir quanto esforço colocar em cada curso restante.'
  },
  'marks-percentage-calculator': {
    name: 'Calculadora de Porcentagem de Notas',
    desc: 'Porcentagem de múltiplas disciplinas, com modo reverso',
    intro: 'A Calculadora de Porcentagem converte as pontuações brutas para uma porcentagem. Lida com exames de várias disciplinas, mostra análises por disciplina e inclui um modo reverso para encontrar as notas necessárias para uma porcentagem desejada.',
    metaTitle: 'Calculadora de Porcentagem de Notas Online',
    metaDescription: 'Converta suas notas em porcentagem instantaneamente. Suporte multi-disciplinas e modo reverso.',
    tips: [
      'Use o Modo Reverso para descobrir quantos pontos você precisa para atingir uma porcentagem alvo.'
    ],
    workedExample: {
      title: 'Calculando a porcentagem geral',
      inputs: [
        'Inglês: 78 / 100',
        'Matemática: 91 / 100',
      ],
      steps: [
        'Total obtido = 78 + 91 = 169',
        'Total máximo = 200',
        'Porcentagem = (169 / 200) × 100 = 84,5%',
      ],
      result: '84,5% geral.'
    },
    about: 'Converter notas para porcentagem parece simples, mas exames de várias disciplinas com diferentes notas máximas confundem muitos estudantes. Você precisa somar os numeradores e os denominadores primeiro antes de dividir.'
  },
  'attendance-calculator': {
    name: 'Calculadora de Frequência Escolar',
    desc: 'Planejador de faltas, limites e alertas de frequência',
    intro: 'A Calculadora de Frequência informa sua porcentagem de presenças e quantas aulas você pode faltar com segurança antes de cair abaixo do limite mínimo da sua universidade.',
    metaTitle: 'Calculadora de Faltas e Frequência',
    metaDescription: 'Calcule sua porcentagem de faltas e saiba quantas você ainda pode ter.'
  },
  'final-grade-calculator': {
    name: 'Calculadora de Nota Final',
    desc: 'Calcula notas finais baseada em pesos',
    intro: 'Calcula a sua nota ponderada do curso a partir de trabalhos e provas.',
    metaTitle: 'Calculadora de Nota Ponderada',
    metaDescription: 'Descubra quanto você precisa tirar na prova final.'
  },
  'cgpa-percentage-calculator': {
    name: 'Conversor de CGPA',
    desc: 'Converte CGPA para porcentagem',
    intro: 'Converte a sua média global em porcentagem.',
    metaTitle: 'Conversor de CGPA para Porcentagem',
    metaDescription: 'Altere seu CGPA em formato de porcentagem rapidamente.'
  },
  'ielts-band-calculator': {
    name: 'Calculadora IELTS',
    desc: 'Calcula o seu Band Score',
    intro: 'Calcula o Band Score geral do seu IELTS.',
    metaTitle: 'Calculadora de Pontuação IELTS',
    metaDescription: 'Simule a sua pontuação IELTS.'
  },
  'sat-score-calculator': {
    name: 'Calculadora de Pontuação SAT',
    desc: 'Simula pontuação no SAT',
    intro: 'Converta suas pontuações de seção do SAT.',
    metaTitle: 'Calculadora SAT Online',
    metaDescription: 'Calcule suas chances e notas do SAT.'
  },
  'study-timer': {
    name: 'Cronômetro Pomodoro',
    desc: 'Cronômetro para focar nos estudos',
    intro: 'Use a Técnica Pomodoro para estudar de forma mais eficiente.',
    metaTitle: 'Cronômetro de Estudo Pomodoro',
    metaDescription: 'Temporizador online para estudos.'
  },
  'target-gpa-calculator': {
    name: 'Calculadora de Média Alvo',
    desc: 'Descubra a média necessária no futuro',
    intro: 'Determina qual nota você precisa nos próximos semestres para se formar com a nota alvo.',
    metaTitle: 'Calculadora de Média Alvo',
    metaDescription: 'Planeje o seu IRA futuro.'
  },
  'required-grade-calculator': {
    name: 'Nota Necessária',
    desc: 'A nota necessária para passar',
    intro: 'Veja quanto você precisa tirar na próxima prova.',
    metaTitle: 'Calculadora de Nota Necessária',
    metaDescription: 'Calcule de forma rápida e grátis quanto falta.'
  },
  'weighted-grade-calculator': {
    name: 'Calculadora Ponderada',
    desc: 'Médias ponderadas',
    intro: 'Média de provas com pesos diferentes.',
    metaTitle: 'Calculadora de Média Ponderada',
    metaDescription: 'Calcule as suas médias.'
  },
  'gre-score-calculator': {
    name: 'Calculadora GRE',
    desc: 'Pontuação GRE e percentil',
    intro: 'Converte suas notas de seção para escala oficial.',
    metaTitle: 'Calculadora de Pontuação GRE',
    metaDescription: 'Preveja as suas notas no GRE.'
  },
  'toefl-score-calculator': {
    name: 'Calculadora TOEFL',
    desc: 'Descubra seu total no TOEFL',
    intro: 'Totaliza as seções do TOEFL e mostra o equivalente do IELTS.',
    metaTitle: 'Calculadora de Notas do TOEFL',
    metaDescription: 'Encontre suas pontuações do TOEFL.'
  },
  'scholarship-gpa-planner': {
    name: 'Calculadora para Bolsa de Estudos',
    desc: 'Mapa para manter a bolsa',
    intro: 'Calcula quanto você precisa para não perder sua bolsa.',
    metaTitle: 'Calculadora de Bolsa (IRA)',
    metaDescription: 'Monitore sua média para bolsa de estudos.'
  },
  'assignment-grade-calculator': {
    name: 'Calculadora de Trabalhos',
    desc: 'Impacto dos trabalhos na nota',
    intro: 'Monitora os componentes do curso.',
    metaTitle: 'Calculadora de Notas de Trabalhos',
    metaDescription: 'Gerencie o peso das suas atividades.'
  },
  'cumulative-gpa-calculator': {
    name: 'Média Acumulada',
    desc: 'IRA ao longo de vários semestres',
    intro: 'Soma as notas de vários semestres.',
    metaTitle: 'Calculadora de IRA Acumulado',
    metaDescription: 'Descubra seu IRA de todos os períodos.'
  },
  'act-score-calculator': {
    name: 'Calculadora ACT',
    desc: 'Nota do exame ACT',
    intro: 'Converte as seções para formar a nota do ACT.',
    metaTitle: 'Calculadora do ACT',
    metaDescription: 'Verifique os resultados do ACT.'
  },
  'test-score-calculator': {
    name: 'Calculadora de Provas',
    desc: 'Nota e porcentagem',
    intro: 'Mostra o desempenho de provas.',
    metaTitle: 'Simulador de Notas',
    metaDescription: 'Veja a sua nota na prova.'
  },
  'gpa-converter': {
    name: 'Conversor Internacional de GPA',
    desc: 'Converta de uma escala para outra',
    intro: 'Transforme escalas internacionais em locais.',
    metaTitle: 'Conversor de Notas GPA',
    metaDescription: 'Mude a escala do seu desempenho escolar.'
  },
  'class-rank-calculator': {
    name: 'Ranking da Turma',
    desc: 'Estime sua colocação',
    intro: 'Qual a sua posição comparada com os alunos.',
    metaTitle: 'Calculadora de Posição em Sala',
    metaDescription: 'Você é um dos melhores da sala?'
  },
  'study-schedule-planner': {
    name: 'Gerador de Cronograma',
    desc: 'Crie seu cronograma',
    intro: 'Horas de estudo para as provas.',
    metaTitle: 'Cronograma de Estudos Automático',
    metaDescription: 'Monte seu plano de estudos diário.'
  },
  'gmat-score-calculator': {
    name: 'Calculadora GMAT',
    desc: 'Pontuações do GMAT',
    intro: 'Converte notas em pontos do GMAT.',
    metaTitle: 'Calculadora de Nota GMAT',
    metaDescription: 'Encontre seu percentil GMAT.'
  },
  'pass-fail-calculator': {
    name: 'Calculadora de Aprovação',
    desc: 'O que falta para passar',
    intro: 'Se você passou ou reprovou.',
    metaTitle: 'O que falta para passar',
    metaDescription: 'Veja as suas chances de passar na disciplina.'
  },
  'reading-level-calculator': {
    name: 'Nível de Leitura',
    desc: 'Facilidade de leitura do texto',
    intro: 'Aplica fórmulas para ver a dificuldade.',
    metaTitle: 'Análise de Texto',
    metaDescription: 'Entenda a complexidade da sua escrita.'
  },
  'college-admission-estimator': {
    name: 'Estimativa de Admissão',
    desc: 'Chances na universidade',
    intro: 'Fornece uma chance geral na faculdade.',
    metaTitle: 'Simulador Universitário',
    metaDescription: 'Quais as minhas chances de passar?'
  }
};
