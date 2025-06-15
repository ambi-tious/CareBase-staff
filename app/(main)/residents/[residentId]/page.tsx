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
import { Badge } from "@/components/ui/badge"
import { Edit3, Phone, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { ResidentProfileHeader } from "@/components/3_organisms/resident-profile-header"
import { ResidentDetailTabs } from "@/components/3_organisms/resident-detail-tabs"

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
      </div>
    </CardContent>
  </Card>
)

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
    {point.icon && <point.icon className="h-8 w-8 mx-auto mb-2" />}
    <p className="text-sm font-medium">{point.category}</p>
  </div>
)

export default function ResidentDetailPage({ params }: { params: { residentId: string } }) {
  const residentIdNum = Number.parseInt(params.residentId, 10)
  const resident = getResidentById(residentIdNum)

  if (!resident) {
    return <div className="p-6 text-center text-red-500">ご利用者が見つかりません。</div>
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <ResidentProfileHeader resident={resident} />
      <ResidentDetailTabs resident={resident} />

      <div className="fixed bottom-6 right-6 z-10">
        <Button className="h-16 w-16 rounded-full bg-carebase-blue shadow-lg hover:bg-carebase-blue-dark md:h-12 md:w-auto md:px-6 md:py-3 font-semibold">
          <Clock className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">クイック作成</span>
        </Button>
      </div>
    </div>
  )
}
