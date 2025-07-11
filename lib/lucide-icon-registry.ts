'use client';

import {
  Activity,
  AlertTriangle,
  Bath,
  Bed,
  Book,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle,
  Clipboard,
  ClipboardList,
  Clock,
  Cookie,
  Droplets,
  DeleteIcon as ExcretionIcon,
  Eye,
  FileArchive,
  FileClock,
  FileSignature,
  FileText,
  FileWarning,
  Folder,
  GlassWater,
  Heart,
  HeartPulse,
  Lightbulb,
  List,
  MessageCircle,
  MessageSquare,
  Notebook,
  NotebookText,
  Pill,
  Presentation,
  Shield,
  Soup,
  Stethoscope,
  Thermometer,
  SmileIcon as Tooth,
  User,
  UserCheck,
  Users,
  Utensils,
  Wind,
  type LucideIcon,
} from 'lucide-react';

// Icon registry mapping string names to icon components
const iconRegistry: Record<string, LucideIcon> = {
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
  Notebook,
  MessageCircle,
  FileClock,

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
