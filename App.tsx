import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./src/components/MainScreen";
import DetailScreen from "./src/components/DetailsScreen";
import Search from "./src/components/Search";

const Stack = createNativeStackNavigator()
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen component={MainScreen} name="Home" />
          <Stack.Screen component={DetailScreen} name="Details" />
          <Stack.Screen component={Search} name="Search" />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}