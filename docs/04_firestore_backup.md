# Firestore バックアップ・復元手順

## 1. 概要

| 項目 | 内容 |
|------|------|
| 対象サービス | Cloud Firestore |
| プロジェクトID | `it-passport-typing-game` |
| プラン | Sparkプラン（無料枠） |
| 方式 | Firestore REST API を使用したローカルバックアップ |
| 依存 | Node.js 18+（外部パッケージ不要） |

## 2. Firestoreのデータ構造

コレクション `game_data` に2つのドキュメントが存在する。

### game_data/rankings
ゴールド獲得量順のランキング（Top10）。

```json
{
  "records": [
    {
      "name": "プレイヤー名",
      "streak": 97,
      "total": 130,
      "gold": 46188,
      "wrongCount": 6,
      "category": "all",
      "date": "2026-02-21T10:21:01.973Z"
    }
  ],
  "updatedAt": "Timestamp"
}
```

### game_data/unlocked_titles
称号の解放状態と最初の解放者。

```json
{
  "titles": {
    "0":   { "name": "かけだしタイパー", "unlockedBy": "" },
    "10":  { "name": "IT見習い",       "unlockedBy": "RTX5090" },
    "20":  { "name": "IT冒険者",       "unlockedBy": "RTX5090" },
    "30":  { "name": "IT騎士",         "unlockedBy": "RTX5090" },
    "40":  { "name": "IT勇者",         "unlockedBy": "RTX5090" },
    "50":  { "name": "IT魔法使い",     "unlockedBy": "RTX5090" },
    "60":  { "name": "IT賢者",         "unlockedBy": "RTX5090" },
    "70":  { "name": "ITマスター",     "unlockedBy": "RTX5090" },
    "80":  { "name": "IT博士",         "unlockedBy": "RTX5090" },
    "90":  { "name": "ITゴッド",       "unlockedBy": "RTX5090" },
    "100": { "name": "IT伝説王",       "unlockedBy": "RTX5090" }
  },
  "updatedAt": "Timestamp"
}
```

## 3. スクリプト一覧

| ファイル | 用途 |
|---------|------|
| `backup_firestore.mjs` | Firestoreからデータを取得してローカルJSONに保存 |
| `restore_firestore.mjs` | バックアップJSONからFirestoreにデータを書き戻す |

## 4. バックアップ手順

```bash
cd /Users/suzukitakefumi/Documents/ITパスポートタイピングゲーム
node backup_firestore.mjs
```

実行すると `firestore_backup_YYYY-MM-DDTHH-MM-SS.json` が生成される。

## 5. 復元手順

### Step 1: ドライラン（確認のみ、Firestoreへの書き込みなし）

```bash
node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json --dry-run
```

対象ドキュメントとフィールドが正しく表示されることを確認する。

### Step 2: 本番復元

```bash
node restore_firestore.mjs firestore_backup_2026-02-28T06-59-32.json
```

`--dry-run` を外すとFirestoreに書き戻される。既存データは上書きされる。

## 6. バックアップファイルの構造

```json
{
  "projectId": "it-passport-typing-game",
  "backupDate": "ISO日時文字列",
  "documents": {
    "game_data/rankings": {
      "_path": "ドキュメントパス",
      "_rawFields": { "Firestore REST APIの生データ" },
      "data": { "パース済みのJSオブジェクト（復元時はこちらを使用）" },
      "createTime": "ドキュメント作成日時",
      "updateTime": "ドキュメント更新日時"
    },
    "game_data/unlocked_titles": { "同上" }
  }
}
```

## 7. 注意事項

- 復元はドキュメント単位の上書き（PATCH）で行われる。フィールド単位のマージではない。
- バックアップファイルには `_rawFields`（Firestore形式）と `data`（パース済み）の両方が含まれる。復元時は `data` を使用する。
- Sparkプランの制限内（1日50,000読み取り / 20,000書き込み）で動作する。2ドキュメントのみなので問題なし。

## 8. 現在のバックアップ

| ファイル | 日時 | 備考 |
|---------|------|------|
| `firestore_backup_2026-02-28T06-59-32.json` | 2026-02-28 15:59 JST | 初回バックアップ。レベル上限変更作業前に取得。 |
