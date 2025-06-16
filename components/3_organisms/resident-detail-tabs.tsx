import type React from 'react';
import type { Resident } from '@/mocks/care-board-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Settings } from 'lucide-react';
import { ContactInfoCard } from '@/components/2_molecules/contact-info-card';
import { HomeCareOfficeCard } from '@/components/2_molecules/home-care-office-card';
import { MedicalInstitutionCard } from '@/components/2_molecules/medical-institution-card';
import { MedicationCard } from '@/components/2_molecules/medication-card';
import { IndividualPointCard } from '@/components/2_molecules/individual-point-card';

interface ResidentDetailTabsProps {
  resident: Resident;
}

export const ResidentDetailTabs: React.FC<ResidentDetailTabsProps> = ({ resident }) => {
  const detailTabs = [
    { value: 'family', label: 'ご家族情報' },
    { value: 'homeCare', label: '居宅介護支援事業所' },
    { value: 'medical', label: 'かかりつけ医療機関' },
    { value: 'history', label: '既往歴' },
    { value: 'medicationInfo', label: 'お薬情報' },
    { value: 'medicationStatus', label: '服薬状況' },
    { value: 'points', label: '個別ポイント' },
  ];

  return (
    <Tabs defaultValue="family" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-gray-200 p-1.5 rounded-xl">
          {detailTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-4 py-2.5 text-sm font-medium rounded-lg"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="outline"
          className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
        >
          <PlusCircle className="h-4 w-4 mr-2 text-carebase-blue" />
          追加
        </Button>
      </div>

      <TabsContent value="family">
        {resident.contacts && resident.contacts.length > 0 ? (
          resident.contacts.map((contact) => <ContactInfoCard key={contact.id} contact={contact} />)
        ) : (
          <p className="text-center text-gray-500 py-8">ご家族情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="homeCare">
        {resident.homeCareOffice ? (
          <HomeCareOfficeCard office={resident.homeCareOffice} />
        ) : (
          <p className="text-center text-gray-500 py-8">居宅介護支援事業所の情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="medical">
        {resident.medicalInstitutions && resident.medicalInstitutions.length > 0 ? (
          resident.medicalInstitutions.map((institution) => (
            <MedicalInstitutionCard key={institution.id} institution={institution} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">かかりつけ医療機関の情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="history">
        {resident.medicalHistory && resident.medicalHistory.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-carebase-blue">
                    <TableHead className="text-white text-center">登録日</TableHead>
                    <TableHead className="text-white text-center">内容</TableHead>
                    <TableHead className="text-white text-center">備考</TableHead>
                    <TableHead className="text-white text-center w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resident.medicalHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="text-center">{history.date}</TableCell>
                      <TableCell className="whitespace-pre-line">{history.condition}</TableCell>
                      <TableCell>{history.notes || '-'}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          編集する
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500 py-8">既往歴の情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="medicationInfo">
        {resident.medicationInfo && resident.medicationInfo.length > 0 ? (
          resident.medicationInfo.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">お薬情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="medicationStatus">
        {resident.medicationStatus && resident.medicationStatus.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-carebase-blue">
                    <TableHead className="text-white text-center">登録日</TableHead>
                    <TableHead className="text-white text-center">内容</TableHead>
                    <TableHead className="text-white text-center">備考</TableHead>
                    <TableHead className="text-white text-center w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resident.medicationStatus.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell className="text-center">{status.date}</TableCell>
                      <TableCell>{status.content}</TableCell>
                      <TableCell>{status.notes || '-'}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          編集する
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500 py-8">服薬状況の情報はありません。</p>
        )}
      </TabsContent>

      <TabsContent value="points">
        <div className="mb-4 flex gap-2">
          <Button variant="outline" className="bg-white">
            内容のある項目のみ表示
          </Button>
          <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">すべて表示</Button>
          <Button variant="outline" className="bg-white ml-auto">
            <Settings className="h-4 w-4 mr-2" />
            カテゴリを編集
          </Button>
        </div>
        {resident.individualPoints && resident.individualPoints.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {resident.individualPoints.map((point) => (
              <IndividualPointCard key={point.id} point={point} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">個別ポイントの情報はありません。</p>
        )}
      </TabsContent>
    </Tabs>
  );
};
