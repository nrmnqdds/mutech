import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { LanguageContext } from './_layout';
import { FamilyMember, familyMembersService } from './utils/familyMembers';

export default function FamilyMembers() {
  const router = useRouter();
  const { language, t } = useContext(LanguageContext);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: 'John Doe',
    phoneNumber: '+60123456789',
    relationship: '',
    address: '123 Main Street, City',
    isEmergencyContact: false,
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    const members = await familyMembersService.getAllFamilyMembers();
    setFamilyMembers(members);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (editingMember) {
        setEditingMember({ ...editingMember, image: imageUri });
      } else {
        setNewMember({ ...newMember, image: imageUri });
      }
    }
  };

  const handleSave = async () => {
    if (!newMember.name || !newMember.phoneNumber || !newMember.relationship) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingMember) {
        await familyMembersService.updateFamilyMember(editingMember.id, editingMember);
      } else {
        await familyMembersService.addFamilyMember(newMember as Omit<FamilyMember, 'id'>);
      }
      await loadFamilyMembers();
      setIsAdding(false);
      setEditingMember(null);
      setNewMember({
        name: 'John Doe',
        phoneNumber: '+60123456789',
        relationship: '',
        address: '123 Main Street, City',
        isEmergencyContact: false,
        image: 'https://randomuser.me/api/portraits/men/1.jpg'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save family member');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this family member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await familyMembersService.deleteFamilyMember(id);
            await loadFamilyMembers();
          },
        },
      ]
    );
  };

  const renderMemberForm = () => (
    <View style={styles.form}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        <Image
          source={{ uri: editingMember?.image || newMember.image }}
          style={styles.avatar}
        />
        <View style={styles.editAvatarOverlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder={t('name')}
        value={editingMember?.name || newMember.name}
        onChangeText={(text) =>
          editingMember
            ? setEditingMember({ ...editingMember, name: text })
            : setNewMember({ ...newMember, name: text })
        }
      />

      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder={t('phone')}
        value={editingMember?.phoneNumber || newMember.phoneNumber}
        onChangeText={(text) =>
          editingMember
            ? setEditingMember({ ...editingMember, phoneNumber: text })
            : setNewMember({ ...newMember, phoneNumber: text })
        }
        keyboardType="phone-pad"
      />

      <Text style={styles.inputLabel}>Relationship</Text>
      <TextInput
        style={styles.input}
        placeholder="Relationship"
        value={editingMember?.relationship || newMember.relationship}
        onChangeText={(text) =>
          editingMember
            ? setEditingMember({ ...editingMember, relationship: text })
            : setNewMember({ ...newMember, relationship: text })
        }
      />

      <Text style={styles.inputLabel}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={editingMember?.address || newMember.address}
        onChangeText={(text) =>
          editingMember
            ? setEditingMember({ ...editingMember, address: text })
            : setNewMember({ ...newMember, address: text })
        }
      />

      <TouchableOpacity
        style={[
          styles.emergencyToggle,
          (editingMember?.isEmergencyContact || newMember.isEmergencyContact) && styles.emergencyToggleActive,
        ]}
        onPress={() =>
          editingMember
            ? setEditingMember({
                ...editingMember,
                isEmergencyContact: !editingMember.isEmergencyContact,
              })
            : setNewMember({
                ...newMember,
                isEmergencyContact: !newMember.isEmergencyContact,
              })
        }
      >
        <Text style={styles.emergencyToggleText}>
          {editingMember?.isEmergencyContact || newMember.isEmergencyContact
            ? 'Emergency Contact'
            : 'Not Emergency Contact'}
        </Text>
      </TouchableOpacity>

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setIsAdding(false);
            setEditingMember(null);
            setNewMember({
              name: 'John Doe',
              phoneNumber: '+60123456789',
              relationship: '',
              address: '123 Main Street, City',
              isEmergencyContact: false,
              image: 'https://randomuser.me/api/portraits/men/1.jpg'
            });
          }}
        >
          <Text style={styles.buttonText}>{t('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('saveProfile')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Family Members</Text>
        {!isAdding && !editingMember && (
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Users')}>
              <Ionicons name="people" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { marginLeft: 8 }]} onPress={() => setIsAdding(true)}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {(isAdding || editingMember) && renderMemberForm()}

        {!isAdding && !editingMember && (
          <View style={styles.membersList}>
            {familyMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <Image source={{ uri: member.image }} style={styles.memberAvatar} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRelationship}>{member.relationship}</Text>
                  <Text style={styles.memberPhone}>{member.phoneNumber}</Text>
                  {member.isEmergencyContact && (
                    <View style={styles.emergencyBadge}>
                      <Text style={styles.emergencyBadgeText}>Emergency Contact</Text>
                    </View>
                  )}
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditingMember(member)}
                  >
                    <Ionicons name="pencil" size={20} color="#1e90ff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(member.id)}
                  >
                    <Ionicons name="trash" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <BottomBar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1e90ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e90ff',
    borderRadius: 20,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
    fontWeight: 'bold',
  },
  emergencyToggle: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  emergencyToggleActive: {
    backgroundColor: '#1e90ff',
  },
  emergencyToggleText: {
    color: '#333',
    fontWeight: 'bold',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#1e90ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  membersList: {
    padding: 16,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberRelationship: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  memberPhone: {
    fontSize: 14,
    color: '#666',
  },
  emergencyBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  emergencyBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberActions: {
    justifyContent: 'center',
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
}); 