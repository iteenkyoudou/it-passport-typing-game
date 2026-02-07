# 20260207 練習問題数の不足について

## 現状

### 実際のデータ
- **Stage 1-11**: 各ステージ **2問ずつ**（合計22問）
- **Stage 12（ボス）**: 0問

### 想定されていた仕様
おそらく最初に設計した人は以下を想定していた可能性が高い：
- **Stage 1-11**: 各ステージ **8問前後**
- **合計**: 約80問

### データ確認結果

```bash
=== chapter1_stages1-4.json ===
Stage 1: 2問
Stage 2: 2問
Stage 3: 2問
Stage 4: 2問

=== chapter1_stages5-8.json ===
Stage 5: 2問
Stage 6: 2問
Stage 7: 2問
Stage 8: 2問

=== chapter1_stages9-11.json ===
Stage 9: 2問
Stage 10: 2問
Stage 11: 2問

=== chapter1_stage12_boss.json ===
Stage 12: 0問（ボスバトル用）
```

---

## 問題点

1. **練習問題が少なすぎる**
   - 各ステージ2問しかないため、学習の深度が浅い
   - 復習や反復練習の機会が不足

2. **コード側は問題数に依存しない設計**
   - `LEARN_STEPS=['vocab','question','knowledge','practice1','practice2','reward']`
   - 現在は2問固定で動作しているが、コード修正で柔軟に対応可能

3. **ボスバトルへの影響**
   - ボスバトルは全練習問題からランダム出題
   - 練習問題が22問しかないため、出題パターンが少ない

---

## 解決策

### 案1: JSONに問題を追加（推奨）
**メリット:**
- 学習効果が向上
- ボスバトルの問題バリエーションが増える

**必要な作業:**
1. 各ステージに練習問題を6問追加（合計8問/ステージ）
2. ITパスポート過去問から適切な問題を選定
3. JSON形式で追加

**目標:**
- Stage 1-11: 各8問 → 合計88問

**問題追加のフォーマット:**
```json
{
  "source": "令和X年 問XX",
  "questionText": "問題文",
  "choices": {
    "ア": "選択肢1",
    "イ": "選択肢2",
    "ウ": "選択肢3",
    "エ": "選択肢4"
  },
  "answer": "イ",
  "shortExplanation": "正解の理由",
  "choiceAnalysis": [
    {
      "choice": "ア",
      "verdict": "✗",
      "explanation": "不正解の理由"
    },
    ...
  ]
}
```

---

### 案2: コード側で動的に対応（暫定対応）
**メリット:**
- JSON追加なしで対応可能
- 問題が少なくても破綻しない

**実装内容:**
1. 練習問題が2問未満の場合はスキップ
2. 練習問題が3問以上の場合は全て出題
3. `LEARN_STEPS` を動的生成

**コード例:**
```javascript
function startStage(id){
  // 練習問題の数に応じて動的にステップ生成
  const pracCount = currentStage.practiceQuestions?.length || 0;
  const pracSteps = [];
  for(let i=0; i<pracCount; i++){
    pracSteps.push(`practice${i+1}`);
  }
  const dynamicSteps = ['vocab','question','knowledge', ...pracSteps, 'reward'];
  // ...
}
```

---

## 優先度

**高**: 案1（JSON追加）
- 根本的な解決
- 学習コンテンツの充実

**中**: 案2（コード対応）
- 案1の実施までの暫定対応
- 将来的に問題が増えた場合の柔軟性向上

---

## 次のアクション

1. **問題作成者に確認**
   - 80問想定だったか確認
   - 問題追加の作業分担

2. **優先ステージの決定**
   - 全ステージ一度に追加は大変
   - まずはChapter 1のStage 1-4に集中？

3. **問題ソースの確認**
   - ITパスポート過去問データベース
   - 既存の学習教材

---

## 追加の修正提案

### ボスバトルのフォールバック処理を削除

**現状（course.html:1903-1912行目）:**
```javascript
// 章内ステージの practiceQuestions を収集
const pool=[];
COURSE_DATA.forEach(st=>{
  if(st.practiceQuestions){
    st.practiceQuestions.forEach(pq=>{...});
  }
});
// フォールバック: poolが空ならBOSS_DATA.questionsを使う
if(pool.length===0&&BOSS_DATA.questions)BOSS_DATA.questions.forEach(q=>pool.push(q));
```

**問題点:**
- フォールバック処理が複雑
- `BOSS_DATA.questions` は既に空で使われていない
- 混乱を招く

**修正提案:**
```javascript
// フォールバック削除
if(pool.length===0&&BOSS_DATA.questions)BOSS_DATA.questions.forEach(q=>pool.push(q));
// ↓ 削除
```

**理由:**
- ボスバトルはStage 1-11の練習問題から出題する設計
- `BOSS_DATA.questions` は不要
- シンプルな実装に変更

---

## Git履歴調査結果

**調査対象コミット:**
- `1662c4f`: インラインデータを削除しJSON読み込みに統一
- `7f0bd44`: データ構造調査と修正

**結論:**
- 両コミットで既に `COURSE_DATA = []` と `BOSS_DATA = {}`
- インラインデータから空に変更したのは**もっと前のコミット**
- 練習問題が減ったわけではなく、**JSONファイルに最初から2問ずつしか入っていなかった**

---

## 参考

- 練習問題データ: `/course/chapter1_stages*.json`
- コード実装: `course.html:1000-1040`
- 現在の実装: 2問固定、シャッフル済み
- ボスバトル実装: `course.html:1900-1912`
