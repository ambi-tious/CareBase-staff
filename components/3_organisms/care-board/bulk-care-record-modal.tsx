'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { CareCategoryKey, CareEvent, careCategories, Resident } from '@/mocks/care-board-data';
import { Calendar, Clock, Save, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface BulkCareRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
  onSave: (records: { residentId: number; event: CareEvent }[]) => void;
}

interface ResidentSelection {
  resident: Resident;
  selected: boolean;
  note: string;
}

export const BulkCareRecordModal: React.FC<BulkCareRecordModalProps> = ({
  isOpen,
  onClose,
  residents,
  onSave,
}) => {
  const [residentSelections, setResidentSelections] = useState<ResidentSelection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CareCategoryKey | ''>('');
  const [commonLabel, setCommonLabel] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [staffName, setStaffName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 分オプションを生成（5分間隔）
  const minuteOptions = Array.from({ length: 12 }).map((_, index) => {
    const minute = index * 5;
    return {
      value: minute.toString().padStart(2, '0'),
      label: minute.toString().padStart(2, '0'),
    };
  });

  // 初期化
  useEffect(() => {
    if (isOpen) {
      // 現在時刻をデフォルト値として設定
      const now = new Date();
      setHour(now.getHours().toString().padStart(2, '0'));
      setMinute(Math.floor(now.getMinutes() / 5) * (5).toString().padStart(2, '0'));

      // 利用者選択の初期化
      setResidentSelections(
        residents.map((resident) => ({
          resident,
          selected: false,
          note: '',
        }))
      );

      // ログインユーザー情報を取得
      try {
        const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
        if (staffDataStr) {
          const staffData = JSON.parse(staffDataStr);
          setStaffName(staffData.staff.name);
        } else {
          setStaffName('田中 花子'); // フォールバック
        }
      } catch (error) {
        console.error('Failed to load staff data:', error);
        setStaffName('田中 花子');
      }

      // フォームをリセット
      setSelectedCategory('');
      setCommonLabel('');
      setErrors({});
    }
  }, [isOpen, residents]);

  // 全選択/全解除の切り替え
  const toggleSelectAll = (checked: boolean) => {
    setResidentSelections((prev) =>
      prev.map((selection) => ({
        ...selection,
        selected: checked,
      }))
    );
  };

  // 個別の利用者選択の切り替え
  const toggleResidentSelection = (residentId: number, checked: boolean) => {
    setResidentSelections((prev) =>
      prev.map((selection) =>
        selection.resident.id === residentId ? { ...selection, selected: checked } : selection
      )
    );
  };

  // 個別の特記事項の更新
  const updateResidentNote = (residentId: number, note: string) => {
    setResidentSelections((prev) =>
      prev.map((selection) =>
        selection.resident.id === residentId ? { ...selection, note } : selection
      )
    );
  };

  // フォームのバリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!hour || !minute) {
      newErrors.time = '時間を選択してください';
    }

    if (!selectedCategory) {
      newErrors.category = 'ケア種別を選択してください';
    }

    if (!commonLabel || commonLabel.trim() === '') {
      newErrors.label = '内容を入力してください';
    }

    const selectedCount = residentSelections.filter((s) => s.selected).length;
    if (selectedCount === 0) {
      newErrors.residents = '少なくとも1人の利用者を選択してください';
    } else if (selectedCount > 20) {
      newErrors.residents = '一度に選択できる利用者は最大20人です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 時間と分を結合
      const timeString = `${hour}:${minute}`;

      // 選択されたカテゴリの情報を取得
      const category = careCategories.find((c) => c.key === selectedCategory);

      // 選択された利用者ごとにイベントを作成
      const records = residentSelections
        .filter((selection) => selection.selected)
        .map((selection) => {
          // 基本イベント情報
          const event: CareEvent = {
            time: timeString,
            icon: category?.icon || 'ClipboardList',
            label: commonLabel,
            categoryKey: selectedCategory as CareCategoryKey,
            details: `担当者: ${staffName}\n${selection.note}`.trim(),
          };

          return {
            residentId: selection.resident.id,
            event,
          };
        });

      // 保存処理を呼び出し
      onSave(records);

      // モーダルを閉じる
      onClose();
    } catch (error) {
      console.error('Failed to save bulk records:', error);
      setErrors({
        submit: '記録の保存中にエラーが発生しました。もう一度お試しください。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            まとめて記録
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* 時間選択 */}
          <div className="space-y-2 border p-4 rounded-md bg-gray-50">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <label className="text-sm font-medium">
                時間 <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">時</label>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className={errors.time ? 'border-red-500' : ''}>
                    <SelectValue placeholder="時" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">分</label>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder="分" />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          {/* ケア種別選択 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              ケア種別 <span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as CareCategoryKey)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="ケア種別を選択" />
              </SelectTrigger>
              <SelectContent>
                {careCategories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    <div className="flex items-center gap-2">
                      {React.createElement(getLucideIcon(category.icon), {
                        className: 'h-4 w-4',
                      })}
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>

          {/* 共通内容 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              内容 <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={commonLabel}
              onChange={(e) => setCommonLabel(e.target.value)}
              placeholder="例: 食事摂取量8割"
              className={errors.label ? 'border-red-500' : ''}
            />
            {errors.label && <p className="text-red-500 text-xs">{errors.label}</p>}
          </div>

          {/* 担当者情報 */}
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2" />
              <label className="text-sm font-medium">担当者</label>
            </div>
            <div className="p-3 border rounded-md bg-gray-50">
              <p className="text-sm font-medium">{staffName}</p>
              <p className="text-xs text-gray-500 mt-1">
                ログイン中のユーザーが自動的に設定されます
              </p>
            </div>
          </div>

          {/* 利用者選択 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                利用者選択 <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                />
                <label htmlFor="select-all" className="ml-2 text-sm">
                  全選択
                </label>
              </div>
            </div>

            {errors.residents && <p className="text-red-500 text-xs">{errors.residents}</p>}

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-12 p-2 text-left">選択</th>
                      <th className="p-2 text-left">利用者名</th>
                      <th className="p-2 text-left">特記事項</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residentSelections.map((selection) => (
                      <tr key={selection.resident.id} className="border-t">
                        <td className="p-2">
                          <Checkbox
                            checked={selection.selected}
                            onCheckedChange={(checked) =>
                              toggleResidentSelection(selection.resident.id, checked === true)
                            }
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{selection.resident.name}</div>
                            <div className="text-xs text-gray-500">
                              ({selection.resident.careLevel})
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Input
                            value={selection.note}
                            onChange={(e) =>
                              updateResidentNote(selection.resident.id, e.target.value)
                            }
                            placeholder="個別の特記事項"
                            disabled={!selection.selected}
                            className="text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {errors.submit}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? '保存中...' : '一括登録'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
