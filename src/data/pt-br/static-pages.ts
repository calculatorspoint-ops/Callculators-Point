/**
 * src/data/pt-br/static-pages.ts
 *
 * Brazilian Portuguese content for all static pages:
 * About, Contact, Privacy Policy, Terms of Service, Disclaimer, Cookie Policy.
 */

export const STATIC_PAGES_PT_BR = {

  about: {
    meta: {
      title: 'Sobre Nós — Calculators Point',
      description: 'A Calculators Point foi criada por M. Khurram, engenheiro de software com experiência em fintechs. Nossa missão: calculadoras gratuitas, precisas e que respeitam sua privacidade.',
    },
    hero: {
      title: 'Sobre a Calculators Point',
      subtitle: 'Calculadoras gratuitas, precisas e acessíveis para todos.',
    },
    mission: {
      title: 'Nossa Missão',
      body: 'A Calculators Point nasceu de uma necessidade simples: ferramentas de cálculo profissionais que qualquer pessoa possa usar, sem precisar pagar, sem criar conta e sem comprometer a privacidade. Acreditamos que informação financeira e de saúde de qualidade deve ser acessível a todos — independentemente de renda ou localização.',
    },
    founder: {
      title: 'Quem está por trás do projeto',
      body: 'A Calculators Point foi desenvolvida por M. Khurram, engenheiro de software com experiência em fintechs. Ao perceber que as ferramentas de cálculo disponíveis online eram lentas, cheias de anúncios invasivos ou exigiam cadastro, decidiu construir uma alternativa melhor — rápida, limpa e gratuita.',
    },
    values: {
      title: 'Nossos Valores',
      items: [
        { icon: '🆓', title: 'Sempre Gratuito', body: 'Todas as calculadoras são e sempre serão gratuitas. Sem planos premium, sem paywall, sem cadastro.' },
        { icon: '🔒', title: 'Privacidade em Primeiro Lugar', body: 'Nenhum dado pessoal é armazenado. Os cálculos acontecem no seu dispositivo. Não vendemos informações a terceiros.' },
        { icon: '✅', title: 'Precisão Verificada', body: 'Cada fórmula é revisada por especialistas. Usamos bibliotecas matemáticas de alta precisão para resultados confiáveis.' },
        { icon: '⚡', title: 'Velocidade e Leveza', body: 'O site carrega em menos de 2 segundos. Sem bloatware, sem rastreadores desnecessários. Roda bem até em conexões lentas.' },
      ],
    },
    contact: {
      title: 'Entre em Contato',
      body: 'Tem sugestões, encontrou um erro ou quer propor uma nova calculadora? Ficaremos felizes em ouvir você.',
      email: 'contact@calculatorspoint.com',
      linkLabel: 'Fale Conosco',
    },
  },

  contact: {
    meta: {
      title: 'Fale Conosco — Calculators Point',
      description: 'Entre em contato com a equipe da Calculators Point. Sugestões, erros, parcerias ou dúvidas — respondemos todos.',
    },
    hero: {
      title: 'Fale Conosco',
      subtitle: 'Tem alguma dúvida, sugestão ou encontrou um erro? Mande uma mensagem.',
    },
    form: {
      nameLabel: 'Nome',
      namePlaceholder: 'Seu nome',
      emailLabel: 'E-mail',
      emailPlaceholder: 'seu@email.com',
      subjectLabel: 'Assunto',
      subjectPlaceholder: 'Sobre o que você quer falar?',
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Descreva sua dúvida, sugestão ou problema...',
      submitButton: 'Enviar Mensagem',
      sending: 'Enviando...',
      successTitle: 'Mensagem enviada!',
      successBody: 'Obrigado pelo contato. Responderemos em até 48 horas.',
      errorMessage: 'Erro ao enviar. Tente novamente ou escreva diretamente para contact@calculatorspoint.com',
    },
    directContact: {
      title: 'Contato Direto',
      emailLabel: 'E-mail',
      responseTime: 'Tempo de resposta: até 48 horas',
    },
    topics: {
      title: 'Assuntos Comuns',
      items: [
        'Reportar um erro de cálculo',
        'Sugerir uma nova calculadora',
        'Dúvidas sobre privacidade',
        'Parcerias e colaborações',
        'Outros',
      ],
    },
  },

  privacyPolicy: {
    meta: {
      title: 'Política de Privacidade — Calculators Point',
      description: 'Leia nossa Política de Privacidade. A Calculators Point não armazena dados pessoais. Os cálculos ocorrem no seu dispositivo.',
    },
    title: 'Política de Privacidade',
    lastUpdated: '13 de junho de 2025',
    intro: 'A Calculators Point valoriza sua privacidade. Esta política descreve quais dados coletamos, como os usamos e como protegemos suas informações ao usar nosso site.',
    sections: [
      {
        title: '1. Dados Coletados',
        body: 'A Calculators Point não coleta nem armazena dados pessoais identificáveis. Todas as entradas de calculadoras (pesos, valores, notas, etc.) são processadas exclusivamente no seu dispositivo e nunca enviadas para nossos servidores.',
      },
      {
        title: '2. Cookies e Análise',
        body: 'Usamos cookies essenciais para manter preferências (tema claro/escuro, moeda selecionada). Com seu consentimento, usamos o Google Analytics para entender padrões de uso de forma agregada e anônima. Você pode recusar os cookies de análise e o site continuará funcionando normalmente.',
      },
      {
        title: '3. Publicidade',
        body: 'Exibimos anúncios do Google AdSense para manter o site gratuito. O Google pode usar cookies para personalizar anúncios com base no seu histórico de navegação. Você pode gerenciar preferências de anúncios nas configurações do Google.',
      },
      {
        title: '4. Serviços de Terceiros',
        body: 'Usamos o Firebase (Google) para análises de uso anônimas e o Vercel para hospedagem. Esses serviços têm suas próprias políticas de privacidade.',
      },
      {
        title: '5. Seus Direitos (LGPD)',
        body: 'Nos termos da Lei Geral de Proteção de Dados (LGPD), você tem direito de acessar, corrigir ou solicitar a exclusão de qualquer dado pessoal que eventualmente tenhamos coletado. Entre em contato pelo e-mail abaixo.',
      },
      {
        title: '6. Contato',
        body: 'Para dúvidas sobre esta política, entre em contato: contact@calculatorspoint.com',
      },
    ],
  },

  termsOfService: {
    meta: {
      title: 'Termos de Serviço — Calculators Point',
      description: 'Termos de uso da Calculators Point. Calculadoras gratuitas para fins informativos. Não constituem aconselhamento profissional.',
    },
    title: 'Termos de Serviço',
    lastUpdated: '13 de junho de 2025',
    intro: 'Ao acessar e usar a Calculators Point, você concorda com os termos descritos abaixo. Se não concordar, por favor, não utilize o site.',
    sections: [
      {
        title: '1. Uso Permitido',
        body: 'O site e suas calculadoras são fornecidos gratuitamente para uso pessoal, educacional e informativo. É proibido usar o site para fins ilegais, difamatórios ou que violem direitos de terceiros.',
      },
      {
        title: '2. Precisão das Informações',
        body: 'Nos empenhamos para garantir resultados precisos, mas não garantimos a exatidão, completude ou adequação dos resultados para finalidades específicas. Os resultados são estimativas baseadas nas informações fornecidas pelo usuário.',
      },
      {
        title: '3. Isenção de Responsabilidade',
        body: 'Os resultados das calculadoras são apenas para fins informativos e não substituem aconselhamento profissional de médicos, contadores, advogados ou assessores financeiros certificados. A Calculators Point não se responsabiliza por decisões tomadas com base nos resultados apresentados.',
      },
      {
        title: '4. Propriedade Intelectual',
        body: 'Todo o conteúdo do site — textos, código, layout e design — é propriedade da Calculators Point. É proibida a reprodução sem autorização prévia por escrito.',
      },
      {
        title: '5. Modificações',
        body: 'Reservamos o direito de modificar estes termos a qualquer momento. Mudanças significativas serão comunicadas nesta página com atualização da data.',
      },
    ],
  },

  disclaimer: {
    meta: {
      title: 'Aviso Legal — Calculators Point',
      description: 'Aviso legal da Calculators Point. Resultados são estimativas para fins informativos. Consulte profissionais para decisões importantes.',
    },
    title: 'Aviso Legal',
    lastUpdated: '13 de junho de 2025',
    intro: 'As calculadoras disponíveis na Calculators Point fornecem resultados estimados com base nas informações inseridas pelo usuário. Leia este aviso com atenção.',
    sections: [
      {
        title: 'Aviso Geral',
        body: 'Todos os resultados gerados por nossas calculadoras são estimativas matemáticas para fins informativos e educacionais. Não constituem aconselhamento profissional de qualquer natureza.',
      },
      {
        title: 'Finanças',
        body: 'Os resultados das calculadoras financeiras (juros, financiamentos, investimentos, impostos) são estimativas baseadas nas informações fornecidas. Não constituem aconselhamento financeiro, contábil ou tributário. Consulte um assessor financeiro certificado, contador ou advogado tributarista antes de tomar decisões de investimento, empréstimo ou planejamento fiscal.',
      },
      {
        title: 'Saúde e Bem-estar',
        body: 'Os resultados das calculadoras de saúde (IMC, calorias, TMB, gordura corporal) são estimativas para fins informativos. Não constituem diagnóstico médico nem substituem a orientação de médicos, nutricionistas ou profissionais de saúde registrados.',
      },
      {
        title: 'Educação',
        body: 'As calculadoras de médias e notas são estimativas. Os critérios de aprovação e cálculo variam por instituição. Verifique sempre com sua escola ou universidade.',
      },
      {
        title: 'Construção e Engenharia',
        body: 'As estimativas de materiais e custos de construção são aproximadas. Consulte sempre um engenheiro civil ou arquiteto habilitado para projetos de construção.',
      },
    ],
  },

  cookiePolicy: {
    meta: {
      title: 'Política de Cookies — Calculators Point',
      description: 'Entenda como a Calculators Point usa cookies. Apenas cookies essenciais e de análise com seu consentimento.',
    },
    title: 'Política de Cookies',
    lastUpdated: '13 de junho de 2025',
    intro: 'Este site usa cookies para melhorar sua experiência. Explico aqui o que são, quais usamos e como gerenciá-los.',
    sections: [
      {
        title: 'O que são cookies?',
        body: 'Cookies são pequenos arquivos de texto que um site armazena no seu dispositivo. São usados para lembrar preferências, analisar o uso do site e personalizar conteúdo.',
      },
      {
        title: 'Cookies Essenciais',
        body: 'Esses cookies são necessários para o funcionamento básico do site: manter o tema escolhido (claro/escuro), salvar suas calculadoras favoritas e lembrar preferências de moeda. Não podem ser desativados.',
      },
      {
        title: 'Cookies de Análise',
        body: 'Com seu consentimento, usamos o Google Analytics para entender como os visitantes usam o site — quais calculadoras são mais populares, de onde vêm os usuários, etc. Todos os dados são anônimos e agregados.',
      },
      {
        title: 'Cookies de Publicidade',
        body: 'O Google AdSense pode usar cookies para exibir anúncios relevantes ao seu perfil. Você pode gerenciar preferências de anúncios em myaccount.google.com/data-and-privacy.',
      },
      {
        title: 'Como Gerenciar Cookies',
        body: 'Você pode aceitar ou recusar cookies não essenciais no banner que aparece na sua primeira visita. Também pode gerenciar cookies nas configurações do seu navegador. Recusar cookies de análise não afeta o funcionamento das calculadoras.',
      },
    ],
  },

};
