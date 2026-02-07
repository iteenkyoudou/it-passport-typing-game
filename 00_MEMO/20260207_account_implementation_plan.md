# 20260207 アカウント機能実装計画

## 前提条件

- **対象**: 身内のみ（不特定多数ではない）
- **認証**: パスワード不要、アカウント名のみ
- **公開**: GitHub Pages (`course.html` で公開)
- **データ保存**: localStorage → Firebase（段階的に移行）

## localStorage と GitHub Pages の注意点

- GitHub Pagesは静的ファイル配信のみ → localStorageは問題なく使える
- 同じドメイン内（`github.io/リポジトリ名`）で `index.html` と `course.html` が共存
- localStorageのキー名を分けて干渉を防ぐ: `course_accountName`, `course_saveData` など

---

## Phase 1: localStorage実装（優先）✅ 完了

### 実装内容

- [x] **アカウント名入力画面を作成** ✅ 完了
  - 初回アクセス時にモーダル表示
  - アカウント名入力フォーム（最大20文字）
  - 「ログイン」ボタン
  - Enterキーでもログイン可能
  - 実装場所: `course.html:573-584` (HTML), `course.html:22-54` (CSS)

- [x] **localStorageにアカウント情報を保存** ✅ 完了
  - キー名: `course_accountName`
  - 保存内容: アカウント名（文字列）
  - 実装場所: `course.html:711-722`

- [x] **セーブデータをlocalStorageに保存** ✅ 完了
  - キー名: `course_saveData`
  - 保存内容: JSON形式
    ```json
    {
      "level": 1,
      "exp": 0,
      "gold": 0,
      "clearedStages": [],
      "ownedCards": [],
      "bossCleared": false,
      "titles": ["駆け出しの学び手"],
      "currentTitle": "駆け出しの学び手",
      "inventory": []
    }
    ```
  - 実装場所: `course.html:724-754`

- [x] **ログイン状態の確認** ✅ 完了
  - ページ読み込み時にlocalStorageをチェック
  - アカウント名があればログイン済み
  - なければアカウント名入力画面を表示
  - 実装場所: `course.html:792-811`

- [x] **サイドパネルにアカウント名・称号を表示** ✅ 完了
  - ハードコード「ゲストユーザー（仮）」から実際のアカウント名に置き換え
  - localStorageから読み込んだ値を表示
  - 実装場所: `course.html:782-789`, `course.html:587-590`

- [x] **セーブデータの自動保存** ✅ 完了
  - `saveState()` 関数を修正してlocalStorageに自動保存
  - レベルアップ、ステージクリア、ゴールド獲得、カード獲得時に自動保存
  - 実装場所: `course.html:836-840`

- [x] **動作確認** ✅ 完了
  - ブラウザを閉じて再度開いてもログイン状態が維持される
  - セーブデータが正しく保存・復元される
  - アカウント名と称号がサイドパネルに正しく表示される

### 実装日時
- 2026-02-07 完了

**状態**: Phase 1完了。このまま身内利用なら完結してもOK

---

## Phase 2: Firebase Realtime Database実装（別端末対応）

### TODO

- [ ] Firebaseプロジェクト作成
  - Googleアカウントでログイン
  - 新規プロジェクト作成
  - Realtime Databaseを有効化

- [ ] Firebase SDKをcourse.htmlに追加
  ```html
  <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-database.js"></script>
  ```

- [ ] Firebase設定を追加
  ```javascript
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
  firebase.initializeApp(firebaseConfig);
  ```

- [ ] データ構造設計
  ```
  users/
    {accountName}/
      level: 1
      exp: 0
      gold: 0
      clearedStages: []
      collectedCards: []
      title: "駆け出しの学び手"
  ```

- [ ] ログイン処理をFirebase対応
  - アカウント名でFirebaseにデータ保存・読み込み
  - 同じアカウント名で別端末からアクセス可能に

- [ ] localStorageからFirebaseへのマイグレーション機能
  - 既存のlocalStorageデータをFirebaseに移行
  - 移行後はFirebaseをメインに使用

- [ ] 動作確認
  - PC1でログイン → データ保存
  - PC2で同じアカウント名でログイン → データが同期されているか

**完了目安**: 別端末でも使いたくなったら実装

---

## Phase 3: セキュリティルール設定（最小限）

### TODO

- [ ] Firebaseセキュリティルールを設定
  ```javascript
  {
    "rules": {
      "users": {
        "$accountName": {
          ".read": true,  // 誰でも読める（身内のみなので問題なし）
          ".write": true  // 誰でも書ける（シンプル重視）
        }
      }
    }
  }
  ```

- [ ] （オプション）アカウント名の重複チェック
  - 同じアカウント名で複数人がログインしないように警告

- [ ] 動作確認
  - セキュリティルールが正しく適用されているか

**完了目安**: Firebase実装後、必要最小限のルール設定

---

## 実装スケジュール目安

| Phase | 作業時間 | 優先度 |
|-------|---------|--------|
| Phase 1 | 2-3時間 | **高** |
| Phase 2 | 2-3時間 | 中 |
| Phase 3 | 1時間 | 低 |

---

## 次のアクション

1. **Phase 1のTODOから順番に実装**
2. アカウント名入力画面のUI設計
3. localStorageの保存・読み込み処理を実装
