import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { CounterProvider } from "./contex/CounterContex";

export default function App() {
  return (
    <CounterProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </CounterProvider>
  );
}
