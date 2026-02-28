# 問題データ仕様書

## 1. 概要

本プロジェクトには2種類の問題データが存在する。

| 種類 | ファイル | 用途 | 形式 |
|------|---------|------|------|
| メインゲーム用問題 | `questions.js` | index.htmlのタイピングゲーム（通常/ミッションモード） | JavaScript グローバル変数 |
| コースモード用問題 | `course/chapter1_stages*.json` | course.htmlの学習コースモード | JSON（章・ステージ構成） |
| 収集済み過去問データ | `collected_questions_chapter1.json` | コースモード問題の元データ・参照用 | JSON |

## 2. メインゲーム用問題データ（questions.js）

### 2.1 全体構造

```javascript
const ALL_QUESTIONS = [
  { category, question, answer, choices, explanation },
  ...
];
```

- グローバル定数 `ALL_QUESTIONS` として定義
- `index.html` から `<script src="questions.js"></script>` で読み込み
- 穴埋めタイピング形式の問題で構成

### 2.2 問題オブジェクトのフィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `category` | string | Yes | カテゴリ名（`"ストラテジ系"` / `"マネジメント系"` / `"テクノロジ系"`） |
| `question` | string | Yes | 問題文。空欄部分を `＿＿＿` で表現した穴埋め形式 |
| `answer` | string | Yes | 正解の文字列。ユーザーがタイピングで入力する対象 |
| `choices` | string[] | Yes | 選択肢の配列（4つ）。正解を含む |
| `explanation` | string | Yes | 解説文。初学者向けのわかりやすい説明 |

### 2.3 問題文の形式

- 「＿＿＿」（全角アンダースコア3文字）を空欄として使用
- 例: `"企業の強み・弱み・機会・脅威を分析するフレームワークを ＿＿＿ 分析という。"`
- ユーザーは空欄に当てはまる `answer` をタイピングで入力する

### 2.4 回答の形式

- 英語（例: `"SWOT"`, `"CPU"`, `"HTTP"`）
- カタカナ（例: `"ウォーターフォール"`, `"アジャイル"`）
- 漢字（例: `"利益"`, `"著作権"`, `"個人情報"`）
- 混合（例: `"IT戦略"`, `"技術のSカーブ"`）

### 2.5 カテゴリ分類

ITパスポート試験の3分野に対応した大分類のみを持つ。中分類・小分類はフィールドとして定義されていないが、コメントで区分を示している。

| 大分類（category値） | 問題数 | コメント上の中分類 |
|---------------------|--------|-------------------|
| ストラテジ系 | 41問 | 企業活動、法務、経営戦略 |
| マネジメント系 | 27問 | プロジェクト管理、開発技術、サービスマネジメント |
| テクノロジ系 | 62問 | ハードウェア・基礎理論、ネットワーク、セキュリティ、データベース、プログラミング・アルゴリズム、クラウド・新技術 |
| **合計** | **130問** | |

末尾にはボス戦用の追加問題（ストラテジ系5問、マネジメント系5問、テクノロジ系5問）も含まれる。

### 2.6 読み込み・フィルタリング方式

`index.html` で以下のように使用される:

```javascript
// カテゴリフィルタリング
function getFilteredQuestions(cat) {
  if (cat === 'all') return ALL_QUESTIONS;
  return ALL_QUESTIONS.filter(q => q.category === cat);
}
```

- ダッシュボード画面でラジオボタンによりカテゴリを選択
- 選択肢: `"all"`（すべて）/ `"ストラテジ系"` / `"マネジメント系"` / `"テクノロジ系"`
- 通常モード: フィルタ済み問題からランダムに10問（`NORMAL_QUESTIONS`）を出題
- ミッションモード: フィルタ済み全問題からHPが尽きるまで出題

## 3. コースモード用問題データ（course/）

### 3.1 ファイル構成

```
course/
  chapter1_stages1-4.json    -- ステージ1~4の学習データ
  chapter1_stages5-8.json    -- ステージ5~8の学習データ
  chapter1_stages9-11.json   -- ステージ9~11の学習データ
  chapter1_stage12_boss.json -- ステージ12（章ボス戦）
```

course.htmlから以下のように非同期に読み込まれる:

```javascript
const [r1, r2, r3] = await Promise.all([
  fetch('course/chapter1_stages1-4.json'),
  fetch('course/chapter1_stages5-8.json'),
  fetch('course/chapter1_stages9-11.json')
]);
// ボス戦は別途読み込み
const bossResp = await fetch('course/chapter1_stage12_boss.json');
```

### 3.2 通常ステージJSON構造

```json
{
  "chapter": 1,
  "chapterTitle": "コンピュータの世界",
  "chapterDescription": "毎日使ってるスマホやパソコン、中身を知ろう",
  "stages": [
    {
      "stageId": 1,
      "title": "コンピュータの種類",
      "subtitle": "スマホもPCもゲーム機も全部コンピュータ",
      "category": "テクノロジ系",
      "subcategory": "ハードウェア",
      "estimatedMinutes": 15,
      "mainQuestion": { ... },
      "relatedKnowledge": { ... },
      "practiceQuestions": [ ... ]
    }
  ]
}
```

#### ステージフィールド一覧

| フィールド | 型 | 説明 |
|-----------|------|------|
| `stageId` | number | ステージ番号（1始まり） |
| `title` | string | ステージタイトル |
| `subtitle` | string | サブタイトル（補足説明） |
| `category` | string | ITパスポートの大分類 |
| `subcategory` | string | 中分類テーマ |
| `estimatedMinutes` | number | 想定学習時間（分） |
| `mainQuestion` | object | メイン問題（詳細後述） |
| `relatedKnowledge` | object | 関連知識セクション |
| `practiceQuestions` | array | 練習問題（2問） |

#### mainQuestion の構造

| フィールド | 型 | 説明 |
|-----------|------|------|
| `source` | string | 出典（例: `"令和4年 問74"`） |
| `originalText` | string | 過去問の原文テキスト |
| `choices` | object | 選択肢（`"ア"` ~ `"エ"` のキーと値） |
| `answer` | string | 正解の選択肢キー（`"ア"` / `"イ"` / `"ウ"` / `"エ"`） |
| `wordExplanations` | array | 問題文中の用語解説リスト |
| `questionExplained` | string | 問題の意図を初学者向けに解説 |
| `choiceAnalysis` | array | 各選択肢の正誤と解説 |
| `solvingStrategy` | object | 解法戦略（`steps` と `trap`） |

#### wordExplanations の要素

| フィールド | 型 | 説明 |
|-----------|------|------|
| `word` | string | 用語 |
| `reading` | string | 読み方 |
| `explanation` | string | やさしい説明文 |

#### choiceAnalysis の要素

| フィールド | 型 | 説明 |
|-----------|------|------|
| `choice` | string | 選択肢キー（`"ア"` 等） |
| `verdict` | string | 正誤表示（`"◎ 正解"` / `"✗"`） |
| `explanation` | string | なぜ正解/不正解かの解説 |

#### solvingStrategy の構造

| フィールド | 型 | 説明 |
|-----------|------|------|
| `steps` | string[] | 解法のステップ |
| `trap` | string | ひっかけポイントの注意 |

#### relatedKnowledge の構造

| フィールド | 型 | 説明 |
|-----------|------|------|
| `title` | string | 知識セクションのタイトル |
| `content` | array | `{ term, description }` のリスト |

#### practiceQuestions の要素

mainQuestionと同様の構造だが、以下のフィールドが追加/変更される:

| フィールド | 型 | 説明 |
|-----------|------|------|
| `source` | string | 出典 |
| `questionText` | string | 問題文（`originalText` ではなく `questionText`） |
| `choices` | object | 選択肢 |
| `answer` | string | 正解キー |
| `shortExplanation` | string | 簡潔な解説 |
| `questionExplained` | string | 問題意図の解説 |
| `choiceAnalysis` | array | 選択肢分析 |
| `solvingStrategy` | object | 解法戦略 |

### 3.3 ボスステージJSON構造

```json
{
  "chapter": 1,
  "stages": [
    {
      "stageId": 12,
      "title": "章ボス: コンピュータ総合テスト",
      "subtitle": "第1章の全範囲から出題！10問に挑戦しよう",
      "category": "テクノロジ系",
      "subcategory": "総合",
      "estimatedMinutes": 20,
      "isBossBattle": true,
      "passingScore": 7,
      "bossName": "メカドラゴン",
      "bossDescription": "コンピュータの知識で倒せ！7問以上正解で撃破！",
      "questions": [ ... ]
    }
  ]
}
```

#### ボスステージ固有フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `isBossBattle` | boolean | ボス戦フラグ（`true`） |
| `passingScore` | number | 合格に必要な正解数 |
| `bossName` | string | ボスの名前 |
| `bossDescription` | string | ボス戦の説明文 |
| `questions` | array | ボス戦用問題リスト |

#### ボス戦問題の構造

| フィールド | 型 | 説明 |
|-----------|------|------|
| `id` | string | 問題ID（例: `"boss1-q1"`） |
| `relatedStage` | number | 関連するステージ番号 |
| `questionText` | string | 問題文 |
| `choices` | object | 選択肢（`"ア"` ~ `"エ"`） |
| `answer` | string | 正解キー |
| `shortExplanation` | string | 簡潔な解説 |

### 3.4 第1章のステージ一覧

| ステージ | タイトル | テーマ | 問題数 |
|---------|---------|--------|--------|
| 1 | コンピュータの種類 | ハードウェア | メイン1 + 練習2 |
| 2 | 入力と出力 | 入出力デバイス | メイン1 + 練習2 |
| 3 | CPUってなに？ | プロセッサ | メイン1 + 練習2 |
| 4 | メモリとストレージ | メモリ | メイン1 + 練習2 |
| 5 | OSってなに？ | OS | メイン1 + 練習2 |
| 6 | ファイルとフォルダ | ファイルシステム | メイン1 + 練習2 |
| 7 | ソフトウェアの種類 | オフィスツール | メイン1 + 練習2 |
| 8 | オープンソースってなに？ | OSS | メイン1 + 練習2 |
| 9 | 2進数の世界 | 離散数学 | メイン1 + 練習2 |
| 10 | データの単位 | 情報の理論 | メイン1 + 練習2 |
| 11 | 画像・音・動画のデータ | マルチメディア | メイン1 + 練習2 |
| 12 | 章ボス: コンピュータ総合テスト | 総合 | ボス戦10問 |

## 4. 収集済み過去問データ（collected_questions_chapter1.json）

### 4.1 概要

コースモード用の問題収集・管理に使用される参照データ。ITパスポート試験の過去問を元にステージ構成で整理している。

### 4.2 構造

```json
{
  "chapter": "第1章 コンピュータの世界",
  "source": "https://www.itpassportsiken.com/",
  "collectedDate": "2026-02-06",
  "stages": [
    {
      "stageId": 1,
      "stageTitle": "コンピュータの種類",
      "theme": "ハードウェア",
      "questions": [ ... ]
    }
  ]
}
```

#### 問題フィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| `id` | string | 問題ID（例: `"s1_main"`, `"s1_practice1"`） |
| `year` | string | 出題年（例: `"令和3年"`） |
| `questionNumber` | string | 問題番号（例: `"問57"`） |
| `url` | string | 過去問の参照URL |
| `category` | string | 詳細カテゴリ（例: `"テクノロジ系 > ハードウェア > コンピュータ・入出力装置"`） |
| `questionText` | string | 問題文 |
| `choices` | object | 選択肢（`"ア"` ~ `"エ"`） |
| `correctAnswer` | string | 正解キー |
| `explanation` | string | 解説文 |

### 4.3 コースモードJSONとの関係

`collected_questions_chapter1.json` はコースモード用問題の**元データ（素材）**として位置付けられる。

- 収集データ: 過去問の原文・出典・URLを記録した生データ
- コースJSON: 収集データを元に、初学者向けの用語解説・選択肢分析・解法戦略を追加し、学習教材として再構成したもの

変換の流れ:
```
collected_questions_chapter1.json（元データ）
  ↓ 加工・教材化
course/chapter1_stages*.json（学習用データ）
```

## 5. 2種類の問題データの比較

| 項目 | メインゲーム用（questions.js） | コースモード用（course/*.json） |
|------|------------------------------|-------------------------------|
| 問題形式 | 穴埋めタイピング | 4択選択（ア〜エ） |
| 回答方式 | キーボード入力 | 選択肢クリック |
| 解説の詳しさ | 1段落の簡潔な説明 | 用語解説・選択肢分析・解法戦略を含む詳細解説 |
| カテゴリ | 3大分類のみ | 大分類 + 中分類（subcategory） |
| 出典情報 | なし | 年度・問題番号・URL付き |
| 問題の独立性 | 各問題が独立 | ステージとして体系的に構成 |
| 読み込み方式 | `<script>` タグで同期読み込み | `fetch()` で非同期読み込み |
| 使用画面 | index.html | course.html |
