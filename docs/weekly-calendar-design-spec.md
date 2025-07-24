# 週間表示UI改善案 - Googleカレンダー風レイアウト

## 1. UIデザイン仕様書

### 1.1 全体レイアウト構造

```
┌─────────────────────────────────────────────────────────────────┐
│ 週ナビゲーションヘッダー (高さ: 64px)                           │
├─────────────────────────────────────────────────────────────────┤
│ 日付ヘッダー (高さ: 80px)                                       │
│ ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐             │
│ │時間 │ 月  │ 火  │ 水  │ 木  │ 金  │ 土  │ 日  │             │
│ │     │12/4 │12/5 │12/6 │12/7 │12/8 │12/9 │12/10│             │
│ └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘             │
├─────────────────────────────────────────────────────────────────┤
│ スクロール可能コンテンツエリア                                   │
│ ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐             │
│ │00:00│     │     │     │     │     │     │     │             │
│ │00:30│     │     │     │     │     │     │     │             │
│ │01:00│     │     │     │     │     │     │     │             │
│ │ ... │     │     │     │     │     │     │     │             │
│ │23:30│     │     │     │     │     │     │     │             │
│ └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘             │
├─────────────────────────────────────────────────────────────────┤
│ 週間統計情報 (高さ: 48px)                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 詳細寸法・色指定

#### カラーパレット
```css
/* 基本色 */
--week-bg-primary: #ffffff;
--week-bg-secondary: #f8fafc;
--week-border-light: #e2e8f0;
--week-border-medium: #cbd5e1;
--week-text-primary: #1e293b;
--week-text-secondary: #64748b;

/* 強調色 */
--week-today-bg: #0891b2;
--week-today-text: #ffffff;
--week-weekend-bg: #f1f5f9;
--week-current-time: #ef4444;

/* イベント色 */
--week-event-scheduled: rgba(var(--category-color), 0.1);
--week-event-completed: rgba(var(--category-color), 0.25);
--week-event-border-scheduled: 2px dashed var(--category-color);
--week-event-border-completed: 2px solid var(--category-color);
```

#### 寸法仕様
```css
/* グリッド */
.week-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
}

/* 時間スロット */
.time-slot {
  height: 60px; /* 30分 = 60px */
  min-height: 60px;
}

/* イベントブロック */
.event-block {
  min-height: 56px;
  padding: 8px;
  border-radius: 6px;
  position: absolute;
  z-index: 10;
}

/* 日付ヘッダー */
.date-header {
  height: 80px;
  padding: 12px;
  text-align: center;
}
```

### 1.3 インタラクション仕様

#### ホバー効果
- **時間スロット**: `hover:bg-blue-50` - 薄い青色背景
- **イベントブロック**: `hover:shadow-md` - ドロップシャドウ強化
- **日付ヘッダー**: `hover:bg-gray-100` - 薄いグレー背景

#### クリック操作
- **時間スロット**: 新規イベント作成モーダル表示
- **イベントブロック**: イベント詳細・編集モーダル表示
- **日付ヘッダー**: その日の詳細ビューに遷移

#### ドラッグ&ドロップ
- **イベント移動**: 異なる時間・日付への移動
- **イベント延長**: 下端ドラッグでの時間延長
- **視覚フィードバック**: ドラッグ中の半透明表示

### 1.4 状態別表示パターン

#### 通常状態
- 背景: 白色
- ボーダー: 薄いグレー
- テキスト: ダークグレー

#### 今日の日付
- 背景: `bg-carebase-blue`
- テキスト: 白色
- ボーダー: 青色強調

#### 週末
- 背景: `bg-blue-50/50`
- 軽微な色調変更で平日と区別

#### イベント状態
- **予定**: 点線ボーダー、薄い背景色
- **完了**: 実線ボーダー、濃い背景色、チェックマーク

## 2. HTML/CSS構造概要

### 2.1 セマンティックHTML構造

```html
<div class="week-calendar" role="grid" aria-label="週間カレンダー">
  <!-- ナビゲーションヘッダー -->
  <header class="week-navigation" role="banner">
    <nav aria-label="週ナビゲーション">
      <button aria-label="前週">前週</button>
      <h2 aria-live="polite">2025年1月20日 〜 1月26日</h2>
      <button aria-label="翌週">翌週</button>
    </nav>
  </header>

  <!-- 日付ヘッダー -->
  <div class="date-headers" role="row">
    <div class="time-column-header" role="columnheader">時間</div>
    <div class="date-header" role="columnheader" aria-label="月曜日 1月20日">
      <span class="day-name">月</span>
      <span class="day-number">20</span>
    </div>
    <!-- 他の日付... -->
  </div>

  <!-- メインコンテンツ -->
  <div class="calendar-content" role="grid">
    <div class="time-column" role="rowgroup">
      <div class="time-slot" role="gridcell">00:00</div>
      <!-- 他の時間... -->
    </div>
    
    <div class="day-column" role="rowgroup" aria-label="月曜日のイベント">
      <div class="time-slot" role="gridcell" tabindex="0">
        <div class="event-block" role="button" aria-label="朝食 - 佐藤清様">
          <!-- イベント内容 -->
        </div>
      </div>
      <!-- 他の時間スロット... -->
    </div>
    <!-- 他の日付列... -->
  </div>

  <!-- 現在時刻ライン -->
  <div class="current-time-line" aria-hidden="true">
    <span class="current-time-label">14:30</span>
    <div class="current-time-indicator"></div>
  </div>
</div>
```

### 2.2 CSS Grid/Flexboxレイアウト

```css
/* メインコンテナ */
.week-calendar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: calc(100vh - 200px);
}

/* グリッドレイアウト */
.calendar-content {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  flex: 1;
  overflow: hidden;
}

/* スクロール可能エリア */
.scrollable-content {
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* レスポンシブ調整 */
@media (max-width: 1023px) {
  .calendar-content {
    grid-template-columns: 80px repeat(5, 1fr); /* 平日のみ */
  }
}

@media (max-width: 767px) {
  .calendar-content {
    grid-template-columns: 80px 1fr; /* 1日表示 */
  }
}
```

### 2.3 主要クラス名と役割

| クラス名 | 役割 | 説明 |
|---------|------|------|
| `.week-calendar` | メインコンテナ | 週間カレンダー全体の構造 |
| `.week-navigation` | ナビゲーション | 週移動とタイトル表示 |
| `.date-headers` | 日付ヘッダー | 曜日と日付の表示 |
| `.calendar-content` | メインコンテンツ | グリッドレイアウトの本体 |
| `.time-column` | 時間軸 | 左端の時間表示列 |
| `.day-column` | 日付列 | 各日のイベント表示エリア |
| `.time-slot` | 時間スロット | 30分単位の時間区切り |
| `.event-block` | イベントブロック | 個別イベントの表示 |
| `.current-time-line` | 現在時刻ライン | リアルタイム時刻表示 |

## 3. 既存システム変更点リスト

### 3.1 削除が必要な既存機能

#### ファイル削除
- `components/3_organisms/care-board/care-board-time-base.tsx` の一部機能
  - 縦並びレイアウト関連のスタイル
  - 利用者別の行表示ロジック

#### 削除対象コード
```typescript
// 削除: 縦並び表示のグリッド設定
style={{
  gridTemplateColumns: `80px repeat(${careBoardData.length}, minmax(160px, 1fr))`,
}}

// 削除: 利用者ヘッダーの縦並び表示
{careBoardData.map((resident) => (
  <div className="sticky top-0 bg-gray-100 z-20">
    <ResidentInfoCell resident={resident} />
  </div>
))}
```

### 3.2 新規追加が必要な機能

#### 新規コンポーネント
1. **CareboardWeekView** - メイン週間表示コンポーネント
2. **ResponsiveCareboardWeekView** - レスポンシブ対応ラッパー
3. **useMediaQuery** - メディアクエリ監視フック

#### 新規機能
1. **週ナビゲーション** - 前週/翌週への移動
2. **現在時刻ライン** - リアルタイム時刻表示
3. **イベント重複処理** - 同時間帯の複数イベント配置
4. **レスポンシブ表示** - デバイス別の表示調整

### 3.3 修正が必要な既存機能

#### CareBoard メインコンポーネント
```typescript
// 修正前
type ActiveTabView = 'time' | 'user';

// 修正後
type ActiveTabView = 'time' | 'user' | 'week';
```

#### イベントデータ構造の拡張
```typescript
// 既存
interface CareEvent {
  scheduledTime: string;
  actualTime?: string;
  // ...
}

// 拡張（後方互換性維持）
interface CareEvent {
  scheduledTime: string;
  actualTime?: string;
  duration?: number; // 分単位（デフォルト30分）
  isAllDay?: boolean; // 終日イベント
  // ...
}
```

### 3.4 データ構造の変更要件

#### 新規追加フィールド
```typescript
// イベント期間の管理
interface CareEventExtended extends CareEvent {
  startDateTime: Date;
  endDateTime: Date;
  durationMinutes: number;
  isMultiDay: boolean;
}

// 週間表示用の設定
interface WeekViewSettings {
  timeSlotHeight: number; // デフォルト: 60px
  timeSlotInterval: number; // デフォルト: 30分
  showWeekends: boolean; // デフォルト: true
  startHour: number; // デフォルト: 0
  endHour: number; // デフォルト: 24
}
```

## 4. 実装優先度とスケジュール案

### Phase 1: 必須機能（2週間）

#### Week 1: 基本レイアウト
- [ ] 基本グリッドレイアウトの実装
- [ ] 日付ヘッダーの作成
- [ ] 時間軸の表示
- [ ] 基本的なイベント表示

**成果物**: 静的な週間カレンダー表示

#### Week 2: 基本機能
- [ ] 週ナビゲーション機能
- [ ] イベントクリック処理
- [ ] 現在時刻ライン表示
- [ ] 基本的なレスポンシブ対応

**成果物**: 基本操作可能な週間カレンダー

### Phase 2: 拡張機能（3週間）

#### Week 3: 高度な表示機能
- [ ] イベント重複時の配置計算
- [ ] ドラッグ&ドロップ機能
- [ ] 複数日イベントの表示
- [ ] アニメーション効果

#### Week 4: レスポンシブ最適化
- [ ] タブレット向け5日表示
- [ ] モバイル向け1日表示
- [ ] タッチ操作の最適化
- [ ] パフォーマンス最適化

#### Week 5: 統合・テスト
- [ ] 既存システムとの統合
- [ ] アクセシビリティ対応
- [ ] ブラウザ互換性テスト
- [ ] パフォーマンステスト

**成果物**: 本番環境対応の完全な週間カレンダー

### 想定工数
- **Phase 1**: 80時間（開発者2名 × 2週間）
- **Phase 2**: 120時間（開発者2名 × 3週間）
- **総計**: 200時間

## 5. Googleカレンダーベンチマーク分析

### 5.1 優れたユーザビリティ要素

#### 直感的な時間認識
- **時間軸の固定表示**: 左端の時間軸が常に見える
- **30分単位の区切り**: 細かすぎず粗すぎない適切な粒度
- **現在時刻の明示**: 赤いラインでの現在時刻表示

#### 効率的な情報表示
- **イベントの階層表示**: 重複時の自動配置
- **色分けによる分類**: カテゴリ別の視覚的区別
- **簡潔な情報表示**: 必要最小限の情報で可読性確保

### 5.2 視覚的階層の構築方法

#### 情報の優先度付け
1. **最高優先**: 現在時刻ライン（赤色）
2. **高優先**: 今日の日付（青色背景）
3. **中優先**: イベントブロック（カテゴリ色）
4. **低優先**: グリッドライン（薄いグレー）

#### 空間の効果的活用
- **余白の活用**: 適切な padding/margin で視認性向上
- **グリッドの統一**: 一貫したグリッドシステム
- **階層の明確化**: z-index による重なり順序の管理

### 5.3 独自改善案

#### 介護現場特化の機能
1. **利用者アバター表示**: イベント内に小さなアバター表示
2. **緊急度の視覚化**: 重要なケアイベントの強調表示
3. **実施状況の明示**: 予定/実施済みの明確な区別
4. **チーム別色分け**: 担当チームによる色分け表示

#### アクセシビリティ強化
1. **キーボードナビゲーション**: Tab/矢印キーでの操作
2. **スクリーンリーダー対応**: 適切なARIA属性
3. **高コントラスト対応**: 色覚障害者への配慮
4. **フォントサイズ調整**: ユーザー設定による文字サイズ変更

## 6. 技術的考慮事項

### 6.1 パフォーマンス最適化

#### 仮想化の実装
```typescript
// 大量イベント対応の仮想スクロール
const VirtualizedTimeSlots = () => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 48 });
  
  // スクロール位置に基づいて表示範囲を計算
  const updateVisibleRange = useCallback((scrollTop: number) => {
    const slotHeight = 60;
    const containerHeight = 600;
    const start = Math.floor(scrollTop / slotHeight);
    const end = Math.ceil((scrollTop + containerHeight) / slotHeight);
    setVisibleRange({ start: Math.max(0, start - 2), end: end + 2 });
  }, []);

  return (
    // 表示範囲内のスロットのみレンダリング
  );
};
```

#### メモ化の活用
```typescript
// イベント配置計算の最適化
const memoizedEventLayout = useMemo(() => {
  return calculateEventLayout(dayEvents);
}, [dayEvents]);

// 日付計算の最適化
const memoizedWeekDays = useMemo(() => {
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}, [weekStart, weekEnd]);
```

### 6.2 アクセシビリティ対応

#### ARIA属性の実装
```html
<!-- グリッド構造の明示 -->
<div role="grid" aria-label="週間スケジュール">
  <div role="row">
    <div role="columnheader">時間</div>
    <div role="columnheader" aria-label="月曜日 12月4日">月 12/4</div>
  </div>
  
  <!-- イベントの詳細情報 -->
  <div role="gridcell" aria-label="9時30分 朝食 佐藤清様" tabindex="0">
    <!-- イベント内容 -->
  </div>
</div>
```

#### キーボードナビゲーション
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      // 前日に移動
      break;
    case 'ArrowRight':
      // 翌日に移動
      break;
    case 'ArrowUp':
      // 前の時間スロットに移動
      break;
    case 'ArrowDown':
      // 次の時間スロットに移動
      break;
    case 'Enter':
    case ' ':
      // 選択中のスロット/イベントを開く
      break;
  }
};
```

## 7. 実装ガイドライン

### 7.1 開発手順

1. **基本構造の実装**
   - グリッドレイアウトの作成
   - 時間軸とヘッダーの実装

2. **イベント表示機能**
   - 基本的なイベント配置
   - 重複イベントの処理

3. **インタラクション機能**
   - クリック・ホバー処理
   - ドラッグ&ドロップ

4. **レスポンシブ対応**
   - ブレークポイントの設定
   - デバイス別最適化

5. **最適化・テスト**
   - パフォーマンス調整
   - アクセシビリティテスト

### 7.2 品質保証

#### テスト項目
- [ ] 各ブラウザでの表示確認
- [ ] レスポンシブ動作テスト
- [ ] アクセシビリティ監査
- [ ] パフォーマンス測定
- [ ] ユーザビリティテスト

#### 成功指標
- ページ読み込み時間: 2秒以内
- 1000件イベント表示: 60fps維持
- アクセシビリティスコア: 95点以上
- ユーザー満足度: 4.5/5.0以上

この改善案により、介護現場のスタッフが直感的かつ効率的にスケジュール管理を行える、業界標準レベルの週間カレンダーUIを実現できます。