import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomBar } from "../components/BottomBar";
import { LanguageContext } from "./_layout";
import { FamilyMember, familyMembersService } from "./utils/familyMembers";

interface User {
  id: string;
  name: string;
  email: string;
  fcmToken: string;
  image?: string;
}

export default function Users() {
  const router = useRouter();
  const { language, t } = useContext(LanguageContext);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      // Get current user's ID
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/Login");
        return;
      }
      const currentUser = JSON.parse(token);

      // Get all users except current user
      const usersSnapshot = await firestore().collection("users").get();
      const usersData = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUser.id) as User[];

      setUsers(usersData);
      console.log("users: ", usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFamily = async (user: User) => {
    try {
      const newFamilyMember: FamilyMember = {
        id: user.id,
        name: user.name,
        phoneNumber: "", // You might want to add phone number to user profile
        relationship: "Family Member",
        address: "", // You might want to add address to user profile
        isEmergencyContact: false,
        image: user.image || "https://randomuser.me/api/portraits/men/1.jpg",
        fcmToken: user.fcmToken, // Include the FCM token
        userId: user.id, // Store the original user ID for reference
      };

      await familyMembersService.addFamilyMember(newFamilyMember);
      Alert.alert("Success", "User added to family members");
      router.push("/FamilyMembers");
    } catch (error) {
      console.error("Error adding to family:", error);
      Alert.alert("Error", "Failed to add user to family members");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <Image
              source={{
                uri:
                  user.image || "https://randomuser.me/api/portraits/men/1.jpg",
              }}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.fcmToken && (
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenBadgeText}>FCM Token Available</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToFamily(user)}
            >
              <Ionicons name="add-circle" size={24} color="#1e90ff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <BottomBar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tokenBadge: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  tokenBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
});
