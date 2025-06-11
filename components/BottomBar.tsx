import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export function BottomBar({ active = 'home' }) {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <View style={styles.navBarBg}>
        <TouchableOpacity onPress={() => router.push('/') }>
          <Ionicons
            name="home"
            size={28}
            color="#222"
            style={[styles.navIcon, active === 'home' && styles.navIconActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Location')}>
          <Entypo
            name="location-pin"
            size={28}
            color="#222"
            style={[styles.navIcon, active === 'location' && styles.navIconActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Chat')}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={28}
            color="#222"
            style={[styles.navIcon, active === 'chat' && styles.navIconActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/FamilyMembers')}>
          <Ionicons
            name="people"
            size={28}
            color="#222"
            style={[styles.navIcon, active === 'family' && styles.navIconActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/UserProfile')}>
          <FontAwesome
            name="user"
            size={28}
            color="#222"
            style={[styles.navIcon, active === 'user' && styles.navIconActive]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 12,
    width: width * 0.95,
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
    backgroundColor: '#b3e0ff',
    opacity: 1,
  },
}); 