import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';
import { FamilyMember, familyMembersService } from './utils/familyMembers';

const { width } = Dimensions.get('window');

const ICONS: any = {
  SNATCH: <MaterialCommunityIcons name="run-fast" size={80} color="#000" />,
  ACCIDENT: <FontAwesome5 name="car-crash" size={80} color="#000" />,
  FIRE: <MaterialCommunityIcons name="fire" size={80} color="#000" />,
  'SEXUAL HARASSMENT': <FontAwesome5 name="user-shield" size={80} color="#000" />,
  'WILD ANIMAL': <MaterialCommunityIcons name="dog-side" size={80} color="#000" />,
  ILLNESS: <FontAwesome5 name="first-aid" size={80} color="#000" />,
};

const COLORS: any = {
  SNATCH: '#3ed36e',
  ACCIDENT: '#e6c84f',
  FIRE: '#f44336',
  'SEXUAL HARASSMENT': '#ff4fcf',
  'WILD ANIMAL': '#dda735',
  ILLNESS: '#e85be6',
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

export default function EmergencyAlert() {
  const router = useRouter();
  const params = useLocalSearchParams();
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
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={tw`flex-1`}>
      <SafeAreaView style={tw`flex-1`}>
        <Text style={[tw`text-3xl font-bold italic text-center mt-4`, { color: '#FFFFFF' }]}>
          {language === 'en' ? 'EMERGENCY CONTACTS' : 'KONTAK KECEMASAN'}
        </Text>

        <View style={tw`flex-row justify-around mt-4 mx-2`}>
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <View key={contact.id} style={tw`items-center mx-1`}>
                <Image source={{ uri: contact.image }} style={tw`w-16 h-16 rounded-full border-2 border-white`} />
                <Text style={tw`text-white text-base mt-1`}>{contact.name.toUpperCase()}</Text>
                <Text
                  style={tw`text-green-400 text-xs`}
                >
                  {t('notified')}
                </Text>
              </View>
            ))
          ) : (
            <View style={tw`items-center justify-center w-full`}>
              <Text style={tw`text-white text-base text-center px-4`}>
                {language === 'en' 
                  ? 'No emergency contacts found. Please add family members and mark them as emergency contacts.'
                  : 'Tiada kontak kecemasan dijumpai. Sila tambah ahli keluarga dan tandakan mereka sebagai kontak kecemasan.'}
              </Text>
            </View>
          )}
        </View>

        <View style={tw`bg-white mt-8 mb-4 py-3 items-center justify-center`}>
          <Text style={tw`text-2xl font-bold italic text-black tracking-wider`}>
            {language === 'en' ? type.toUpperCase() : 
              type === 'SNATCH' ? 'RAGUT' :
              type === 'ACCIDENT' ? 'KEMALANGAN' :
              type === 'FIRE' ? 'KEBAKARAN' :
              type === 'SEXUAL HARASSMENT' ? 'GANGGUAN SEKSUAL' :
              type === 'WILD ANIMAL' ? 'BINATANG LIAR' :
              type === 'ILLNESS' ? 'PENYAKIT' : type.toUpperCase()
            }
          </Text>
        </View>

        {/* Main Content Area: Icon Box and I AM SAFE NOW button */}
        <View style={tw`flex-1 items-center justify-center px-4`}>
          {/* Black Box containing Icon and EMERGENCY ALERTS! text */}
          <View style={tw`bg-black w-full rounded-3xl py-8 items-center shadow-lg`}>
            <View
              style={[tw`w-56 h-56 rounded-3xl justify-center items-center mb-4`, {backgroundColor: COLORS[type] || '#FFC107'}]}
            >
              {ICONS[type] || <MaterialCommunityIcons name="alert-decagram" size={90} color="#000" />}
            </View>
            <Text style={tw`text-white text-2xl font-bold tracking-wider`}>
              {language === 'en' ? 'EMERGENCY ALERTS!' : 'AMARAN KECEMASAN!'}
            </Text>
          </View>

          {/* I AM SAFE NOW Button */}
          <TouchableOpacity
            style={tw`bg-black px-12 py-4 rounded-full mt-12 shadow-lg`}
            onPress={() => router.push({ pathname: '/EmergencyContact', params: { type: type, safe: '1' } })}>
            <Text style={tw`text-white text-xl font-bold tracking-wider`}>
              {language === 'en' ? 'I AM SAFE NOW' : 'SAYA SELAMAT SEKARANG'}
            </Text>
          </TouchableOpacity>
        </View>

        <BottomBar active="home" />
      </SafeAreaView>
    </LinearGradient>
  );
}
