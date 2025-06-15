import type { LucideIcon } from "lucide-react"
import {
  Users,
  ClipboardList,
  MessageSquare,
  Calendar,
  BookOpen,
  Folder,
  FileText,
  Settings,
  Cog,
  User,
  AlertTriangle,
  Clock,
  Book,
  FilePlus,
  FileWarning,
  Clipboard,
  List,
  Settings2,
  Tags,
  FileSignature,
  Bell,
  Users2,
  Building,
  Network,
  Lightbulb,
  Presentation,
  FileArchive,
  BookMarked,
  NotebookText,
  Notebook,
  MessageCircle,
  FileClock,
} from "lucide-react"

export interface NavLink {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavCategory {
  title: string
  icon: LucideIcon
  links: NavLink[]
}

export const dashboardMenu: NavCategory[] = [
  {
    title: "利用者関連",
    icon: Users,
    links: [
      { label: "各種情報(利用者リスト)", href: "#", icon: User },
      { label: "アラートリスト", href: "#", icon: AlertTriangle },
    ],
  },
  {
    title: "ケアボード",
    icon: ClipboardList,
    links: [
      { label: "時間ベース", href: "#", icon: Clock },
      { label: "ご利用者ベース", href: "#", icon: Notebook },
    ],
  },
  {
    title: "連絡・予定",
    icon: MessageSquare,
    links: [
      { label: "ボード表示", href: "#", icon: Presentation },
      { label: "カレンダー表示", href: "#", icon: Calendar },
    ],
  },
  {
    title: "研修・マニュアル",
    icon: BookOpen,
    links: [
      { label: "研修・課題", href: "#", icon: Lightbulb },
      { label: "マニュアル", href: "#", icon: Book },
      { label: "ガイド", href: "#", icon: BookMarked },
    ],
  },
  {
    title: "書類情報関連",
    icon: Folder,
    links: [
      { label: "議事録", href: "#", icon: NotebookText },
      { label: "ヒヤリハット", href: "#", icon: FileWarning },
      { label: "事故報告書", href: "#", icon: FileClock },
      { label: "行事企画書", href: "#", icon: FileSignature },
      { label: "その他書類", href: "#", icon: FileArchive },
    ],
  },
  {
    title: "申し送り・介護記録",
    icon: FileText,
    links: [
      { label: "申し送り一覧", href: "#", icon: MessageCircle },
      { label: "介護記録一覧", href: "#", icon: Clipboard },
      { label: "各項目毎の記録", href: "#", icon: List },
    ],
  }
]
