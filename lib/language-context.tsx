import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = '@bashvara_language';

type Language = 'bn' | 'en';

const translations: Record<string, Record<Language, string>> = {
  'profile': { bn: 'প্রোফাইল', en: 'Profile' },
  'editProfile': { bn: 'প্রোফাইল সম্পাদনা', en: 'Edit Profile' },
  'notificationSettings': { bn: 'নোটিফিকেশন সেটিংস', en: 'Notification Settings' },
  'privacy': { bn: 'গোপনীয়তা', en: 'Privacy' },
  'changeLanguage': { bn: 'ভাষা পরিবর্তন', en: 'Change Language' },
  'darkMode': { bn: 'ডার্ক মোড', en: 'Dark Mode' },
  'helpCenter': { bn: 'সাহায্য কেন্দ্র', en: 'Help Center' },
  'terms': { bn: 'শর্তাবলী', en: 'Terms & Conditions' },
  'aboutApp': { bn: 'অ্যাপ সম্পর্কে', en: 'About App' },
  'logout': { bn: 'লগআউট', en: 'Logout' },
  'logoutConfirm': { bn: 'আপনি কি লগআউট করতে চান?', en: 'Do you want to logout?' },
  'yes': { bn: 'হ্যাঁ', en: 'Yes' },
  'no': { bn: 'না', en: 'No' },
  'saved': { bn: 'সংরক্ষিত', en: 'Saved' },
  'home': { bn: 'হোম', en: 'Home' },
  'chat': { bn: 'চ্যাট', en: 'Chat' },
  'search': { bn: 'খুঁজুন', en: 'Search' },
  'properties': { bn: 'প্রপার্টি', en: 'Properties' },
  'kycVerification': { bn: 'KYC ভেরিফিকেশন', en: 'KYC Verification' },
  'paymentMethod': { bn: 'পেমেন্ট মেথড', en: 'Payment Method' },
  'earningReport': { bn: 'আর্নিং রিপোর্ট', en: 'Earning Report' },
  'notification': { bn: 'নোটিফিকেশন', en: 'Notifications' },
  'businessHours': { bn: 'বিজনেস আওয়ারস', en: 'Business Hours' },
  'help': { bn: 'সাহায্য', en: 'Help' },
  'bengali': { bn: 'বাংলা', en: 'Bengali' },
  'english': { bn: 'ইংরেজি', en: 'English' },
  'currentLanguage': { bn: 'বর্তমান ভাষা', en: 'Current Language' },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'bn',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('bn');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then(val => {
      if (val === 'en' || val === 'bn') setLang(val);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLang(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
  };

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
