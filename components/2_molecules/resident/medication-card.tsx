import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MedicationInfo } from '@/mocks/care-board-data';
import { Edit3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface MedicationCardProps {
  medication: MedicationInfo;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => (
  <Card className="mb-4">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={medication.imageUrl || '/placeholder.svg?height=96&width=96&query=medication'}
              alt={medication.medicationName}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          <Link
            href="#"
            className="text-xs text-carebase-blue hover:underline mt-1 block text-center"
          >
            画像を変更
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm text-gray-500">薬情報</h3>
              <p className="text-lg font-bold">{medication.medicationName}</p>
            </div>
            <Button variant="outline" size="sm">
              <Edit3 className="h-3 w-3 mr-1" />
              編集する
            </Button>
          </div>
          <div className="text-sm space-y-1">
            <p>
              <strong>調剤/処方医療機関:</strong> {medication.institution}
            </p>
            <p>
              <strong>調剤年月日:</strong> {medication.prescriptionDate}
            </p>
            {medication.notes && (
              <div className="pt-2 border-t">
                <p>
                  <strong>備考:</strong> {medication.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
