/**
 * 全体設定
 */
const CONFIG = {  
  // --- 質問内容 ---
  PROMPT: "私の datastore の中から RAG の経験があるエンジニアを抽出してください。",

  //MODEL: 'models/gemini-3-pro-preview',
  MODEL: 'gemini-2.5-flash',

  // "" の場合は新規作成、使い回しは非推奨
  EXISTING_STORE_NAME: 'hrs_1764051018131',

  // --- 認証 ---
  USE_SECRET_MANAGER: false,
  PROJECT_ID: 'decisive-window-477904-h3', // Secret Manager を使うときに設定

  // --- インデックス完了待ち ---
  OPERATION_POLL_MAX: 60,      // ループ回数（× POLL_INTERVAL_MS）
  POLL_INTERVAL_MS: 5000,      // 1回あたりの待機 (ms)

  OPERATION_POLL_INTERVAL_MS: 20000, // 20s

  LOCATION:'global',

  PROJECTION_ID: 'decisive-window-477904-h3',

};
