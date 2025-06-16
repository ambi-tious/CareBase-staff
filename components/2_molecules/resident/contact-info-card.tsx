import type React from "react"
import type { ContactPerson } from "@/mocks/care-board-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit3, Phone, Mail, MapPin } from "lucide-react"

interface ContactCardProps {
  contact: ContactPerson
}

export const ContactInfoCard: React.FC<ContactCardProps> = ({ contact }) => {
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
