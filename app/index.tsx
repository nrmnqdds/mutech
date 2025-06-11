import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';

const { width } = Dimensions.get('window');

const BUTTONS = [
  {
    label: 'snatch',
    color: '#3ed36e',
    icon: <MaterialCommunityIcons name="run-fast" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'accident',
    color: '#e6c84f',
    icon: <FontAwesome5 name="car-crash" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'fire',
    color: '#f44336',
    icon: <MaterialCommunityIcons name="fire" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'sexualHarassment',
    color: '#ff4fcf',
    icon: <FontAwesome5 name="user-shield" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'wildAnimal',
    color: '#dda735',
    icon: <MaterialCommunityIcons name="dog-side" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'illness',
    color: '#e85be6',
    icon: <FontAwesome5 name="first-aid" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
  {
    label: 'others',
    color: '#9c27b0',
    icon: <MaterialCommunityIcons name="dots-horizontal" size={48} color="#000" style={{ marginBottom: 6 }} />,
  },
];

const TYPE_MAP: any = {
  snatch: 'SNATCH',
  accident: 'ACCIDENT',
  fire: 'FIRE',
  sexualHarassment: 'SEXUAL HARASSMENT',
  wildAnimal: 'WILD ANIMAL',
  illness: 'ILLNESS',
  others: 'OTHERS',
};

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useContext(LanguageContext);
 useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Login check - Token:', token ? 'exists' : 'not found');
        if(token){
          return
        }

        router.replace('/Login');
      } catch (error) {
        console.error('Error checking login status:', error);
        router.replace('/Login');
      }
    };
    checkLogin();
  }, []);
  
  return (
    <LinearGradient
      colors={["#1e90ff", "#0a2740"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          {/* Logo placeholder */}
          <View style={styles.logo} />
          <Text style={styles.title}>MuTECH</Text>
          <View style={{ position: 'absolute', right: 20, top: 0, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setLanguage('en')} style={{ marginRight: 8, padding: 6, backgroundColor: language === 'en' ? '#fff' : '#eee', borderRadius: 8 }}>
              <Text style={{ color: language === 'en' ? '#1e90ff' : '#333', fontWeight: 'bold' }}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLanguage('ms')} style={{ padding: 6, backgroundColor: language === 'ms' ? '#fff' : '#eee', borderRadius: 8 }}>
              <Text style={{ color: language === 'ms' ? '#1e90ff' : '#333', fontWeight: 'bold' }}>BM</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Grid Buttons */}
        <View style={styles.grid}>
          {BUTTONS.map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={[styles.gridButton, { backgroundColor: btn.color }]}
              onPress={() => {
                if (btn.label === 'others') {
                  router.push({ pathname: '/Others' });
                } else {
                  router.push({ pathname: '/EmergencyDetail', params: { type: TYPE_MAP[btn.label] } });
                }
              }}
            >
              {btn.icon}
              <Text style={styles.gridLabel}>{t(btn.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Bottom Navigation */}
        <BottomBar active="home" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  gridButton: {
    width: width / 3.2,
    height: width / 3.2,
    borderRadius: 20,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  gridLabel: {
    marginTop: 8,
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  navBarBg: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#cfe6ff',
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 18,
    width: width * 0.92,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  navIcon: {
    padding: 8,
    borderRadius: 20,
    opacity: 0.7,
  },
  navIconActive: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#b3e0ff',
    opacity: 1,
  },
});
