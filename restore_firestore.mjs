#!/usr/bin/env node
/**
 * Firestore 復元スクリプト（Sparkプラン対応）
 * バックアップJSONからFirestore REST API経由でデータを書き戻す
 *
 * 使い方:
 *   node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json
 *
 * ※ ドライラン（確認のみ、書き込みしない）:
 *   node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json --dry-run
 */

const PROJECT_ID = 'it-passport-typing-game';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/** JSの値をFirestore REST APIのValue型に変換 */
function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { integerValue: String(value) };
    return { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  return { stringValue: String(value) };
}

/** JSオブジェクトをFirestore REST APIのfields形式に変換 */
function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

async function restoreDocument(docPath, data, dryRun) {
  const url = `${BASE_URL}/${docPath}`;
  const body = { fields: toFirestoreFields(data) };

  if (dryRun) {
    console.log(`  [DRY-RUN] ${docPath} - 書き込みスキップ`);
    console.log(`    フィールド: ${Object.keys(data).join(', ')}`);
    return;
  }

  console.log(`  書き込み中: ${docPath} ...`);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${docPath}: ${text}`);
  }
  console.log(`  OK: ${docPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filePath = args.find(a => !a.startsWith('--'));

  if (!filePath) {
    console.error('使い方: node restore_firestore.mjs <バックアップファイル.json> [--dry-run]');
    console.error('例:     node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json');
    console.error('        node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json --dry-run');
    process.exit(1);
  }

  const { readFileSync } = await import('fs');
  const { resolve } = await import('path');
  const fullPath = resolve(filePath);

  let backup;
  try {
    backup = JSON.parse(readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    console.error(`ファイル読み込みエラー: ${err.message}`);
    process.exit(1);
  }

  console.log('=== Firestore 復元 ===');
  console.log(`バックアップ日時: ${backup.backupDate}`);
  console.log(`プロジェクト: ${backup.projectId}`);
  console.log(`対象ドキュメント: ${Object.keys(backup.documents).join(', ')}`);
  if (dryRun) console.log('モード: DRY-RUN（書き込みしない）');
  console.log('');

  for (const [docPath, doc] of Object.entries(backup.documents)) {
    if (doc.error) {
      console.log(`  スキップ: ${docPath} (バックアップ時にエラー)`);
      continue;
    }
    await restoreDocument(docPath, doc.data, dryRun);
  }

  console.log('\n=== 復元完了 ===');
}

main().catch(err => {
  console.error('復元失敗:', err);
  process.exit(1);
});
