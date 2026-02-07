# practiceQuestions 詳細版統一計画

**作成日**: 2026年2月7日
**目的**: Stage5-11のpracticeQuestionsを、Stage1-4と同じ詳細フォーマットに統一する

---

## 📋 現状整理

### **フォーマットの違い**

#### **詳細版（Stage1-4）**
```json
{
  "source": "令和3年 問72",
  "questionText": "...",
  "choices": {...},
  "answer": "イ",
  "shortExplanation": "...",
  "questionExplained": "この問題は「○○」を聞いているよ。\n\n具体的な解説...",
  "choiceAnalysis": [
    {"choice": "ア", "verdict": "✗", "explanation": "..."},
    {"choice": "イ", "verdict": "◎ 正解", "explanation": "..."},
    {"choice": "ウ", "verdict": "✗", "explanation": "..."},
    {"choice": "エ", "verdict": "✗", "explanation": "..."}
  ],
  "solvingStrategy": {
    "steps": [
      "ステップ1",
      "ステップ2",
      "ステップ3"
    ],
    "trap": "ひっかけポイントの解説"
  }
}
```

#### **簡易版（Stage5-11）**
```json
{
  "source": "令和4年 問85",
  "questionText": "...",
  "choices": {...},
  "answer": "イ",
  "shortExplanation": "..."
}
```

---

## 🎯 統一方針

### **Option A: 詳細版に統一（推奨）**

**メリット:**
- ユーザーへの学習サポートが充実
- Stage1-4との一貫性確保
- 解説の質が向上

**デメリット:**
- 作業量が多い（各practiceQuestionに3つのフィールドを追加）
- データ量が増加

**作業量見積もり:**
- Stage5-8: 各ステージ2問 × 4ステージ = 8問
- Stage9-11: 各ステージ2問 × 3ステージ = 6問
- **合計: 14問の詳細化が必要**

---

### **Option B: 簡易版に統一**

**メリット:**
- 作業量が少ない（Stage1-4の3フィールドを削除するだけ）
- データ量が削減

**デメリット:**
- せっかく作った詳細な解説を削除することになる
- 学習サポートが低下

---

## 🔧 作業手順（Option A採用の場合）

### **1. 対象ファイルと問題数の確認**

| ファイル | ステージ | 問題数（概算） |
|---------|---------|--------------|
| `chapter1_stages5-8.json` | Stage5-8 | 8問 |
| `chapter1_stages9-11.json` | Stage9-11 | 6問 |
| **合計** | - | **14問** |

### **2. 各問題に追加するフィールド**

各practiceQuestionに以下を追加：

1. **`questionExplained`** (string)
   - 問題の意図と背景を説明
   - 「この問題は○○を聞いているよ」形式
   - 具体例やたとえ話を含む

2. **`choiceAnalysis`** (array)
   - 各選択肢（ア〜エ）の分析
   - 正解は「◎ 正解」、不正解は「✗」
   - なぜ正解/不正解かを詳しく説明

3. **`solvingStrategy`** (object)
   - `steps`: 解答の手順（配列）
   - `trap`: よくあるひっかけポイント

### **3. 作業分担の検討**

- [ ] 一人で全14問を作成（時間：約3-5時間）
- [ ] 複数人で分担（Stage5-8 / Stage9-11で分割）
- [ ] AIアシスタントで下書き→人力でレビュー

---

## 📝 テンプレート

以下のテンプレートを使用して統一：

```json
{
  "source": "元の出典",
  "questionText": "問題文",
  "choices": {
    "ア": "選択肢A",
    "イ": "選択肢B",
    "ウ": "選択肢C",
    "エ": "選択肢D"
  },
  "answer": "イ",
  "shortExplanation": "既存の簡単な解説",
  "questionExplained": "この問題は「○○」を聞いているよ。\n\n詳しい背景解説...",
  "choiceAnalysis": [
    {"choice": "ア", "verdict": "✗", "explanation": "なぜ不正解か"},
    {"choice": "イ", "verdict": "◎ 正解", "explanation": "なぜ正解か"},
    {"choice": "ウ", "verdict": "✗", "explanation": "なぜ不正解か"},
    {"choice": "エ", "verdict": "✗", "explanation": "なぜ不正解か"}
  ],
  "solvingStrategy": {
    "steps": [
      "ステップ1: キーワードを確認",
      "ステップ2: 選択肢を絞る",
      "ステップ3: 正解を選ぶ"
    ],
    "trap": "ひっかけポイントの解説"
  }
}
```

---

## ✅ チェックリスト

### **準備**
- [ ] 統一方針を決定（Option A or B）
- [ ] 作業担当者を決定
- [ ] Stage5-11の既存のshortExplanationを確認

### **実装（Option A）**
- [ ] Stage5の2問を詳細化
- [ ] Stage6の2問を詳細化
- [ ] Stage7の2問を詳細化
- [ ] Stage8の2問を詳細化
- [ ] Stage9の2問を詳細化
- [ ] Stage10の2問を詳細化
- [ ] Stage11の2問を詳細化

### **検証**
- [ ] JSONの構文エラーチェック
- [ ] course.htmlでの動作確認
- [ ] 全ステージの構造が統一されているか確認

---

## 🚀 推奨アクション

**即座に実行:**
1. **方針決定**: Option A（詳細版統一）を推奨
2. **優先順位**: Stage5から順番に作業
3. **品質基準**: Stage1-4の解説レベルを参考にする

**長期的改善:**
- 今後新しいステージを追加する際は、最初から詳細版フォーマットで作成
- テンプレートをドキュメント化して統一ルールを明確化

---

## 💡 備考

- 詳細版の解説は学習効果を高めるため、Option Aを強く推奨
- 作業は一度に全部やる必要はなく、ステージごとに分割実施可能
- AIアシスタントで下書き生成→人間がレビュー、という流れが効率的
