import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Property, ChatThread, ChatMessage, SavedProperty, SearchFilters, UserRole, AppNotification } from '@/constants/types';
import { Platform } from 'react-native';
import { auth, db, googleProvider } from '@/lib/firebase';
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
  googleLogin: (role: UserRole) => Promise<boolean>;
  register: (userData: Partial<User>, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'views' | 'verified' | 'featured'>) => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<boolean>;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getOwnerProperties: () => Property[];
  deleteProperty: (id: string) => void;
  togglePropertyAvailability: (id: string) => void;
  createChatThread: (recipientId: string, recipientName: string, propertyId: string, propertyTitle: string) => Promise<string | null>;
  sendMessage: (chatId: string, text: string) => Promise<boolean>;
  getChatMessages: (chatId: string) => ChatMessage[];
  deleteMessage: (chatId: string, messageId: string, forEveryone: boolean) => Promise<boolean>;
  editMessage: (chatId: string, messageId: string, newText: string) => Promise<boolean>;
  deleteAllChatMessages: (chatId: string) => Promise<boolean>;
  deleteEntireChatThread: (chatId: string) => Promise<boolean>;
  deleteAllChatsPermananently: () => Promise<boolean>;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  createNotification: (userId: string, type: AppNotification['type'], title: string, body: string, data?: Record<string, string>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  ROLE: '@bashvara_role',
};

function removeUndefined(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [authLoading, setAuthLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const cleanupRanRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
        const fallbackRole = (storedRole as UserRole) || 'client';
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });
            setUserRoleState(userData.role);
            await AsyncStorage.setItem(STORAGE_KEYS.ROLE, userData.role);
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              role: fallbackRole,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              kycVerified: false,
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), removeUndefined(newUser as any));
            } catch {}
            setUser(newUser);
            setUserRoleState(fallbackRole);
          }
        } catch (e) {
          console.error('Error fetching user data:', e);
          const fallbackUser: User = {
            id: firebaseUser.uid,
            role: fallbackRole,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            kycVerified: false,
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
          setUserRoleState(fallbackRole);
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
      },
      (error) => {
        console.error('Error listening to properties:', error);
        setProperties([]);
      }
    );

    return () => unsubscribe();
  }, []);

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
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const notifs: AppNotification[] = [];
      snap.forEach(d => notifs.push({ ...d.data(), id: d.id } as AppNotification));
      notifs.sort((a, b) => {
        const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : ((a.createdAt as any)?.toMillis?.() || 0);
        const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : ((b.createdAt as any)?.toMillis?.() || 0);
        return timeB - timeA;
      });
      setNotifications(notifs);
    }, (err) => {
      console.error('Error listening to notifications:', err);
    });
    return () => unsub();
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
        setChatThreads([]);
      }
    );

    return () => unsubscribe();
  }, [user]);

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
      try {
        const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: credential.user.uid });
          setUserRoleState(userData.role);
          await AsyncStorage.setItem(STORAGE_KEYS.ROLE, userData.role);
        } else {
          const fallbackUser: User = {
            id: credential.user.uid,
            role: effectiveRole as UserRole,
            name: credential.user.displayName || '',
            email: credential.user.email || email,
            phone: credential.user.phoneNumber || '',
            kycVerified: false,
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
          setUserRoleState(effectiveRole as UserRole);
          await AsyncStorage.setItem(STORAGE_KEYS.ROLE, effectiveRole);
        }
      } catch (firestoreErr: any) {
        console.warn('Firestore read failed, using auth data:', firestoreErr.code);
        const fallbackUser: User = {
          id: credential.user.uid,
          role: effectiveRole as UserRole,
          name: credential.user.displayName || '',
          email: credential.user.email || email,
          phone: credential.user.phoneNumber || '',
          kycVerified: false,
          createdAt: new Date().toISOString(),
        };
        setUser(fallbackUser);
        setUserRoleState(effectiveRole as UserRole);
        await AsyncStorage.setItem(STORAGE_KEYS.ROLE, effectiveRole);
      }
      return true;
    } catch (e: any) {
      console.error('Login error:', e.code || e.message);
      return false;
    }
  };

  const googleLogin = async (role: UserRole): Promise<boolean> => {
    try {
      if (Platform.OS !== 'web') {
        console.warn('Google login is only available on web');
        return false;
      }

      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: firebaseUser.uid });
          setUserRoleState(userData.role);
          await AsyncStorage.setItem(STORAGE_KEYS.ROLE, userData.role);
        } else {
          const newUser: User = {
            id: firebaseUser.uid,
            role,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            kycVerified: false,
            createdAt: new Date().toISOString(),
          };

          await setDoc(userDocRef, removeUndefined(newUser as any));
          setUser(newUser);
          setUserRoleState(role);
          await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
        }
      } catch (firestoreError: any) {
        const newUser: User = {
          id: firebaseUser.uid,
          role,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          kycVerified: false,
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        setUserRoleState(role);
        await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
      }
      return true;
    } catch (e: any) {
      console.error('Google login error:', e.message);
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

      const newUser = {
        id: credential.user.uid,
        role,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        whatsapp: userData.whatsapp || '',
        gender: userData.gender || '',
        occupation: userData.occupation || '',
        division: userData.division || '',
        district: userData.district || '',
        upazila: userData.upazila || '',
        nidNumber: userData.nidNumber || '',
        kycVerified: false,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', credential.user.uid), removeUndefined(newUser));
      } catch (firestoreErr: any) {
        console.warn('Firestore write failed during registration:', firestoreErr.code);
      }
      setUser(newUser as User);
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

      const docRef = await addDoc(collection(db, 'properties'), removeUndefined(newProperty));

      const clientUsers = await getDocs(query(collection(db, 'users'), where('role', '==', 'client')));
      clientUsers.forEach(async (clientDoc) => {
        try {
          await addDoc(collection(db, 'notifications'), removeUndefined({
            userId: clientDoc.id,
            type: 'new_property',
            title: 'নতুন প্রপার্টি যোগ হয়েছে',
            body: `${propertyData.title || 'নতুন প্রপার্টি'} - ৳${propertyData.rent}/মাস`,
            data: { propertyId: docRef.id },
            read: false,
            createdAt: new Date().toISOString(),
          }));
        } catch {}
      });
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

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const cleanUpdates = removeUndefined(updates as any);
      delete cleanUpdates.id;
      await updateDoc(doc(db, 'users', user.id), cleanUpdates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (e) {
      console.error('Error updating user:', e);
      return false;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>): Promise<boolean> => {
    try {
      const cleanUpdates = removeUndefined(updates as any);
      delete cleanUpdates.id;
      await updateDoc(doc(db, 'properties', id), cleanUpdates);
      return true;
    } catch (e) {
      console.error('Error updating property:', e);
      return false;
    }
  };

  const createChatThread = async (
    recipientId: string,
    recipientName: string,
    propertyId: string,
    propertyTitle: string
  ): Promise<string | null> => {
    if (!user) return null;
    try {
      const existing = chatThreads.find(
        t => t.participantIds.includes(recipientId) && t.propertyId === propertyId
      );
      if (existing) return existing.id;

      const thread = {
        participantIds: [user.id, recipientId],
        participantNames: [user.name, recipientName],
        propertyId,
        propertyTitle,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
      };
      const docRef = await addDoc(collection(db, 'chats'), removeUndefined(thread));
      return docRef.id;
    } catch (e) {
      console.error('Error creating chat:', e);
      return null;
    }
  };

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  const createNotification = async (
    userId: string,
    type: AppNotification['type'],
    title: string,
    body: string,
    data?: Record<string, string>
  ) => {
    try {
      const notif = removeUndefined({
        userId,
        type,
        title,
        body,
        data: data || {},
        read: false,
        createdAt: new Date().toISOString(),
      });
      await addDoc(collection(db, 'notifications'), notif);
    } catch (e) {
      console.error('Error creating notification:', e);
    }
  };

  const shouldShowNotification = useCallback(async (type: AppNotification['type']): Promise<boolean> => {
    try {
      const val = await AsyncStorage.getItem('@bashvara_notification_prefs');
      if (!val) return true;
      const prefs = JSON.parse(val);
      const typeMap: Record<string, string> = {
        'message': 'messages',
        'new_property': 'newProperty',
        'kyc_approved': 'kycStatus',
        'kyc_declined': 'kycStatus',
        'system': 'system',
      };
      const key = typeMap[type];
      return key ? prefs[key] !== false : true;
    } catch {
      return true;
    }
  }, []);

  const markNotificationRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
    } catch (e) {
      console.error('Error marking all notifications read:', e);
    }
  };

  const unreadNotificationCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const sendMessage = async (chatId: string, text: string): Promise<boolean> => {
    if (!user || !text.trim()) return false;
    try {
      const thread = chatThreads.find(t => t.id === chatId);
      const msg = {
        senderId: user.id,
        receiverId: '',
        text: text.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      await addDoc(collection(db, 'chats', chatId, 'messages'), removeUndefined(msg));
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text.trim(),
        lastMessageTime: new Date().toISOString(),
      });

      if (thread) {
        const receiverId = thread.participantIds.find(pid => pid !== user.id);
        if (receiverId) {
          createNotification(receiverId, 'message', `${user.name} থেকে নতুন মেসেজ`, text.trim().substring(0, 100), { chatId });
        }
      }
      return true;
    } catch (e) {
      console.error('Error sending message:', e);
      return false;
    }
  };

  const deleteMessage = async (chatId: string, messageId: string, forEveryone: boolean): Promise<boolean> => {
    if (!user) return false;
    try {
      const msgRef = doc(db, 'chats', chatId, 'messages', messageId);
      if (forEveryone) {
        const msgDoc = await getDoc(msgRef);
        if (msgDoc.data()?.senderId !== user.id) return false;
        await updateDoc(msgRef, { deleted: true, text: '' });
      } else {
        const msgDoc = await getDoc(msgRef);
        const existing = (msgDoc.data()?.deletedForUsers as string[]) || [];
        await updateDoc(msgRef, { deletedForUsers: [...existing, user.id] });
      }
      return true;
    } catch (e) {
      console.error('Error deleting message:', e);
      return false;
    }
  };

  const editMessage = async (chatId: string, messageId: string, newText: string): Promise<boolean> => {
    if (!user || !newText.trim()) return false;
    try {
      const msgRef = doc(db, 'chats', chatId, 'messages', messageId);
      const msgDoc = await getDoc(msgRef);
      if (msgDoc.data()?.senderId !== user.id) return false;
      await updateDoc(msgRef, {
        text: newText.trim(),
        edited: true,
        editedAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      console.error('Error editing message:', e);
      return false;
    }
  };

  const deleteAllChatMessages = async (chatId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const msgsSnap = await getDocs(collection(db, 'chats', chatId, 'messages'));
      await Promise.all(msgsSnap.docs.map(d => {
        const existing = (d.data()?.deletedForUsers as string[]) || [];
        return updateDoc(d.ref, { deletedForUsers: [...existing, user.id] });
      }));
      return true;
    } catch (e) {
      console.error('Error deleting all messages:', e);
      return false;
    }
  };

  const deleteEntireChatThread = async (chatId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      if (!chatDoc.exists()) return false;
      const chatData = chatDoc.data();
      if (!chatData?.participantIds?.includes(user.id)) return false;

      const msgsSnap = await getDocs(collection(db, 'chats', chatId, 'messages'));
      await Promise.all(msgsSnap.docs.map(d => deleteDoc(d.ref)));
      await deleteDoc(doc(db, 'chats', chatId));
      return true;
    } catch (e) {
      console.error('Error deleting entire chat thread:', e);
      return false;
    }
  };

  const deleteAllChatsPermananently = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const userChats = chatThreads.filter(t => t.participantIds.includes(user.id));
      for (const thread of userChats) {
        const msgsSnap = await getDocs(collection(db, 'chats', thread.id, 'messages'));
        await Promise.all(msgsSnap.docs.map(d => deleteDoc(d.ref)));
        await deleteDoc(doc(db, 'chats', thread.id));
      }
      return true;
    } catch (e) {
      console.error('Error deleting all chats:', e);
      return false;
    }
  };

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    if (cleanupRanRef.current) return;
    if (chatThreads.length === 0) return;

    cleanupRanRef.current = true;
    let cancelled = false;

    const cleanupOldMessages = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoff = sevenDaysAgo.toISOString();

        for (const thread of chatThreads) {
          if (cancelled) return;
          const msgsSnap = await getDocs(collection(db, 'chats', thread.id, 'messages'));
          const oldMsgs = msgsSnap.docs.filter(d => {
            const ts = d.data().timestamp;
            return ts && ts < cutoff;
          });
          if (oldMsgs.length > 0 && !cancelled) {
            await Promise.all(oldMsgs.map(d => deleteDoc(d.ref)));
          }
        }
      } catch (e) {
        console.error('Error cleaning up old messages:', e);
      }
    };

    cleanupOldMessages();
    return () => { cancelled = true; };
  }, [user, chatThreads.length]);

  const getChatMessages = useCallback(
    (chatId: string): ChatMessage[] => chatMessages[chatId] || [],
    [chatMessages]
  );

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
      googleLogin,
      register,
      logout,
      setUserRole,
      toggleSaveProperty,
      isPropertySaved,
      addProperty,
      updateUser,
      updateProperty,
      updateSearchFilters,
      clearSearchFilters,
      getFilteredProperties,
      getPropertyById,
      getOwnerProperties,
      deleteProperty,
      togglePropertyAvailability,
      createChatThread,
      sendMessage,
      getChatMessages,
      deleteMessage,
      editMessage,
      deleteAllChatMessages,
      deleteEntireChatThread,
      deleteAllChatsPermananently,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      createNotification,
    }),
    [user, userRole, properties, savedProperties, chatThreads, searchFilters, authLoading, chatMessages, notifications, unreadNotificationCount]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
