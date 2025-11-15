export default {
  title: '应用',
  createApplication: '创建应用',
  importApplication: '导入应用',
  copyApplication: '复制应用',
  workflow: '高级编排',
  simple: '简单配置',
  aiCreate: {
    button: '用人工智能创造',
    dialogTitle: '人工智能应用程序创建',
    description: '用于创建人工智能辅助应用程序的全屏工作区（即将推出）。',
    inputPlaceholder: '描述您的业务目标或知识库，以便人工智能可以制作应用程序配置',
    submit: '发送',
    submitSuccess: '收到请求。 AI创作体验即将到来。',
    comingSoon: '人工智能创作正在积极开发中。完整的体验即将到来。',
    templateIntro: '首先选择下面的模板，以便人工智能知道如何构建您的应用程序。',
    templateListTitle: '选择一个模板以开始使用',
    templateEmpty: '尚无可用模板。请在系统设置中上传一份。',
    templateDefaultDesc: '使用此模板作为您的 AI 应用程序的基础。',
    templateSelected: '让我们使用 {name} 模板进行构建。',
    templateConfirm: '{name} 模板已锁定。告诉我您下一步想要构建什么体验。',
    templateLoadFailed: '加载模板失败。请稍后重试。',
    templateRequired: '在发送需求之前选择一个模板。',
    templateMissingPath: '该模板缺少下载路径。请联系管理员。',
    templateFetchFailed: '模板下载失败。请重试。',
    templateFetchFailedMessage: '下载 {name} 失败。再试一次或选择另一个模板。',
    templateLoading: '正在加载模板...',
    templateNotReady: '模板处理仍在进行中。请稍等。',
    templateImportSuccess: '{name} 模板已导入。描述您接下来想要构建的内容。',
    templateImportFailed: '模板导入失败。请稍后重试。',
    datasetReminderTitle: '小心',
    datasetReminder: '首先创建并配置知识库，以便应用程序可以正确回答用户问题。',
    applicationListTitle: '家庭应用程序（前 6 个）',
    applicationListEmpty: '还没有应用程序。稍后刷新即可看到新的。',
    applicationListNoDesc: '没有提供描述。',
    appNamePrompt: '打开 {name}。请在工作流程基本信息中配置其APP名称。',
    appNameInstruction: '您正在关注 {workflowPath}。在此处输入应用程序名称以继续。',
    appNamePlaceholder: '输入新的APP名称',
    appNameConfirm: '保存名称',
    appNameRequired: '请先输入应用程序名称。',
    appNameSuccess: '{name} 已更新。',
    appNameFailed: '无法保存应用程序名称。稍后再试。',
    appNameFetchFailed: '无法加载应用详细信息。请重试。',
    appNameSetMessage: '已保存APP名称。继续配置工作流程的其余部分。',
    appDetailFailed: '无法加载应用程序设置。请稍后重试。',
    workflowListTitle: '工作流程节点',
    baseNodeTitle: '基础节点设置',
    baseNodeNameLabel: '助理姓名',
    baseNodeNamePlaceholder: '输入助理姓名',
    baseNodeEmailLabel: '联系邮箱',
    baseNodeEmailPlaceholder: '输入助理邮箱（可选）',
    baseNodePrologueLabel: '序幕',
    baseNodeProloguePlaceholder: '描述用户将看到的欢迎消息',
    baseNodeSubmit: '保存基节点',
    baseNodeNameRequired: '助理姓名为必填项。',
    baseNodeAppNameRequired: '先设置应用名称，然后保存基础节点。',
    baseNodeEmailRequired: '需要联系电子邮件。',
    baseNodeFetchFailed: '无法加载基本节点。请重试。',
    baseNodeMissing: '未找到基节点。检查工作流配置。',
    baseNodeSuccess: '基础节点更新成功。',
    baseNodeFailed: '无法保存基本节点。',
    baseNodeSetMessage: '{name} 基本节点已更新。继续配置工作流程。',
    datasetForm: {
      title: '创建知识库',
      tip: '还没有数据集？在继续您的应用程序设置之前，请在此处快速创建一个。',
      createButton: '保存设置',
      nameLabel: '数据集名称',
      namePlaceholder: '输入数据集名称',
      descLabel: '描述',
      descPlaceholder: '描述该知识库存储的内容',
      typeLabel: '数据集类型',
      typeGeneral: '通用数据集',
      typeWeb: '网络数据集',
      embeddingLabel: '嵌入模型',
      embeddingPlaceholder: '选择嵌入模型',
      refreshEmbedding: '刷新模型',
      submit: '创建数据集',
      nameRequired: '数据集名称是必需的。',
      descRequired: '需要描述。',
      embeddingRequired: '请选择嵌入模型。',
      modelLoadFailed: '无法加载嵌入模型。稍后再试。',
      success: '数据集创建成功。',
      successMessage: '{name} 已准备就绪。您现在可以将其绑定到您的应用程序。',
      failed: '数据集创建失败。请稍后重试。',
    },
    datasetUpload: {
      title: '上传知识库文件',
      tip: '上传 {name} 的文档，以便您的 AI 助手可以从中学习。',
      placeholder: '将文件拖放到此处或单击选择',
      limit: '支持PDF、Word、PPT、TXT、Markdown。每个文件最大 100MB。',
      submit: '提交文件',
      fileRequired: '请添加至少一个文件。',
      success: '{name} 文件已成功上传。',
      successMessage: '文件已上传。您想添加更多文件吗？',
      failed: '文件上传失败。请稍后重试。',
      startMessage: '伟大的！现在上传 {name} 的文档以完成知识库的准备。',
      moreTitle: '上传更多文件？',
      moreMessage: '您需要为 {name} 上传其他文件吗？',
      moreConfirm: '上传更多',
      moreCancel: '继续 AI 设置',
      doneTitle: '{name} 已准备好进行 AI 设置。',
      doneDescription: '您可以继续配置您的 AI 应用程序。',
      continueMessage: '{name} 上传完成。继续设置您的 AI 应用程序。',
      missingDataset: '缺少知识库信息。请先创建一个。',
      empty: '没有生成可读内容。请尝试不同的文档。',
      saveFailed: '无法将文档存储到知识库中。',
      documentName: '文档 {index}',
      datasetRequired: '请在保存之前完成知识库的创建和上传。',
    },
    chatButton: '通过AI聊天创建应用程序',
    chatDialogTitle: '人工智能聊天',
    chatHeading: 'AI对话（Vue + FastAPI）',
    chatPlaceholder: '说些什么...',
    chatSend: '发送',
    chatLoading: '思维...',
    chatCreatePrompt: '我们已经聊了一段时间——您现在想创建一个人工智能应用程序吗？',
    chatEffortLabel: '推理能力',
    chatEffortOptions: {
      low: 'low',
      medium: 'medium',
      high: 'high',
    },
    chatWelcome: '您好！我是AI创建应用助理。我有什么可以帮您？',
    chatApiError: '[API 错误] {message}',
    chatNetworkError: '[网络错误] {message}',
    chatTemplateListTitle: '可用的应用程序模板',
    chatTemplateListEmpty: '没有找到模板。在系统设置中上传一个即可开始使用。',
    chatTemplateListLoading: '正在为您获取模板列表...',
    chatTemplateListError: '[模板错误] {message}',
    chatTemplateListUntitled: '模板#{index}',
    chatTemplateDownloadStart: '正在下载 {name} 模板...',
    chatTemplateImporting: '正在将 {name} 模板导入到您的工作区...',
    chatTemplateImportSuccess: '{name} 模板导入成功。',
    chatTemplateImportFailed: '[模板导入失败] {message}',
    chatTemplateMissingPath: '[模板缺少路径] 无法下载 {name}。',
    applicationCard: {
      title: '选择要完成的应用程序',
      tip: '在发布之前选择您要更新的应用程序。',
      refresh: '刷新',
      empty: '尚无可用的应用程序。',
      listFailed: '无法加载应用程序。',
      detailFailed: '无法加载应用程序详细信息。',
      baseNameRequired: 'AI名字为必填项。',
      fields: {
        baseName: 'AI名字',
        basePrologue: '简介',
        recipient: '电子邮件',
      },
      recipientHint: '当客户有订购需求时，系统会发送邮件至该邮箱，请保持畅通。',
      recipientRequired: '请填写接收通知的邮箱。',
      submit: '保存更改',
      publish: '发布',
      saveSuccess: '{name} 更新成功。',
      saveFailed: '[更新失败] {message}',
      publishSuccess: '{name} 发布成功。',
      publishFailed: '[发布失败] {message}',
    },
    chatFlowSummary: '好的！让我引导您完成使用 AI 进行创建的工作流程。',
    chatFlowTitle: '使用 AI 工作流程进行创作',
    chatFlowIntro: '请按照以下步骤在 AI 指导下构建应用程序：',
    chatFlowStep1Title: '步骤1·打开“用AI创作”',
    chatFlowStep1Desc: '从仪表板启动工作区，以便 GPT-5 可以为您管理模板和数据集。',
    chatFlowStep2Title: '步骤 2 · 选择模板',
    chatFlowStep2Desc: '选择或上传应用程序模板，为构建者奠定坚实的基础。',
    chatFlowStep3Title: '第 3 步 · 描述您的目标',
    chatFlowStep3Desc: '共享业务目标、语气偏好和数据集，以便 GPT-5 可以配置每个节点。',
    chatFlowStep4Title: '步骤4·绑定数据并发布',
    chatFlowStep4Desc: '创建或链接数据集、更新基本节点、检查设置，然后发布您的 AI 应用程序。',
    chatFlowNote: '需要帮助吗？单击卡片网格上的“使用 AI 创建”即可打开完整的引导体验。',
    chatAccessTokenMissing: '缺少聊天访问令牌。请先配置应用程序访问令牌。',
    datasetListTitle: '现有知识库',
    datasetListEmpty: '还没有知识库。创建一个以继续。',
    datasetListFailed: '无法加载现有数据集。请稍后重试。',
    unnamedTemplate: '无标题模板',
  },
  searchBar: {
    placeholder: '按名称搜索'
  },
  userFilter: {
    all: '全部用户'
  },
  setting: {
    demo: '演示'
  },
  delete: {
    confirmTitle: '是否删除应用：',
    confirmMessage: '删除后该应用将不再提供服务，请谨慎操作。'
  },
  tip: {
    ExportError: '导出失败',
    professionalMessage: '最多支持 5 个应用',
    saveErrorMessage: '保存失败，请检查输入或稍后再试',
    loadingErrorMessage: '加载配置失败，请检查输入或稍后再试'
  },
  applicationForm: {
    title: {
      appTest: '调试预览',
      copy: '副本'
    },
    form: {
      appName: {
        label: '名称',
        placeholder: '请输入应用名称',
        requiredMessage: '请输入应用名称'
      },
      appDescription: {
        label: '描述',
        placeholder: '描述该应用的应用场景及用途，如：XXX 小助手回答用户提出的 XXX 产品使用问题'
      },
      appType: {
        label: '类型',
        simplePlaceholder: '适合新手创建小助手',
        workflowPlaceholder: '适合高级用户自定义小助手的工作流'
      },
      appTemplate: {
        blankApp: '空白应用',
        assistantApp: '知识库问答助手',
        ecommerceApp: '电商 AI',
        templateMissing: '请先在系统设置中上传 AI 模板',
        importFailed: 'AI 模板导入失败，请稍后重试',
        pcSetupReminder:
          '手机屏幕无法完整展示高级编排设置，建议前往电脑端访问 https://ai.vnppp.com 完成配置。用户名：您的注册邮箱，密码：mi123。（注意有个点）'
      },
      aiModel: {
        label: 'AI 模型',
        placeholder: '请选择 AI 模型'
      },
      roleSettings: {
        label: '系统角色',
        placeholder: '你是 xxx 小助手'
      },
      prompt: {
        label: '提示词',
        noReferences: ' (无引用知识库)',
        references: ' (引用知识库)',
        placeholder: '请输入提示词',
        requiredMessage: '请输入提示词',
        tooltip:
          '通过调整提示词内容，可以引导大模型聊天方向，该提示词会被固定在上下文的开头，可以使用变量。',
        noReferencesTooltip:
          '通过调整提示词内容，可以引导大模型聊天方向，该提示词会被固定在上下文的开头。可以使用变量：{question} 是用户提出问题的占位符。',
        referencesTooltip:
          '通过调整提示词内容，可以引导大模型聊天方向，该提示词会被固定在上下文的开头。可以使用变量：{data} 是引用知识库中分段的占位符；{question} 是用户提出问题的占位符。',
        defaultPrompt: `已知信息：{data}
用户问题：{question}
回答要求：
 - 请使用中文回答用户问题`
      },
      historyRecord: {
        label: '历史聊天记录'
      },
      relatedKnowledge: {
        label: '关联知识库',
        placeholder: '关联的知识库展示在这里'
      },
      multipleRoundsDialogue: '多轮对话',

      prologue: '开场白',
      defaultPrologue:
        '您好，我是 XXX 小助手，您可以向我提出 XXX 使用问题。\n- XXX 主要功能有什么？\n- XXX 如何收费？\n- 需要转人工服务',

      problemOptimization: {
        label: '问题优化',
        tooltip: '根据历史聊天优化完善当前问题，更利于匹配知识点。'
      },
      voiceInput: {
        label: '语音输入',
        placeholder: '请选择语音识别模型',
        requiredMessage: '请选择语音输入模型',
        autoSend: '自动发送'
      },
      voicePlay: {
        label: '语音播放',
        placeholder: '请选择语音合成模型',
        requiredMessage: '请选择语音播放模型',
        autoPlay: '自动播放',
        browser: '浏览器播放(免费)',
        tts: 'TTS模型',
        listeningTest: '试听'
      },
      reasoningContent: {
        label: '输出思考',
        tooltip: '请根据模型返回的思考标签设置，标签中间的内容将会认定为思考过程',
        start: '开始',
        end: '结束'
      }
    },
    buttons: {
      publish: '保存并发布',

      addModel: '添加模型'
    },

    dialog: {
      addDataset: '添加关联知识库',
      addDatasetPlaceholder: '所选知识库必须使用相同的 Embedding 模型',
      selected: '已选',
      countDataset: '个知识库',

      selectSearchMode: '检索模式',
      vectorSearch: '向量检索',
      vectorSearchTooltip: '向量检索是一种基于向量相似度的检索方式，适用于知识库中的大数据量场景。',
      fullTextSearch: '全文检索',
      fullTextSearchTooltip:
        '全文检索是一种基于文本相似度的检索方式，适用于知识库中的小数据量场景。',
      hybridSearch: '混合检索',
      hybridSearchTooltip:
        '混合检索是一种基于向量和文本相似度的检索方式，适用于知识库中的中等数据量场景。',
      similarityThreshold: '相似度高于',
      similarityTooltip: '相似度越高相关性越强。',
      topReferences: '引用分段数 TOP',
      maxCharacters: '最多引用字符数',
      noReferencesAction: '无引用知识库分段时',
      continueQuestioning: '继续向 AI 模型提问',
      provideAnswer: '指定回答内容',
      designated_answer:
        '你好，我是 XXX 小助手，我的知识库只包含了 XXX 产品相关知识，请重新描述您的问题。',
      defaultPrompt1:
        '()里面是用户问题,根据上下文回答揣测用户问题({question}) 要求: 输出一个补全问题,并且放在',
      defaultPrompt2: '标签中'
    }
  },
  applicationAccess: {
    title: '应用接入',
    wecom: '企业微信应用',
    wecomTip: '打造企业微信智能应用',
    dingtalk: '钉钉应用',
    dingtalkTip: '打造钉钉智能应用',
    wechat: '公众号',
    wechatTip: '打造公众号智能应用',
    lark: '飞书应用',
    larkTip: '打造飞书智能应用',
    slack: 'Slack',
    slackTip: '打造 Slack 智能应用',
    setting: '配置',
    callback: '回调地址',
    callbackTip: '请输入回调地址',
    wecomPlatform: '企业微信后台',
    wechatPlatform: '微信公众平台',
    dingtalkPlatform: '钉钉开放平台',
    larkPlatform: '飞书开放平台',
    wecomSetting: {
      title: '企业微信应用配置',
      cropId: '企业 ID',
      cropIdPlaceholder: '请输入企业 ID',
      agentIdPlaceholder: '请输入Agent ID',
      secretPlaceholder: '请输入Secret',
      tokenPlaceholder: '请输入Token',
      encodingAesKeyPlaceholder: '请输入EncodingAESKey',
      authenticationSuccessful: '认证成功',
      urlInfo: '-应用管理-自建-创建的应用-接收消息-设置 API 接收的 "URL" 中'
    },
    dingtalkSetting: {
      title: '钉钉应用配置',
      clientIdPlaceholder: '请输入Client ID',
      clientSecretPlaceholder: '请输入Client Secret',
      urlInfo: '-机器人页面，设置 "消息接收模式" 为 HTTP模式 ，并把上面URL填写到"消息接收地址"中'
    },
    wechatSetting: {
      title: '公众号应用配置',
      appId: '开发者ID (APP ID)',
      appIdPlaceholder: '请输入开发者ID (APP ID)',
      appSecret: '开发者密钥 (APP SECRET)',
      appSecretPlaceholder: '请输入开发者密钥 (APP SECRET)',
      token: '令牌 (TOKEN)',
      tokenPlaceholder: '请输入令牌 (TOKEN)',
      aesKey: '消息加解密密钥',
      aesKeyPlaceholder: '请输入消息加解密密钥',
      urlInfo: '-设置与开发-基本配置-服务器配置的 "服务器地址URL" 中'
    },
    larkSetting: {
      title: '飞书应用配置',
      appIdPlaceholder: '请输入App ID',
      appSecretPlaceholder: '请输入App Secret',
      verificationTokenPlaceholder: '请输入Verification Token',
      urlInfo: '-事件与回调-事件配置-配置订阅方式的 "请求地址" 中'
    },
    slackSetting: {
      title: 'Slack 应用配置',
      signingSecretPlaceholder: '请输入 Signing Secret',
      botUserTokenPlaceholder: '请输入 Bot User Token'
    },
    copyUrl: '复制链接填入到'
  },
  hitTest: {
    title: '命中测试',
    text: '针对用户提问调试段落匹配情况，保障回答效果。',
    emptyMessage1: '命中段落显示在这里',
    emptyMessage2: '没有命中的分段'
  }
}
