function doGet(e) {
  return ContentService.createTextOutput("Use POST");
}

function doPost(e) {
  const result = runFileSearchAndReturn_();
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * File Search + Gemini を実行して最終結果を返す
 */
function runFileSearchAndReturn_() {
  console.log('=== File Search 処理開始 === モデル: ' + CONFIG.MODEL);

  console.log('Gemini に質問を投げます。プロンプト: ' + CONFIG.PROMPT);
  const answer = askWithFileSearch_(CONFIG.PROMPT);

  console.log("LLM回答本文:", answer.text);
  console.log("返却された context 件数:", answer.context?.length || 0);

  const persons = [];

  if (answer.context && Array.isArray(answer.context)) {
    answer.context.forEach((ctx, index) => {
      try {
        const parsed = JSON.parse(ctx);
        if (parsed.profile) {
          persons.push({
            profile: parsed.profile,
            projects: parsed.projects || [],
          });
        } else {
          console.warn(`Context ${index} に profile が見つかりません`, parsed);
        }
      } catch (e) {
        console.error(`Context ${index} の JSON パースエラー`, e, ctx);
      }
    });
  }

  console.log("バックエンドで抽出した persons:", persons);
  console.log('=== File Search 処理終了 ===');

  return {
    text: answer.text,
    context: answer.context,
    persons: persons,
  };
}
