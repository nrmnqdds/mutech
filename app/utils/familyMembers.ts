import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FamilyMember {
  id: string;
  name: string;
  image: string;
  phoneNumber: string;
  relationship: string;
  address: string;
  isEmergencyContact: boolean;
}

const FAMILY_MEMBERS_KEY = '@family_members';

export const familyMembersService = {
  // Get all family members
  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const members = await AsyncStorage.getItem(FAMILY_MEMBERS_KEY);
      return members ? JSON.parse(members) : [];
    } catch (error) {
      console.error('Error getting family members:', error);
      return [];
    }
  },

  // Add a new family member
  async addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    try {
      const members = await this.getAllFamilyMembers();
      const newMember = {
        ...member,
        id: Date.now().toString(), // Simple unique ID generation
      };
      members.push(newMember);
      await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify(members));
      return newMember;
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  },

  // Update a family member
  async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | null> {
    try {
      const members = await this.getAllFamilyMembers();
      const index = members.findIndex(m => m.id === id);
      if (index === -1) return null;

      const updatedMember = { ...members[index], ...updates };
      members[index] = updatedMember;
      await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify(members));
      return updatedMember;
    } catch (error) {
      console.error('Error updating family member:', error);
      throw error;
    }
  },

  // Delete a family member
  async deleteFamilyMember(id: string): Promise<boolean> {
    try {
      const members = await this.getAllFamilyMembers();
      const filteredMembers = members.filter(m => m.id !== id);
      await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify(filteredMembers));
      return true;
    } catch (error) {
      console.error('Error deleting family member:', error);
      return false;
    }
  },

  // Get emergency contacts
  async getEmergencyContacts(): Promise<FamilyMember[]> {
    try {
      const members = await this.getAllFamilyMembers();
      return members.filter(m => m.isEmergencyContact);
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }
}; 