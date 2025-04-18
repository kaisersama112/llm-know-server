export default {
  "title": "システム",
  "test": "接続テスト",
  "testSuccess": "成功",
  "testFailed": "接続テスト失敗",
  "password": "パスワード",
  "authentication": {
    "title": "ログイン認証",
    "ldap": {
      "title": "LDAP",
      "address": "LDAPアドレス",
      "serverPlaceholder": "LDAPアドレスを入力",
      "bindDN": "バインドDN",
      "bindDNPlaceholder": "バインドDNを入力",
      "ou": "ユーザーOU",
      "ouPlaceholder": "ユーザーOUを入力",
      "ldap_filter": "ユーザーフィルター",
      "ldap_filterPlaceholder": "ユーザーフィルターを入力",
      "ldap_mapping": "属性マッピング",
      "ldap_mappingPlaceholder": "属性マッピングを入力",
      "enableAuthentication": "LDAP認証を有効化"
    },
    "cas": {
      "title": "CAS",
      "ldpUri": "ldpURI",
      "ldpUriPlaceholder": "ldpURIを入力",
      "validateUrl": "検証URL",
      "validateUrlPlaceholder": "検証URLを入力",
      "redirectUrl": "コールバックURL",
      "redirectUrlPlaceholder": "コールバックURLを入力",
      "enableAuthentication": "CAS認証を有効化"
    },
    "oidc": {
      "title": "OIDC",
      "authEndpoint": "認証エンドポイント",
      "authEndpointPlaceholder": "認証エンドポイントを入力",
      "tokenEndpoint": "トークンエンドポイント",
      "tokenEndpointPlaceholder": "トークンエンドポイントを入力",
      "userInfoEndpoint": "ユーザー情報エンドポイント",
      "userInfoEndpointPlaceholder": "ユーザー情報エンドポイントを入力",
      "clientId": "クライアントID",
      "clientIdPlaceholder": "クライアントIDを入力",
      "scopePlaceholder": "スコープを入力",
      "clientSecret": "クライアントシークレット",
      "clientSecretPlaceholder": "クライアントシークレットを入力",
      "logoutEndpoint": "ログアウトエンドポイント",
      "logoutEndpointPlaceholder": "ログアウトエンドポイントを入力",
      "redirectUrl": "リダイレクトURL",
      "redirectUrlPlaceholder": "リダイレクトURLを入力",
      "enableAuthentication": "OIDC認証を有効化"
    },
    "oauth2": {
      "title": "OAuth2",
      "authEndpoint": "認証エンドポイント",
      "authEndpointPlaceholder": "認証エンドポイントを入力",
      "tokenEndpoint": "トークンエンドポイント",
      "tokenEndpointPlaceholder": "トークンエンドポイントを入力",
      "userInfoEndpoint": "ユーザー情報エンドポイント",
      "userInfoEndpointPlaceholder": "ユーザー情報エンドポイントを入力",
      "scope": "スコープ",
      "scopePlaceholder": "スコープを入力",
      "clientId": "クライアントID",
      "clientIdPlaceholder": "クライアントIDを入力",
      "clientSecret": "クライアントシークレット",
      "clientSecretPlaceholder": "クライアントシークレットを入力",
      "redirectUrl": "リダイレクトURL",
      "redirectUrlPlaceholder": "リダイレクトURLを入力",
      "filedMapping": "フィールドマッピング",
      "filedMappingPlaceholder": "フィールドマッピングを入力",
      "enableAuthentication": "OAuth2認証を有効化"
    },
    "scanTheQRCode": {
      "title": "QRコード認証",
      "wecom": "WeCom",
      "dingtalk": "DingTalk",
      "lark": "Lark",
      "effective": "有効",
      "alreadyTurnedOn": "有効中",
      "notEnabled": "無効",
      "validate": "検証",
      "validateSuccess": "成功",
      "validateFailed": "検証失敗",
      "validateFailedTip": "必須項目を入力し形式を確認してください",
      "appKeyPlaceholder": "APPキーを入力",
      "appSecretPlaceholder": "APPシークレットを入力",
      "corpIdPlaceholder": "企業IDを入力",
      "agentIdPlaceholder": "エージェントIDを入力",
      "callbackWarning": "有効なURLアドレスを入力してください",
      "larkQrCode": "Lark QRコード認証",
      "dingtalkQrCode": "DingTalk QRコード認証",
      "setting": "設定",
      "access": "アクセス"
    }
  },
  "theme": {
    "title": "外観設定",
    "platformDisplayTheme": "プラットフォームテーマ",
    "customTheme": "カスタムテーマ",
    "platformLoginSettings": "ログイン画面設定",
    "custom": "カスタム",
    "pagePreview": "プレビュー",
    "default": "デフォルト",
    "restoreDefaults": "デフォルトに戻す",
    "orange": "オレンジ",
    "green": "グリーン",
    "purple": "パープル",
    "red": "レッド",
    "loginBackground": "ログイン背景画像",
    "loginLogo": "ログインロゴ",
    "websiteLogo": "サイトロゴ",
    "replacePicture": "画像を変更",
    "websiteLogoTip": "推奨サイズ:48x48px JPG/PNG/GIF形式対応 最大10MB",
    "loginLogoTip": "推奨サイズ:204x52px JPG/PNG/GIF形式対応 最大10MB",
    "loginBackgroundTip": "推奨サイズ:576x900px（ベクター）または1152x1800px（ビットマップ）最大10MB",
    "websiteName": "サイト名",
    "websiteNamePlaceholder": "サイト名を入力",
    "websiteNameTip": "ブラウザタブに表示される名称",
    "websiteSlogan": "ウェルカムメッセージ",
    "websiteSloganPlaceholder": "ウェルカムメッセージを入力",
    "websiteSloganTip": "ロゴ下部に表示されるメッセージ",
    "defaultSlogan": "すぐ使える柔軟なRAGチャットボット",
    "defaultTip": "デフォルトはLLM-Knowプラットフォームインターフェース",
    "logoDefaultTip": "デフォルトはLLM-Knowログイン画面",
    "platformSetting": "プラットフォーム設定",
    "showUserManual": "ユーザーマニュアル表示",
    "showForum": "フォーラム表示",
    "showProject": "プロジェクトアドレス表示",
    "urlPlaceholder": "URLアドレスを入力",
    "abandonUpdate": "変更を破棄",
    "saveAndApply": "保存して適用",
    "fileMessageError": "ファイルサイズ10MB超過",
    "saveSuccess": "外観設定が適用されました"
  },
  "email": {
    "title": "メール設定",
    "smtpHost": "SMTPホスト",
    "smtpHostPlaceholder": "SMTPホストを入力",
    "smtpPort": "SMTPポート",
    "smtpPortPlaceholder": "SMTPポートを入力",
    "smtpUser": "SMTPユーザー",
    "smtpUserPlaceholder": "SMTPユーザー名を入力",
    "sendEmail": "送信元メール",
    "sendEmailPlaceholder": "送信元メールアドレスを入力",
    "smtpPassword": "SMTPパスワード",
    "smtpPasswordPlaceholder": "SMTPパスワードを入力",
    "enableSSL": "SSLを有効化（ポート465使用時）",
    "enableTLS": "TLSを有効化（ポート587使用時）"
  }
}