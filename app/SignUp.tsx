import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "@react-native-firebase/firestore";
import CryptoJS from "crypto-js";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const generateRandomId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const db = getFirestore();

  const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
  };

  const handleSignUp = useCallback(async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Check if email already exists
      const q = query(
        collection(db, "users"),
        where("email", "==", email.toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      console.log("querySnapshot", querySnapshot.docs);

      if (!querySnapshot.empty) {
        setError("Email is already registered");
        return;
      }

      // Hash password
      const hashedPassword = hashPassword(password);

      const generated = generateRandomId();

      // Create new user document
      const userData = {
        id: generated,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        fcmToken: "",
        lastTokenUpdate: null,
        createdAt: new Date().toISOString(),
      };

      // const docRef = await addDoc(collection(db, "users"), userData);
      const _docRef = doc(db, "users", generated);
      const docRef = await setDoc(_docRef, userData);
      console.log("docRef", docRef);
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => router.replace("/Login"), 1200);
    } catch (e: any) {
      console.error("Signup error:", e);
      setError("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  }, [name, email, password]);

  const speakHelp = () => {
    Speech.speak("Help!");
  };

  return (
    <LinearGradient colors={["#1e90ff", "#0a2740"]} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
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
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/Login")}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={speakHelp}>
          <Text>Help</Text>
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
    backgroundColor: "#3ed36e",
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
  success: {
    color: "#1e90ff",
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
