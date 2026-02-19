export type UserRole = 'client' | 'owner';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profileImage?: string;
  gender?: string;
  occupation?: string;
  division?: string;
  district?: string;
  upazila?: string;
  nidNumber?: string;
  kycVerified?: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  type: string;
  description: string;
  images: string[];
  division: string;
  district: string;
  upazila: string;
  address: string;
  rent: number;
  deposit: number;
  serviceCharge: number;
  bedrooms: number;
  bathrooms: number;
  floorLevel: number;
  totalFloors: number;
  area: number;
  furnishing: string;
  genderPreference: string;
  parking: boolean;
  gasConnection: boolean;
  waterSupply: boolean;
  elevator: boolean;
  generator: boolean;
  security: boolean;
  negotiable: boolean;
  available: boolean;
  verified: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  participantIds: string[];
  participantNames: string[];
  propertyId?: string;
  propertyTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SavedProperty {
  propertyId: string;
  savedAt: string;
}

export interface SearchFilters {
  division?: string;
  district?: string;
  upazila?: string;
  type?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  genderPreference?: string;
  parking?: boolean;
}
