import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme as useDeviceColorScheme,
} from "react-native";
import { BottomBar } from "../components/BottomBar";
import { Colors } from "../constants/Colors";
import { LanguageContext } from "./_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/men/10.jpg";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [themeChoice, setThemeChoice] = useState<"light" | "dark" | "system">(
    "system",
  );
  const deviceColorScheme = useDeviceColorScheme();
  const colorScheme =
    themeChoice === "system" ? (deviceColorScheme ?? "light") : themeChoice;
  const themeColors = Colors[colorScheme];
  const { language, setLanguage, t } = useContext(LanguageContext);

  const router = useRouter();

  const pickImage = async () => {
    if (!editMode) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you could persist the changes to storage or backend
  };

  const setTheme = (theme: "light" | "dark" | "system") => {
    setThemeChoice(theme);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: themeColors.tint }]}>
          {t("profile")}
        </Text>
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setLanguage("en")}
            style={{
              marginRight: 8,
              padding: 6,
              backgroundColor: language === "en" ? "#fff" : "#eee",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: language === "en" ? "#1e90ff" : "#333",
                fontWeight: "bold",
              }}
            >
              EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage("ms")}
            style={{
              padding: 6,
              backgroundColor: language === "ms" ? "#fff" : "#eee",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: language === "ms" ? "#1e90ff" : "#333",
                fontWeight: "bold",
              }}
            >
              BM
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} disabled={!editMode}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {editMode && (
              <View style={styles.editAvatarOverlay}>
                <Ionicons name="camera" size={28} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {editMode && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickImage}
            >
              <Text style={styles.changePhotoText}>{t("changePhoto")}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("name")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder={t("enterName")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              editable={editMode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("age")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={age}
              onChangeText={setAge}
              placeholder={t("enterAge")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              keyboardType="numeric"
              editable={editMode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("address")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder={t("enterAddress")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              multiline
              editable={editMode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("phone")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder={t("enterPhone")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              keyboardType="phone-pad"
              editable={editMode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("emergencyContact")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder={t("enterEmergencyContact")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              editable={editMode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {t("emergencyPhone")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: colorScheme === "dark" ? "#333" : "#eee",
                },
              ]}
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              placeholder={t("enterEmergencyPhone")}
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
              keyboardType="phone-pad"
              editable={editMode}
            />
          </View>
          {!editMode ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.editButtonText}>{t("editProfile")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t("saveProfile")}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={[
              styles.themeBtn,
              themeChoice === "light" && styles.themeBtnActive,
            ]}
            onPress={() => setTheme("light")}
          >
            <Text
              style={[
                styles.themeBtnText,
                themeChoice === "light" && styles.themeBtnTextActive,
              ]}
            >
              {t("light")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeBtn,
              themeChoice === "dark" && styles.themeBtnActive,
            ]}
            onPress={() => setTheme("dark")}
          >
            <Text
              style={[
                styles.themeBtnText,
                themeChoice === "dark" && styles.themeBtnTextActive,
              ]}
            >
              {t("dark")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeBtn,
              themeChoice === "system" && styles.themeBtnActive,
            ]}
            onPress={() => setTheme("system")}
          >
            <Text
              style={[
                styles.themeBtnText,
                themeChoice === "system" && styles.themeBtnTextActive,
              ]}
            >
              {t("system")}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.themeBtn,
            themeChoice === "light" && styles.themeBtnActive,
          ]}
          onPress={async () => {
            await AsyncStorage.clear();
            router.push("/Login");
          }}
        >
          <Text
            style={[
              styles.themeBtnText,
              themeChoice === "light" && styles.themeBtnTextActive,
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomBar active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginTop: 80,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  editAvatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1e90ff",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhotoButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#1e90ff",
    borderRadius: 8,
  },
  changePhotoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  form: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 16,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "#3ed36e",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  themeBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  themeBtnActive: {
    backgroundColor: "#1e90ff",
    borderColor: "#1e90ff",
  },
  themeBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 14,
  },
  themeBtnTextActive: {
    color: "#fff",
  },
});
