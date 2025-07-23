'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { recordTypeOptions, priorityOptions, type RecordDataItem } from '@/types/record-data';
import { Clock, User, FileText, Edit, Trash2, Heart, Stethoscope, MessageSquare } from 'lucide-react';

interface RecordCardProps {
  record: RecordDataItem;
  onEdit?: (record: RecordDataItem) => void;
  onDelete?: (recordId: string) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onEdit, onDelete }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'care':
        return <Heart className="h-4 w-4" />;
      case 'nursing':
        return <Stethoscope className="h-4 w-4" />;
      case 'handover':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeConfig = (type: string) => {
    return recordTypeOptions.find(option => option.value === type) || recordTypeOptions[0];
  };

  const getPriorityConfig = (priority: string) => {
    return priorityOptions.find(option => option.value === priority) || priorityOptions[1];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '実施中';
      case 'pending':
        return '予定';
      default:
        return '未設定';
    }
  };

  const typeConfig = getTypeConfig(record.type);
  const priorityConfig = getPriorityConfig(record.priority || 'medium');

  return (
    <Card className="relative hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
              {getTypeIcon(record.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
                {record.priority && (
                  <Badge variant="outline" className={priorityConfig.color}>
                    {priorityConfig.label}
                  </Badge>
                )}
                {record.status && (
                  <Badge variant="outline" className={getStatusColor(record.status)}>
                    {getStatusLabel(record.status)}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {record.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(record)}
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Edit className="h-3 w-3" />
                <span className="sr-only">編集</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(record.id)}
                className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">削除</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            {record.content}
          </p>
          
          {record.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">注記:</span> {record.notes}
              </p>
            </div>
          )}

          {record.category && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">カテゴリ:</span>
              <Badge variant="secondary" className="text-xs">
                {record.category}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{record.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{record.staffName}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};