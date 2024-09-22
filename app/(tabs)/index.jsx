import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
const Index = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // image Pick
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await updateUserProfile(result.assets[0].uri);
    }
  };

  // SignOut
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/SignIn");
    } catch (error) {
      console.log("Sign out failed: ", error.message);
    }
  };

  // fetch user profile Data
  const fetchUserProfile = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      console.log("No user is logged in.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // pull refresh
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      fetchUserProfile();
      setRefreshing(false);
    }, 1500);
  };

  // update Profile
  const updateUserProfile = async (imageUri) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setLoading(true);
      try {
        await updateProfile(currentUser, {
          displayName: "Shrikant Gaikwad",
          photoURL: imageUri,
        });
        setUser(auth.currentUser);
        console.log("Profile updated successfully.");
      } catch (error) {
        console.log("Error updating profile:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {user && (
        <View>
          <Image
            source={{ uri: user.photoURL || "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <Text style={styles.text}>
            Welcome, {user.displayName || "Guest"}!
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{ position: "absolute", marginLeft: 64, marginTop: 10 }}
          >
            <AntDesign name="edit" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: "#1A237E",
  },
  button: {
    backgroundColor: "#5C6BC0",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
