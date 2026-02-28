# プロジェクト全体概要

## 1. プロジェクト名

**ITパスポートタイピングゲーム**

## 2. 目的

ITパスポート試験の用語・知識をゲーム形式で楽しく学習できるWebアプリケーション。ドラゴンクエスト風のRPG演出を取り入れ、モンスター討伐やボスバトル、称号獲得などのゲーム性によって学習モチベーションを高める。

## 3. 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | HTML / CSS / JavaScript（バニラ、フレームワークなし） |
| バックエンド | なし（静的サイト） |
| データベース | Firebase Firestore（クラウド同期） + localStorage（ローカルキャッシュ） |
| 外部ライブラリ | Firebase SDK 10.7.1（CDN） |
| ホスティング | 静的ファイル配信（構成上の制約なし） |

## 4. 画面構成

本プロジェクトは2つの独立した画面（HTMLファイル）で構成される。

### 4.1 メインゲーム（index.html）

穴埋めタイピング形式のゲーム。3つの選択肢から正解をタイピング入力して回答する。

| 画面 | 説明 |
|------|------|
| イントロ画面 | ストーリー導入演出 |
| スタート画面 | モード選択・カテゴリ選択 |
| ゲーム画面 | 3カラムレイアウト（ランキング / ゲーム本体 / 検索パネル） |
| 結果画面 | スコア・称号・ランキング表示 |
| ゲームオーバー画面 | HP=0時の演出 |

**主な機能:**
- 練習モード（10問、制限なし）/ 本気モード（全問、HP制・時間制限）
- 10問ごとのボスバトル（全10体）
- 11段階の称号システム
- アイテム（ポーション・腕時計）
- ランキング（Firestore同期、Top10）
- Google検索連携（iframe内表示）

詳細: [01_main_game_spec.md](./01_main_game_spec.md)

### 4.2 コースモード（course.html）

DQ風UIの体系的学習コース。4択選択形式で、ステージを順に攻略していく。

| 画面 | 説明 |
|------|------|
| ステージ選択画面 | 章内のステージ一覧 |
| 学習画面 | 6ステップ構成（用語→問題→知識→練習×2→報酬） |
| ボス準備画面 | ショップ・アイテム管理 |
| ボスバトル画面 | 全問正解が必須の緊張感あるバトル |
| カード図鑑 | 獲得済みカードの閲覧 |

**主な機能:**
- 第1章「コンピュータの世界」全12ステージ（通常11 + ボス1）
- レベル・経験値システム（最大Lv999）
- 20段階の称号
- ショップ（命のたま・賢者のメガネ）
- カード図鑑（全13枚）
- タイプライター演出・順次表示システム

詳細: [02_course_spec.md](./02_course_spec.md)

## 5. 問題データ

2種類の問題データが存在し、それぞれ異なる画面で使用される。

| データ | ファイル | 形式 | 問題数 | 使用画面 |
|--------|---------|------|--------|---------|
| メインゲーム用 | `questions.js` | 穴埋めタイピング | 130問 | index.html |
| コースモード用 | `course/*.json` | 4択選択 | 11ステージ×3問 + ボス戦 | course.html |
| 収集済み過去問 | `collected_questions_chapter1.json` | 参照用元データ | - | - |

**カテゴリ構成（メインゲーム）:**
- ストラテジ系: 41問
- マネジメント系: 27問
- テクノロジ系: 62問

詳細: [03_questions_data_spec.md](./03_questions_data_spec.md)

## 6. ファイル構成

```
ITパスポートタイピングゲーム/
├── index.html                 # メインゲーム画面
├── course.html                # コースモード画面
├── questions.js               # メインゲーム用問題データ（130問）
├── collected_questions_chapter1.json  # 収集済み過去問（参照用）
│
├── course/                    # コースモード用問題データ
│   ├── chapter1_stages1-4.json
│   ├── chapter1_stages5-8.json
│   ├── chapter1_stages9-11.json
│   └── chapter1_stage12_boss.json
│
├── docs/                      # 仕様書
│   ├── 00_project_overview.md     # 本ファイル（全体概要）
│   ├── 01_main_game_spec.md       # メインゲーム仕様書
│   ├── 02_course_spec.md          # コースモード仕様書
│   └── 03_questions_data_spec.md  # 問題データ仕様書
│
├── ボス/                      # ボス画像（10体）
│   ├── dragon_01_red.png
│   ├── dragon_01_white.png
│   ├── dragon_02_yellow.png
│   ├── darkknight_04.png
│   ├── datenshi_01_01_black.png
│   ├── yosei_01_green.png
│   ├── hero_red.png
│   ├── daitenshi_02_02_brown.png
│   ├── megami_01_pink.png
│   └── daiakuma_01_02_black.png
│
├── character_monster_*.png    # 通常モンスター画像（12種）
├── bakuhatsu_01.png           # 爆発エフェクト
├── portion_01_lightblue_02.png # ポーション画像
├── udedokei_gold.png          # 腕時計画像
├── shihei_1000yen.png         # お札画像
├── koka_5yen.png              # コイン画像
├── boss_dragon_red.png        # ボスドラゴン画像
├── magatama_blue.png          # 勾玉画像
├── megane_square.png          # メガネ画像
│
├── iwashiro_*.mp3             # BGM（5曲）
├── キーボード1.mp3             # SE: キー入力音
├── クイズ正解1.mp3             # SE: 正解音
├── ゲージ回復1.mp3             # SE: 回復音
├── 大キック.mp3                # SE: 不正解音
├── 小パンチ.mp3                # SE: 打撃音
├── お金がジャラジャラ.mp3       # SE: ゴールド音
├── 重力魔法1.mp3               # SE: 魔法音
├── 決定ボタンを押す*.mp3       # SE: UI操作音（4種）
└── 制限時間タイマー.mp3        # SE: タイマー音
```

## 7. データ保存

### メインゲーム（index.html）

| 保存先 | 用途 |
|--------|------|
| Firebase Firestore | ランキング（game_data/rankings）、称号解放（game_data/unlocked_titles） |
| localStorage | ランキング・プレイヤー名・称号のキャッシュ |

### コースモード（course.html）

| 保存先 | 用途 |
|--------|------|
| localStorage | ゲーム状態（`it-course-state`キー: EXP、GOLD、レベル、クリア済みステージ、カード、称号、アイテム） |

## 8. 2画面の関係

- `index.html` と `course.html` は**独立した画面**として動作
- データの共有はなし（別々のlocalStorageキー、別々の称号体系）
- 問題データも完全に分離（questions.js vs course/*.json）
- 共通するのはアセット（画像・音声ファイル）の一部のみ
