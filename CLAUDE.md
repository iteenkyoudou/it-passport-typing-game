# CLAUDE.md

## 起動時チェック

会話の最初に、以下を確認してからユーザーに報告すること：

1. **gitの状態確認**: `git fetch origin` → `git log --oneline HEAD..origin/main` でローカルとリモートに差分がないか確認
2. 差分がある場合はユーザーに「ローカルとリモートに差分があります。pullしてから作業しますか？」と確認する
3. 未コミットの変更がある場合もユーザーに報告する

## プロジェクト概要

- ITパスポート試験の学習用Webアプリ（静的サイト）
- 2画面構成: index.html（タイピングゲーム）、course.html（コースモード）
- Firebase Firestore（ランキング・称号）+ localStorage（セーブデータ）
- 詳細仕様: 99_仕様/ ディレクトリ参照

## 重要な注意事項

- course.htmlの `state` データ構造は変更しない（既存セーブデータ破損防止）
- Firestoreバックアップ手順: 99_仕様/Firestoreバックアップ手順.md 参照
- テスト用コード（defaultState の gold:5000, clearedStages全開放, loadState の強制リセット）は本番リリース前に修正が必要
- デバッグコマンド `debugSkipTo(n)` （index.html末尾）は本番リリース前にコメントアウトすること。デバッグ時はコメントを外すだけで復活可能

## 改修検討余地

- 中ボスの名前：現在「全章共通」で未決定。章ごとに変える（例：「コンピュータの妖精」）か、全部同じ名前（例：「妖精の番人」）にするか要検討

## 引き継ぎメモ（course.html 2週目・にがて機能まわり）

### 2026年 course.html改修（2週目バッジ表示＋ミス再出題＋3周目改善）

**前提**：index.html（タイピングゲーム）とcourse.html（対策講座）は完全に独立。「2周目」の難易度システム（ng2）はcourse.htmlにのみ存在し、index.htmlには一切ない。

**2週目（ng2）バッジ表示**
- サイドバー（`#sp-ng2-badge-area`）に常時HUDバッジ「★2周目チャレンジ中」を追加。`updateHeader()`で`currentRun==='ng2'`のとき表示
- ステージ学習画面・ボス戦タイトルにも「★2周目」バッジを併記（`startStage()`のlearn-title、ボス開始時のboss-title）
- 初めて1周目→2周目に切り替えたとき、実績演出(`.achievement-notify`)を流用した「ここから2周目！」トーストを1回だけ表示（`state.ng2.introShown`で制御）

**にがて（ミス問題）再出題機能**
- 過去問(mainQuestion)・練習問題(practiceQuestions)には章内で一意な`_qid`（例`"3-5-p2"`＝3章5ステージの練習問題index2）を`loadChapterData()`で付与。qidは`chapterId-stageId-種別`の文字列で、`recordMiss()`側でqidを分解してchapterId/stageIdを復元している
- ミスは`state.missedQuestions`（qid→{chapterId,stageId,correctCount}）に永続記録。周回・章を問わず蓄積
- **ステージ直後の復習ラウンド**：ステージ本編（vocab〜reward）が終わったとき、そのステージ内でミスした問題があれば`startStageEndReview()`が自動で挟まる。正解するまでリトライ必須、全問終えたら本来のマップ画面に戻る
- **にがてリスト**：ステージ選択画面（`renderStageGrid()`）の先頭に「🎯 にがて復習に挑戦」ボタンを表示（この章にミスが残っている場合のみ）。押すと`startWeakListReview()`でこの章のミス問題だけをまとめて復習できる
- **卒業条件**：復習ラウンド（ステージ直後 or にがてリスト、いずれも`isReviewMode===true`のとき）で正解するたびに`correctCount`が+1、2回（連続でなくてOK）で`state.missedQuestions`から削除＋お祝いトースト。**初回ミス直後の強制リトライでの正解はカウントしない**（正解1回目としてカウントされるのは復習ラウンド入り後のみ）
- 復習ラウンドは既存の`renderPractice()`を`opts`引数（uid/forceFullHint/doneLabel/onDone/onRetry/titleLabel）で拡張して再利用。ヒントは常にLv4相当（全開放）で表示
- **設計判断・既知の制約**：にがてリストは「今開いている章」限定（COURSE_DATAが1章分しかロードされない既存アーキテクチャのため）。章をまたいだ全にがて問題の一覧化は行っていない。中ボス・章ボスの問題はにがて追跡の対象外（ボスは元々ノーミス要求＋いのちのいし等の別システムがあるため）

**3周目以降の改善**
- 2週目の`rounds`が2以上（＝3周目以降）のとき、`startStage()`内で「過去問＋知識＋練習問題」のステップ順序をシャッフルする（vocab/rewardは固定）。1周目・2週目1回目は従来どおりの順序で不変
- 選択肢の並びシャッフルはmain/practice問題ともに元から毎回実施済み（既存機能、今回変更なし）

**マスター認定**
- 模擬試験章を除く全8章で2週目ボス撃破（`state.ng2.chapters[ch.id].bossCleared2`が全true）したら`isNg2MasterCertified()`がtrueになり、既存の実績システムで`ng2_master`（🎓 マスター認定）を解除。実績一覧（`ACHIEVEMENTS`配列）に追加済み
- 認定後はサイドバーに常時「🎓 マスター認定」バッジを表示、以降の「もう一周」ボタン・確認モーダルの文言が「🏅 スコアアタックに挑戦」系に変わる（`renderStageGrid()`・`confirmNg2NewRound()`）

**state構造への追加（すべて既存構造への追記のみ、削除・変更なし）**
- `state.missedQuestions = {}` （defaultState/migrateSaveDataに追加）
- `state.ng2.introShown` （前回セッションで追加）

## 低優先度：継続プレイ促進（将来検討）

- **EXPに意味を持たせる** — Lvアップで何かが変わる仕組み（アイテム値下げ・新アイテム解放など）
- **デイリーログインボーナス** — 毎日来る理由を作る
- **連続学習ストリーク** — 〇日連続プレイで称号・ボーナス
- **次の称号まで可視化** — 「あと◯問で称号変わる」表示
- **カードに意味を持たせる** — 収集だけでなく効果・強さなど
