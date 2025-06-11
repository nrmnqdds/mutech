import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';
import { FamilyMember, familyMembersService } from './utils/familyMembers';

const { width } = Dimensions.get('window');

export default function EmergencyContact() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string;
  const { language, t } = useContext(LanguageContext);
  const [emergencyContacts, setEmergencyContacts] = useState<FamilyMember[]>([]);

  useEffect(() => {
    loadEmergencyContacts();
    const timer = setTimeout(() => {
      if (params.safe === '1') {
        router.push({ pathname: '/Safe', params: { type } });
      } else {
        router.push({ pathname: '/EmergencyAlert', params: { type } });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, type, params.safe]);

  const loadEmergencyContacts = async () => {
    const contacts = await familyMembersService.getEmergencyContacts();
    setEmergencyContacts(contacts);
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Logo and header */}
        <View style={styles.logo} />
        <Text style={styles.headerText}>
          {language === 'en' ? 'EMERGENCY CONTACT' : 'KONTAK KECEMASAN'}
        </Text>
        <ScrollView contentContainerStyle={styles.contactsContainer} showsVerticalScrollIndicator={false}>
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <View key={contact.id} style={styles.contactCard}>
                <Image source={{ uri: contact.image }} style={styles.avatar} />
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.notifying}>
                  {language === 'en' ? 'Notifying...' : 'Memaklumkan...'}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noContactsContainer}>
              <Text style={styles.noContactsText}>
                {language === 'en' 
                  ? 'No emergency contacts found. Please add family members and mark them as emergency contacts.'
                  : 'Tiada kontak kecemasan dijumpai. Sila tambah ahli keluarga dan tandakan mereka sebagai kontak kecemasan.'}
              </Text>
            </View>
          )}
        </ScrollView>
        <BottomBar active="home" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_SIZE = width / 2.4;

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
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 1,
  },
  contactsContainer: {
    alignItems: 'center',
    paddingBottom: 100,
    paddingTop: 8,
  },
  contactCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_SIZE,
    paddingVertical: 18,
    marginHorizontal: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#1e90ff',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  contactName: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  notifying: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
  noContactsContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  noContactsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 