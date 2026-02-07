# Course.html JSONデータ調査レポート

**作成日**: 2026年2月7日
**対象ファイル**: `course.html` および `course/` ディレクトリ内のJSONファイル

---

## 📋 調査概要

Stage1（動作確認済み）と、Stage2-11のJSONデータ構造に差分がないか調査を実施。

### 調査対象ファイル
- `course/chapter1_stages1-4.json` (Stage1-4)
- `course/chapter1_stages5-8.json` (Stage5-8)
- `course/chapter1_stages9-11.json` (Stage9-11)
- `course/chapter1_stage12_boss.json` (Stage12: ボス)

---

## ❌ 発見された問題点

### **1. Stage1に誤字あり（要修正）**

**ファイル**: `course/chapter1_stages1-4.json`
**行番号**: 17行目
**現在の内容**:
```json
"ア": "OSが異なるPCやスマートフォン同士では，Mom同じファイル形式のドキュメントであっても，互いに読むことはできない。",
```

**問題**: `Mom同じ` となっている

**修正後**:
```json
"ア": "OSが異なるPCやスマートフォン同士では，同じファイル形式のドキュメントであっても，互いに読むことはできない。",
```

---

### **2. ファイルトップレベル構造の不統一（要統一）**

各JSONファイルのトップレベル構造が異なっています。

#### **現状**:

| ファイル | `chapter` | `chapterTitle` | `chapterDescription` | `stages` |
|---------|-----------|----------------|----------------------|----------|
| stages1-4.json | ✅ | ✅ | ✅ | ✅ |
| stages5-8.json | ✅ | ❌ | ❌ | ✅ |
| stages9-11.json | ✅ | ❌ | ❌ | ✅ |
| stage12_boss.json | ✅ | ❌ | ❌ | ✅ |

#### **修正方針（推奨）**:

**Option A（推奨）**: 全ファイルに `chapterTitle` と `chapterDescription` を追加

```json
{
  "chapter": 1,
  "chapterTitle": "コンピュータの世界",
  "chapterDescription": "毎日使ってるスマホやパソコン、中身を知ろう",
  "stages": [...]
}
```

**Option B**: すべてから削除し、`course.html`側でハードコーディング

どちらにするかは、以下を検討：
- `course.html` がこの情報を使っているか？
- 複数チャプターに拡張予定があるか？

---

### **3. `practiceQuestions` の詳細度の違い（要統一）** ✅ 調査完了

#### **調査結果**:

**Stage1〜4の`practiceQuestions`構造（詳細版）**:
```json
{
  "source": "令和3年 問72",
  "questionText": "...",
  "choices": {...},
  "answer": "イ",
  "shortExplanation": "...",
  "questionExplained": "...",  // ← 詳細な問題解説
  "choiceAnalysis": [...],     // ← 選択肢ごとの分析
  "solvingStrategy": {...}     // ← 解き方の戦略
}
```

**Stage5〜8の`practiceQuestions`構造（簡略版）**:
```json
{
  "source": "令和4年 問85",
  "questionText": "...",
  "choices": {...},
  "answer": "イ",
  "shortExplanation": "..."    // ← shortExplanationのみ
}
```

**結論**:
- **Stage1〜4**: 最新の詳細フォーマット
- **Stage5〜8**: 古い簡略フォーマット
- **Stage9〜11**: 未確認（要調査）

**推奨**: Stage5〜11のpracticeQuestionsを、Stage1〜4と同じ詳細フォーマットに統一する

---

## ✅ 問題なし（構造統一されている項目）

以下の項目は全ステージで構造が統一されています：

- ✅ `stageId`, `title`, `subtitle`
- ✅ `category`, `subcategory`, `estimatedMinutes`
- ✅ `mainQuestion` の構造
  - `source`, `originalText`, `choices`, `answer`
  - `wordExplanations`, `questionExplained`, `choiceAnalysis`, `solvingStrategy`
- ✅ `relatedKnowledge` の構造
- ✅ `cardReward` の構造
- ✅ Stage12のボス構造（独立しており問題なし）

---

## 🔧 修正タスクリスト

### 【必須】
- [x] **誤字修正**: `course/chapter1_stages1-4.json` 17行目の `Mom同じ` → `同じ` ✅ 完了

### 【要判断】
- [x] **構造統一**: `chapterTitle` と `chapterDescription` の削除 ✅ 完了
  - **判断**: course.htmlで使用されていない（HTML内にハードコーディング）
  - **対応**: stages1-4.json から `chapterTitle` と `chapterDescription` を削除
  - **削除した内容**:
    - `"chapterTitle": "コンピュータの世界"`
    - `"chapterDescription": "毎日使ってるスマホやパソコン、中身を知ろう"`
  - **表示場所**: `course.html` 587-588行目にハードコーディング済み

- [ ] **practiceQuestions統一**: Stage1-4の詳細版をStage5-11にも適用するか判断 ✅ 調査完了
  - **調査結果**: Stage1-4は詳細版、Stage5-8は簡略版
  - **推奨**: 詳細版を全ステージに適用（Stage5-11を詳細フォーマットに変更）
  - **次のアクション**: Stage9-11の構造も確認してから統一作業を実施

---

## 📊 ファイル構造サマリー

```
course/
├── chapter1_stages1-4.json      (Stage1-4)   ✅ 誤字修正済、詳細版
├── chapter1_stages5-8.json      (Stage5-8)   ⚠️ practiceQuestions簡略版
├── chapter1_stages9-11.json     (Stage9-11)  🔄 要確認
└── chapter1_stage12_boss.json   (Stage12)    ✅ ボス専用構造（問題なし）
```

---

## 🎯 次のステップ

1. ✅ **誤字を即座に修正** → 完了
2. ✅ **course.html を確認**し、`chapterTitle`/`chapterDescription`の使用状況を調査 → 完了（削除済み）
3. ✅ **course.htmlの`let COURSE_DATA = [];`を確認** → 空配列で正解（JSONから動的読み込み）
4. ✅ **practiceQuestionsの構造差分を調査** → Stage1-4は詳細版、Stage5-8は簡略版
5. 🔄 **Stage9-11の構造を確認**
6. 🛠️ **Stage5-11のpracticeQuestionsを詳細版に統一**（推奨）

---

## 💡 備考

- 全体的にデータの品質は高く、構造はほぼ統一されている
- 主な問題は「誤字1箇所」と「メタデータの有無」のみ
- ボスステージ（Stage12）は独自構造だが、問題なし
