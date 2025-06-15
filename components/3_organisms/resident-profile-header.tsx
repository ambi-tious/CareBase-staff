import type React from "react"
import type { Resident } from "@/mocks/care-board-data"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InfoRow } from "@/components/1_atoms/info-row"

interface ResidentProfileHeaderProps {
  resident: Resident
}

export const ResidentProfileHeader: React.FC<ResidentProfileHeaderProps> = ({ resident }) => {
  return (
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
            <Button className="w-full mb-3 bg-carebase-blue hover:bg-carebase-blue-dark font-semibold py-3 text-base">
              記録データ
            </Button>
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
            <div className="mt-0">
              <InfoRow label="認定有効期間" value={`${resident.certValidityStart} ~ ${resident.certValidityEnd}`} />
            </div>
            <div className="mt-2">
              <InfoRow label="住所" value={resident.address} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
