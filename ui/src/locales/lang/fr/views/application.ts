export default {
  title: 'APP',
  createApplication: 'Créer une APP',
  importApplication: 'Importer une APP',
  copyApplication: 'Copier une APP',
  workflow: 'WORKFLOW',
  simple: 'SIMPLE',
  aiCreate: {
    button: 'Créer avec l\'IA',
    dialogTitle: 'Création d\'applications IA',
    description: 'Un espace de travail plein écran pour la création d\'applications assistée par l\'IA (à venir).',
    inputPlaceholder: 'Décrivez votre objectif commercial ou votre base de connaissances afin que l\'IA puisse créer la configuration de l\'application',
    submit: 'Envoyer',
    submitSuccess: 'Demande reçue. L\'expérience de création d\'IA arrive bientôt.',
    comingSoon: 'La création d\'IA est en cours de développement actif. Une expérience complète arrive bientôt.',
    templateIntro: 'Commencez par choisir un modèle ci-dessous afin que l\'IA sache comment structurer votre application.',
    templateListTitle: 'Choisissez un modèle pour commencer',
    templateEmpty: 'Aucun modèle disponible pour l\'instant. Veuillez en télécharger un dans les paramètres système.',
    templateDefaultDesc: 'Utilisez ce modèle comme base de votre application IA.',
    templateSelected: 'Construisons avec le modèle {name}.',
    templateConfirm: 'Modèle {name} verrouillé. Dites-moi quelle expérience vous souhaitez créer ensuite.',
    templateLoadFailed: 'Échec du chargement des modèles. Veuillez réessayer plus tard.',
    templateRequired: 'Sélectionnez un modèle avant d\'envoyer les exigences.',
    templateMissingPath: 'Il manque un chemin de téléchargement dans ce modèle. Veuillez contacter l\'administrateur.',
    templateFetchFailed: 'Échec du téléchargement du modèle. Veuillez réessayer.',
    templateFetchFailedMessage: 'Le téléchargement de {name} a échoué. Réessayez ou choisissez un autre modèle.',
    templateLoading: 'Chargement du modèle...',
    templateNotReady: 'Le traitement du modèle est toujours en cours. Veuillez patienter un instant.',
    templateImportSuccess: 'Modèle {name} importé. Décrivez ce que vous souhaitez construire ensuite.',
    templateImportFailed: 'L\'importation du modèle a échoué. Veuillez réessayer plus tard.',
    datasetReminderTitle: 'Attention',
    datasetReminder: 'Créez et configurez d\'abord une base de connaissances afin que l\'application puisse répondre correctement aux questions des utilisateurs.',
    applicationListTitle: 'Applications pour la maison (6 premières)',
    applicationListEmpty: 'Aucune application pour l\'instant. Actualisez plus tard pour en voir de nouveaux.',
    applicationListNoDesc: 'Aucune description fournie.',
    appNamePrompt: 'Ouverture de {name}. Veuillez configurer son nom d\'application dans les informations de base du flux de travail.',
    appNameInstruction: 'Vous vous concentrez sur {workflowPath}. Entrez le nom de l\'application ici pour continuer.',
    appNamePlaceholder: 'Entrez un nouveau nom d\'application',
    appNameConfirm: 'Enregistrer le nom',
    appNameRequired: 'Veuillez d\'abord saisir un nom d\'application.',
    appNameSuccess: '{name} a été mis à jour.',
    appNameFailed: 'Échec de l\'enregistrement du nom de l\'application. Réessayez plus tard.',
    appNameFetchFailed: 'Impossible de charger les détails de l\'application. Veuillez réessayer.',
    appNameSetMessage: 'Nom de l\'application enregistré. Continuez à configurer le reste du flux de travail.',
    appDetailFailed: 'Échec du chargement des paramètres de l\'application. Veuillez réessayer plus tard.',
    workflowListTitle: 'Nœuds de flux de travail',
    baseNodeTitle: 'Paramètres du nœud de base',
    baseNodeNameLabel: "Nom de l'assistant",
    baseNodeNamePlaceholder: 'Entrez le nom de l\'assistant',
    baseNodeEmailLabel: 'E-mail de contact',
    baseNodeEmailPlaceholder: 'Saisissez l\'e-mail de l\'assistant (facultatif)',
    baseNodePrologueLabel: 'Prologue',
    baseNodeProloguePlaceholder: 'Décrivez le message de bienvenue que les utilisateurs verront',
    baseNodeSubmit: 'Enregistrer le nœud de base',
    baseNodeNameRequired: 'Le nom de l\'assistant est requis.',
    baseNodeAppNameRequired: 'Définissez d\'abord le nom de l\'application, puis enregistrez le nœud de base.',
    baseNodeEmailRequired: 'L\'e-mail de contact est requis.',
    baseNodeFetchFailed: 'Impossible de charger le nœud de base. Veuillez réessayer.',
    baseNodeMissing: 'Nœud de base introuvable. Vérifiez la configuration du flux de travail.',
    baseNodeSuccess: 'Le nœud de base a été mis à jour avec succès.',
    baseNodeFailed: 'Échec de l\'enregistrement du nœud de base.',
    baseNodeSetMessage: 'Nœud de base {name} mis à jour. Continuez à configurer le flux de travail.',
    datasetForm: {
      title: 'Créer une base de connaissances',
      tip: 'Pas encore de jeu de données ? Créez-en un rapidement ici avant de poursuivre la configuration de votre application.',
      createButton: 'Enregistrer les paramètres',
      nameLabel: 'Nom de l\'ensemble de données',
      namePlaceholder: 'Entrez un nom d\'ensemble de données',
      descLabel: 'Description',
      descPlaceholder: 'Décrire ce que stocke cette base de connaissances',
      typeLabel: 'Type d\'ensemble de données',
      typeGeneral: 'Ensemble de données général',
      typeWeb: 'Ensemble de données Web',
      embeddingLabel: 'Modèle d\'intégration',
      embeddingPlaceholder: 'Sélectionnez un modèle d\'intégration',
      refreshEmbedding: 'Actualiser les modèles',
      submit: 'Créer un ensemble de données',
      nameRequired: 'Le nom de l’ensemble de données est obligatoire.',
      descRequired: 'Une description est requise.',
      embeddingRequired: 'Veuillez choisir un modèle d\'intégration.',
      modelLoadFailed: 'Échec du chargement des modèles d\'intégration. Réessayez plus tard.',
      success: 'Ensemble de données créé avec succès.',
      successMessage: '{name} est prêt. Vous pouvez maintenant le lier à votre application.',
      failed: 'La création de l\'ensemble de données a échoué. Veuillez réessayer plus tard.',
    },
    datasetUpload: {
      title: 'Télécharger des fichiers de la base de connaissances',
      tip: 'Téléchargez des documents pour {name} afin que votre assistant IA puisse en tirer des leçons.',
      placeholder: 'Déposez les fichiers ici ou cliquez pour sélectionner',
      limit: 'Prend en charge PDF, Word, PPT, TXT, Markdown. Max 100 Mo par fichier.',
      submit: 'Soumettre des fichiers',
      fileRequired: 'Veuillez ajouter au moins un fichier.',
      success: 'Fichiers {name} téléchargés avec succès.',
      successMessage: 'Documents téléchargés. Souhaitez-vous ajouter plus de fichiers ?',
      failed: 'Le téléchargement du fichier a échoué. Veuillez réessayer plus tard.',
      startMessage: 'Super! Téléchargez maintenant les documents pour {name} pour terminer la préparation de la base de connaissances.',
      moreTitle: 'Télécharger plus de fichiers ?',
      moreMessage: 'Devez-vous télécharger des documents supplémentaires pour {name} ?',
      moreConfirm: 'Télécharger plus',
      moreCancel: 'Continuer la configuration de l\'IA',
      doneTitle: '{name} est prêt pour la configuration de l\'IA.',
      doneDescription: 'Vous pouvez continuer à configurer votre application IA.',
      continueMessage: 'Téléchargement de {name} terminé. Continuez à configurer votre application IA.',
      missingDataset: 'Informations manquantes dans la base de connaissances. Veuillez d\'abord en créer un.',
      empty: 'Aucun contenu lisible n\'a été généré. Veuillez essayer différents documents.',
      saveFailed: 'Échec du stockage des documents dans la base de connaissances.',
      documentName: 'Document {index}',
      datasetRequired: 'Veuillez terminer la création et le téléchargement d\'une base de connaissances avant de sauvegarder.',
    },
    chatButton: 'Créer une application via AI Chat',
    chatDialogTitle: 'Discussion avec le constructeur d\'IA',
    chatHeading: 'Conversation IA (Vue + FastAPI)',
    chatPlaceholder: 'Dire quelque chose...',
    chatSend: 'Envoyer',
    chatLoading: 'Pensée...',
    chatCreatePrompt: 'Nous discutons depuis un moment : aimeriez-vous créer une application d’IA maintenant ?',
    chatEffortLabel: 'Effort de raisonnement',
    chatEffortOptions: {
      low: 'faible',
      medium: 'moyen',
      high: 'haut',
    },
    chatWelcome: 'Bonjour! Je suis l\'assistant de création d\'IA. Comment puis-je t\'aider?',
    chatApiError: '[Erreur API] {message}',
    chatNetworkError: '[Erreur réseau] {message}',
    chatTemplateListTitle: 'Modèles de candidature disponibles',
    chatTemplateListEmpty: 'Aucun modèle trouvé. Téléchargez-en un dans les paramètres système pour commencer.',
    chatTemplateListLoading: 'Récupération de la liste des modèles pour vous...',
    chatTemplateListError: '[Erreur de modèle] {message}',
    chatTemplateListUntitled: 'Modèle #{index}',
    chatTemplateDownloadStart: 'Téléchargement du modèle {name}...',
    chatTemplateImporting: 'Importation du modèle {name} dans votre espace de travail...',
    chatTemplateImportSuccess: 'Modèle {name} importé avec succès.',
    chatTemplateImportFailed: '[Échec de l\'importation du modèle] {message}',
    chatTemplateMissingPath: '[Chemin manquant du modèle] Impossible de télécharger {name}.',
    applicationCard: {
      title: 'Sélectionnez une candidature à finaliser',
      tip: 'Choisissez l\'application que vous souhaitez mettre à jour avant de la publier.',
      refresh: 'Rafraîchir',
      empty: 'Aucune application disponible pour l\'instant.',
      listFailed: 'Échec du chargement des applications.',
      detailFailed: 'Échec du chargement des détails de l\'application.',
      baseNameRequired: 'Le nom de l\'assistant est requis.',
      fields: {
        baseName: "Nom de l'assistant",
        basePrologue: 'Prologue',
        recipient: 'E-mail du destinataire',
      },
      recipientHint: 'Lorsqu’un client souhaite commander, une notification est envoyée à cette adresse e-mail. Veuillez la garder disponible.',
      recipientRequired: 'Veuillez renseigner l’e-mail de réception des notifications.',
      submit: 'Enregistrer les modifications',
      publish: 'Publier',
      saveSuccess: '{name} a été mis à jour avec succès.',
      saveFailed: '[Échec de la mise à jour] {message}',
      publishSuccess: '{name} a été publié avec succès.',
      publishFailed: '[Échec de la publication] {message}',
    },
    chatFlowSummary: 'Super! Laissez-moi vous guider à travers le flux de travail Créer avec l\'IA.',
    chatFlowTitle: 'Créer avec le flux de travail de l\'IA',
    chatFlowIntro: 'Suivez ces étapes pour créer une application avec les conseils GPT-5 :',
    chatFlowStep1Title: 'Étape 1 · Ouvrez « Créer avec l\'IA »',
    chatFlowStep1Desc: 'Lancez l\'espace de travail à partir du tableau de bord afin que GPT-5 puisse gérer les modèles et les ensembles de données pour vous.',
    chatFlowStep2Title: 'Étape 2 · Choisissez un modèle',
    chatFlowStep2Desc: 'Sélectionnez ou téléchargez un modèle d\'application pour donner au constructeur une base solide.',
    chatFlowStep3Title: 'Étape 3 · Décrivez vos objectifs',
    chatFlowStep3Desc: 'Partagez vos objectifs commerciaux, vos préférences de tonalité et vos ensembles de données afin que GPT-5 puisse configurer chaque nœud.',
    chatFlowStep4Title: 'Étape 4 · Lier les données et publier',
    chatFlowStep4Desc: 'Créez ou liez des ensembles de données, mettez à jour le nœud de base, vérifiez les paramètres, puis publiez votre application d\'IA.',
    chatFlowNote: 'Besoin d\'aide ? Cliquez sur « Créer avec l\'IA » sur la grille des cartes pour ouvrir l\'expérience guidée complète.',
    chatAccessTokenMissing: 'Jeton d\'accès au chat manquant. Veuillez d\'abord configurer le jeton d\'accès à l\'application.',
    datasetListTitle: 'Bases de connaissances existantes',
    datasetListEmpty: 'Pas encore de bases de connaissances. Créez-en un pour continuer.',
    datasetListFailed: 'Échec du chargement des ensembles de données existants. Veuillez réessayer plus tard.',
    unnamedTemplate: 'Modèle sans titre',
  },
  searchBar: {
    placeholder: 'Rechercher par nom'
  },

  setting: {
    demo: 'Démo'
  },
  delete: {
    confirmTitle: 'Êtes-vous sûr de vouloir supprimer cette APP : ',
    confirmMessage:
      "La suppression de cette APP ne fournira plus ses services. Veuillez procéder avec précaution."
  },
  tip: {
    ExportError: 'Échec de l\'exportation',
    professionalMessage:
      "Le nombre maximum d'APP supportées est de 5.",
    saveErrorMessage: 'Échec de la sauvegarde, veuillez vérifier vos données ou réessayer plus tard.',
    loadingErrorMessage: 'Échec du chargement de la configuration, veuillez vérifier vos données ou réessayer plus tard.'
  },

  applicationForm: {
    title: {
      appTest: 'Aperçu du débogage',
      copy: 'copier'
    },
    form: {
      appName: {
        label: 'Nom',
        placeholder: 'Veuillez entrer le nom de l\'APP',
        requiredMessage: 'Le nom de l\'APP est obligatoire.'
      },
      appDescription: {
        label: 'Description',
        placeholder:
          'Décrivez le scénario et l\'utilisation de l\'APP, par exemple : assistant XXX répondant aux questions des utilisateurs sur l\'utilisation du produit XXX.'
      },
      appType: {
        label: 'Type',
        simplePlaceholder: 'Adapté aux débutants pour créer un assistant.',
        workflowPlaceholder: 'Adapté aux utilisateurs avancés pour personnaliser le flux de travail de l\'assistant.'
      },
      appTemplate: {
        blankApp: 'Application vierge',
        assistantApp: 'Assistant questions-réponses de base de connaissances',
        ecommerceApp: 'IA de commerce électronique',
        templateMissing: 'Veuillez d’abord téléverser le modèle d’IA dans les paramètres système',
        importFailed: 'Échec de l’importation du modèle d’IA, veuillez réessayer plus tard',
        pcSetupReminder:
          'L’écran du mobile ne peut pas afficher entièrement les réglages d’orchestration avancée. Nous vous recommandons de vous rendre sur https://ai.vnppp.com depuis un ordinateur pour terminer la configuration. Nom d’utilisateur : votre e-mail d’inscription, mot de passe : mi123. (Attention : il y a un point.)'
      },
      aiModel: {
        label: 'Modèle IA',
        placeholder: 'Veuillez sélectionner un modèle IA.'
      },
      roleSettings: {
        label: 'Rôle système',
        placeholder: 'Vous êtes un assistant xxx.'
      },

      prompt: {
        label: 'Invite',
        noReferences: '(Aucune référence à la connaissance)',
        references: '(Références à la connaissance)',
        placeholder: 'Veuillez entrer une invite.',
        requiredMessage: 'Veuillez entrer une invite.',
        tooltip:
          "En ajustant le contenu de l'invite, vous pouvez guider la direction de la discussion avec le grand modèle.",

        noReferencesTooltip:
          "En ajustant le contenu de l'invite, vous pouvez guider la direction de la discussion avec le grand modèle. Cette invite sera fixée au début du contexte. Variables utilisées : {question} correspond à la question posée par l'utilisateur.",
        referencesTooltip:
          "En ajustant le contenu de l'invite, vous pouvez guider la direction de la discussion avec le grand modèle. Cette invite sera fixée au début du contexte. Variables utilisées : {data} contient les informations connues issues de la connaissance ; {question} correspond à la question posée par l'utilisateur.",
        defaultPrompt: `Informations connues : {data}
          Question : {question}
           Exigences de réponse : 
           - Veuillez utiliser un langage concis et professionnel pour répondre à la question de l'utilisateur.
           `
      },
      historyRecord: {
        label: 'Historique des conversations'
      },
      relatedKnowledge: {
        label: 'Connaissances associées',
        placeholder: 'Les connaissances associées s\'afficheront ici.'
      },
      multipleRoundsDialogue: 'Dialogue en plusieurs tours',

      prologue: 'Prologue',
      defaultPrologue:
        "Bonjour, je suis l'assistant XXX. Vous pouvez me poser des questions sur l'utilisation de XXX.\n- Quelles sont les principales fonctionnalités de XXX?\n- Quels LLM sont pris en charge par XXX ?\n- Quels types de documents sont pris en charge par XXX ?",
      problemOptimization: {
        label: 'Optimisation des questions',
        tooltip:
          "Optimisez la question actuelle en fonction de l'historique des discussions pour mieux correspondre aux points de connaissance."
      },

      voiceInput: {
        label: 'Entrée vocale',
        placeholder: 'Veuillez sélectionner un modèle de reconnaissance vocale.',
        requiredMessage: 'Veuillez sélectionner un modèle d\'entrée vocale.',
        autoSend: 'Envoi automatique'
      },
      voicePlay: {
        label: 'Lecture vocale',
        placeholder: 'Veuillez sélectionner un modèle de synthèse vocale.',
        requiredMessage: 'Veuillez sélectionner un modèle de lecture vocale.',
        autoPlay: 'Lecture automatique',
        browser: 'Lecture dans le navigateur (gratuit)',
        tts: 'Modèle TTS',
        listeningTest: 'Aperçu'
      },
      reasoningContent: {
        label: 'Sortie de réflexion',
        tooltip:
          "Veuillez définir l'étiquette de réflexion en fonction du retour du modèle, et le contenu entre les étiquettes sera reconnu comme le processus de réflexion.",
        start: 'Début',
        end: 'Fin'
      }
    },
    buttons: {
      publish: 'Enregistrer et publier',
      addModel: 'Ajouter un modèle'
    },
    dialog: {
      addDataset: 'Ajouter des connaissances associées',
      addDatasetPlaceholder: 'Les connaissances sélectionnées doivent utiliser le même modèle d\'intégration.',
      selected: 'Sélectionné',
      countDataset: 'Connaissances',

      selectSearchMode: 'Mode de recherche',
      vectorSearch: 'Recherche vectorielle',
      vectorSearchTooltip:
        "La recherche vectorielle est une méthode basée sur le calcul de distance vectorielle, adaptée aux grands volumes de données dans les connaissances.",
      fullTextSearch: 'Recherche en texte intégral',
      fullTextSearchTooltip:
        "La recherche en texte intégral est une méthode basée sur la similarité textuelle, adaptée aux petits volumes de données dans les connaissances.",
      hybridSearch: 'Recherche hybride',
      hybridSearchTooltip:
        "La recherche hybride est une méthode basée à la fois sur la similarité vectorielle et textuelle, adaptée aux volumes moyens de données dans les connaissances.",
      similarityThreshold: 'Similarité minimale',
      similarityTooltip: 'Plus la similarité est élevée, plus la corrélation est forte.',
      topReferences: 'Top N segments',
      maxCharacters: 'Nombre maximum de caractères par référence',
      noReferencesAction: "Lorsqu'il n'y a aucune référence aux connaissances",
      continueQuestioning: 'Continuer à poser des questions au modèle IA',
      provideAnswer: 'Spécifier le contenu de la réponse',
      designated_answer:
        "Bonjour, je suis l'assistant XXX. Mes connaissances ne contiennent que des informations relatives aux produits XXX. Veuillez reformuler votre question.",
      defaultPrompt1:
        "Le contenu entre parenthèses () représente la question de l'utilisateur. Sur la base du contexte, veuillez deviner et compléter la question de l'utilisateur ({question}). L'exigence est de générer une question complète et de la placer",
      defaultPrompt2: 'balise'
    }
  },
  applicationAccess: {
    title: 'Accès à l\'APP',
    wecom: 'WeCom',
    wecomTip: 'Créer une APP intelligente WeCom',
    dingtalk: 'DingTalk',
    dingtalkTip: 'Créer une APP intelligente DingTalk',
    wechat: 'WeChat',
    wechatTip: 'Créer une APP intelligente WeChat',
    lark: 'Lark',
    larkTip: 'Créer une APP intelligente Lark',
    setting: 'Paramètres',
    callback: 'Adresse de rappel',
    callbackTip: 'Veuillez remplir l\'adresse de rappel.',
    wecomPlatform: 'Plateforme ouverte WeCom',
    wechatPlatform: 'Plateforme ouverte WeChat',
    dingtalkPlatform: 'Plateforme ouverte DingTalk',
    larkPlatform: 'Plateforme ouverte Lark',
    slack: 'Slack',
    slackTip: 'Créer une APP intelligente Slack',
    wecomSetting: {
      title: 'Configuration WeCom',
      cropId: 'ID de l\'entreprise',
      cropIdPlaceholder: 'Veuillez entrer l\'ID de l\'entreprise.',
      agentIdPlaceholder: 'Veuillez entrer l\'ID de l\'agent.',
      secretPlaceholder: 'Veuillez entrer le secret.',
      tokenPlaceholder: 'Veuillez entrer le jeton.',
      encodingAesKeyPlaceholder: 'Veuillez entrer EncodingAESKey.',
      authenticationSuccessful: 'Succès',
      urlInfo:
        '- Gestion des APP - Auto-construit - APP créée - Réception des messages - Définir l\'"URL" reçue par l\'API.'
    },
    dingtalkSetting: {
      title: 'Configuration DingTalk',
      clientIdPlaceholder: 'Veuillez entrer l\'ID client.',
      clientSecretPlaceholder: 'Veuillez entrer le secret client.',
      urlInfo:
        '- Sur la page du robot, définissez le "Mode de réception des messages" en mode HTTP, et remplissez l\'URL ci-dessus dans l\'"Adresse de réception des messages".'
    },
    wechatSetting: {
      title: 'Configuration WeChat',
      appId: 'ID de l\'APP',
      appIdPlaceholder: 'Veuillez entrer l\'ID de l\'APP.',
      appSecret: 'SECRET de l\'APP',
      appSecretPlaceholder: 'Veuillez entrer le SECRET de l\'APP.',
      token: 'TOKEN',
      tokenPlaceholder: 'Veuillez entrer le TOKEN.',
      aesKey: 'Clé de chiffrement des messages',
      aesKeyPlaceholder: 'Veuillez entrer la clé de chiffrement des messages.',
      urlInfo:
        '- Paramètres et développement - Configuration de base - "URL de l\'adresse du serveur" dans la configuration du serveur.'
    },
    larkSetting: {
      title: 'Configuration Lark',
      appIdPlaceholder: 'Veuillez entrer l\'ID de l\'APP.',
      appSecretPlaceholder: 'Veuillez entrer le secret de l\'APP.',
      verificationTokenPlaceholder: 'Veuillez entrer le jeton de vérification.',
      urlInfo:
        '- Événements et rappels - Configuration des événements - Configurer l\'"adresse de demande" de la méthode d\'abonnement.'
    },
    slackSetting: {
      title: 'Configuration Slack',
      signingSecretPlaceholder: 'Veuillez entrer le secret de signature.',
      botUserTokenPlaceholder: 'Veuillez entrer le jeton utilisateur du bot.'
    },
    copyUrl: 'Copiez le lien et remplissez-le ici.'
  },
  hitTest: {
    title: 'Test de récupération',
    text: 'Testez l\'effet de correspondance des connaissances basé sur le texte de requête donné.',
    emptyMessage1: 'Les résultats du test de récupération s\'afficheront ici.',
    emptyMessage2: 'Aucun segment correspondant trouvé.'
  }
}
