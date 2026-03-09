import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Property, ChatThread, SavedProperty, SearchFilters, UserRole } from '@/constants/types';
import { SAMPLE_PROPERTIES, SAMPLE_CHATS } from '@/constants/mock-data';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

interface AppContextValue {
  user: User | null;
  userRole: UserRole | null;
  isLoggedIn: boolean;
  properties: Property[];
  savedProperties: string[];
  chatThreads: ChatThread[];
  searchFilters: SearchFilters;
  authLoading: boolean;
  login: (email: string, password: string, overrideRole?: UserRole) => Promise<boolean>;
  register: (userData: Partial<User>, role: UserRole, password?: string) => Promise<boolean>;
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
  ROLE: '@bashvara_role',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [authLoading, setAuthLoading] = useState(true);
  const [dataSeeded, setDataSeeded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });
            setUserRoleState(userData.role);
          }
        } catch (e) {
          console.error('Error fetching user data:', e);
        }
        setAuthLoading(false);
      } else {
        const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
        if (storedRole === 'admin') {
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
          setAuthLoading(false);
          return;
        }
        setUser(null);
        setUserRoleState(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'properties'),
      (snapshot) => {
        const props: Property[] = [];
        snapshot.forEach((docSnap) => {
          props.push({ ...docSnap.data(), id: docSnap.id } as Property);
        });
        props.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProperties(props);

        if (!dataSeeded && props.length === 0) {
          setDataSeeded(true);
          seedInitialData();
        } else if (props.length > 0) {
          setDataSeeded(true);
        }
      },
      (error) => {
        console.error('Error listening to properties:', error);
        setProperties(SAMPLE_PROPERTIES);
        setDataSeeded(true);
      }
    );

    return () => unsubscribe();
  }, [dataSeeded]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.id, 'savedProperties'),
      (snapshot) => {
        const saved: string[] = [];
        snapshot.forEach((docSnap) => {
          saved.push(docSnap.id);
        });
        setSavedProperties(saved);
      },
      (error) => {
        console.error('Error listening to saved properties:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const unsubscribe = onSnapshot(
      query(collection(db, 'chats'), where('participantIds', 'array-contains', user.id)),
      (snapshot) => {
        const threads: ChatThread[] = [];
        snapshot.forEach((docSnap) => {
          threads.push({ ...docSnap.data(), id: docSnap.id } as ChatThread);
        });
        setChatThreads(threads);
      },
      (error) => {
        console.error('Error listening to chats:', error);
        setChatThreads(SAMPLE_CHATS);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);
      SAMPLE_PROPERTIES.forEach((prop) => {
        const docRef = doc(db, 'properties', prop.id);
        batch.set(docRef, prop);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error seeding data:', e);
      setProperties(SAMPLE_PROPERTIES);
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
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
      return true;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser({ ...userData, id: credential.user.uid });
        setUserRoleState(userData.role);
        await AsyncStorage.setItem(STORAGE_KEYS.ROLE, userData.role);
      }
      return true;
    } catch (e: any) {
      console.error('Login error:', e.message);
      return false;
    }
  };

  const register = async (userData: Partial<User>, role: UserRole, password?: string): Promise<boolean> => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        userData.email || '',
        password || ''
      );

      const newUser: User = {
        id: credential.user.uid,
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

      await setDoc(doc(db, 'users', credential.user.uid), newUser);
      setUser(newUser);
      setUserRoleState(role);
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
      return true;
    } catch (e: any) {
      console.error('Registration error:', e.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      const currentRole = userRole;
      setUser(null);
      setUserRoleState(null);
      setSavedProperties([]);
      setChatThreads([]);
      await AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
      if (currentRole !== 'admin') {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  const toggleSaveProperty = async (propertyId: string) => {
    if (!user || user.role === 'admin') return;

    try {
      const savedRef = doc(db, 'users', user.id, 'savedProperties', propertyId);
      const savedDoc = await getDoc(savedRef);

      if (savedDoc.exists()) {
        await deleteDoc(savedRef);
        setSavedProperties(prev => prev.filter(id => id !== propertyId));
      } else {
        await setDoc(savedRef, { savedAt: new Date().toISOString() });
        setSavedProperties(prev => [...prev, propertyId]);
      }
    } catch (e) {
      console.error('Error toggling save:', e);
    }
  };

  const isPropertySaved = useCallback(
    (propertyId: string) => savedProperties.includes(propertyId),
    [savedProperties]
  );

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'views' | 'verified' | 'featured'>) => {
    try {
      const newProperty = {
        ...propertyData,
        views: 0,
        verified: false,
        featured: false,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'properties'), newProperty);
    } catch (e) {
      console.error('Error adding property:', e);
    }
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const clearSearchFilters = () => setSearchFilters({});

  const getFilteredProperties = useCallback(() => {
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
  }, [properties, searchFilters]);

  const getPropertyById = useCallback(
    (id: string) => properties.find(p => p.id === id),
    [properties]
  );

  const getOwnerProperties = useCallback(() => {
    if (!user) return [];
    return properties.filter(p => p.ownerId === user.id);
  }, [user, properties]);

  const deleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (e) {
      console.error('Error deleting property:', e);
    }
  };

  const togglePropertyAvailability = async (id: string) => {
    try {
      const prop = properties.find(p => p.id === id);
      if (prop) {
        await updateDoc(doc(db, 'properties', id), { available: !prop.available });
      }
    } catch (e) {
      console.error('Error toggling availability:', e);
    }
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
      authLoading,
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
    [user, userRole, properties, savedProperties, chatThreads, searchFilters, authLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
