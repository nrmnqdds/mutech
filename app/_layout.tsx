import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export const TRANSLATIONS = {
  en: {
    // Home page
    snatch: 'SNATCH',
    accident: 'ACCIDENT',
    fire: 'FIRE',
    sexualHarassment: 'SEXUAL HARASSMENT',
    wildAnimal: 'WILD ANIMAL',
    illness: 'ILLNESS',
    others: 'OTHERS',
    // Notepad
    notepad: 'Notepad',
    writeNote: 'Write your note...',
    saveNote: 'Save Note',
    showFullScreen: 'Show Full Screen',
    sound: 'Sound',
    back: 'Back',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    noteDeleted: 'Note deleted',
    undo: 'Undo',
    // Profile
    profile: 'Profile',
    name: 'Name',
    enterName: 'Enter your name',
    age: 'Age',
    enterAge: 'Enter your age',
    address: 'Address',
    enterAddress: 'Enter your address',
    phone: 'Phone Number',
    enterPhone: 'Enter your phone number',
    emergencyContact: 'Emergency Contact',
    enterEmergencyContact: 'Enter emergency contact name',
    emergencyPhone: 'Emergency Phone',
    enterEmergencyPhone: 'Enter emergency contact number',
    editProfile: 'Edit Profile',
    saveProfile: 'Save Profile',
    changePhoto: 'Change Photo',
    // Emergency
    help: 'HELP',
    notify: 'NOTIFY',
    // Theme
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    fontSize: 'Font Size',
  },
  ms: {
    // Home page
    snatch: 'RAGUT',
    accident: 'KEMALANGAN',
    fire: 'KEBAKARAN',
    sexualHarassment: 'GANGGUAN SEKSUAL',
    wildAnimal: 'BINATANG LIAR',
    illness: 'PENYAKIT',
    others: 'LAIN-LAIN',
    // Notepad
    notepad: 'Nota',
    writeNote: 'Tulis nota anda...',
    saveNote: 'Simpan Nota',
    showFullScreen: 'Tunjuk Skrin Penuh',
    sound: 'Bunyi',
    back: 'Kembali',
    edit: 'Edit',
    delete: 'Padam',
    cancel: 'Batal',
    noteDeleted: 'Nota dipadam',
    undo: 'Batal',
    // Profile
    profile: 'Profil',
    name: 'Nama',
    enterName: 'Masukkan nama anda',
    age: 'Umur',
    enterAge: 'Masukkan umur anda',
    address: 'Alamat',
    enterAddress: 'Masukkan alamat anda',
    phone: 'Nombor Telefon',
    enterPhone: 'Masukkan nombor telefon anda',
    emergencyContact: 'Kontak Kecemasan',
    enterEmergencyContact: 'Masukkan nama kontak kecemasan',
    emergencyPhone: 'Telefon Kecemasan',
    enterEmergencyPhone: 'Masukkan nombor telefon kecemasan',
    editProfile: 'Edit Profil',
    saveProfile: 'Simpan Profil',
    changePhoto: 'Tukar Foto',
    // Emergency
    help: 'TOLONG',
    notify: 'MAKLUM',
    // Theme
    light: 'Cerah',
    dark: 'Gelap',
    system: 'Sistem',
    fontSize: 'Saiz Fon',
  }
};

// Language context for global language switching
export const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: 'en' | 'ms') => {},
  t: (key: string) => '',
});


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [language, setLanguage] = useState<'en' | 'ms'>('en');

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }, []);

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  // Function to update FCM token in Firestore
  const updateFCMToken = async (userId: string, token: string) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          fcmToken: token,
          lastTokenUpdate: firestore.FieldValue.serverTimestamp(),
        });
      console.log('FCM token updated successfully');
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  };

  // Function to get and save FCM token
  const getAndSaveFCMToken = async (userId: string) => {
    try {
      const token = await messaging().getToken();
      if (token) {
        await updateFCMToken(userId, token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Login check - Token:', token ? 'exists' : 'not found');
        setIsLoggedIn(!!token);
        
        // If user is logged in, get and save FCM token
        if (token) {
          const userData = JSON.parse(token);
          await getAndSaveFCMToken(userData.id);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  // Listen for FCM token refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (token) => {
      try {
        const userToken = await AsyncStorage.getItem('token');
        if (userToken) {
          const userData = JSON.parse(userToken);
          await updateFCMToken(userData.id, token);
        }
      } catch (error) {
        console.error('Error handling token refresh:', error);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  console.log('Current login status:', isLoggedIn ? 'logged in' : 'not logged in');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" />
              <Stack.Screen name="SignUp" />
            </>
          ) : (
            <Stack.Screen name="index" />
          )}
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="EmergencyDetail" />
          <Stack.Screen name="Others" />
          <Stack.Screen name="Users" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LanguageContext.Provider>
  );
}
