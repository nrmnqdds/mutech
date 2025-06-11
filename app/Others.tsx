import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';

const { width } = Dimensions.get('window');

const LOCATIONS = [
  {
    label: 'SUPERMARKET',
    color: '#4caf50',
    icon: <MaterialCommunityIcons name="cart" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help finding items in the supermarket',
      'Where is the checkout counter?',
      'I need help with the self-checkout machine',
      'Where can I find the shopping cart?',
      'I need help with the price scanner',
      'Where is the customer service desk?',
      'I need help with my shopping list',
      'Where are the restrooms?',
    ],
  },
  {
    label: 'HOSPITAL',
    color: '#2196f3',
    icon: <MaterialCommunityIcons name="hospital" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help with hospital registration',
      'Where is the emergency room?',
      'I need to find my doctor\'s office',
      'Where is the pharmacy?',
      'I need help with insurance forms',
      'Where is the waiting area?',
      'I need help with appointment scheduling',
      'Where are the restrooms?',
    ],
  },
  {
    label: 'RESTAURANT',
    color: '#ff9800',
    icon: <MaterialCommunityIcons name="food" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help ordering food',
      'What are today\'s specials?',
      'I have food allergies, can you help?',
      'Where is the restroom?',
      'I need help with the menu',
      'Can I get the bill please?',
      'I need help with payment',
      'Where can I find the exit?',
    ],
  },
  {
    label: 'BANK',
    color: '#795548',
    icon: <MaterialCommunityIcons name="bank" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help with banking services',
      'Where is the ATM?',
      'I need help with account opening',
      'Where is the customer service desk?',
      'I need help with money withdrawal',
      'Where can I find the loan department?',
      'I need help with online banking',
      'Where are the restrooms?',
    ],
  },
  {
    label: 'PHARMACY',
    color: '#e91e63',
    icon: <MaterialCommunityIcons name="medical-bag" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help getting medicine',
      'Where is the prescription counter?',
      'I need help with medication instructions',
      'Where can I find over-the-counter medicine?',
      'I need help with insurance coverage',
      'Where is the pharmacist?',
      'I need help with dosage information',
      'Where are the restrooms?',
    ],
  },
  {
    label: 'TRANSPORT',
    color: '#607d8b',
    icon: <MaterialCommunityIcons name="bus" size={48} color="#000" style={{ marginBottom: 6 }} />,
    messages: [
      'I need help with transportation',
      'Where is the bus stop?',
      'I need help with ticket purchase',
      'Where is the train platform?',
      'I need help with route information',
      'Where is the taxi stand?',
      'I need help with schedule information',
      'Where is the information desk?',
    ],
  },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    location: 'Location',
    supermarket: 'SUPERMARKET',
    hospital: 'HOSPITAL',
    restaurant: 'RESTAURANT',
    bank: 'BANK',
    pharmacy: 'PHARMACY',
    transport: 'TRANSPORT',
    // Supermarket messages (casual)
    msg_supermarket_1: 'Can you help me find something in the supermarket?',
    msg_supermarket_2: 'Where do I pay for my stuff?',
    msg_supermarket_3: 'How do I use the self-checkout?',
    msg_supermarket_4: 'Where are the shopping carts?',
    msg_supermarket_5: 'How do I use the price scanner?',
    msg_supermarket_6: 'Where can I get some help?',
    msg_supermarket_7: 'Can you help with my shopping list?',
    // Hospital messages (casual)
    msg_hospital_1: 'Can you help me register at the hospital?',
    msg_hospital_2: 'Where\'s the emergency room?',
    msg_hospital_3: 'How do I find my doctor\'s office?',
    msg_hospital_4: 'Where\'s the pharmacy?',
    msg_hospital_5: 'Can you help with insurance forms?',
    msg_hospital_6: 'Where do I wait?',
    msg_hospital_7: 'How do I make an appointment?',
    msg_hospital_8: 'Where\'s the bathroom?',
    // Restaurant messages (casual)
    msg_restaurant_1: 'Can you help me order food?',
    msg_restaurant_2: 'What\'s special today?',
    msg_restaurant_3: 'I have food allergies, can you help?',
    msg_restaurant_4: 'Where\'s the bathroom?',
    msg_restaurant_5: 'Can you help me with the menu?',
    msg_restaurant_6: 'Can I get the bill?',
    msg_restaurant_7: 'How do I pay?',
    msg_restaurant_8: 'How do I get out of here?',
    // Bank messages (casual)
    msg_bank_1: 'Can you help me with banking stuff?',
    msg_bank_2: 'Where\'s the ATM?',
    msg_bank_3: 'How do I open an account?',
    msg_bank_4: 'Where can I get some help?',
    msg_bank_5: 'How do I take out money?',
    msg_bank_6: 'Where\'s the loan department?',
    msg_bank_7: 'Can you help with online banking?',
    msg_bank_8: 'Where\'s the bathroom?',
    // Pharmacy messages (casual)
    msg_pharmacy_1: 'Can you help me get some medicine?',
    msg_pharmacy_2: 'Where do I pick up my prescription?',
    msg_pharmacy_3: 'How do I take my medicine?',
    msg_pharmacy_4: 'Where can I find over-the-counter medicine?',
    msg_pharmacy_5: 'Can you help with insurance?',
    msg_pharmacy_6: 'Where\'s the pharmacist?',
    msg_pharmacy_7: 'How much medicine should I take?',
    msg_pharmacy_8: 'Where\'s the bathroom?',
    // Transport messages (casual)
    msg_transport_1: 'Can you help me with transport?',
    msg_transport_2: 'Where\'s the bus stop?',
    msg_transport_3: 'How do I buy a ticket?',
    msg_transport_4: 'Where\'s the train platform?',
    msg_transport_5: 'How do I find my route?',
    msg_transport_6: 'Where\'s the taxi stand?',
    msg_transport_7: 'Can you help with the schedule?',
    msg_transport_8: 'Where\'s the info desk?',
  },
  ms: {
    location: 'Lokasi',
    supermarket: 'PASARAYA',
    hospital: 'HOSPITAL',
    restaurant: 'RESTORAN',
    bank: 'BANK',
    pharmacy: 'FARMASI',
    transport: 'PENGANGKUTAN',
    // Supermarket messages (casual)
    msg_supermarket_1: 'Boleh tolong saya cari barang di pasaraya?',
    msg_supermarket_2: 'Kat mana nak bayar barang?',
    msg_supermarket_3: 'Macam mana nak guna mesin layan diri?',
    msg_supermarket_4: 'Troli beli-belah kat mana?',
    msg_supermarket_5: 'Macam mana nak guna pengimbas harga?',
    msg_supermarket_6: 'Kat mana boleh dapat bantuan?',
    msg_supermarket_7: 'Boleh tolong dengan senarai beli-belah saya?',
    // Hospital messages (casual)
    msg_hospital_1: 'Boleh tolong saya daftar di hospital?',
    msg_hospital_2: 'Kat mana bilik kecemasan?',
    msg_hospital_3: 'Macam mana nak cari pejabat doktor saya?',
    msg_hospital_4: 'Kat mana farmasi?',
    msg_hospital_5: 'Boleh tolong dengan borang insurans?',
    msg_hospital_6: 'Kat mana nak tunggu?',
    msg_hospital_7: 'Macam mana nak buat temujanji?',
    msg_hospital_8: 'Kat mana tandas?',
    // Restaurant messages (casual)
    msg_restaurant_1: 'Boleh tolong saya pesan makanan?',
    msg_restaurant_2: 'Apa yang istimewa hari ni?',
    msg_restaurant_3: 'Saya ada alahan makanan, boleh tolong?',
    msg_restaurant_4: 'Kat mana tandas?',
    msg_restaurant_5: 'Boleh tolong dengan menu?',
    msg_restaurant_6: 'Boleh saya dapatkan bil?',
    msg_restaurant_7: 'Macam mana nak bayar?',
    msg_restaurant_8: 'Macam mana nak keluar?',
    // Bank messages (casual)
    msg_bank_1: 'Boleh tolong saya uruskan hal bank?',
    msg_bank_2: 'Kat mana ATM?',
    msg_bank_3: 'Macam mana nak buka akaun?',
    msg_bank_4: 'Kat mana boleh dapat bantuan?',
    msg_bank_5: 'Macam mana nak keluarkan duit?',
    msg_bank_6: 'Kat mana jabatan pinjaman?',
    msg_bank_7: 'Boleh tolong dengan perbankan online?',
    msg_bank_8: 'Kat mana tandas?',
    // Pharmacy messages (casual)
    msg_pharmacy_1: 'Boleh tolong saya dapatkan ubat?',
    msg_pharmacy_2: 'Kat mana nak ambil preskripsi?',
    msg_pharmacy_3: 'Macam mana nak makan ubat?',
    msg_pharmacy_4: 'Kat mana nak cari ubat tanpa preskripsi?',
    msg_pharmacy_5: 'Boleh tolong dengan insurans?',
    msg_pharmacy_6: 'Kat mana ahli farmasi?',
    msg_pharmacy_7: 'Berapa banyak ubat saya perlu ambil?',
    msg_pharmacy_8: 'Kat mana tandas?',
    // Transport messages (casual)
    msg_transport_1: 'Boleh tolong saya dengan pengangkutan?',
    msg_transport_2: 'Kat mana perhentian bas?',
    msg_transport_3: 'Macam mana nak beli tiket?',
    msg_transport_4: 'Kat mana platform kereta api?',
    msg_transport_5: 'Macam mana nak cari laluan?',
    msg_transport_6: 'Kat mana tempat teksi?',
    msg_transport_7: 'Boleh tolong dengan jadual?',
    msg_transport_8: 'Kat mana kaunter maklumat?',
  },
};

const LOCATION_MESSAGES: Record<string, string[]> = {
  SUPERMARKET: [
    'msg_supermarket_1',
    'msg_supermarket_2',
    'msg_supermarket_3',
    'msg_supermarket_4',
    'msg_supermarket_5',
    'msg_supermarket_6',
    'msg_supermarket_7',
  ],
  HOSPITAL: [
    'msg_hospital_1',
    'msg_hospital_2',
    'msg_hospital_3',
    'msg_hospital_4',
    'msg_hospital_5',
    'msg_hospital_6',
    'msg_hospital_7',
    'msg_hospital_8',
  ],
  RESTAURANT: [
    'msg_restaurant_1',
    'msg_restaurant_2',
    'msg_restaurant_3',
    'msg_restaurant_4',
    'msg_restaurant_5',
    'msg_restaurant_6',
    'msg_restaurant_7',
    'msg_restaurant_8',
  ],
  BANK: [
    'msg_bank_1',
    'msg_bank_2',
    'msg_bank_3',
    'msg_bank_4',
    'msg_bank_5',
    'msg_bank_6',
    'msg_bank_7',
    'msg_bank_8',
  ],
  PHARMACY: [
    'msg_pharmacy_1',
    'msg_pharmacy_2',
    'msg_pharmacy_3',
    'msg_pharmacy_4',
    'msg_pharmacy_5',
    'msg_pharmacy_6',
    'msg_pharmacy_7',
    'msg_pharmacy_8',
  ],
  TRANSPORT: [
    'msg_transport_1',
    'msg_transport_2',
    'msg_transport_3',
    'msg_transport_4',
    'msg_transport_5',
    'msg_transport_6',
    'msg_transport_7',
    'msg_transport_8',
  ],
};

export default function Others() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { language, setLanguage } = useContext(LanguageContext);
  const [maleVoice, setMaleVoice] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchMaleVoice = async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      const langCode = language === 'en' ? 'en-US' : 'ms-MY';
      // Try to find a male voice for the selected language
      const male = voices.find(v => v.language === langCode);
      setMaleVoice(male ? male.identifier : undefined);
    };
    fetchMaleVoice();
  }, [language]);

  const speakMessage = (message: string) => {
    if (isSoundEnabled) {
      Speech.speak(message, {
        rate: 0.6,
        pitch: 0.95,
        volume: 1.0,
        language: language === 'en' ? 'en-US' : 'ms-MY',
        voice: maleVoice,
      });
    }
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{TRANSLATIONS[language].location}</Text>
          </View>
          <TouchableOpacity
            style={[styles.soundButton, { backgroundColor: isSoundEnabled ? '#4caf50' : '#f44336' }]}
            onPress={() => setIsSoundEnabled(!isSoundEnabled)}
          >
            <MaterialCommunityIcons
              name={isSoundEnabled ? 'volume-high' : 'volume-off'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <View style={{ position: 'absolute', left: 20, top: 0, flexDirection: 'row', alignItems: 'center' }}>
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
          {LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location.label}
              style={[styles.gridButton, { backgroundColor: location.color }]}
              onPress={() => setSelectedLocation(location)}
            >
              {location.icon}
              <Text style={styles.gridLabel}>{TRANSLATIONS[language][location.label.toLowerCase()] || location.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages Modal */}
        <Modal
          visible={selectedLocation !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedLocation(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedLocation?.label}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedLocation(null)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.messagesList}>
                {selectedLocation && LOCATION_MESSAGES[selectedLocation.label]?.map((msgKey, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.messageButton}
                    onPress={() => speakMessage(TRANSLATIONS[language][msgKey])}
                  >
                    <Text style={styles.messageText}>{TRANSLATIONS[language][msgKey]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

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
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  soundButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  gridButton: {
    width: width / 2.7,
    height: width / 2.7,
    borderRadius: 18,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  gridLabel: {
    marginTop: 8,
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 20,
  },
  messagesList: {
    maxHeight: '80%',
  },
  messageButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
}); 