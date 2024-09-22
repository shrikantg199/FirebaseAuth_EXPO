import { router } from "expo-router";
import { useEffect } from "react";
import { auth } from "../firebaseConfig";

const Index = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("Home");
      } else {
        router.replace("/(auth)/SignIn");
      }
    });

    return unsubscribe;
  }, []);

  return null; 
};

export default Index;
