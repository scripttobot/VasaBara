import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import React from "react";
import Colors from "@/constants/colors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }} />
        <Label>Dashboard</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add-property">
        <Icon sf={{ default: "plus.circle", selected: "plus.circle.fill" }} />
        <Label>Add</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-properties">
        <Icon sf={{ default: "building.2", selected: "building.2.fill" }} />
        <Label>Properties</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="owner-profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#000" : "#fff",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: Colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "#000" : "#fff" }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-property"
        options={{
          title: "Add",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-properties"
        options={{
          title: "Properties",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "business" : "business-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="owner-profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function OwnerTabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
