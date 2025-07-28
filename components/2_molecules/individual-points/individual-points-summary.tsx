'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { IndividualPoint } from '@/types/individual-point';
import { categoryOptions } from '@/types/individual-point';
import { BarChart3, PlusCircle, Target, TrendingUp } from 'lucide-react';
import type React from 'react';

interface IndividualPointsSummaryProps {
  points: IndividualPoint[];
  onCreatePoint?: () => void;
  onCategoryClick?: (category: string) => void;
  className?: string;
}

export const IndividualPointsSummary: React.FC<IndividualPointsSummaryProps> = ({
  points,
  onCreatePoint,
  onCategoryClick,
  className = '',
}) => {
  // カテゴリ別の件数を集計
  const categoryCounts = categoryOptions.reduce(
    (acc, category) => {
      const count = points.filter(
        (point) => point.category === category.value && point.status === 'active'
      ).length;
      acc[category.value] = count;
      return acc;
    },
    {} as Record<string, number>
  );

  // 統計情報を計算
  const totalActivePoints = points.filter((point) => point.status === 'active').length;
  const highPriorityCount = points.filter(
    (point) => point.priority === 'high' && point.status === 'active'
  ).length;
  const recentlyUpdatedCount = points.filter((point) => {
    const updatedDate = new Date(point.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updatedDate > weekAgo && point.status === 'active';
  }).length;

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryClick?.(categoryValue);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 全体統計サマリ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">総ポイント数</p>
                <p className="text-2xl font-bold text-blue-900">{totalActivePoints}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">高優先度</p>
                <p className="text-2xl font-bold text-red-900">{highPriorityCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-200 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">最近更新</p>
                <p className="text-2xl font-bold text-green-900">{recentlyUpdatedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center h-full">
              <Button
                onClick={onCreatePoint}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                新規作成
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリ別サマリ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-carebase-blue" />
            カテゴリ別サマリ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categoryOptions.map((category) => {
              const count = categoryCounts[category.value];
              const Icon = getLucideIcon(category.icon);
              const hasPoints = count > 0;

              return (
                <div
                  key={category.value}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${
                      hasPoints
                        ? 'border-carebase-blue bg-carebase-blue/5 hover:bg-carebase-blue/10 hover:border-carebase-blue-dark'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleCategoryClick(category.value)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${category.label}カテゴリ: ${count}件`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category.value);
                    }
                  }}
                >
                  {/* カテゴリアイコンと名前 */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${hasPoints ? 'bg-carebase-blue text-white' : 'bg-gray-300 text-gray-600'}
                      `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${hasPoints ? 'text-carebase-blue' : 'text-gray-600'}`}
                      >
                        {category.label}
                      </p>
                      <p
                        className={`text-lg font-bold ${hasPoints ? 'text-carebase-blue' : 'text-gray-500'}`}
                      >
                        {count}
                      </p>
                    </div>
                  </div>

                  {/* 件数バッジ（件数がある場合のみ） */}
                  {hasPoints && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-red-500 text-white border-white border-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold">
                        {count}
                      </Badge>
                    </div>
                  )}

                  {/* ホバー時のアクションヒント */}
                  <div className="absolute inset-0 bg-carebase-blue/10 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-xs text-carebase-blue font-medium bg-white px-2 py-1 rounded shadow">
                      詳細を見る
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* カテゴリサマリの説明 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">カテゴリ別表示について</p>
                <p className="text-xs leading-relaxed">
                  各カテゴリをクリックすると、該当する個別ポイントのみを表示します。
                  数字は有効な個別ポイントの件数を示しています。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 空の状態の表示 */}
      {totalActivePoints === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">個別ポイントがありません</h3>
            <p className="text-gray-500 mb-6">
              この利用者様の個別ケアポイントを作成して、
              <br />
              より質の高いケアを提供しましょう。
            </p>
            {onCreatePoint && (
              <Button
                onClick={onCreatePoint}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                最初の個別ポイントを作成
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};