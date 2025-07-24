# 連絡・予定 週間表示UI改善 - 実装ガイド

## 主要な変更点

### 1. レイアウトの根本的変更
**Before**: 縦積み日別カード表示
```jsx
// 旧: 各日を縦に積み重ねる方式
<div className="space-y-4">
  {days.map(day => (
    <Card key={day}>
      <div className="flex">
        <div className="date-column">{day}</div>
        <div className="events-column">{events}</div>
      </div>
    </Card>
  ))}
</div>
```

**After**: Googleカレンダー風7列グリッド
```jsx
// 新: 7列グリッドによる横並び表示
<div className="weekly-calendar-container">
  <div className="weekly-header grid grid-cols-7">
    {days.map(day => <DayHeader key={day} />)}
  </div>
  <div className="weekly-events-grid grid grid-cols-7">
    {days.map(day => <DayColumn key={day} />)}
  </div>
</div>
```

### 2. 新機能の追加

#### 2.1 レスポンシブ日数調整
- **デスクトップ**: 7日表示（フル週間）
- **タブレット**: 5日表示（平日中心）
- **モバイル**: 3日表示（選択日中心）

#### 2.2 今日のハイライト
- ヘッダーの今日の日付を青色円形で強調
- 今日の列に薄い青色背景を適用
- 上部に青色インジケーターライン表示

#### 2.3 インタラクティブ要素
- 各日付列ホバー時に新規作成ボタン表示
- イベントカードのホバーアニメーション
- 週間ナビゲーション（前週/次週ボタン）

### 3. 技術的改善点

#### 3.1 パフォーマンス最適化
```jsx
// React.memoによる最適化
const WeeklyEventCard = React.memo(({ event }) => {
  // イベントカードの実装
});

// useMemoによるデータ処理最適化
const weekDays = useMemo(() => {
  return eachDayOfInterval({ start, end });
}, [selectedDate]);
```

#### 3.2 アクセシビリティ強化
```jsx
// ARIA属性の追加
<div 
  role="grid" 
  aria-label="週間カレンダー"
  className="weekly-calendar-container"
>
  <div role="row" className="weekly-header">
    <div role="columnheader">月</div>
  </div>
  <div role="row" className="weekly-events-grid">
    <div role="gridcell" tabIndex={0}>
      <div role="button" aria-label="会議 - 08:00">
        {/* イベント内容 */}
      </div>
    </div>
  </div>
</div>
```

## 実装時の注意点

### 1. CSS Grid対応
- IE11は非対応のため、モダンブラウザ前提
- Flexbox fallbackは不要（対象ブラウザが限定的）
- `grid-template-columns: repeat(7, 1fr)`で等幅分割

### 2. 日付計算の注意
```jsx
// 週の開始を月曜日に設定
const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

// 日本のロケールを使用
format(date, 'E', { locale: ja }); // 月、火、水...
```

### 3. イベントデータの互換性
既存の`ContactScheduleItem`型をそのまま使用可能：
```typescript
interface ContactScheduleItem {
  id: string;
  title: string;
  content: string;
  type: 'contact' | 'schedule' | 'handover';
  dueDate: string; // ISO形式の日付文字列
  startTime?: string; // HH:mm形式
  // ... その他のプロパティ
}
```

### 4. レスポンシブ実装のポイント
```jsx
// useMediaQueryフックを活用
const isDesktop = useMediaQuery('(min-width: 1024px)');
const displayDays = isDesktop ? 7 : isTablet ? 5 : 3;

// 動的グリッド列数
<div style={{ gridTemplateColumns: `repeat(${displayDays}, 1fr)` }}>
```

## 段階的実装アプローチ

### Step 1: 基本レイアウト（1日）
1. 7列グリッドの基本構造作成
2. 日付ヘッダーの実装
3. 既存イベントデータの表示確認

### Step 2: スタイリング（2日）
1. Googleカレンダー風のビジュアルデザイン適用
2. 今日のハイライト機能
3. イベント種別・重要度の色分け

### Step 3: インタラクション（2日）
1. 週間ナビゲーション機能
2. イベントクリック・ホバー効果
3. 新規作成ボタンの実装

### Step 4: レスポンシブ対応（2日）
1. タブレット・モバイル用レイアウト調整
2. useMediaQueryフックの実装
3. 各デバイスでの動作確認

### Step 5: 最適化・テスト（1日）
1. パフォーマンス最適化
2. アクセシビリティ監査
3. ブラウザ互換性確認

## 期待される効果

### ユーザビリティ向上
- **視認性**: 週間スケジュールを一目で把握可能
- **操作性**: 直感的な日付選択とイベント作成
- **効率性**: 複数日の予定比較が容易

### 技術的メリット
- **保守性**: モジュール化されたコンポーネント構造
- **拡張性**: 新機能追加が容易な設計
- **パフォーマンス**: 最適化されたレンダリング

この改善により、介護現場のスタッフが週間の連絡・予定をより効率的に管理できる、プロフェッショナルレベルのUIを実現できます。