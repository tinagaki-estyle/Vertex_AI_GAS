/**
 * Vertex AI Search（File Search）付きで Gemini に質問する
 */
function askWithFileSearch_(userText) {
  const PROJECT_ID = CONFIG.PROJECT_ID;          // "decisive-window-477904-h3"
  const MODEL      = CONFIG.MODEL;               // "gemini-2.5-flash"
  const MODEL_LOCATION = "us-central1";          // ★ここ重要：global ではない
  const DATASTORE_LOCATION = "global";           // File Search は global のままでOK
  const DATA_STORE_ID = "hrs_1764051018131_google_drive";

  const accessToken = getAccessToken_();

  // ★モデル呼び出し URL は us-central1 などのリージョン
  const url = `https://${MODEL_LOCATION}-aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/${MODEL_LOCATION}/publishers/google/models/${MODEL}:generateContent`;

  // ★File Search datastore は global
  const datastorePath =
    `projects/${PROJECT_ID}/locations/${DATASTORE_LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: userText }],
      },
    ],
    tools: [
      {
        retrieval: {
          vertexAiSearch: {
            datastore: datastorePath,
          },
        },
      },
    ],
    model: `projects/${PROJECT_ID}/locations/${MODEL_LOCATION}/publishers/google/models/${MODEL}`,
  };

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  const body = res.getContentText();

  if (code < 200 || code >= 300) {
    throw new Error(`generateContent failed: ${code} ${body}`);
  }

  const json = JSON.parse(body);
  const candidate = json.candidates && json.candidates[0];

  if (!candidate) {
    return { text: "", context: [] };
  }

  const text =
    candidate.content &&
    candidate.content.parts &&
    candidate.content.parts[0] &&
    candidate.content.parts[0].text || "";

  const contexts = [];
  const chunks =
    (candidate.groundingMetadata &&
      candidate.groundingMetadata.groundingChunks) ||
    [];

  chunks.forEach((chunk) => {
    if (chunk.retrievedContext && chunk.retrievedContext.text) {
      contexts.push(chunk.retrievedContext.text);
    }
  });

  return { text, context: contexts };
}

function getAccessToken_() {
  return ScriptApp.getOAuthToken();
}
