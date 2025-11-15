export default {
  title: '應用',
  createApplication: '建立應用',
  importApplication: '匯入應用',
  copyApplication: '複製應用',
  workflow: '進階編排',
  simple: '簡單配置',
  aiCreate: {
    button: '用人工智能創造',
    dialogTitle: '人工智能應用程序創建',
    description: '用於創建人工智能輔助應用程序的全屏工作區（即將推出）。',
    inputPlaceholder: '描述您的業務目標或知識庫，以便人工智能可以製作應用程序配置',
    submit: '發送',
    submitSuccess: '收到請求。 AI創作體驗即將到來。',
    comingSoon: '人工智能創作正在積極開發中。完整的體驗即將到來。',
    templateIntro: '首先選擇下面的模板，以便人工智能知道如何構建您的應用程序。',
    templateListTitle: '選擇一個模板以開始使用',
    templateEmpty: '尚無可用模板。請在系統設置中上傳一份。',
    templateDefaultDesc: '使用此模板作為您的 AI 應用程序的基礎。',
    templateSelected: '讓我們使用 {name} 模板進行構建。',
    templateConfirm: '{name} 模板已鎖定。告訴我您下一步想要構建什麼體驗。',
    templateLoadFailed: '加載模板失敗。請稍後重試。',
    templateRequired: '在發送需求之前選擇一個模板。',
    templateMissingPath: '該模板缺少下載路徑。請聯繫管理員。',
    templateFetchFailed: '模板下載失敗。請重試。',
    templateFetchFailedMessage: '下載 {name} 失敗。再試一次或選擇另一個模板。',
    templateLoading: '正在加載模板...',
    templateNotReady: '模板處理仍在進行中。請稍等。',
    templateImportSuccess: '{name} 模板已導入。描述您接下來想要構建的內容。',
    templateImportFailed: '模板導入失敗。請稍後重試。',
    datasetReminderTitle: '小心',
    datasetReminder: '首先創建並配置知識庫，以便應用程序可以正確回答用戶問題。',
    applicationListTitle: '家庭應用程序（前 6 個）',
    applicationListEmpty: '還沒有應用程序。稍後刷新即可看到新的。',
    applicationListNoDesc: '沒有提供描述。',
    appNamePrompt: '打開 {name}。請在工作流程基本信息中配置其APP名稱。',
    appNameInstruction: '您正在關注 {workflowPath}。在此處輸入應用程序名稱以繼續。',
    appNamePlaceholder: '輸入新的APP名稱',
    appNameConfirm: '保存名稱',
    appNameRequired: '請先輸入應用程序名稱。',
    appNameSuccess: '{name} 已更新。',
    appNameFailed: '無法保存應用程序名稱。稍後再試。',
    appNameFetchFailed: '無法加載應用詳細信息。請重試。',
    appNameSetMessage: '已保存APP名稱。繼續配置工作流程的其餘部分。',
    appDetailFailed: '無法加載應用程序設置。請稍後重試。',
    workflowListTitle: '工作流程節點',
    baseNodeTitle: '基礎節點設置',
    baseNodeNameLabel: '助理姓名',
    baseNodeNamePlaceholder: '輸入助理姓名',
    baseNodeEmailLabel: '聯繫郵箱',
    baseNodeEmailPlaceholder: '輸入助理郵箱（可選）',
    baseNodePrologueLabel: '序幕',
    baseNodeProloguePlaceholder: '描述用戶將看到的歡迎消息',
    baseNodeSubmit: '保存基節點',
    baseNodeNameRequired: '助理姓名為必填項。',
    baseNodeAppNameRequired: '先設置應用名稱，然後保存基礎節點。',
    baseNodeEmailRequired: '需要聯繫電子郵件。',
    baseNodeFetchFailed: '無法加載基本節點。請重試。',
    baseNodeMissing: '未找到基節點。檢查工作流配置。',
    baseNodeSuccess: '基礎節點更新成功。',
    baseNodeFailed: '無法保存基本節點。',
    baseNodeSetMessage: '{name} 基本節點已更新。繼續配置工作流程。',
    datasetForm: {
      title: '創建知識庫',
      tip: '還沒有數據集？在繼續您的應用程序設置之前，請在此處快速創建一個。',
      createButton: '保存設置',
      nameLabel: '數據集名稱',
      namePlaceholder: '輸入數據集名稱',
      descLabel: '描述',
      descPlaceholder: '描述這個知識庫存放的內容',
      typeLabel: '數據集類型',
      typeGeneral: '通用數據集',
      typeWeb: '網絡數據集',
      embeddingLabel: '嵌入模型',
      embeddingPlaceholder: '選擇嵌入模型',
      refreshEmbedding: '刷新模型',
      submit: '創建數據集',
      nameRequired: '數據集名稱是必需的。',
      descRequired: '需要描述。',
      embeddingRequired: '請選擇嵌入模型。',
      modelLoadFailed: '無法加載嵌入模型。稍後再試。',
      success: '數據集創建成功。',
      successMessage: '{name} 已準備就緒。您現在可以將其綁定到您的應用程序。',
      failed: '數據集創建失敗。請稍後重試。',
    },
    datasetUpload: {
      title: '上傳知識庫文件',
      tip: '上傳 {name} 的文檔，以便您的 AI 助手可以從中學習。',
      placeholder: '將文件拖放到此處或單擊選擇',
      limit: '支持PDF、Word、PPT、TXT、Markdown。每個文件最大 100MB。',
      submit: '提交文件',
      fileRequired: '請添加至少一個文件。',
      success: '{name} 文件已成功上傳。',
      successMessage: '文件已上傳。您想添加更多文件嗎？',
      failed: '文件上傳失敗。請稍後重試。',
      startMessage: '偉大的！現在上傳 {name} 的文檔以完成知識庫的準備。',
      moreTitle: '上傳更多文件？',
      moreMessage: '您需要為 {name} 上傳其他文件嗎？',
      moreConfirm: '上傳更多',
      moreCancel: '繼續 AI 設置',
      doneTitle: '{name} 已準備好進行 AI 設置。',
      doneDescription: '您可以繼續配置您的 AI 應用程序。',
      continueMessage: '{name} 上傳完成。繼續設置您的 AI 應用程序。',
      missingDataset: '缺少知識庫信息。請先創建一個。',
      empty: '沒有生成可讀內容。請嘗試不同的文檔。',
      saveFailed: '無法將文檔存儲到知識庫中。',
      documentName: '文檔 {index}',
      datasetRequired: '請在保存之前完成知識庫的創建和上傳。',
    },
    chatButton: '通過AI聊天創建應用程序',
    chatDialogTitle: '人工智能生成器聊天',
    chatHeading: 'AI對話（Vue + FastAPI）',
    chatPlaceholder: '說些什麼...',
    chatSend: '發送',
    chatLoading: '思維...',
    chatCreatePrompt: '我們已經聊了一段時間——您現在想創建一個人工智能應用程序嗎？',
    chatEffortLabel: '推理努力',
    chatEffortOptions: {
      low: '低的',
      medium: '中等的',
      high: '高的',
    },
    chatWelcome: '你好！我是AI創作助理。我怎麼幫你？',
    chatApiError: '[API 錯誤] {message}',
    chatNetworkError: '[網絡錯誤] {message}',
    chatTemplateListTitle: '可用的應用程序模板',
    chatTemplateListEmpty: '沒有找到模板。在系統設置中上傳一個即可開始使用。',
    chatTemplateListLoading: '正在為您獲取模板列表...',
    chatTemplateListError: '[模板錯誤] {message}',
    chatTemplateListUntitled: '模板#{index}',
    chatTemplateDownloadStart: '正在下載 {name} 模板...',
    chatTemplateImporting: '正在將 {name} 模板導入到您的工作區...',
    chatTemplateImportSuccess: '{name} 模板導入成功。',
    chatTemplateImportFailed: '[模板導入失敗] {message}',
    chatTemplateMissingPath: '[模板缺少路徑] 無法下載 {name}。',
    applicationCard: {
      title: '選擇要完成的應用程序',
      tip: '在發布之前選擇您要更新的應用程序。',
      refresh: '重新整理',
      empty: '尚無可用的應用程序。',
      listFailed: '無法加載應用程序。',
      detailFailed: '無法加載應用程序詳細信息。',
      baseNameRequired: '助理姓名為必填項。',
      fields: {
        baseName: '助理姓名',
        basePrologue: '序幕',
        recipient: '收件人電子郵件',
      },
      recipientHint: '當客戶提出訂購需求時，系統會將通知寄到此信箱，請保持暢通。',
      recipientRequired: '請填寫接收通知的信箱。',
      submit: '保存更改',
      publish: '發布',
      saveSuccess: '{name} 更新成功。',
      saveFailed: '[更新失敗] {message}',
      publishSuccess: '{name} 發布成功。',
      publishFailed: '[發布失敗] {message}',
    },
    chatFlowSummary: '偉大的！讓我引導您完成使用 AI 進行創建的工作流程。',
    chatFlowTitle: '使用 AI 工作流程進行創作',
    chatFlowIntro: '請按照以下步驟在 GPT-5 指導下構建應用程序：',
    chatFlowStep1Title: '步驟1·打開“用AI創作”',
    chatFlowStep1Desc: '從儀表板啟動工作區，以便 GPT-5 可以為您管理模板和數據集。',
    chatFlowStep2Title: '步驟 2 · 選擇模板',
    chatFlowStep2Desc: '選擇或上傳應用程序模板，為構建者奠定堅實的基礎。',
    chatFlowStep3Title: '第 3 步 · 描述您的目標',
    chatFlowStep3Desc: '共享業務目標、語氣偏好和數據集，以便 GPT-5 可以配置每個節點。',
    chatFlowStep4Title: '步驟4·綁定數據並發布',
    chatFlowStep4Desc: '創建或鏈接數據集、更新基本節點、檢查設置，然後發布您的 AI 應用程序。',
    chatFlowNote: '需要幫助嗎？單擊卡片網格上的“使用 AI 創建”即可打開完整的引導體驗。',
    chatAccessTokenMissing: '缺少聊天訪問令牌。請先配置應用程序訪問令牌。',
    datasetListTitle: '現有知識庫',
    datasetListEmpty: '還沒有知識庫。創建一個以繼續。',
    datasetListFailed: '無法加載現有數據集。請稍後重試。',
    unnamedTemplate: '無標題模板',
  },
  searchBar: {
    placeholder: '按名稱搜尋'
  },
  setting: {
    demo: '示範'
  },
  delete: {
    confirmTitle: '是否刪除應用：',
    confirmMessage: '刪除後該應用將不再提供服務，請謹慎操作。'
  },
  tip: {
    ExportError: '匯出失敗',
    professionalMessage: '最多支援 5 個應用。',
    saveErrorMessage: '儲存失敗，請檢查輸入或稍後再試',
    loadingErrorMessage: '載入配置失敗，請檢查輸入或稍後再試'
  },
  applicationForm: {
    title: {
      appTest: '調試預覽',
      copy: '副本'
    },
    form: {
      appName: {
        label: '名稱',
        placeholder: '請輸入應用名稱',
        requiredMessage: '請輸入應用名稱'
      },
      appDescription: {
        label: '描述',
        placeholder: '描述該應用的應用場景及用途，如：XXX 小助手回答用戶提出的 XXX 產品使用問題'
      },
      appType: {
        label: '類型',
        simplePlaceholder: '適合新手建立小助手',
        workflowPlaceholder: '適合高階用戶自訂小助手的工作流程'
      },
      appTemplate: {
        blankApp: '空白應用',
        assistantApp: '知識庫問答助手',
        ecommerceApp: '電商 AI',
        templateMissing: '請先在系統設定中上傳 AI 範本',
        importFailed: 'AI 範本匯入失敗，請稍後再試',
        pcSetupReminder:
          '手機螢幕無法完整顯示進階編排設定，建議改用電腦造訪 https://ai.vnppp.com 完成設定。使用者名稱：您的註冊信箱，密碼：mi123。（請注意有一個點）'
      },
      aiModel: {
        label: 'AI 模型',
        placeholder: '請選擇 AI 模型'
      },
      roleSettings: {
        label: '角色設定',
        placeholder: '你是 xxx 小助手'
      },
      prompt: {
        label: '提示詞',
        noReferences: ' (無引用知識庫)',
        references: ' (引用知識庫)',
        placeholder: '請輸入提示詞',
        requiredMessage: '請輸入提示詞',
        tooltip:'透過調整提示詞內容，可以引導大模型對話方向，該提示詞會被固定在上下文的開頭。',
        
        noReferencesTooltip:
          '透過調整提示詞內容，可以引導大模型對話方向，該提示詞會被固定在上下文的開頭。可以使用變數：{question} 是用戶提出問題的佔位符。',
        referencesTooltip:
          '透過調整提示詞內容，可以引導大模型對話方向，該提示詞會被固定在上下文的開頭。可以使用變數：{data} 是引用知識庫中分段的佔位符；{question} 是用戶提出問題的佔位符。',
        defaultPrompt: `已知資訊：{data}
用戶問題：{question}
回答要求：
 - 請使用中文回答用戶問題`
      },
      historyRecord: {
        label: '歷史對話紀錄'
      },
      relatedKnowledge: {
        label: '關聯知識庫',
        placeholder: '關聯的知識庫展示在這裡'
      },
      multipleRoundsDialogue: '多輪對話',

      prologue: '開場白',
      defaultPrologue:
        '您好，我是 XXX 小助手，您可以向我提出 XXX 使用問題。\n- XXX 主要功能有什麼？\n- XXX 如何收費？\n- 需要轉人工服務',

      problemOptimization: {
        label: '問題優化',
        tooltip: '根據歷史對話優化完善當前問題，更利於匹配知識點。'
      },
      voiceInput: {
        label: '語音輸入',
        placeholder: '請選擇語音辨識模型',
        requiredMessage: '請選擇語音輸入模型',
        autoSend: '自動發送'
      },
      voicePlay: {
        label: '語音播放',
        placeholder: '請選擇語音合成模型',
        requiredMessage: '請選擇語音播放模型',
        autoPlay: '自動播放',
        browser: '瀏覽器播放(免費)',
        tts: 'TTS模型',
        listeningTest: '試聽'
      },
      reasoningContent: {
        label: '輸出思考',
        tooltip:'請根據模型返回的思考標簽設置，標簽中間的內容將會認定爲思考過程',
        start: '開始',
        end: '結束',
      }
    },
    buttons: {
      publish: '儲存並發佈',
      addModel: '新增模型'
    },

    dialog: {
      addDataset: '新增關聯知識庫',
      addDatasetPlaceholder: '所選知識庫必須使用相同的 Embedding 模型',
      selected: '已選',
      countDataset: '個知識庫',

      selectSearchMode: '檢索模式',
      vectorSearch: '向量檢索',
      vectorSearchTooltip: '向量檢索是一種基於向量相似度的檢索方式，適用於知識庫中的大數據量場景。',
      fullTextSearch: '全文檢索',
      fullTextSearchTooltip:
        '全文檢索是一種基於文本相似度的檢索方式，適用於知識庫中的小數據量場景。',
      hybridSearch: '混合檢索',
      hybridSearchTooltip:
        '混合檢索是一種基於向量和文本相似度的檢索方式，適用於知識庫中的中等數據量場景。',
      similarityThreshold: '相似度高於',
      similarityTooltip: '相似度越高相關性越強。',
      topReferences: '引用分段數 TOP',
      maxCharacters: '最多引用字元數',
      noReferencesAction: '無引用知識庫分段時',
      continueQuestioning: '繼續向 AI 模型提問',
      provideAnswer: '指定回答內容',
      designated_answer:
        '你好，我是 XXX 小助手，我的知識庫只包含了 XXX 產品相關知識，請重新描述您的問題。',
      defaultPrompt1:
        '()裡面是用戶問題,根據上下文回答揣測用戶問題({question}) 要求: 輸出一個補全問題,並且放在',
      defaultPrompt2: '標籤中'
    }
  },
  applicationAccess: {
    title: '應用接入',
    wecom: '企業微信應用',
    wecomTip: '打造企業微信智慧應用',
    dingtalk: '釘釘應用',
    dingtalkTip: '打造釘釘智慧應用',
    wechat: '公眾號',
    wechatTip: '打造公眾號智慧應用',
    lark: '飛書應用',
    larkTip: '打造飛書智慧應用',
    slack: 'Slack',
    slackTip: '打造 Slack 智慧應用',
    setting: '配置',
    callback: '回呼位址',
    callbackTip: '請輸入回呼位址',
    wecomPlatform: '企業微信後台',
    wechatPlatform: '微信公众平台',
    dingtalkPlatform: '釘釘開放平台',
    larkPlatform: '飛書開放平台',
    wecomSetting: {
      title: '企業微信應用配置',
      cropId: '企業 ID',
      cropIdPlaceholder: '請輸入企業 ID',
      agentIdPlaceholder: '請輸入Agent ID',
      secretPlaceholder: '請輸入Secret',
      tokenPlaceholder: '請輸入Token',
      encodingAesKeyPlaceholder: '請輸入EncodingAESKey',
      authenticationSuccessful: '認證成功',
      urlInfo: '-應用管理-自建-建立的應用-接收消息-設定 API 接收的 "URL" 中'
    },
    dingtalkSetting: {
      title: '釘釘應用配置',
      clientIdPlaceholder: '請輸入Client ID',
      clientSecretPlaceholder: '請輸入Client Secret',
      urlInfo: '-機器人頁面，設定 "消息接收模式" 為 HTTP模式 ，並把上面URL填寫到"消息接收位址"中'
    },
    wechatSetting: {
      title: '公眾號應用配置',
      appId: '開發者ID (APP ID)',
      appIdPlaceholder: '請輸入開發者ID (APP ID)',
      appSecret: '開發者密鑰 (APP SECRET)',
      appSecretPlaceholder: '請輸入開發者密鑰 (APP SECRET)',
      token: '權杖 (TOKEN)',
      tokenPlaceholder: '請輸入權杖 (TOKEN)',
      aesKey: '消息加解密密鑰',
      aesKeyPlaceholder: '請輸入消息加解密密鑰',
      urlInfo: '-設定與開發-基本配置-伺服器配置的 "伺服器位址URL" 中'
    },
    larkSetting: {
      title: '飛書應用配置',
      appIdPlaceholder: '請輸入App ID',
      appSecretPlaceholder: '請輸入App Secret',
      verificationTokenPlaceholder: '請輸入Verification Token',
      urlInfo: '-事件與回呼-事件配置-配置訂閱方式的 "請求位址" 中'
    },
    slackSetting: {
      title: 'Slack 應用配置',
      signingSecretPlaceholder: '請輸入 Signing Secret',
      botUserTokenPlaceholder: '請輸入 Bot User Token',
    },
    copyUrl: '複製連結填入到'
  },
  hitTest: {
    title: '命中測試',
    text: '針對用戶提問調試段落匹配情況，保障回答效果。',
    emptyMessage1: '命中的段落顯示在這裡',
    emptyMessage2: '沒有命中的分段'
  }
}
