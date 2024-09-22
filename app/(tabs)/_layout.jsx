import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabsStructure = () => {
  return (
    <Tabs>
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="index" options={{title:"Profile"}}/>
    </Tabs>
  );
};

export default TabsStructure;

const styles = StyleSheet.create({});
