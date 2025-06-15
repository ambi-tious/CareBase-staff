import type React from "react"
import {
  getResidentById,
  type ContactPerson,
  type HomeCareOffice,
  type MedicalInstitution,
  type MedicationInfo,
  type IndividualPoint,
} from "@/mocks/care-board-data"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit3, Phone, Mail, MapPin, Clock, Settings } from 'lucide-react'
import Link from "next/link"

interface InfoRowProps {
  label: string
  value?: string | number | null
  className?: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, className }) => (
  <div className={`grid grid-cols-3 gap-2 py-2 border-b border-gray-100 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900 col-span-2">{value || "-"}</dd>
  </div>
)

interface ContactCardProps {
  contact: ContactPerson
}

const ContactInfoCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              contact.type === "緊急連絡先" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {contact.type}
          </span>
          <CardTitle className="text-lg">
            {contact.name} <span className="text-sm text-gray-500">({contact.furigana})</span>
          </CardTitle>
        </div>
        <Button variant="outline" size="sm">
          <Edit3 className="h-3 w-3 mr-1" />
          編集する
        </Button>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          <p>
            <strong>続柄:</strong> {contact.relationship}
          </p>
          <p>
            <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
            <strong>電話番号1:</strong> {contact.phone1}
          </p>
          {contact.phone2 && (
            <p>
              <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>電話番号2:</strong> {contact.phone2}
            </p>
          )}
          {contact.email && (
            <p>
              <Mail className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>メール:</strong> {contact.email}
            </p>
          )}
          <p className="md:col-span-2">
            <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
            <strong>住所:</strong> {contact.address}
          </p>
          {contact.notes && (
            <p className="md:col-span-2 pt-2 mt-2 border-t">
              <strong>備考:</strong> {contact.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const HomeCareOfficeCard: React.FC<{ office: HomeCareOffice }> = ({ office }) => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <h3 className="text-lg font-semibold mb-1">事業所名</h3>
        <p className="text-xl font-bold text-carebase-blue">{office.businessName}</p>
      </div>
      <Button variant="outline" size="sm">
        <Edit3 className="h-3 w-3 mr-1" />
        編集する
      </Button>
    </CardHeader>
    <CardContent className="text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
        <p>
          <strong>ケアマネージャー:</strong> {office.careManager}
        </p>
        <p>
          <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
          <strong>電話番号:</strong> {office.phone}
        </p>
        <p>
          <strong>FAX:</strong> {office.fax}
        </p>
        <p className="md:col-span-2">
          <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
          <strong>住所:</strong> {office.address}
        </p>
        {office.notes && (
          <p className="md:col-span-2 pt-2 mt-2 border-t">
            <strong>備考:</strong> {office.notes}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
)

const MedicalInstitutionCard: React.FC<{ institution: MedicalInstitution }> = ({ institution }) => (
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
)

const MedicationCard: React.FC<{ medication: MedicationInfo }> = ({ medication }) => (
  <Card className="mb-4">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={medication.imageUrl || "/placeholder.svg?height=96&width=96&query=medication"}
              alt={medication.medicationName}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <Link href="#" className="text-xs text-carebase-blue hover:underline mt-1 block text-center">
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
      </CardContent>
    </Card>
  )
}

const IndividualPointCard: React.FC<{ point: IndividualPoint }> = ({ point }) => (
  <div
    className={`relative p-4 rounded-lg text-center ${
      point.isActive ? "bg-carebase-blue text-white" : "bg-gray-200 text-gray-500"
    }`}
  >
    {point.count > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
      >
        {point.count}
      </Badge>
    )}
    <point.icon className="h-8 w-8 mx-auto mb-2" />
    <p className="text-sm font-medium">{point.category}</p>
  </div>
)

export default function ResidentDetailPage({ params }: { params: { residentId: string } }) {
  const residentIdNum = Number.parseInt(params.residentId, 10)
  const resident = getResidentById(residentIdNum)

  if (!resident) {
    return <div className="p-6 text-center text-red-500">ご利用者が見つかりません。</div>
  }

  const detailTabs = [
    { value: "family", label: "ご家族情報" },
    { value: "homeCare", label: "居宅介護支援事業所" },
    { value: "medical", label: "かかりつけ医療機関" },
    { value: "history", label: "既往歴" },
    { value: "medicationInfo", label: "お薬情報" },
    { value: "medicationStatus", label: "服薬状況" },
    { value: "points", label: "個別ポイント" },
  ]

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Avatar and Actions */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/4">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden mb-4 shadow-md">
                <Image
                  src={resident.avatarUrl || "/placeholder.svg?height=192&width=192&query=resident+avatar"}
                  alt={resident.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
              <Link href="#" className="text-sm text-carebase-blue hover:underline mb-4 self-center lg:self-start">
                画像を更新
              </Link>
              <Button className="w-full mb-3 bg-carebase-blue hover:bg-carebase-blue-dark font-semibold py-3 text-base">記録データ</Button>
              <Button
                variant="outline"
                className="w-full border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-semibold py-3 text-base"
              >
                ケアプラン
              </Button>
            </div>

            {/* Right Column: Resident Details */}
            <div className="flex-1 lg:w-3/4">
              <div className="mb-4">
                <h2 className="text-xs text-gray-500">名前</h2>
                <p className="text-3xl font-bold mb-1 text-carebase-text-primary">{resident.name}</p>
                <h3 className="text-sm text-gray-500">フリガナ</h3>
                <p className="text-lg text-gray-700 mb-4">{resident.furigana}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-0">
                {/* Column 1 */}
                <div>
                  <InfoRow label="生年月日" value={`${resident.dob} (${resident.age}歳)`} />
                  <InfoRow label="性別" value={resident.sex} />
                  <InfoRow label="所属フロア・グループ" value={resident.floorGroup} />
                  <InfoRow label="所属ユニット・チーム" value={resident.unitTeam} />
                </div>
                {/* Column 2 */}
                <div>
                  <InfoRow label="部屋情報" value={resident.roomInfo} />
                  <InfoRow label="登録日" value={resident.registrationDate} />
                  <InfoRow label="更新日" value={resident.lastUpdateDate} />
                  <InfoRow label="入所日" value={resident.admissionDate} />
                </div>
                {/* Column 3 */}
                <div>
                  <InfoRow label="退所日" value={resident.dischargeDate} />
                  <InfoRow label="入所状況" value={resident.admissionStatus} />
                  <InfoRow label="要介護度" value={resident.careLevel} />
                  <InfoRow label="認定日" value={resident.certificationDate} />
                </div>
              </div>
              <div className="mt-0"> {/* Reduced margin top */}
                 <InfoRow label="認定有効期間" value={`${resident.certValidityStart} ~ ${resident.certValidityEnd}`} />
              </div>
              <div className="mt-2">
                <InfoRow label="住所" value={resident.address} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation and Content */}
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
          <Button variant="outline" className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium">
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
                        <TableCell>{history.notes || "-"}</TableCell>
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
            resident.medicationInfo.map((medication) => <MedicationCard key={medication.id} medication={medication} />)
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
                        <TableCell>{status.notes || "-"}</TableCell>
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

      <div className="fixed bottom-6 right-6 z-10">
        <Button className="h-16 w-16 rounded-full bg-carebase-blue shadow-lg hover:bg-carebase-blue-dark md:h-12 md:w-auto md:px-6 md:py-3 font-semibold">
          <Clock className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">クイック作成</span>
        </Button>
      </div>
    </div>
  )
}
