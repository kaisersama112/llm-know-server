export default {
  title: 'APP',
  createApplication: 'Create APP',
  importApplication: 'Import APP',
  copyApplication: 'Copy APP',
  workflow: 'WORKFLOW',
  simple: 'SIMPLE',
  aiCreate: {
    button: 'Create with AI',
    dialogTitle: 'AI App Creation',
    description: 'A full-screen workspace for AI-assisted app creation (coming soon).',
    inputPlaceholder: 'Describe your business goal or knowledge base so AI can craft the app config',
    submit: 'Send',
    submitSuccess: 'Request received. The AI creation experience is coming soon.',
    comingSoon: 'AI creation is under active development. A complete experience is coming soon.',
    templateIntro: 'Start by picking a template below so the AI knows how to structure your app.',
    templateListTitle: 'Choose a template to get started',
    templateEmpty: 'No templates available yet. Please upload one in System Settings.',
    templateDefaultDesc: 'Use this template as the foundation for your AI app.',
    templateSelected: 'Let’s build with the {name} template.',
    templateConfirm: '{name} template locked in. Tell me what experience you want to build next.',
    templateLoadFailed: 'Failed to load templates. Please try again later.',
    templateRequired: 'Select a template before sending requirements.',
    templateMissingPath: 'This template is missing a download path. Please contact the admin.',
    templateFetchFailed: 'Failed to download the template. Please retry.',
    templateFetchFailedMessage: 'Downloading {name} failed. Try again or pick another template.',
    templateLoading: 'Loading template...',
    templateNotReady: 'Template processing is still in progress. Please wait a moment.',
    templateImportSuccess: '{name} template imported. Describe what you want to build next.',
    templateImportFailed: 'Template import failed. Please try again later.',
    datasetReminderTitle: 'Heads-up',
    datasetReminder: 'Create and configure a knowledge base first so the app can answer user questions properly.',
    applicationListTitle: 'Home Apps (first 6)',
    applicationListEmpty: 'No apps yet. Refresh later to see new ones.',
    applicationListNoDesc: 'No description provided.',
    appNamePrompt: 'Opening {name}. Please configure its APP Name in the workflow Basic Info.',
    appNameInstruction: 'You are focusing on {workflowPath}. Enter the APP Name here to keep going.',
    appNamePlaceholder: 'Enter a new APP name',
    appNameConfirm: 'Save Name',
    appNameRequired: 'Please enter an app name first.',
    appNameSuccess: '{name} has been updated.',
    appNameFailed: 'Failed to save the app name. Try again later.',
    appNameFetchFailed: 'Could not load app details. Please retry.',
    appNameSetMessage: 'APP name saved. Continue configuring the rest of the workflow.',
    appDetailFailed: 'Failed to load app settings. Please try again later.',
    workflowListTitle: 'Workflow Nodes',
    baseNodeTitle: 'Base Node Settings',
    baseNodeNameLabel: 'Assistant Name',
    baseNodeNamePlaceholder: 'Enter the assistant name',
    baseNodeEmailLabel: 'Contact Email',
    baseNodeEmailPlaceholder: 'Enter the assistant email (optional)',
    baseNodePrologueLabel: 'Prologue',
    baseNodeProloguePlaceholder: 'Describe the welcome message users will see',
    baseNodeSubmit: 'Save Base Node',
    baseNodeNameRequired: 'Assistant name is required.',
    baseNodeAppNameRequired: 'Set the app name first, then save the base node.',
    baseNodeEmailRequired: 'Contact email is required.',
    baseNodeFetchFailed: 'Unable to load the base node. Please retry.',
    baseNodeMissing: 'Base node not found. Check the workflow configuration.',
    baseNodeSuccess: 'Base node updated successfully.',
    baseNodeFailed: 'Failed to save the base node.',
    baseNodeSetMessage: '{name} base node updated. Continue configuring the workflow.',
    datasetForm: {
      title: 'Create a Knowledge Base',
      tip: 'No dataset yet? Quickly create one here before continuing your app setup.',
      createButton: 'Save Settings',
      nameLabel: 'Dataset Name',
      namePlaceholder: 'Enter a dataset name',
      descLabel: 'Description',
      descPlaceholder: 'Describe what this knowledge base stores',
      typeLabel: 'Dataset Type',
      typeGeneral: 'General Dataset',
      typeWeb: 'Web Dataset',
      embeddingLabel: 'Embedding Model',
      embeddingPlaceholder: 'Select an embedding model',
      refreshEmbedding: 'Refresh Models',
      submit: 'Create Dataset',
      nameRequired: 'Dataset name is required.',
      descRequired: 'Description is required.',
      embeddingRequired: 'Please choose an embedding model.',
      modelLoadFailed: 'Failed to load embedding models. Try again later.',
      success: 'Dataset created successfully.',
      successMessage: '{name} is ready. You can now bind it to your app.',
      failed: 'Dataset creation failed. Please try again later.'
    },
    datasetUpload: {
      title: 'Upload Knowledge Base Files',
      tip: 'Upload documents for {name} so your AI assistant can learn from them.',
      placeholder: 'Drop files here or click to select',
      limit: 'Supports PDF, Word, PPT, TXT, Markdown. Max 100MB per file.',
      submit: 'Submit Files',
      fileRequired: 'Please add at least one file.',
      success: '{name} files uploaded successfully.',
      successMessage: 'Documents uploaded. Would you like to add more files?',
      failed: 'File upload failed. Please try again later.',
      startMessage: 'Great! Now upload documents for {name} to finish preparing the knowledge base.',
      moreTitle: 'Upload More Files?',
      moreMessage: 'Do you need to upload additional documents for {name}?',
      moreConfirm: 'Upload More',
      moreCancel: 'Continue AI Setup',
      doneTitle: '{name} is ready for AI setup.',
      doneDescription: 'You can continue configuring your AI application.',
      continueMessage: '{name} upload complete. Continue setting up your AI application.',
      missingDataset: 'Missing knowledge base information. Please create one first.',
      empty: 'No readable content was generated. Please try different documents.',
      saveFailed: 'Failed to store documents in the knowledge base.',
      documentName: 'Document {index}',
      datasetRequired: 'Please finish creating and uploading a knowledge base before saving.'
    },
    chatButton: 'Create Application via AI Chat',
    chatDialogTitle: 'AI Builder Chat',
    chatHeading: 'AI Conversation (Vue + FastAPI)',
    chatPlaceholder: 'Say something...',
    chatSend: 'Send',
    chatLoading: 'Thinking...',
    chatCreatePrompt: 'We have been chatting for a while—would you like to create an AI application now?',
    chatEffortLabel: 'Reasoning effort',
    chatEffortOptions: {
      low: 'low',
      medium: 'medium',
      high: 'high'
    },
    chatWelcome: 'Hello! I am the AI Creation Assistant. How can I help you?',
    chatApiError: '[API Error] {message}',
    chatNetworkError: '[Network Error] {message}',
    chatTemplateListTitle: 'Available application templates',
    chatTemplateListEmpty: 'No templates found. Upload one in System Settings to get started.',
    chatTemplateListLoading: 'Fetching the template list for you...',
    chatTemplateListError: '[Template Error] {message}',
    chatTemplateListUntitled: 'Template #{index}',
    chatTemplateDownloadStart: 'Downloading {name} template...',
    chatTemplateImporting: 'Importing {name} template into your workspace...',
    chatTemplateImportSuccess: '{name} template imported successfully.',
    chatTemplateImportFailed: '[Template Import Failed] {message}',
    chatTemplateMissingPath: '[Template Missing Path] Unable to download {name}.',
    applicationCard: {
      title: 'Select an application to finalize',
      tip: 'Pick the application you want to update before publishing.',
      refresh: 'Refresh',
      empty: 'No applications available yet.',
      listFailed: 'Failed to load applications.',
      detailFailed: 'Failed to load application detail.',
      baseNameRequired: 'Assistant name is required.',
      fields: {
        baseName: 'Assistant Name',
        basePrologue: 'Prologue',
        recipient: 'Recipient Email'
      },
      recipientHint: 'When customers request an order, notifications will be emailed to this inbox.',
      recipientRequired: 'Recipient email is required.',
      submit: 'Save Changes',
      publish: 'Publish',
      saveSuccess: '{name} updated successfully.',
      saveFailed: '[Update Failed] {message}',
      publishSuccess: '{name} published successfully.',
      publishFailed: '[Publish Failed] {message}'
    },
    chatFlowSummary: 'Great! Let me walk you through the Create with AI workflow.',
    chatFlowTitle: 'Create with AI workflow',
    chatFlowIntro: 'Follow these steps to build an application with GPT-5 guidance:',
    chatFlowStep1Title: 'Step 1 · Open “Create with AI”',
    chatFlowStep1Desc:
      'Launch the workspace from the dashboard so GPT-5 can manage templates and datasets for you.',
    chatFlowStep2Title: 'Step 2 · Pick a template',
    chatFlowStep2Desc: 'Select or upload an app template to give the builder a solid foundation.',
    chatFlowStep3Title: 'Step 3 · Describe your goals',
    chatFlowStep3Desc:
      'Share business goals, tone preferences, and datasets so GPT-5 can configure each node.',
    chatFlowStep4Title: 'Step 4 · Bind data & publish',
    chatFlowStep4Desc:
      'Create or link datasets, update the base node, review settings, then publish your AI application.',
    chatFlowNote:
      'Need help? Click “Create with AI” on the card grid to open the full guided experience.',
    chatAccessTokenMissing: 'Missing chat access token. Please configure the application access token first.',
    datasetListTitle: 'Existing Knowledge Bases',
    datasetListEmpty: 'No knowledge bases yet. Create one to continue.',
    datasetListFailed: 'Failed to load existing datasets. Please try again later.',
    unnamedTemplate: 'Untitled Template'
  },
  searchBar: {
    placeholder: 'Search by name'
  },
  userFilter: {
    all: 'All Users'
  },

  setting: {
    demo: 'Demo'
  },
  delete: {
    confirmTitle: 'Are you sure you want to delete this APP: ',
    confirmMessage:
      'Deleting this APP will no longer provide its services. Please proceed with caution.'
  },
  tip: {
    ExportError: 'Export Failed',
    professionalMessage:
      'The supports up to 5 APP. ',
    saveErrorMessage: 'Saving failed, please check your input or try again later',
    loadingErrorMessage: 'Failed to load configuration, please check your input or try again later'
  },

  applicationForm: {
    title: {
      appTest: 'Debug Preview',
      copy: 'copy'
    },
    form: {
      appName: {
        label: 'Name',
        placeholder: 'Please enter the APP name',
        requiredMessage: 'APP name is required'
      },
      appDescription: {
        label: 'Description',
        placeholder:
          'Describe the APP scenario and use, e.g.: XXX assistant answering user questions about XXX product usage'
      },
      appType: {
        label: 'Type',
        simplePlaceholder: 'Suitable for beginners to create assistant.',
        workflowPlaceholder: 'Suitable for advanced users to customize the workflow of assistant'
      },
      appTemplate: {
        blankApp: 'Blank APP',
        assistantApp: 'Knowledge Base Q&A Assistant',
        ecommerceApp: 'E-commerce AI',
        templateMissing: 'Please upload the AI template in System Settings first',
        importFailed: 'Failed to import the AI template. Please try again later',
        pcSetupReminder:
          'Mobile screens cannot fully display the advanced orchestration settings. Please visit https://ai.vnppp.com on a desktop to complete the configuration. Username: your registered email, password: mi123. (Note: don\'t forget the dot.)'
      },
      aiModel: {
        label: 'AI Model',
        placeholder: 'Please select an AI model'
      },
      roleSettings: {
        label: 'System Role',
        placeholder: 'You are xxx assistant'
      },

      prompt: {
        label: 'Prompt',
        noReferences: '（No references Knowledge）',
        references: ' (References Knowledge)',
        placeholder: 'Please enter prompt',
        requiredMessage: 'Please enter prompt',
        tooltip:
          'By adjusting the content of the prompt, you can guide the direction of the large model chat.',

        noReferencesTooltip:
          'By adjusting the content of the prompt, you can guide the direction of the large model chat. This prompt will be fixed at the beginning of the context. Variables used: {question} is the question posed by the user.',
        referencesTooltip:
          'By adjusting the content of the prompt, you can guide the direction of the large model chat. This prompt will be fixed at the beginning of the context. Variables used: {data} carries known information from the knowledge; {question} is the question posed by the user.',
        defaultPrompt: `Known information: {data}
          Question: {question}
           Response requirements: 
           - Please use concise and professional language to answer the user's question.
           `
      },
      historyRecord: {
        label: 'Chat History'
      },
      relatedKnowledge: {
        label: 'Related Knowledge',
        placeholder: 'Related knowledge are displayed here'
      },
      multipleRoundsDialogue: 'Multiple Rounds Dialogue',

      prologue: 'Prologue',
      defaultPrologue:
        'Hello, I am XXX Assistant. You can ask me questions about using XXX.\n- What are the main features of XXX?\n- Which LLM does XXX support?\n- What document types does XXX support?',
      problemOptimization: {
        label: 'Questions Optimization',
        tooltip:
          'Optimize the current question based on historical chat to better match knowledge points.'
      },

      voiceInput: {
        label: 'Voice Input',
        placeholder: 'Please select a speech recognition model',
        requiredMessage: 'Please select a speech input model',
        autoSend: 'Automatic Sending'
      },
      voicePlay: {
        label: 'Voice Playback',
        placeholder: 'Please select a speech synthesis model',
        requiredMessage: 'Please select a speech playback model',
        autoPlay: 'Automatic Playback',
        browser: 'Browser Playback (free)',
        tts: 'TTS Model',
        listeningTest: 'Preview'
      },
      reasoningContent: {
        label: 'Output Thinking',
        tooltip:
          "Please set the thinking label based on the model's return, and the content in the middle of the label will be recognized as the thinking process.",
        start: 'Start',
        end: 'End'
      }
    },
    buttons: {
      publish: 'Save&Publish',
      addModel: 'Add Model'
    },
    dialog: {
      addDataset: 'Add Related Knowledge',
      addDatasetPlaceholder: 'The selected knowledge must use the same embedding model',
      selected: 'Selected',
      countDataset: 'Knowledge',

      selectSearchMode: 'Retrieval Mode',
      vectorSearch: 'Vector Search',
      vectorSearchTooltip:
        'Vector search is a retrieval method based on vector distance calculations, suitable for large data volumes in the knowledge.',
      fullTextSearch: 'Full-text Search',
      fullTextSearchTooltip:
        'Full-text search is a retrieval method based on text similarity, suitable for small data volumes in the knowledge.',
      hybridSearch: 'Hybrid Search',
      hybridSearchTooltip:
        'Hybrid search is a retrieval method based on both vector and text similarity, suitable for medium data volumes in the knowledge.',
      similarityThreshold: 'Lowest Similarity',
      similarityTooltip: 'The higher the similarity, the stronger the correlation.',
      topReferences: 'Top N Segments',
      maxCharacters: 'Maximum  Characters per Reference',
      noReferencesAction: 'When there are no knowledge references',
      continueQuestioning: 'Continue to ask questions to the Al model',
      provideAnswer: 'Specify Reply Content',
      designated_answer:
        'Hello, I am XXX Assistant. My knowledge only contains information related to XXX products. Please rephrase your question.',
      defaultPrompt1:
        "The content inside the parentheses () represents the user's question. Based on the context, please speculate and complete the user's question ({question}). The requirement is to output a completed question and place it",
      defaultPrompt2: 'tag'
    }
  },
  applicationAccess: {
    title: 'APP Access',
    wecom: 'WeCom',
    wecomTip: 'Create WeCom intelligent APP',
    dingtalk: 'DingTalk',
    dingtalkTip: 'Create DingTalk intelligent APP',
    wechat: 'WeChat',
    wechatTip: 'Create WeChat intelligent APP',
    lark: 'Lark',
    larkTip: 'Create Lark intelligent APP',
    setting: 'Setting',
    callback: 'Callback Address',
    callbackTip: 'Please fill in the callback address',
    wecomPlatform: 'WeCom Open Platform',
    wechatPlatform: 'WeChat Open Platform',
    dingtalkPlatform: 'DingTalk Open Platform',
    larkPlatform: 'Lark Open Platform',
    slack: 'Slack',
    slackTip: 'Create Slack intelligent APP',
    wecomSetting: {
      title: 'WeCom Configuration',
      cropId: 'Crop ID',
      cropIdPlaceholder: 'Please enter crop ID',
      agentIdPlaceholder: 'Please enter agent ID',
      secretPlaceholder: 'Please enter secret',
      tokenPlaceholder: 'Please enter token',
      encodingAesKeyPlaceholder: 'Please enter EncodingAESKey',
      authenticationSuccessful: 'Successful',
      urlInfo:
        '-APP management-Self-built-Created APP-Receive messages-Set the "URL" received by the API'
    },
    dingtalkSetting: {
      title: 'DingTalk Configuration',
      clientIdPlaceholder: 'Please enter client ID',
      clientSecretPlaceholder: 'Please enter client secret',
      urlInfo:
        '-On the robot page, set the "Message Receiving Mode" to HTTP mode, and fill in the above URL into the "Message Receiving Address"'
    },
    wechatSetting: {
      title: 'WeChat Configuration',
      appId: 'APP ID',
      appIdPlaceholder: 'Please enter APP ID',
      appSecret: 'APP SECRET',
      appSecretPlaceholder: 'Please enter APP SECRET',
      token: 'TOKEN',
      tokenPlaceholder: 'Please enter TOKEN',
      aesKey: 'Message Encryption Key',
      aesKeyPlaceholder: 'Please enter the message encryption key',
      urlInfo:
        '-Settings and Development-Basic Configuration-"Server Address URL" in server configuration'
    },
    larkSetting: {
      title: 'Lark Configuration',
      appIdPlaceholder: 'Please enter APP ID',
      appSecretPlaceholder: 'Please enter APP secret',
      verificationTokenPlaceholder: 'Please enter verification token',
      urlInfo:
        '-Events and callbacks - event configuration - configure the "request address" of the subscription method'
    },
    slackSetting: {
      title: 'Slack Configuration',
      signingSecretPlaceholder: 'Please enter signing secret',
      botUserTokenPlaceholder: 'Please enter bot user token'
    },
    copyUrl: 'Copy the link and fill it in'
  },
  hitTest: {
    title: 'Retrieval Testing',
    text: 'Test the hitting effect of the Knowledge based on the given query text.',
    emptyMessage1: 'Retrieval Testing results will show here',
    emptyMessage2: 'No matching sections found'
  }
}
