# index.html 仕様書
ITパスポート タイピングゲーム

---

## 概要
ITパスポート試験の用語を穴埋めタイピング形式で学習できるゲーム。
ドラクエ風のモンスターバトル演出で楽しく学べる。

---

## ファイル構成

### メインファイル
| ファイル | 説明 |
|---------|------|
| `index.html` | ゲーム本体（HTML/CSS/JS一体型、約4500行） |
| `questions.js` | 問題データ（穴埋め形式、約100問） |

### 画像ファイル
| ファイル | 用途 |
|---------|------|
| `character_monster_slime_green.png` | 通常モンスター（スライム） |
| `character_monster_*.png` | 通常モンスター（10種類） |
| `boss_dragon_red.png` | ボスモンスター（ドラゴン） |
| `bakuhatsu_01.png` | ダメージエフェクト |
| `portion_01_lightblue_02.png` | ポーションアイテム |
| `udedokei_gold.png` | 腕時計アイテム |
| `shihei_1000yen.png` | お金（お札） |
| `koka_5yen.png` | お金（コイン） |

### サウンドファイル
| ファイル | 用途 |
|---------|------|
| `iwashiro_*.mp3` | BGM（5曲ローテーション） |
| `キーボード1.mp3` | タイピング音 |
| `クイズ正解1.mp3` | 正解音 |
| `大キック.mp3` | 不正解音 |
| `小パンチ.mp3` | ダメージ音 |
| `お金がジャラジャラ.mp3` | ゴールド獲得音 |
| `ゲージ回復1.mp3` | ポーション回復音 |
| `重力魔法1.mp3` | 腕時計使用音 |
| `決定ボタンを押す*.mp3` | UI操作音 |
| `制限時間タイマー.mp3` | タイマー警告音 |

---

## 画面構成

### 1. イントロ画面 (`#intro-screen`)
- ゲーム開始時のストーリー演出
- クリック or SPACEでスキップ可能

### 2. スタート画面 (`#start-screen`)
- **モード選択**
  - 練習モード：10問ランダム出題
  - 本気モード：HPがなくなるまで続く
- **カテゴリ選択**
  - すべて / ストラテジ系 / マネジメント系 / テクノロジ系
- **サウンド設定**
  - 全音ON/OFF
  - BGM ON/OFF

### 3. ゲーム画面 (`#game-screen`)
- **HUD（上部）**
  - 問題番号 / 総問題数
  - 獲得ゴールド表示
- **タイマー**（本気モードのみ）
  - 1問45秒制限
  - 残り22秒で警告色、15秒で危険色
- **問題エリア**
  - 穴埋め形式で問題文表示
- **選択肢エリア**
  - 正解+不正解2つの計3択
- **タイピング入力**
  - ローマ字 or 英語で入力
- **モンスターエリア**
  - ドラクエ風モンスター表示
  - ダメージエフェクト
- **プレイヤーステータス**（本気モードのみ）
  - HPバー
  - アイテムスロット（ポーション×2、腕時計×2）
- **ナビゲーションボックス**
  - 操作ガイド表示

### 4. 検索サイドパネル (`#search-side-panel`)
- 選択肢をクリックでGoogle検索
- ブラウザ風UIでiframe表示
- 魔法エフェクト演出

### 5. 結果画面 (`#result-screen`)
- 正解数 / 不正解数 / 獲得ゴールド
- 称号表示（本気モード）
- ランキング表示（本気モード）

### 6. サイドバー
- **左サイドバー** (`#sidebar-left`)
  - 賞金ランキング（TOP10）
- **右サイドバー** (`#sidebar-right`)
  - 称号解放者一覧

---

## ゲームシステム

### ゲームモード

#### 練習モード
- 10問ランダム出題
- HP制限なし
- タイマーなし
- 正解/不正解のフィードバックのみ

#### 本気モード
- 全問から出題（HPがなくなるまで）
- HP: 100
- 1問45秒制限
- アイテムドロップあり
- ボスバトルあり
- ランキング記録

---

### HPシステム（本気モードのみ）

| 定数 | 値 | 説明 |
|------|-----|------|
| `PLAYER_MAX_HP` | 100 | 最大HP |
| `DMG_MIN` | 1 | 通常ダメージ最小 |
| `DMG_MAX` | 50 | 通常ダメージ最大 |
| `CRIT_DMG_MIN` | 30 | クリティカルダメージ最小 |
| `CRIT_DMG_MAX` | 99 | クリティカルダメージ最大 |
| `CRIT_CHANCE` | 0.1 | クリティカル発生率（10%） |

- 不正解・タイムアウト時にダメージ
- HP 0でゲームオーバー

---

### アイテムシステム（本気モードのみ）

#### ポーション
| 定数 | 値 |
|------|-----|
| `MAX_POTION_STOCK` | 2 |
| `POTION_HEAL_MIN` | 15 |
| `POTION_HEAL_MAX` | 30 |

- クリックで使用
- HPを15〜30回復

#### 腕時計
| 定数 | 値 |
|------|-----|
| `MAX_WATCH_STOCK` | 2 |

- クリックで使用
- タイマーを45秒にリセット

#### ドロップ確率
- 正解時に100%の確率でアイテム判定
- 50%でポーション、50%で腕時計
- ストックが満タンの場合はドロップしない

---

### ボスシステム（本気モードのみ）

#### ボス出現タイミング
```javascript
BOSS_THRESHOLDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```
- 10問目, 20問目, ... でボス出現
- 一度倒したボスは再出現しない

#### ボスHP
```javascript
BOSS_HP_REQUIRED = 3  // 3問正解で撃破
```

#### ボス一覧
| 問題数 | ボス名 | 称号 |
|--------|--------|------|
| 10問目 | ゴースト | IT見習い |
| 20問目 | ゴーレム | IT冒険者 |
| 30問目 | トレント | IT騎士 |
| 40問目 | ミミック | IT勇者 |
| 50問目 | ガーゴイル | IT魔法使い |
| 60問目 | キョンシー | IT賢者 |
| 70問目 | ジャックオランタン | ITマスター |
| 80問目 | イエティ | IT博士 |
| 90問目 | フランケン | ITゴッド |
| 100問目 | ドラゴン | IT伝説王 |

---

### モンスター一覧（通常）
```javascript
MONSTER_IMAGES = [
  'character_monster_slime_green.png',
  'character_monster_ghost_white.png',
  'character_monster_golem_brown.png',
  'character_monster_golem_gray.png',
  'character_monster_treant_02_green.png',
  'character_monster_mimic_green.png',
  'character_monster_gargoyle_stone.png',
  'character_monster_kyuketsuki_02_purple.png',
  'character_monster_jackolantern_green.png',
  'character_monster_yeti_02_black.png',
  'character_monster_frankenstein_02_green.png',
  'character_monster_hana_02.png'
]
```
- 正解時にランダムで1体表示

---

### ゴールドシステム
- 正解時に100〜999Gランダム獲得
- ボス撃破時は2回ドロップ（ボーナス）
- ランキングはゴールド降順でソート

---

### 称号システム

#### 称号一覧
| 正解数 | 称号 | ランク |
|--------|------|--------|
| 0-9 | かけだしタイパー | beginner |
| 10-19 | IT見習い | bronze |
| 20-29 | IT冒険者 | silver |
| 30-39 | IT騎士 | gold |
| 40-49 | IT勇者 | platinum |
| 50-59 | IT魔法使い | diamond |
| 60-69 | IT賢者 | diamond |
| 70-79 | ITマスター | master |
| 80-89 | IT博士 | master |
| 90-99 | ITゴッド | legend |
| 100 | IT伝説王 | legend |

---

## データ保存

### localStorage
| キー | 内容 |
|------|------|
| `itpassport_mission_records` | ランキングデータ（TOP10） |
| `itpassport_player_name` | プレイヤー名 |
| `itpassport_unlocked_titles` | 解放済み称号 |

### Firebase Firestore
- `game_data/rankings` - ランキングデータ
- `game_data/unlocked_titles` - 称号解放データ
- オフライン時はlocalStorageをフォールバック

---

## 問題データ形式（questions.js）

```javascript
{
  category: "ストラテジ系",  // カテゴリ
  question: "〜を ＿＿＿ という。",  // 問題文（＿＿＿が穴埋め）
  answer: "SWOT",  // 正解
  choices: ["SWOT", "PEST", "PDCA", "KPI"],  // 選択肢
  explanation: "解説文..."  // 解説
}
```

---

## サウンド管理

### ミュート設定
- `isMutedAll` - 全音ON/OFF
- `isMutedBgm` - BGMのみON/OFF

### BGMローテーション
```javascript
BGM_TRACKS = [
  'iwashiro_elevate_perfect.mp3',
  'iwashiro_mikaduki_jelly.mp3',
  'iwashiro_pareidolia.mp3',
  'iwashiro_shien_no_makutsu_8bit.mp3',
  'iwashiro_tousoushin1.mp3'
]
```
- モンスター3体撃破ごとに次の曲へ

---

## 主要な定数

```javascript
NORMAL_QUESTIONS = 10         // 練習モードの問題数
MISSION_TIME_PER_Q = 45       // 本気モードの1問あたり秒数
PLAYER_MAX_HP = 100           // 最大HP
BOSS_HP_REQUIRED = 3          // ボス撃破に必要な正解数
MAX_POTION_STOCK = 2          // ポーション最大所持数
MAX_WATCH_STOCK = 2           // 腕時計最大所持数
POTION_HEAL_MIN = 15          // ポーション回復量最小
POTION_HEAL_MAX = 30          // ポーション回復量最大
ITEM_DROP_CHANCE = 1.0        // アイテムドロップ確率（100%）
CRIT_CHANCE = 0.1             // クリティカル率（10%）
```

---

## 注意事項

### 別プロジェクトとの共存
このフォルダには `course.html`（ITパスポート対策講座）も存在するが、
**別プロジェクト**として管理されている。

| プロジェクト | ファイル | 説明 |
|-------------|---------|------|
| タイピングゲーム | `index.html`, `questions.js` | 本ドキュメントの対象 |
| 対策講座 | `course.html`, `course/*.json` | 別プロジェクト |

共通で使用しているもの：
- 画像ファイル（モンスター、アイテム等）
- Firebase設定

---

## 更新履歴
- 2026-02-07: 初版作成
