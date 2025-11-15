export default {
  title: 'APP',
  createApplication: 'Criar APP',
  importApplication: 'Importar APP',
  copyApplication: 'Copiar APP',
  workflow: 'FLUXO DE TRABALHO',
  simple: 'SIMPLES',
  aiCreate: {
    button: 'Crie com IA',
    dialogTitle: 'Criação de aplicativos de IA',
    description: 'Um espaço de trabalho em tela cheia para criação de aplicativos assistidos por IA (em breve).',
    inputPlaceholder: 'Descreva sua meta de negócios ou base de conhecimento para que a IA possa criar a configuração do aplicativo',
    submit: 'Enviar',
    submitSuccess: 'Solicitação recebida. A experiência de criação de IA chegará em breve.',
    comingSoon: 'A criação de IA está em desenvolvimento ativo. Uma experiência completa estará disponível em breve.',
    templateIntro: 'Comece escolhendo um modelo abaixo para que a IA saiba como estruturar seu aplicativo.',
    templateListTitle: 'Escolha um modelo para começar',
    templateEmpty: 'Nenhum modelo disponível ainda. Faça upload de um nas configurações do sistema.',
    templateDefaultDesc: 'Use este modelo como base para seu aplicativo de IA.',
    templateSelected: 'Vamos construir com o modelo {name}.',
    templateConfirm: '{name} modelo bloqueado. Diga-me qual experiência você deseja construir a seguir.',
    templateLoadFailed: 'Falha ao carregar modelos. Por favor, tente novamente mais tarde.',
    templateRequired: 'Selecione um modelo antes de enviar os requisitos.',
    templateMissingPath: 'Este modelo não tem um caminho de download. Entre em contato com o administrador.',
    templateFetchFailed: 'Falha ao baixar o modelo. Por favor, tente novamente.',
    templateFetchFailedMessage: 'O download de {name} falhou. Tente novamente ou escolha outro modelo.',
    templateLoading: 'Carregando modelo...',
    templateNotReady: 'O processamento do modelo ainda está em andamento. Por favor, espere um momento.',
    templateImportSuccess: '{name} modelo importado. Descreva o que você deseja construir a seguir.',
    templateImportFailed: 'Falha na importação do modelo. Por favor, tente novamente mais tarde.',
    datasetReminderTitle: 'Atenção',
    datasetReminder: 'Crie e configure primeiro uma base de conhecimento para que o aplicativo possa responder às perguntas dos usuários de maneira adequada.',
    applicationListTitle: 'Aplicativos domésticos (6 primeiros)',
    applicationListEmpty: 'Nenhum aplicativo ainda. Atualize mais tarde para ver os novos.',
    applicationListNoDesc: 'Nenhuma descrição fornecida.',
    appNamePrompt: 'Abrindo {name}. Configure o nome do APP no fluxo de trabalho Informações básicas.',
    appNameInstruction: 'Você está focando em {workflowPath}. Digite o nome do APP aqui para continuar.',
    appNamePlaceholder: 'Insira um novo nome de APP',
    appNameConfirm: 'Salvar nome',
    appNameRequired: 'Insira um nome de aplicativo primeiro.',
    appNameSuccess: '{name} foi atualizado.',
    appNameFailed: 'Falha ao salvar o nome do aplicativo. Tente novamente mais tarde.',
    appNameFetchFailed: 'Não foi possível carregar os detalhes do aplicativo. Por favor, tente novamente.',
    appNameSetMessage: 'Nome do APP salvo. Continue configurando o restante do fluxo de trabalho.',
    appDetailFailed: 'Falha ao carregar as configurações do aplicativo. Por favor, tente novamente mais tarde.',
    workflowListTitle: 'Nós de fluxo de trabalho',
    baseNodeTitle: 'Configurações do nó base',
    baseNodeNameLabel: 'Nome do assistente',
    baseNodeNamePlaceholder: 'Digite o nome do assistente',
    baseNodeEmailLabel: 'E-mail de contato',
    baseNodeEmailPlaceholder: 'Digite o e-mail do assistente (opcional)',
    baseNodePrologueLabel: 'Prólogo',
    baseNodeProloguePlaceholder: 'Descreva a mensagem de boas-vindas que os usuários verão',
    baseNodeSubmit: 'Salvar nó base',
    baseNodeNameRequired: 'O nome do assistente é obrigatório.',
    baseNodeAppNameRequired: 'Defina primeiro o nome do aplicativo e depois salve o nó base.',
    baseNodeEmailRequired: 'O e-mail de contato é obrigatório.',
    baseNodeFetchFailed: 'Não foi possível carregar o nó base. Por favor, tente novamente.',
    baseNodeMissing: 'Nó base não encontrado. Verifique a configuração do fluxo de trabalho.',
    baseNodeSuccess: 'Nó base atualizado com sucesso.',
    baseNodeFailed: 'Falha ao salvar o nó base.',
    baseNodeSetMessage: '{name} nó base atualizado. Continue configurando o fluxo de trabalho.',
    datasetForm: {
      title: 'Crie uma base de conhecimento',
      tip: 'Ainda não há conjunto de dados? Crie um rapidamente aqui antes de continuar a configuração do seu aplicativo.',
      createButton: 'Salvar configurações',
      nameLabel: 'Nome do conjunto de dados',
      namePlaceholder: 'Insira um nome de conjunto de dados',
      descLabel: 'Descrição',
      descPlaceholder: 'Descreva o que esta base de conhecimento armazena',
      typeLabel: 'Tipo de conjunto de dados',
      typeGeneral: 'Conjunto de dados geral',
      typeWeb: 'Conjunto de dados da web',
      embeddingLabel: 'Modelo de incorporação',
      embeddingPlaceholder: 'Selecione um modelo de incorporação',
      refreshEmbedding: 'Atualizar modelos',
      submit: 'Criar conjunto de dados',
      nameRequired: 'O nome do conjunto de dados é obrigatório.',
      descRequired: 'A descrição é obrigatória.',
      embeddingRequired: 'Escolha um modelo de incorporação.',
      modelLoadFailed: 'Falha ao carregar modelos de incorporação. Tente novamente mais tarde.',
      success: 'Conjunto de dados criado com sucesso.',
      successMessage: '{name} está pronto. Agora você pode vinculá-lo ao seu aplicativo.',
      failed: 'Falha na criação do conjunto de dados. Por favor, tente novamente mais tarde.',
    },
    datasetUpload: {
      title: 'Carregar arquivos da base de conhecimento',
      tip: 'Faça upload de documentos para {name} para que seu assistente de IA possa aprender com eles.',
      placeholder: 'Solte os arquivos aqui ou clique para selecionar',
      limit: 'Suporta PDF, Word, PPT, TXT, Markdown. Máximo de 100 MB por arquivo.',
      submit: 'Enviar arquivos',
      fileRequired: 'Adicione pelo menos um arquivo.',
      success: '{name} arquivos enviados com sucesso.',
      successMessage: 'Documentos carregados. Gostaria de adicionar mais arquivos?',
      failed: 'Falha no upload do arquivo. Por favor, tente novamente mais tarde.',
      startMessage: 'Ótimo! Agora carregue os documentos para {name} para terminar de preparar a base de conhecimento.',
      moreTitle: 'Carregar mais arquivos?',
      moreMessage: 'Você precisa fazer upload de documentos adicionais para {name}?',
      moreConfirm: 'Carregar mais',
      moreCancel: 'Continuar configuração de IA',
      doneTitle: '{name} está pronto para configuração de IA.',
      doneDescription: 'Você pode continuar configurando seu aplicativo de IA.',
      continueMessage: '{name} upload concluído. Continue configurando seu aplicativo de IA.',
      missingDataset: 'Faltam informações da base de conhecimento. Por favor, crie um primeiro.',
      empty: 'Nenhum conteúdo legível foi gerado. Por favor, tente documentos diferentes.',
      saveFailed: 'Falha ao armazenar documentos na base de conhecimento.',
      documentName: 'Documento {index}',
      datasetRequired: 'Conclua a criação e o upload de uma base de conhecimento antes de salvar.',
    },
    chatButton: 'Criar aplicativo via AI Chat',
    chatDialogTitle: 'Bate-papo do Construtor de IA',
    chatHeading: 'Conversa de IA (Vue + FastAPI)',
    chatPlaceholder: 'Dizer algo...',
    chatSend: 'Enviar',
    chatLoading: 'Pensamento...',
    chatCreatePrompt: 'Já estamos conversando há algum tempo. Você gostaria de criar um aplicativo de IA agora?',
    chatEffortLabel: 'Esforço de raciocínio',
    chatEffortOptions: {
      low: 'baixo',
      medium: 'médio',
      high: 'alto',
    },
    chatWelcome: 'Olá! Eu sou o Assistente de Criação de IA. Como posso ajudá-lo?',
    chatApiError: '[Erro de API] {message}',
    chatNetworkError: '[Erro de rede] {message}',
    chatTemplateListTitle: 'Modelos de aplicativos disponíveis',
    chatTemplateListEmpty: 'Nenhum modelo encontrado. Carregue um nas configurações do sistema para começar.',
    chatTemplateListLoading: 'Buscando a lista de modelos para você...',
    chatTemplateListError: '[Erro de modelo] {message}',
    chatTemplateListUntitled: 'Modelo #{index}',
    chatTemplateDownloadStart: 'Baixando modelo {name}...',
    chatTemplateImporting: 'Importando modelo {name} para seu espaço de trabalho...',
    chatTemplateImportSuccess: '{name} modelo importado com sucesso.',
    chatTemplateImportFailed: '[Falha na importação do modelo] {message}',
    chatTemplateMissingPath: '[Caminho ausente do modelo] Não é possível fazer download de {name}.',
    applicationCard: {
      title: 'Selecione um aplicativo para finalizar',
      tip: 'Escolha o aplicativo que deseja atualizar antes de publicar.',
      refresh: 'Atualizar',
      empty: 'Nenhum aplicativo disponível ainda.',
      listFailed: 'Falha ao carregar aplicativos.',
      detailFailed: 'Falha ao carregar detalhes do aplicativo.',
      baseNameRequired: 'O nome do assistente é obrigatório.',
      fields: {
        baseName: 'Nome do assistente',
        basePrologue: 'Prólogo',
        recipient: 'E-mail do destinatário',
      },
      recipientHint: 'Quando um cliente solicitar uma assinatura, enviaremos um e-mail para esta caixa. Mantenha-a disponível.',
      recipientRequired: 'Informe o e-mail que receberá as notificações.',
      submit: 'Salvar alterações',
      publish: 'Publicar',
      saveSuccess: '{name} atualizado com sucesso.',
      saveFailed: '[Falha na atualização] {message}',
      publishSuccess: '{name} publicado com sucesso.',
      publishFailed: '[Falha na publicação] {message}',
    },
    chatFlowSummary: 'Ótimo! Deixe-me orientar você no fluxo de trabalho Criar com IA.',
    chatFlowTitle: 'Crie com fluxo de trabalho de IA',
    chatFlowIntro: 'Siga estas etapas para criar um aplicativo com orientação GPT-5:',
    chatFlowStep1Title: 'Passo 1 · Abra “Criar com IA”',
    chatFlowStep1Desc: 'Inicie o espaço de trabalho no painel para que o GPT-5 possa gerenciar modelos e conjuntos de dados para você.',
    chatFlowStep2Title: 'Passo 2 · Escolha um modelo',
    chatFlowStep2Desc: 'Selecione ou carregue um modelo de aplicativo para fornecer ao construtor uma base sólida.',
    chatFlowStep3Title: 'Passo 3 · Descreva seus objetivos',
    chatFlowStep3Desc: 'Compartilhe metas de negócios, preferências de tom e conjuntos de dados para que o GPT-5 possa configurar cada nó.',
    chatFlowStep4Title: 'Etapa 4 · Vincular dados e publicar',
    chatFlowStep4Desc: 'Crie ou vincule conjuntos de dados, atualize o nó base, revise as configurações e publique seu aplicativo de IA.',
    chatFlowNote: 'Precisar de ajuda? Clique em “Criar com IA” na grade do cartão para abrir a experiência guiada completa.',
    chatAccessTokenMissing: 'Token de acesso ao chat ausente. Configure primeiro o token de acesso do aplicativo.',
    datasetListTitle: 'Bases de conhecimento existentes',
    datasetListEmpty: 'Ainda não há bases de conhecimento. Crie um para continuar.',
    datasetListFailed: 'Falha ao carregar conjuntos de dados existentes. Por favor, tente novamente mais tarde.',
    unnamedTemplate: 'Modelo sem título',
  },
  searchBar: {
    placeholder: 'Pesquisar por nome'
  },

  setting: {
    demo: 'Demonstração'
  },
  delete: {
    confirmTitle: 'Tem certeza de que deseja excluir este APP: ',
    confirmMessage:
      'Excluir este APP fará com que seus serviços não estejam mais disponíveis. Por favor, proceda com cautela.'
  },
  tip: {
    ExportError: 'Exportação falhou',
    professionalMessage:
      'Suporta até 5 APPs.',
    saveErrorMessage: 'Falha ao salvar, por favor verifique sua entrada ou tente novamente mais tarde',
    loadingErrorMessage: 'Falha ao carregar a configuração, por favor verifique sua entrada ou tente novamente mais tarde'
  },

  applicationForm: {
    title: {
      appTest: 'Prévia de Depuração',
      copy: 'copiar'
    },
    form: {
      appName: {
        label: 'Nome',
        placeholder: 'Por favor, insira o nome do APP',
        requiredMessage: 'O nome do APP é obrigatório'
      },
      appDescription: {
        label: 'Descrição',
        placeholder:
          'Descreva o cenário e uso do APP, por exemplo: Assistente XXX respondendo perguntas de usuários sobre o uso do produto XXX'
      },
      appType: {
        label: 'Tipo',
        simplePlaceholder: 'Apropriado para iniciantes criarem assistentes.',
        workflowPlaceholder: 'Apropriado para usuários avançados personalizarem o fluxo de trabalho do assistente'
      },
      appTemplate: {
        blankApp: 'APP em branco',
        assistantApp: 'Assistente de perguntas e respostas da base de conhecimento',
        ecommerceApp: 'IA de e-commerce',
        templateMissing: 'Faça o upload do modelo de IA nas Configurações do sistema primeiro',
        importFailed: 'Falha ao importar o modelo de IA. Tente novamente mais tarde',
        pcSetupReminder:
          'A tela do celular não consegue exibir totalmente as configurações avançadas de orquestração. Acesse https://ai.vnppp.com em um computador para concluir a configuração. Nome de usuário: seu e-mail cadastrado, senha: mi123. (Atenção: há um ponto.)'
      },
      aiModel: {
        label: 'Modelo de IA',
        placeholder: 'Por favor, selecione um modelo de IA'
      },
      roleSettings: {
        label: 'Papel do Sistema',
        placeholder: 'Você é o assistente xxx'
      },

      prompt: {
        label: 'Prompt',
        noReferences: '(Sem referências de conhecimento)',
        references: ' (Com referências de conhecimento)',
        placeholder: 'Por favor, insira o prompt',
        requiredMessage: 'Por favor, insira o prompt',
        tooltip:
          'Ao ajustar o conteúdo do prompt, você pode guiar a direção da conversa do grande modelo.',

        noReferencesTooltip:
          'Ao ajustar o conteúdo do prompt, você pode guiar a direção da conversa do grande modelo. Este prompt será fixado no início do contexto. Variáveis usadas: {question} é a pergunta feita pelo usuário.',
        referencesTooltip:
          'Ao ajustar o conteúdo do prompt, você pode guiar a direção da conversa do grande modelo. Este prompt será fixado no início do contexto. Variáveis usadas: {data} contém informações conhecidas do conhecimento; {question} é a pergunta feita pelo usuário.',
        defaultPrompt: `Informações conhecidas: {data}
          Pergunta: {question}
           Requisitos de resposta: 
           - Por favor, use linguagem concisa e profissional para responder à pergunta do usuário.
           `
      },
      historyRecord: {
        label: 'Histórico de Conversas'
      },
      relatedKnowledge: {
        label: 'Conhecimento Relacionado',
        placeholder: 'Os conhecimentos relacionados serão exibidos aqui'
      },
      multipleRoundsDialogue: 'Diálogo de Múltiplas Rodadas',

      prologue: 'Prólogo',
      defaultPrologue:
        'Olá, sou o Assistente XXX. Você pode me fazer perguntas sobre como usar o XXX.\n- Quais são os principais recursos do XXX?\n- Qual LLM o XXX suporta?\n- Que tipos de documentos o XXX suporta?',
      problemOptimization: {
        label: 'Otimização de Perguntas',
        tooltip:
          'Otimiza a pergunta atual com base no histórico de chat para melhor combinar pontos de conhecimento.'
      },

      voiceInput: {
        label: 'Entrada de Voz',
        placeholder: 'Por favor, selecione um modelo de reconhecimento de fala',
        requiredMessage: 'Por favor, selecione um modelo de entrada de voz',
        autoSend: 'Envio Automático'
      },
      voicePlay: {
        label: 'Reprodução de Voz',
        placeholder: 'Por favor, selecione um modelo de síntese de fala',
        requiredMessage: 'Por favor, selecione um modelo de reprodução de voz',
        autoPlay: 'Reprodução Automática',
        browser: 'Reprodução no Navegador (grátis)',
        tts: 'Modelo TTS',
        listeningTest: 'Prévia'
      },
      reasoningContent: {
        label: 'Saída de Raciocínio',
        tooltip:
          "Defina a etiqueta de raciocínio com base no retorno do modelo, e o conteúdo no meio da etiqueta será reconhecido como o processo de raciocínio.",
        start: 'Início',
        end: 'Fim'
      }
    },
    buttons: {
      publish: 'Salvar e Publicar',
      addModel: 'Adicionar Modelo'
    },
    dialog: {
      addDataset: 'Adicionar Conhecimento Relacionado',
      addDatasetPlaceholder: 'Os conhecimentos selecionados devem usar o mesmo modelo de embedding',
      selected: 'Selecionado',
      countDataset: 'Conhecimentos',

      selectSearchMode: 'Modo de Recuperação',
      vectorSearch: 'Busca por Vetor',
      vectorSearchTooltip:
        'A busca por vetor é um método de recuperação baseado em cálculos de distância vetorial, adequado para grandes volumes de dados no conhecimento.',
      fullTextSearch: 'Busca de Texto Completo',
      fullTextSearchTooltip:
        'A busca de texto completo é um método de recuperação baseado na similaridade de texto, adequado para pequenos volumes de dados no conhecimento.',
      hybridSearch: 'Busca Híbrida',
      hybridSearchTooltip:
        'A busca híbrida é um método de recuperação baseado tanto na similaridade vetorial quanto textual, adequado para volumes médios de dados no conhecimento.',
      similarityThreshold: 'Similaridade Mínima',
      similarityTooltip: 'Quanto maior a similaridade, mais forte a correlação.',
      topReferences: 'Top N Segmentos',
      maxCharacters: 'Máximo de Caracteres por Referência',
      noReferencesAction: 'Quando não há referências de conhecimento',
      continueQuestioning: 'Continuar fazendo perguntas ao modelo de IA',
      provideAnswer: 'Especificar Conteúdo de Resposta',
      designated_answer:
        'Olá, sou o Assistente XXX. Meu conhecimento contém apenas informações relacionadas aos produtos XXX. Por favor, reformule sua pergunta.',
      defaultPrompt1:
        "O conteúdo dentro dos parênteses () representa a pergunta do usuário. Com base no contexto, especule e complete a pergunta do usuário ({question}). O requisito é gerar uma pergunta completa e colocá-la",
      defaultPrompt2: 'tag'
    }
  },
  applicationAccess: {
    title: 'Acesso ao APP',
    wecom: 'WeCom',
    wecomTip: 'Criar APP inteligente WeCom',
    dingtalk: 'DingTalk',
    dingtalkTip: 'Criar APP inteligente DingTalk',
    wechat: 'WeChat',
    wechatTip: 'Criar APP inteligente WeChat',
    lark: 'Lark',
    larkTip: 'Criar APP inteligente Lark',
    setting: 'Configuração',
    callback: 'Endereço de Retorno',
    callbackTip: 'Por favor, preencha o endereço de retorno',
    wecomPlatform: 'Plataforma Aberta WeCom',
    wechatPlatform: 'Plataforma Aberta WeChat',
    dingtalkPlatform: 'Plataforma Aberta DingTalk',
    larkPlatform: 'Plataforma Aberta Lark',
    slack: 'Slack',
    slackTip: 'Criar APP inteligente Slack',
    wecomSetting: {
      title: 'Configuração WeCom',
      cropId: 'ID da Empresa',
      cropIdPlaceholder: 'Por favor, insira o ID da empresa',
      agentIdPlaceholder: 'Por favor, insira o ID do agente',
      secretPlaceholder: 'Por favor, insira o segredo',
      tokenPlaceholder: 'Por favor, insira o token',
      encodingAesKeyPlaceholder: 'Por favor, insira a EncodingAESKey',
      authenticationSuccessful: 'Sucesso',
      urlInfo:
        '-Gerenciamento de APP-Autoconstruído-APP Criado-Receber Mensagens-Definir o "URL" recebido pela API'
    },
    dingtalkSetting: {
      title: 'Configuração DingTalk',
      clientIdPlaceholder: 'Por favor, insira o ID do cliente',
      clientSecretPlaceholder: 'Por favor, insira o segredo do cliente',
      urlInfo:
        '-Na página do robô, defina o "Modo de Recebimento de Mensagens" para modo HTTP e preencha o URL acima no "Endereço de Recebimento de Mensagens"'
    },
    wechatSetting: {
      title: 'Configuração WeChat',
      appId: 'ID do APP',
      appIdPlaceholder: 'Por favor, insira o ID do APP',
      appSecret: 'Segredo do APP',
      appSecretPlaceholder: 'Por favor, insira o Segredo do APP',
      token: 'TOKEN',
      tokenPlaceholder: 'Por favor, insira o TOKEN',
      aesKey: 'Chave de Criptografia de Mensagens',
      aesKeyPlaceholder: 'Por favor, insira a chave de criptografia de mensagens',
      urlInfo:
        '-Configurações e Desenvolvimento-Configuração Básica-"URL do Endereço do Servidor" na configuração do servidor'
    },
    larkSetting: {
      title: 'Configuração Lark',
      appIdPlaceholder: 'Por favor, insira o ID do APP',
      appSecretPlaceholder: 'Por favor, insira o segredo do APP',
      verificationTokenPlaceholder: 'Por favor, insira o token de verificação',
      urlInfo:
        '-Eventos e callbacks - configuração de eventos - configurar o "endereço de solicitação" do método de inscrição'
    },
    slackSetting: {
      title: 'Configuração Slack',
      signingSecretPlaceholder: 'Por favor, insira o segredo de assinatura',
      botUserTokenPlaceholder: 'Por favor, insira o token do usuário bot'
    },
    copyUrl: 'Copie o link e preencha-o'
  },
  hitTest: {
    title: 'Teste de Recuperação',
    text: 'Teste o efeito de acerto do Conhecimento com base no texto de consulta fornecido.',
    emptyMessage1: 'Os resultados do teste de recuperação aparecerão aqui',
    emptyMessage2: 'Nenhuma seção correspondente encontrada'
  }
}
