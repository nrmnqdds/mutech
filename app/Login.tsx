import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import CryptoJS from "crypto-js";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const db = getFirestore();

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  const updateFCMToken = async (userId: string, token: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        fcmToken: token,
        lastTokenUpdate: serverTimestamp(),
      });
      console.log("FCM token updated successfully");
    } catch (error) {
      console.error("Error updating FCM token:", error);
    }
  };

  // Function to get and save FCM token
  const getAndSaveFCMToken = async (userId: string) => {
    try {
      const token = await messaging().getToken();
      if (token) {
        await updateFCMToken(userId, token);
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Query Firestore for user with matching email
      const q = query(
        collection(db, "users"),
        where("email", "==", email.toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid email or password");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verify password
      const hashedInputPassword = hashPassword(password);
      const isValidPassword = hashedInputPassword === userData.password;

      if (!isValidPassword) {
        setError("Invalid email or password");
        return;
      }

      // Store user data in AsyncStorage
      const userToken = {
        id: userDoc.id,
        email: userData.email,
        name: userData.name,
      };

      await getAndSaveFCMToken(userToken.id);

      await AsyncStorage.setItem("token", JSON.stringify(userToken));
      router.replace("/");
    } catch (e: any) {
      console.error("Login error:", e);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/SignUp")}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
    color: "#222",
  },
  button: {
    backgroundColor: "#1e90ff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  error: {
    color: "red",
    marginBottom: 8,
    fontWeight: "bold",
  },
  linkBtn: {
    marginTop: 16,
  },
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
