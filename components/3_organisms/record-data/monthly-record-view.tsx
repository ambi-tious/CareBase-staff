'use client';

import { MonthlyDataTable } from '@/components/2_molecules/record-data/monthly-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { MonthlyData } from '@/types/record-data';
import { BarChart, Download, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface MonthlyRecordViewProps {
  monthlyData: MonthlyData;
  onExport?: () => void;
}

export const MonthlyRecordView: React.FC<MonthlyRecordViewProps> = ({
  monthlyData,
  onExport,
}) => {
  const { summary, stats } = monthlyData;

  // Calculate week-over-week trends
  const weeklyAverages = useMemo(() => {
    const weeks = [];
    const sortedStats = [...stats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedStats.length; i += 7) {
      const week = sortedStats.slice(i, i + 7);
      const avg = week.reduce((sum, stat) => sum + stat.totalRecords, 0) / week.length;
      weeks.push(avg);
    }
    
    return weeks;
  }, [stats]);

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRateProgress = (rate: number) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          月次統計レポート
        </h2>
        
        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            レポート出力
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              総記録数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {summary.totalRecords.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              1日平均 {summary.averageDaily.toFixed(1)}件
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              完了率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getCompletionRateColor(summary.completionRate)}`}>
              {summary.completionRate.toFixed(1)}%
            </div>
            <Progress 
              value={summary.completionRate} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              主要カテゴリ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {summary.topCategory}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              最も多い記録種別
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              トレンド
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-6 h-6 ${
                weeklyAverages.length > 1 && weeklyAverages[weeklyAverages.length - 1] > weeklyAverages[0]
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`} />
              <div className="text-lg font-bold text-gray-900">
                {weeklyAverages.length > 1 && weeklyAverages[weeklyAverages.length - 1] > weeklyAverages[0] 
                  ? '上昇傾向'
                  : '安定'}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              記録数の推移
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            記録種別内訳
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Care Records */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-blue-800 font-medium mb-2">ケア記録</div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.reduce((sum, stat) => sum + stat.careRecordCount, 0)}件
              </div>
              <div className="text-sm text-blue-600 mt-1">
                全体の{((stats.reduce((sum, stat) => sum + stat.careRecordCount, 0) / summary.totalRecords) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Nursing Records */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-800 font-medium mb-2">介護記録</div>
              <div className="text-2xl font-bold text-green-900">
                {stats.reduce((sum, stat) => sum + stat.nursingRecordCount, 0)}件
              </div>
              <div className="text-sm text-green-600 mt-1">
                全体の{((stats.reduce((sum, stat) => sum + stat.nursingRecordCount, 0) / summary.totalRecords) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Handover Records */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-orange-800 font-medium mb-2">申し送り</div>
              <div className="text-2xl font-bold text-orange-900">
                {stats.reduce((sum, stat) => sum + stat.handoverCount, 0)}件
              </div>
              <div className="text-sm text-orange-600 mt-1">
                全体の{((stats.reduce((sum, stat) => sum + stat.handoverCount, 0) / summary.totalRecords) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <MonthlyDataTable stats={stats} month={monthlyData.month} />
    </div>
  );
};