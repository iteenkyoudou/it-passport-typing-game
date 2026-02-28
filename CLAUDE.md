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
