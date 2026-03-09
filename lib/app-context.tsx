import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Property, ChatThread, SavedProperty, SearchFilters, UserRole } from '@/constants/types';
import { SAMPLE_PROPERTIES, SAMPLE_CHATS } from '@/constants/mock-data';

interface AppContextValue {
  user: User | null;
  userRole: UserRole | null;
  isLoggedIn: boolean;
  properties: Property[];
  savedProperties: string[];
  chatThreads: ChatThread[];
  searchFilters: SearchFilters;
  login: (email: string, password: string, overrideRole?: UserRole) => Promise<boolean>;
  register: (userData: Partial<User>, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'views' | 'verified' | 'featured'>) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getOwnerProperties: () => Property[];
  deleteProperty: (id: string) => void;
  togglePropertyAvailability: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  USER: '@bashvara_user',
  ROLE: '@bashvara_role',
  SAVED: '@bashvara_saved',
  PROPERTIES: '@bashvara_properties',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [chatThreads] = useState<ChatThread[]>(SAMPLE_CHATS);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedRole, storedSaved] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ROLE),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED),
      ]);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRole) setUserRoleState(storedRole as UserRole);
      if (storedSaved) setSavedProperties(JSON.parse(storedSaved));
    } catch (e) {
      console.error('Failed to load stored data', e);
    }
  };

  const login = async (email: string, password: string, overrideRole?: UserRole): Promise<boolean> => {
    const effectiveRole = overrideRole || userRole || 'client';

    if (effectiveRole === 'admin') {
      if (email.trim() !== 'admin' || password !== '*#*#noraxlab#*#*') {
        return false;
      }
      const adminUser: User = {
        id: 'admin-superuser',
        role: 'admin',
        name: 'Super Admin',
        email: 'admin@bashvara.com',
        phone: '',
        kycVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(adminUser);
      setUserRoleState('admin');
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminUser));
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
      return true;
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id,
      role: effectiveRole,
      name: email.split('@')[0],
      email,
      phone: '',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return true;
  };

  const register = async (userData: Partial<User>, role: UserRole): Promise<boolean> => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id,
      role,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      whatsapp: userData.whatsapp,
      gender: userData.gender,
      occupation: userData.occupation,
      division: userData.division,
      district: userData.district,
      upazila: userData.upazila,
      nidNumber: userData.nidNumber,
      kycVerified: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setUserRoleState(role);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
    return true;
  };

  const logout = async () => {
    setUser(null);
    setUserRoleState(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ROLE]);
  };

  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  const toggleSaveProperty = async (propertyId: string) => {
    setSavedProperties(prev => {
      const updated = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  const isPropertySaved = (propertyId: string) => savedProperties.includes(propertyId);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'views' | 'verified' | 'featured'>) => {
    const id = 'prop-' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newProperty: Property = {
      ...propertyData,
      id,
      views: 0,
      verified: false,
      featured: false,
      createdAt: new Date().toISOString(),
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const clearSearchFilters = () => setSearchFilters({});

  const getFilteredProperties = () => {
    return properties.filter(p => {
      if (!p.available) return false;
      if (searchFilters.type && p.type !== searchFilters.type) return false;
      if (searchFilters.minRent && p.rent < searchFilters.minRent) return false;
      if (searchFilters.maxRent && p.rent > searchFilters.maxRent) return false;
      if (searchFilters.bedrooms && p.bedrooms < searchFilters.bedrooms) return false;
      if (searchFilters.bathrooms && p.bathrooms < searchFilters.bathrooms) return false;
      if (searchFilters.furnishing && p.furnishing !== searchFilters.furnishing) return false;
      if (searchFilters.genderPreference && p.genderPreference !== searchFilters.genderPreference) return false;
      if (searchFilters.parking && !p.parking) return false;
      return true;
    });
  };

  const getPropertyById = (id: string) => properties.find(p => p.id === id);

  const getOwnerProperties = () => {
    if (!user) return [];
    return properties.filter(p => p.ownerId === user.id);
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const togglePropertyAvailability = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const value = useMemo(
    () => ({
      user,
      userRole,
      isLoggedIn: !!user,
      properties,
      savedProperties,
      chatThreads,
      searchFilters,
      login,
      register,
      logout,
      setUserRole,
      toggleSaveProperty,
      isPropertySaved,
      addProperty,
      updateSearchFilters,
      clearSearchFilters,
      getFilteredProperties,
      getPropertyById,
      getOwnerProperties,
      deleteProperty,
      togglePropertyAvailability,
    }),
    [user, userRole, properties, savedProperties, chatThreads, searchFilters]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
