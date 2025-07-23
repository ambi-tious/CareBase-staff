'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { MonthlyStats } from '@/types/record-data';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface MonthlyDataTableProps {
  stats: MonthlyStats[];
  month: string;
}

export const MonthlyDataTable: React.FC<MonthlyDataTableProps> = ({ stats, month }) => {
  const getCompletionRateColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionRateVariant = (rate: number) => {
    if (rate >= 95) return 'default';
    if (rate >= 90) return 'secondary';
    return 'destructive';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'M/d(E)', { locale: ja });
    } catch {
      return dateString;
    }
  };

  const sortedStats = [...stats].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            日別記録データ統計 ({format(new Date(month + '-01'), 'yyyy年M月', { locale: ja })})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">日付</TableHead>
                <TableHead className="text-center">ケア記録</TableHead>
                <TableHead className="text-center">介護記録</TableHead>
                <TableHead className="text-center">申し送り</TableHead>
                <TableHead className="text-center">合計記録数</TableHead>
                <TableHead className="text-center">平均時間</TableHead>
                <TableHead className="text-center min-w-[150px]">完了率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((stat) => (
                <TableRow key={stat.date} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{formatDate(stat.date)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {stat.careRecordCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {stat.nursingRecordCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      {stat.handoverCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-lg">{stat.totalRecords}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {stat.averageTime ? (
                      <span className="text-sm text-gray-600">{stat.averageTime}分</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {stat.completionRate ? (
                      <div className="flex items-center gap-2">
                        <Progress value={stat.completionRate} className="w-16 h-2" />
                        <Badge
                          variant={getCompletionRateVariant(stat.completionRate)}
                          className="text-xs min-w-[45px]"
                        >
                          {stat.completionRate}%
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">総記録数</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.reduce((sum, stat) => sum + stat.totalRecords, 0)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">1日平均</div>
          <div className="text-2xl font-bold text-gray-900">
            {(stats.reduce((sum, stat) => sum + stat.totalRecords, 0) / stats.length).toFixed(1)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">平均完了率</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.filter((s) => s.completionRate).length > 0
              ? (
                  stats
                    .filter((s) => s.completionRate)
                    .reduce((sum, stat) => sum + (stat.completionRate || 0), 0) /
                  stats.filter((s) => s.completionRate).length
                ).toFixed(1)
              : '0'}
            %
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">平均処理時間</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.filter((s) => s.averageTime).length > 0
              ? (
                  stats
                    .filter((s) => s.averageTime)
                    .reduce((sum, stat) => sum + (stat.averageTime || 0), 0) /
                  stats.filter((s) => s.averageTime).length
                ).toFixed(0)
              : '0'}
            分
          </div>
        </div>
      </div>
    </div>
  );
};
