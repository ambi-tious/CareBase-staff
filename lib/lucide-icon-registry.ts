'use client';

import {
  Activity,
  AlertTriangle,
  Bath,
  Bed,
  Bell,
  Book,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle,
  Clipboard,
  ClipboardList,
  Clock,
  Clock as ClockIcon,
  Cookie,
  Droplets,
  Dumbbell,
  Edit3,
  DeleteIcon as ExcretionIcon,
  Eye,
  FileArchive,
  FileClock,
  FileSignature,
  FileText,
  FileWarning,
  Folder,
  FolderPlus,
  FileCheck,
  Camera,
  File,
  GlassWater,
  Heart,
  HeartPulse,
  Lightbulb,
  List,
  MessageCircle,
  MessageSquare,
  Notebook,
  NotebookText,
  Palette,
  Pill,
  Presentation,
  Settings,
  Shield,
  Soup,
  Stethoscope,
  Target,
  Thermometer,
  SmileIcon as Tooth,
  User,
  UserCheck,
  Users,
  Utensils,
  Wind,
  Home,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

// Icon registry mapping string names to icon components
const iconRegistry: Record<string, LucideIcon> = {
  // Clock icon for current time button
  ClockIcon,

  // Dashboard menu icons
  Users,
  ClipboardList,
  MessageSquare,
  Calendar,
  BookOpen,
  Folder,
  FileText,
  User,
  AlertTriangle,
  Clock,
  Book,
  FileWarning,
  List,
  FileSignature,
  Lightbulb,
  Presentation,
  FileArchive,
  BookMarked,
  NotebookText,
  FileCheck,
  Camera,
  File,
  Notebook,
  MessageCircle,
  FileClock,
  Bell,

  // Staff data icons
  UserCheck,
  Shield: Shield,
  Stethoscope,
  Heart,
  Clipboard,

  // Care board icons
  Thermometer,
  HeartPulse,
  Droplets,
  Utensils,
  Bath,
  Pill,
  Tooth,
  CheckCircle,
  ExcretionIcon,
  Eye,
  GlassWater,
  Soup,
  Cookie,
  Bed,
  Wind,
  Activity,
  Dumbbell,
  Edit3,
  Target,
  Settings,
  FolderPlus,
  Palette,
  Home,
  MapPin,
};

// Helper function to get icon component by string name
export const getLucideIcon = (iconName: string): LucideIcon => {
  const IconComponent = iconRegistry[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in registry, falling back to User icon`);
    return User;
  }
  return IconComponent;
};

// Export type for icon names
export type IconName = keyof typeof iconRegistry;
