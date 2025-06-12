import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

export interface FamilyMember {
  id: string;
  name: string;
  image: string;
  phoneNumber: string;
  relationship: string;
  address: string;
  isEmergencyContact: boolean;
  fcmToken?: string; // Added FCM token as optional field
  userId?: string; // Added to store the original user ID for reference
}

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;
    const userData = JSON.parse(token);
    return userData.id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
};

export const familyMembersService = {
  // Get all family members for the current user
  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const snapshot = await firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .get();

      const members = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FamilyMember[];

      return members;
    } catch (error) {
      console.error("Error getting family members:", error);
      return [];
    }
  },

  // Add a new family member
  async addFamilyMember(
    member: Omit<FamilyMember, "id">,
  ): Promise<FamilyMember> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const docRef = await firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .add({
          ...member,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      const newMember: FamilyMember = {
        ...member,
        id: docRef.id,
      };

      return newMember;
    } catch (error) {
      console.error("Error adding family member:", error);
      throw error;
    }
  },

  // Update a family member
  async updateFamilyMember(
    id: string,
    updates: Partial<FamilyMember>,
  ): Promise<FamilyMember | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const docRef = firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .doc(id);

      await docRef.update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Get the updated document
      const doc = await docRef.get();
      if (!doc.exists) return null;

      return {
        id: doc.id,
        ...doc.data(),
      } as FamilyMember;
    } catch (error) {
      console.error("Error updating family member:", error);
      throw error;
    }
  },

  // Delete a family member
  async deleteFamilyMember(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .doc(id)
        .delete();

      return true;
    } catch (error) {
      console.error("Error deleting family member:", error);
      return false;
    }
  },

  // Get emergency contacts
  async getEmergencyContacts(): Promise<FamilyMember[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const snapshot = await firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .where("isEmergencyContact", "==", true)
        .get();

      const emergencyContacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FamilyMember[];

      return emergencyContacts;
    } catch (error) {
      console.error("Error getting emergency contacts:", error);
      return [];
    }
  },

  // Get family members with FCM tokens (useful for sending notifications)
  async getFamilyMembersWithFCMTokens(): Promise<FamilyMember[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const snapshot = await firestore()
        .collection("users")
        .doc(userId)
        .collection("familyMembers")
        .where("fcmToken", "!=", null)
        .get();

      const membersWithTokens = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FamilyMember[];

      return membersWithTokens;
    } catch (error) {
      console.error("Error getting family members with FCM tokens:", error);
      return [];
    }
  },
};
