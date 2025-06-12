import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import messaging from '@react-native-firebase/messaging';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';

const { width } = Dimensions.get('window');

const ICONS: any = {
  SNATCH: <MaterialCommunityIcons name="run-fast" size={80} color="#000" />,
  ACCIDENT: <FontAwesome5 name="car-crash" size={80} color="#000" />,
  FIRE: <MaterialCommunityIcons name="fire" size={80} color="#000" />,
  'SEXUAL HARASSMENT': <FontAwesome5 name="user-shield" size={80} color="#000" />,
  'WILD ANIMAL': <MaterialCommunityIcons name="dog-side" size={80} color="#000" />,
  ILLNESS: <FontAwesome5 name="first-aid" size={80} color="#000" />,
};

const HELP_MESSAGES: any = {
  SNATCH: {
    en: 'HELP!\nI AM BEING SNATCHED',
    ms: 'TOLONG!\nSAYA SEDANG DIRAGUT'
  },
  ACCIDENT: {
    en: 'HELP!\nI AM IN ACCIDENT',
    ms: 'TOLONG!\nSAYA DALAM KEMALANGAN'
  },
  FIRE: {
    en: 'HELP!\nTHERE IS A FIRE',
    ms: 'TOLONG!\nADA KEBAKARAN'
  },
  'SEXUAL HARASSMENT': {
    en: 'HELP!\nI AM BEING SEXUALLY HARASSED',
    ms: 'TOLONG!\nSAYA DIKACAU SECARA SEKSUAL'
  },
  'WILD ANIMAL': {
    en: 'HELP!\nTHERE IS A WILD ANIMAL',
    ms: 'TOLONG!\nADA BINATANG LIAR'
  },
  ILLNESS: {
    en: 'HELP!\nI AM ILL',
    ms: 'TOLONG!\nSAYA SAKIT'
  },
};

const COLORS: any = {
  SNATCH: '#3ed36e',
  ACCIDENT: '#e6c84f',
  FIRE: '#f44336',
  'SEXUAL HARASSMENT': '#ff4fcf',
  'WILD ANIMAL': '#dda735',
  ILLNESS: '#e85be6',
};

export default function EmergencyDetail() {
  const params = useLocalSearchParams();
  const type = params.type as string;
  const router = useRouter();
  const { language, setLanguage, t } = useContext(LanguageContext);

  const handleNotify = async () => {
    try {
      // This is a fake FCM token - replace with actual token for testing
      const fakeFcmToken = 'fake-fcm-token-123456789';
      
      // Get the emergency message in English
      const message = HELP_MESSAGES[type].en;
      
      // Send FCM notification
      await messaging().sendMessage({
        fcmOptions: {
          link: "./EmergencyContact",
        },
        notification: {
          title: type,
          body: message,
        },
        data: {
          type: type,
          message: message,
        },
      });

      // Navigate to EmergencyContact after sending notification
      router.push({ pathname: '/EmergencyContact', params: { type, safe: '0' } });
    } catch (error) {
      console.error('Error sending notification:', error);
      // Still navigate to EmergencyContact even if notification fails
      router.push({ pathname: '/EmergencyContact', params: { type, safe: '0' } });
    }
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Logo and header */}
        <View style={styles.logo} />
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t(type.toLowerCase())}</Text>
        </View>
        {/* Icon and help message */}
        <View style={styles.centerBox}>
          <View style={[styles.iconBox, { backgroundColor: COLORS[type] }]}> 
            {ICONS[type]}
          </View>
          <Text style={styles.helpText}>{HELP_MESSAGES[type][language]}</Text>
        </View>
        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={async () => {
              for (let i = 0; i < 6; i++) {
                Speech.speak(language === 'en' ? 'Help me!' : 'Tolong saya!', {
                  rate: 1.0,
                  pitch: 1.2,
                  volume: 1.0,
                  language: language === 'en' ? 'en-US' : 'ms-MY',
                });
                await new Promise(res => setTimeout(res, 1000));
              }
            }}
          >
            <Text style={styles.helpButtonText}>{t('help')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifyButton} onPress={handleNotify}>
            <Text style={styles.notifyButtonText}>{t('notify')}</Text>
          </TouchableOpacity>
        </View>
        <BottomBar active="home" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  headerBar: {
    backgroundColor: '#fff',
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#111',
    letterSpacing: 1,
  },
  centerBox: {
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#bfe0f7cc',
    borderRadius: 12,
    paddingVertical: 24,
    marginBottom: 32,
  },
  iconBox: {
    width: width / 2.2,
    height: width / 2.2,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  helpText: {
    marginTop: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonGroup: {
    marginTop: 24,
    alignItems: 'center',
  },
  helpButton: {
    backgroundColor: 'red',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 100,
    shadowRadius: 5,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 1,
  },
  notifyButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 100,
    shadowRadius: 5,
  },
  notifyButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1,
  },
}); 