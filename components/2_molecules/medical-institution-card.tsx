import type React from 'react';
import type { MedicalInstitution } from '@/mocks/care-board-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit3, Phone, MapPin } from 'lucide-react';

interface MedicalInstitutionCardProps {
  institution: MedicalInstitution;
}

export const MedicalInstitutionCard: React.FC<MedicalInstitutionCardProps> = ({ institution }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <h3 className="text-lg font-semibold mb-1">病院名</h3>
          <p className="text-xl font-bold text-carebase-blue">{institution.institutionName}</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit3 className="h-3 w-3 mr-1" />
          編集する
        </Button>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          <p>
            <strong>医師名:</strong> {institution.doctorName}
          </p>
          <p>
            <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
            <strong>電話番号:</strong> {institution.phone}
          </p>
          <p>
            <strong>FAX:</strong> {institution.fax}
          </p>
          <p className="md:col-span-2">
            <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
            <strong>住所:</strong> {institution.address}
          </p>
          {institution.notes && (
            <p className="md:col-span-2 pt-2 mt-2 border-t">
              <strong>備考:</strong> {institution.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
