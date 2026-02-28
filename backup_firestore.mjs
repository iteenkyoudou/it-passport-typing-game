#!/usr/bin/env node
/**
 * Firestore バックアップスクリプト（Sparkプラン対応）
 * Firestore REST API を使用してローカルにJSONバックアップを取得する
 * 依存: なし（Node.js 18+ の組み込み fetch を使用）
 */

const PROJECT_ID = 'it-passport-typing-game';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// バックアップ対象のドキュメントパス
const DOCUMENTS = [
  'game_data/rankings',
  'game_data/unlocked_titles',
];

/** Firestore REST APIのValue型を通常のJSオブジェクトに変換 */
function parseFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  if (value.mapValue !== undefined) {
    return parseFirestoreFields(value.mapValue.fields || {});
  }
  return value;
}

/** Firestore REST APIのfieldsオブジェクトをパース */
function parseFirestoreFields(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }
  return result;
}

async function fetchDocument(docPath) {
  const url = `${BASE_URL}/${docPath}`;
  console.log(`  取得中: ${docPath} ...`);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${docPath}: ${text}`);
  }
  const raw = await res.json();
  return {
    _path: docPath,
    _rawFields: raw.fields,
    data: parseFirestoreFields(raw.fields || {}),
    createTime: raw.createTime,
    updateTime: raw.updateTime,
  };
}

async function main() {
  console.log('=== Firestore バックアップ開始 ===');
  console.log(`プロジェクト: ${PROJECT_ID}\n`);

  const backup = {
    projectId: PROJECT_ID,
    backupDate: new Date().toISOString(),
    documents: {},
  };

  for (const docPath of DOCUMENTS) {
    try {
      const doc = await fetchDocument(docPath);
      backup.documents[docPath] = doc;
      console.log(`  OK: ${docPath}`);
    } catch (err) {
      console.error(`  ERROR: ${docPath} - ${err.message}`);
      backup.documents[docPath] = { error: err.message };
    }
  }

  // ファイル名に日時を含める
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `firestore_backup_${dateStr}.json`;

  const { writeFileSync } = await import('fs');
  const { join } = await import('path');
  const outPath = join(import.meta.dirname, filename);

  writeFileSync(outPath, JSON.stringify(backup, null, 2), 'utf-8');

  console.log(`\n=== バックアップ完了 ===`);
  console.log(`ファイル: ${outPath}`);

  // サマリー表示
  for (const [path, doc] of Object.entries(backup.documents)) {
    if (doc.error) {
      console.log(`  ${path}: ERROR`);
    } else {
      const keys = Object.keys(doc.data);
      console.log(`  ${path}: ${keys.join(', ')}`);
    }
  }
}

main().catch(err => {
  console.error('バックアップ失敗:', err);
  process.exit(1);
});
