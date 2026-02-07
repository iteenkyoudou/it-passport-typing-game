# course.html 仕様書
ITパスポート対策講座

---

## 概要
ITパスポート試験の過去問を使った学習型コースゲーム。
ステージ制で進行し、問題・解説・練習問題・カード獲得を通じて学習する。

---

## ファイル構成

### メインファイル
| ファイル | 説明 |
|---------|------|
| `course.html` | 対策講座本体（HTML/CSS/JS一体型、約2100行） |

### ステージデータ（JSON）
| ファイル | 内容 |
|---------|------|
| `course/chapter1_stages1-4.json` | Stage 1〜4 |
| `course/chapter1_stages5-8.json` | Stage 5〜8 |
| `course/chapter1_stages9-11.json` | Stage 9〜11 |
| `course/chapter1_stage12_boss.json` | Stage 12（ボスバトル） |

### 使用画像（index.htmlと共有）
| ファイル | 用途 |
|---------|------|
| `boss_dragon_red.png` | ボスモンスター（メカドラゴン） |
| `magatama_blue.png` | アイテム：命のたま |
| `megane_square.png` | アイテム：賢者のメガネ |

---

## 画面構成

### 1. アカウント入力モーダル (`#account-modal`)
- 初回アクセス時にアカウント名を入力
- localStorageにアカウント名とセーブデータを保存

### 2. サイドパネル (`.side-panel`)
- **アカウント名・称号**
- **レベル表示**
- **称号表示**
- **アイテムバー**（マイクラ風2スロット）
- **EXP表示**（レベルアップ進捗）
- **GOLD表示**
- **カリキュラム進捗**

### 3. ステージ選択画面 (`#screen-map`)
- 第1章「コンピュータの世界」
- 12ステージ（通常11 + ボス1）をグリッド表示
- クリア済みステージに✓マーク
- 未解放ステージに🔒マーク
- カード図鑑へのリンク

### 4. 学習画面 (`#screen-learn`)
- **ステップ形式の学習フロー**
  1. 用語解説（ことばステップ）
  2. 問題文表示
  3. 考え方のヒント（アコーディオン）
  4. 選択肢表示・回答
  5. 解説表示
  6. 関連知識
  7. 練習問題（2問）
  8. カード獲得・報酬
- **順次表示システム**（タップ/スペースで次へ）
- **タイプライター演出**

### 5. ボス準備画面 (`#screen-boss-prep`)
- ボスステータス表示
- ショップ機能
- 持ち物確認（最大2個）
- バトル開始ボタン

### 6. ボスバトル画面 (`#screen-boss`)
- 問題表示（ランダム3〜6問）
- HPバー表示
- アイテム使用機能
- 全問正解で撃破

### 7. カード図鑑 (`#screen-collection`)
- 獲得済みカードをグリッド表示
- 未獲得カードは「？？？」

---

## ゲームシステム

### レベルシステム

```javascript
// レベルごとの必要経験値
expForLevel(lv) = 5 + lv * 0.35 + (lv/60)^2 * 3
```

| レベル | 必要EXP（累計目安） |
|--------|-----------------|
| 1 | 0 |
| 2 | 5 |
| 5 | 約25 |
| 10 | 約60 |

### 称号システム

| レベル | 称号 |
|--------|------|
| 1-4 | 駆け出しの学び手 |
| 5-9 | IT用語の旅人 |
| 10-14 | デジタル探検家 |
| 15-19 | コンピュータ冒険者 |
| 20-24 | システム理解者 |
| 25-29 | 知識の守護者 |
| 30+ | IT賢者 |

---

### 経験値・ゴールド獲得

| アクション | EXP | GOLD |
|-----------|-----|------|
| タップ報酬（確率） | 1〜3 | 1〜5 |
| ステージクリア | 100 | 200 |
| ボス戦正解（1問） | 15 | 30〜50 |
| ボス撃破 | 500 | 1000 |

---

### ステージ構成（第1章）

| Stage | タイトル | カテゴリ |
|-------|---------|---------|
| 1 | コンピュータの種類 | ハードウェア |
| 2 | 入力と出力 | 入出力デバイス |
| 3 | CPUの仕事 | プロセッサ |
| 4 | 記憶装置 | メモリ・ストレージ |
| 5 | OSの役割 | OS |
| 6 | ファイル管理 | ファイルシステム |
| 7 | 表計算の論理 | ソフトウェア |
| 8 | OSSとは | ソフトウェア |
| 9 | 2進数と10進数 | 基数変換 |
| 10 | 文字コード | データ表現 |
| 11 | 画像と音声 | マルチメディア |
| 12 | **章ボス** | 総合テスト |

---

### ボスバトルシステム

#### ボス情報
| 項目 | 値 |
|------|-----|
| ボス名 | メカドラゴン |
| 問題数 | ランダム3〜6問 |
| 合格条件 | **全問正解** |
| 報酬EXP | 500 |
| 報酬GOLD | 1000 |
| クリア称号 | コンピュータの冒険者 |

#### アイテムシステム

| アイテム | 価格 | 効果 |
|---------|------|------|
| 命のたま | 150G | 不正解1回をノーカウントにする |
| 賢者のメガネ | 100G | 不正解選択肢を2つ消す |

- 持ち物上限: **2個**
- ボス戦開始時にアイテムを消費

---

### ステージデータ形式（JSON）

```javascript
{
  "stageId": 1,
  "title": "コンピュータの種類",
  "subtitle": "スマホもPCもゲーム機も全部コンピュータ",
  "category": "テクノロジ系",
  "subcategory": "ハードウェア",
  "estimatedMinutes": 15,

  "mainQuestion": {
    "source": "令和4年 問74",
    "originalText": "問題文...",
    "choices": { "ア": "...", "イ": "...", "ウ": "...", "エ": "..." },
    "answer": "イ",
    "wordExplanations": [
      { "word": "OS", "reading": "オペレーティングシステム", "explanation": "..." }
    ],
    "questionExplained": "この問題は〜を聞いているよ。",
    "choiceAnalysis": [
      { "choice": "ア", "verdict": "✗", "explanation": "..." },
      { "choice": "イ", "verdict": "◎ 正解", "explanation": "..." }
    ],
    "solvingStrategy": {
      "steps": ["Step 1", "Step 2", "Step 3"],
      "trap": "ひっかけポイント"
    }
  },

  "relatedKnowledge": {
    "title": "関連知識のタイトル",
    "content": [
      { "term": "用語", "description": "説明" }
    ]
  },

  "practiceQuestions": [
    {
      "source": "令和3年 問72",
      "questionText": "...",
      "choices": { "ア": "...", "イ": "..." },
      "answer": "イ",
      "shortExplanation": "...",
      "questionExplained": "...",
      "choiceAnalysis": [...],
      "solvingStrategy": {...}
    }
  ],

  "cardReward": {
    "cardName": "コンピュータの種類",
    "rarity": 1,
    "summary": "カードの説明",
    "exp": 100,
    "gold": 200
  }
}
```

---

### ボスデータ形式（JSON）

```javascript
{
  "stageId": 12,
  "title": "章ボス: コンピュータ総合テスト",
  "isBossBattle": true,
  "passingScore": 7,
  "bossName": "メカドラゴン",
  "bossDescription": "コンピュータの知識で倒せ！",
  "bossSprite": "boss_dragon_red.png",

  "questions": [
    {
      "id": "boss1-q1",
      "relatedStage": 1,
      "questionText": "...",
      "choices": { "ア": "...", "イ": "..." },
      "answer": "ウ",
      "shortExplanation": "..."
    }
  ],

  "rewards": {
    "clearTitle": "コンピュータの冒険者",
    "exp": 500,
    "gold": 1000,
    "bonusCard": {
      "cardName": "メカドラゴン",
      "rarity": 4,
      "summary": "..."
    }
  }
}
```

---

## データ保存

### localStorage
| キー | 内容 |
|------|------|
| `course_accountName` | アカウント名 |
| `course_saveData` | セーブデータ（JSON） |

### セーブデータ構造
```javascript
{
  level: 1,
  exp: 0,
  gold: 0,
  clearedStages: [],      // クリア済みステージID
  ownedCards: [],         // 獲得済みカード名
  bossCleared: false,     // ボス撃破フラグ
  titles: ['駆け出しの学び手'],  // 獲得済み称号
  currentTitle: '駆け出しの学び手',
  inventory: []           // 所持アイテム
}
```

---

## 演出・アニメーション

### タップ経験値パーティクル
- タップ時に確率でEXP/GOLDを獲得
- パーティクルがサイドパネルに飛んでいく演出

### レベルアップ演出 (`.levelup-overlay`)
- 画面中央に「LEVEL UP!」表示
- ゴールドフラッシュ演出

### 称号獲得演出 (`.title-overlay`)
- 画面中央に称号名表示
- 光るテキストエフェクト

### ボス戦演出
- ボスのアイドルアニメーション（上下浮遊）
- ヒット時の画面揺れ（`.screen-shake`）
- ダメージ時のスプライトフラッシュ

---

## レスポンシブ対応

### PC（768px以上）
- サイドパネル: 左固定（220px幅）
- メインコンテンツ: 左にpadding

### スマホ（768px未満）
- サイドパネル: 画面下部に固定
- グリッドレイアウトで情報表示
- 問題文をスティッキー表示

---

## 音声（SFX）

```javascript
const SFX = {
  select: new Audio('決定ボタンを押す22.mp3'),
  confirm: new Audio('決定ボタンを押す18.mp3'),
  correct: new Audio('クイズ正解1.mp3'),
  wrong: new Audio('大キック.mp3'),
  hit: new Audio('小パンチ.mp3'),
  gold: new Audio('お金がジャラジャラ.mp3'),
  buy: new Audio('決定ボタンを押す41.mp3'),
  victory: new Audio('ゲージ回復1.mp3'),
  buff: new Audio('重力魔法1.mp3'),
  magic: new Audio('重力魔法1.mp3')
};
```

---

## 注意事項

### 別プロジェクトとの共存
このフォルダには `index.html`（タイピングゲーム）も存在するが、
**別プロジェクト**として管理されている。

| プロジェクト | ファイル | 説明 |
|-------------|---------|------|
| 対策講座 | `course.html`, `course/*.json` | 本ドキュメントの対象 |
| タイピングゲーム | `index.html`, `questions.js` | 別プロジェクト |

共通で使用しているもの：
- 画像ファイル（ボス、アイテム等）
- 音声ファイル

---

## 主要な関数一覧

### アカウント管理
| 関数 | 説明 |
|------|------|
| `getAccountName()` | アカウント名取得 |
| `setAccountName(name)` | アカウント名保存 |
| `loadSaveData()` | セーブデータ読み込み |
| `saveSaveData(data)` | セーブデータ保存 |

### ゲーム進行
| 関数 | 説明 |
|------|------|
| `startStage(id)` | ステージ開始 |
| `renderLearnStep()` | 学習ステップ描画 |
| `nextStep()` | 次のステップへ |
| `revealNext()` | 順次表示を進める |

### ボスバトル
| 関数 | 説明 |
|------|------|
| `showBossPrep()` | ボス準備画面表示 |
| `startBoss()` | ボス戦開始 |
| `renderBossQ()` | ボス問題描画 |
| `pickBoss()` | 選択肢選択 |
| `confirmBossPick()` | 回答確定 |
| `useGlasses()` | 賢者のメガネ使用 |

### UI・演出
| 関数 | 説明 |
|------|------|
| `updateHeader()` | サイドパネル更新 |
| `showLevelUp(lv)` | レベルアップ演出 |
| `showTitleOverlay(title)` | 称号獲得演出 |
| `gainTapExp()` | タップ経験値演出 |

---

## 更新履歴
- 2026-02-07: 初版作成
