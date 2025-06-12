import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';
import { FamilyMember, familyMembersService } from './utils/familyMembers';

const { width } = Dimensions.get('window');

export default function Safe() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const type = params.type as string;
  const { language, t } = useContext(LanguageContext);
  const [emergencyContacts, setEmergencyContacts] = useState<FamilyMember[]>([]);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    const contacts = await familyMembersService.getEmergencyContacts();
    setEmergencyContacts(contacts);
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top contacts row */}
        <Text style={[styles.notifyHeader, { color: '#cfe6ff' }]}>
          {language === 'en' ? 'EMERGENCY CONTACT' : 'KONTAK KECEMASAN'}
        </Text>
        <View style={styles.contactsRow}>
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <View key={contact.id} style={styles.contactCol}>
                <Image source={{ uri: contact.image }} style={styles.avatar} />
                <Text style={[styles.contactName, { color: '#111' }]}>{contact.name.toUpperCase()}</Text>
                <Text style={[styles.contactStatus, { color: index % 2 === 0 ? '#1ed760' : '#0070f3' }]}>
                  {index % 2 === 0 ? (language === 'en' ? 'NOTIFIED' : 'DIMAKLUMKAN') : (language === 'en' ? 'NOTIFYING' : 'MEMAKLUMKAN')}
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
        </View>
        {/* Emergency type header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.emergencyType, { color: '#111' }]}>{t(type.toLowerCase())}</Text>
        </View>
        {/* Big green checkmark */}
        <View style={styles.centerBox}>
          <View style={styles.greenCircle}>
            <Ionicons name="checkmark" size={100} color="#fff" />
          </View>
        </View>
        {/* DONE button */}
        <TouchableOpacity style={styles.doneButton} onPress={() => router.push('/')}>
          <Text style={[styles.doneButtonText, { color: '#1ed760' }]}>
            {language === 'en' ? 'DONE' : 'SELESAI'}
          </Text>
        </TouchableOpacity>
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
  notifyHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginHorizontal: 4,
  },
  contactCol: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1e90ff',
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  contactName: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
    letterSpacing: 0.5,
  },
  contactStatus: {
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 0,
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyType: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#111',
    letterSpacing: 1,
  },
  centerBox: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  greenCircle: {
    width: width / 1.7,
    height: width / 1.7,
    borderRadius: width / 3.4,
    backgroundColor: '#3ed36e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  doneButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  doneButtonText: {
    color: '#00c800',
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 1,
    textAlign: 'center',
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noContactsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  }
}); 