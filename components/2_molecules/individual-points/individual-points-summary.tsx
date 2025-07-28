'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { IndividualPoint } from '@/types/individual-point';
import { categoryOptions } from '@/types/individual-point';
import { PlusCircle, Target } from 'lucide-react';
import type React from 'react';

interface IndividualPointsSummaryProps {
  points: IndividualPoint[];
  onCreatePoint?: () => void;
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string;
  className?: string;
}

export const IndividualPointsSummary: React.FC<IndividualPointsSummaryProps> = ({
  points,
  onCreatePoint,
  onCategoryClick,
  selectedCategory,
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

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryClick?.(categoryValue);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categoryOptions.map((category) => {
          const count = categoryCounts[category.value];
          const Icon = getLucideIcon(category.icon);
          const hasPoints = count > 0;

          return (
            <div
              key={category.value}
              className={`
                    relative p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${
                      selectedCategory === category.value
                        ? 'border-carebase-blue-dark bg-carebase-blue text-white shadow-lg'
                        : hasPoints
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
              <div className="flex items-center text-center gap-3">
                <div
                  className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          selectedCategory === category.value
                            ? 'bg-white text-carebase-blue'
                            : hasPoints
                              ? 'bg-carebase-blue text-white'
                              : 'bg-gray-300 text-gray-600'
                        }
                      `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      selectedCategory === category.value
                        ? 'text-white'
                        : hasPoints
                          ? 'text-carebase-blue'
                          : 'text-gray-600'
                    }`}
                  >
                    {category.label}
                  </p>
                </div>
              </div>

              {/* 件数バッジ（件数がある場合のみ） */}
              {hasPoints && (
                <div className="absolute -top-2 -right-2">
                  <Badge className={`${
                    selectedCategory === category.value
                      ? 'bg-white text-carebase-blue border-carebase-blue'
                      : 'bg-red-500 text-white border-white'
                  } border-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold`}>
                    {count}
                  </Badge>
                </div>
              )}

              {/* ホバー時のアクションヒント */}
              {selectedCategory !== category.value && (
                <div className="absolute inset-0 bg-carebase-blue/10 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-xs text-carebase-blue font-medium bg-white px-2 py-1 rounded shadow">
                    詳細を見る
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
