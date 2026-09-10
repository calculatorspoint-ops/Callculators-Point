import type { PtBrRegistry } from '../index';

export const healthPtBr: PtBrRegistry = {
  'bmi-calculator': {
    name: 'Calculadora de IMC',
    desc: 'IMC com classificação OMS, peso ideal e estimativa de gordura corporal',
    intro: 'O IMC (Índice de Massa Corporal) é uma ferramenta de triagem amplamente utilizada que relaciona o seu peso à sua altura para estimar se você está dentro de uma faixa de peso saudável. Esta calculadora aplica o sistema de classificação da OMS, fornecendo sua pontuação numérica e a categoria de risco à saúde associada. É útil para adultos que acompanham a saúde do peso, embora funcione melhor em conjunto com outras medidas, como circunferência da cintura ou porcentagem de gordura corporal.',
    metaTitle: 'Calculadora de IMC — Índice de Massa Corporal Online Grátis',
    metaDescription: 'Calcule seu IMC com a classificação da OMS, faixa de peso ideal e estimativa de gordura corporal. Grátis e preciso.',
    tips: [
      'O IMC não distingue entre músculos e gordura. Indivíduos muito musculosos podem ser classificados como "sobrepeso" apesar de terem baixa gordura corporal.'
    ],
    howToUse: [
      'Selecione o seu sistema de medição preferido.',
      'Insira o seu peso atual.',
      'Insira a sua altura.',
      'Veja instantaneamente o seu IMC, categoria da OMS e faixa de peso ideal.'
    ],
    examples: [
      { scenario: 'Uma pessoa que tem 1,75m de altura e pesa 70kg.', result: 'Seu IMC é 22,9, o que está diretamente na categoria de "Peso Normal".' },
      { scenario: 'A mesma pessoa ganha 15kg de músculo.', result: 'Seu IMC salta para 27,8, classificando-a como "Sobrepeso", embora esteja mais saudável.' }
    ],
    limitations: [
      'O IMC não pode distinguir entre massa muscular e massa gorda. Fisiculturistas frequentemente pontuam como "Obesos".',
      'Não leva em conta idade, densidade óssea ou como a gordura é distribuída (gordura visceral vs subcutânea).'
    ],
    workedExample: { 
      title: 'Calculando o IMC para uma mulher de 35 anos', 
      inputs: ['Peso: 68 kg', 'Altura: 1,65 m'], 
      steps: [
        'Eleve a altura ao quadrado: 1,65 × 1,65 = 2,7225 m²',
        'Divida o peso pela altura ao quadrado: 68 ÷ 2,7225 = 24,98',
        'Arredonde para um decimal: IMC = 25,0',
        'Categoria OMS: Sobrepeso (25,0–29,9) — no limite, logo acima do Normal'
      ], 
      result: 'Um IMC de 25,0 coloca este indivíduo no limite superior do peso normal. Uma redução de 1–2 kg a moveria para a faixa Normal (18,5–24,9).' 
    },
    about: 'O Índice de Massa Corporal foi desenvolvido na década de 1830 pelo matemático Adolphe Quetelet como uma ferramenta estatística em nível populacional — não como um diagnóstico para indivíduos. Apesar disso, tornou-se um padrão clínico porque requer apenas uma balança e uma fita métrica, tornando-o acessível em todos os lugares, de clínicas ao uso doméstico.\n\nOs limites de classificação da OMS são baseados em estudos em nível populacional de risco cardiovascular e metabólico. Eles são um ponto de partida útil, mas não levam em conta massa muscular, densidade óssea, idade ou como a gordura é distribuída.\n\nUse o resultado do seu IMC como um dado entre vários. Combiná-lo com a circunferência da cintura e a porcentagem de gordura corporal oferece uma imagem muito mais completa da sua saúde metabólica.',
    whenToUse: 'Use esta calculadora como uma ferramenta de triagem inicial rápida para determinar se o seu peso se enquadra em uma faixa saudável para a sua altura, de acordo com a Organização Mundial da Saúde.',
    resultMeaning: 'A pontuação do seu IMC coloca você em uma categoria (Abaixo do Peso, Normal, Sobrepeso ou Obeso). Os resultados indicam o seu risco estatístico de doenças relacionadas ao peso.',
  },
  'calorie-calculator': {
    name: 'Calculadora de Calorias / TDEE',
    desc: 'TDEE com metas, fórmulas, macros e projeção semanal de peso',
    intro: 'Esta calculadora de calorias calcula o seu Gasto Energético Diário Total (TDEE) usando a fórmula de Mifflin-St Jeor ou Harris-Benedict, e depois o ajusta para a sua meta específica — seja para perder gordura, manter o peso ou construir músculos. Junto com sua meta de calorias, ela divide as proporções de macronutrientes e mostra uma mudança de peso semanal projetada.',
    metaTitle: 'Calculadora de Calorias – TDEE, Metas de Peso e Macros',
    metaDescription: 'Calcule suas necessidades diárias de calorias com base no TDEE, nível de atividade e meta de peso. Obtenha metas de macros. Grátis e preciso.',
    tips: [
      'O Gasto Energético Diário Total (TDEE) é o número total de calorias que você queima por dia, incluindo a taxa metabólica basal e a atividade física.'
    ],
    workedExample: {
      title: 'Encontrando calorias diárias para um homem de 28 anos com o objetivo de perder gordura',
      inputs: ['Idade: 28', 'Sexo: Masculino', 'Peso: 85 kg', 'Altura: 178 cm', 'Atividade: Moderadamente ativo', 'Meta: Perder 0,5 kg/semana'],
      steps: [
        'Calcular a TMB (Mifflin-St Jeor, masculino): (10 × 85) + (6,25 × 178) − (5 × 28) + 5 = 1.827,5 kcal',
        'Aplicar o multiplicador de atividade (1,55 para moderadamente ativo): 1827,5 × 1,55 = 2.833 kcal (TDEE)',
        'Subtrair 500 kcal/dia para a meta de perda de 0,5 kg/semana: 2.833 − 500 = 2.333 kcal/dia',
        'Divisão de macros (40% proteína, 30% carboidratos, 30% gordura): Proteína = 233 g; Carboidratos = 175 g; Gordura = 78 g'
      ],
      result: 'Meta diária: 2.333 kcal com aproximadamente 233 g de proteína, 175 g de carboidratos e 78 g de gordura.'
    },
    about: 'Suas necessidades calóricas mudam constantemente com base na idade, massa muscular, níveis de estresse e o quanto você se move. A estrutura do TDEE fornece um ponto de partida personalizado que é muito mais preciso do que o conselho genérico de "coma 2.000 calorias".\n\nEsta calculadora oferece duas fórmulas de TMB. Mifflin-St Jeor é o padrão clínico atual e tende a ser mais precisa. Harris-Benedict pode superestimar em 5–10%.\n\nA partir do seu TDEE, um déficit gera perda de gordura e um superávit apoia o ganho muscular.'
  },
  'bmr-calculator': {
    name: 'Calculadora de Taxa Metabólica Basal (TMB)',
    desc: 'Fórmulas Mifflin e Harris-Benedict com TDEE em 5 níveis de atividade',
    intro: 'A sua Taxa Metabólica Basal (TMB) é o número de calorias que o seu corpo queima em repouso completo — a energia mínima necessária para manter o coração batendo e os órgãos funcionando. Esta calculadora calcula a sua TMB usando as equações de Mifflin-St Jeor e Harris-Benedict lado a lado, e então projeta o seu TDEE em cinco níveis de atividade.',
    metaTitle: 'Calculadora de TMB – Taxa Metabólica Basal Online',
    metaDescription: 'Calcule a sua Taxa Metabólica Basal (TMB). Veja o TDEE em todos os níveis de atividade. Grátis e preciso.',
    tips: [
      'Mifflin-St Jeor é considerada a fórmula de TMB mais precisa.',
      'A TMB é responsável por 60-75% das calorias diárias totais.'
    ],
    workedExample: {
      title: 'TMB e TDEE para uma mulher de 42 anos',
      inputs: ['Idade: 42', 'Sexo: Feminino', 'Peso: 72 kg', 'Altura: 163 cm'],
      steps: [
        'Mifflin-St Jeor (feminino): 1.367,75 kcal/dia',
        'Harris-Benedict (feminino): 1.448,7 kcal/dia',
        'TDEE ligeiramente ativo: Mifflin = 1.880 kcal | Harris-Benedict = 1.992 kcal'
      ],
      result: 'A TMB é de aproximadamente 1.368–1.449 kcal. Em um nível ligeiramente ativo, ela precisa de cerca de 1.880–1.990 kcal/dia.'
    },
    about: 'A TMB representa a maior parte do seu gasto total de energia. A equação de Mifflin-St Jeor é considerada o padrão ouro atual. Ambas as fórmulas usam apenas altura, peso, idade e sexo — portanto, não consideram a proporção de músculo para gordura.'
  },
  'body-fat-calculator': {
    name: 'Calculadora de Gordura Corporal',
    desc: 'Porcentagem de gordura usando o método da Marinha dos EUA',
    intro: 'Esta calculadora usa o método da circunferência da Marinha dos EUA, que estima a porcentagem de gordura corporal a partir das medidas do pescoço, cintura e quadril.',
    metaTitle: 'Calculadora de Gordura Corporal Online',
    metaDescription: 'Estime sua porcentagem de gordura corporal. Grátis e preciso.'
  },
  'ideal-weight-calculator': {
    name: 'Calculadora de Peso Ideal',
    desc: 'Comparação de 4 fórmulas: Devine, Miller, Robinson e Hamwi',
    intro: 'Não existe uma definição única de "peso ideal". Esta calculadora mostra seu peso ideal usando quatro fórmulas estabelecidas.',
    metaTitle: 'Calculadora de Peso Ideal',
    metaDescription: 'Encontre o seu peso ideal usando as fórmulas de Devine, Miller, Robinson e Hamwi.'
  },
  'macro-calculator': {
    name: 'Calculadora de Macros',
    desc: 'Metas de proteína/carboidrato/gordura por objetivo',
    intro: 'Esta calculadora de macros determina as suas metas ideais diárias de proteína, carboidrato e gordura com base na sua meta de calorias.',
    metaTitle: 'Calculadora de Macros Diários',
    metaDescription: 'Calcule suas necessidades de macronutrientes para perder gordura ou ganhar massa.'
  },
  'water-intake-calculator': {
    name: 'Calculadora de Hidratação Diária',
    desc: 'Necessidades diárias de água por peso e atividade',
    intro: 'A sua necessidade diária de água muda de acordo com seu peso corporal, exercícios e clima. Descubra sua meta.',
    metaTitle: 'Calculadora de Hidratação',
    metaDescription: 'Descubra quanta água você deve beber por dia.'
  },
  'heart-rate-calculator': {
    name: 'Zonas de Frequência Cardíaca',
    desc: '5 zonas de treino usando a fórmula de Karvonen',
    intro: 'Use as zonas de frequência cardíaca para focar o seu treino aeróbico ou queima de gordura.',
    metaTitle: 'Calculadora de Zonas Cardíacas',
    metaDescription: 'Calcule as zonas de treinamento para os seus exercícios.'
  },
  'pregnancy-due-date': {
    name: 'Calculadora de Semanas de Gravidez',
    desc: 'Data provável do parto via Regra de Naegele',
    intro: 'Esta calculadora estima a data prevista do parto usando a Regra de Naegele e a sua última menstruação.',
    metaTitle: 'Calculadora de Gravidez e Parto',
    metaDescription: 'Descubra a data provável do seu parto e acompanhe os marcos da gravidez.'
  },
  'one-rep-max-calculator': {
    name: 'Cálculo de 1RM',
    desc: 'Estime o 1RM através de 3 fórmulas',
    intro: 'O seu One Rep Max (1RM) é o peso máximo que você consegue levantar em uma única repetição.',
    metaTitle: 'Calculadora de Repetição Máxima (1RM)',
    metaDescription: 'Calcule sua carga máxima para um exercício.'
  },
  'period-calculator': {
    name: 'Calculadora de Menstruação',
    desc: 'Previsão de ciclo com janela fértil',
    intro: 'Prevê suas futuras menstruações, identifica a ovulação e os dias férteis.',
    metaTitle: 'Calculadora do Ciclo Menstrual',
    metaDescription: 'Saiba quando será sua próxima menstruação.'
  },
  'ovulation-calculator': {
    name: 'Calculadora de Ovulação',
    desc: 'Preveja a ovulação e a janela fértil',
    intro: 'A ovulação é a liberação de um óvulo. Saiba seus melhores dias.',
    metaTitle: 'Calculadora de Período Fértil',
    metaDescription: 'Descubra os dias mais prováveis para engravidar.'
  },
  'fertility-window-calculator': {
    name: 'Calculadora de Janela Fértil',
    desc: 'Dias férteis para planejamento',
    intro: 'Identifique os seus dias exatos férteis para aumentar as chances de concepção.',
    metaTitle: 'Dias Férteis - Calculadora',
    metaDescription: 'Saiba os dias em que você pode engravidar.'
  },
  'implantation-calculator': {
    name: 'Calculadora de Nidação',
    desc: 'Quando o óvulo se fixa no útero',
    intro: 'Estime a janela de nidação com base na sua data de ovulação.',
    metaTitle: 'Calculadora de Implantação / Nidação',
    metaDescription: 'Descubra a possível data da nidação na gravidez.'
  },
  'sleep-calculator': {
    name: 'Calculadora de Sono',
    desc: 'Ciclos de sono de 90 minutos',
    intro: 'Acorde sentindo-se revigorado calculando seus ciclos de sono.',
    metaTitle: 'Calculadora de Ciclo de Sono',
    metaDescription: 'Descubra a melhor hora para dormir e acordar.'
  },
  'calories-burned-calculator': {
    name: 'Calorias Queimadas',
    desc: 'Calorias queimadas por 30+ exercícios',
    intro: 'Veja a estimativa de gasto calórico de várias atividades.',
    metaTitle: 'Calculadora de Calorias de Exercícios',
    metaDescription: 'Saiba quantas calorias você gasta no treino.'
  },
  'body-type-calculator': {
    name: 'Calculadora de Biotipo',
    desc: 'Descubra seu somatotipo',
    intro: 'Identifique se você é mais ectomorfo, mesomorfo ou endomorfo.',
    metaTitle: 'Teste de Biotipo Corporal',
    metaDescription: 'Faça o teste do seu biotipo e saiba como treinar.'
  },
  'gfr-calculator': {
    name: 'Calculadora TFG',
    desc: 'Taxa de Filtração Glomerular',
    intro: 'Calcula a TFG para avaliar a função renal.',
    metaTitle: 'Calculadora da Taxa de Filtração Glomerular',
    metaDescription: 'Avalie sua função renal online.'
  },
  'bsa-calculator': {
    name: 'Área de Superfície Corporal',
    desc: 'ASC para dosagem médica',
    intro: 'A Área de Superfície Corporal (ASC) é usada para dosagem clínica.',
    metaTitle: 'Calculadora de Superfície Corporal (ASC)',
    metaDescription: 'Calcule a sua ASC usando várias fórmulas.'
  },
  'bac-calculator': {
    name: 'Calculadora de Álcool no Sangue',
    desc: 'Teor de álcool e limite legal',
    intro: 'Estime o teor de álcool no sangue (TAS) com base nas bebidas ingeridas.',
    metaTitle: 'Calculadora de Alcoolemia',
    metaDescription: 'Saiba seu nível de álcool no sangue.'
  },
  'lean-body-mass-calculator': {
    name: 'Massa Corporal Magra',
    desc: 'Massa muscular usando diferentes fórmulas',
    intro: 'A massa magra é tudo em seu corpo que não é gordura.',
    metaTitle: 'Calculadora de Massa Magra',
    metaDescription: 'Veja quanta massa magra você possui.'
  },
  'protein-calculator': {
    name: 'Calculadora de Proteínas',
    desc: 'Necessidades diárias de proteína',
    intro: 'Calcule quantos gramas de proteína você deve ingerir por dia.',
    metaTitle: 'Calculadora de Ingestão de Proteínas',
    metaDescription: 'Atinga a quantidade de proteína certa para seus músculos.'
  },
  'healthy-weight-calculator': {
    name: 'Calculadora de Peso Saudável',
    desc: 'Faixa de peso saudável baseada no IMC',
    intro: 'Identifique sua faixa de peso saudável.',
    metaTitle: 'Faixa de Peso Saudável',
    metaDescription: 'Veja qual seria o seu peso saudável.'
  }
};
