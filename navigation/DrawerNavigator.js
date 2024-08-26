import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import NotLearnedScreen from "../screens/NotLearnedScreen";
import LearnedScreen from "../screens/LearnedScreen";
import UndecidedScreen from "../screens/UndecidecScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2c2f38" },
        headerTintColor: "#ffffff",
        drawerStyle: { backgroundColor: "#2c2f38" },
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: "#ffffff",
        drawerActiveBackgroundColor: "#283d9a",
      }}
    >
      <Drawer.Screen name="Desbloquei Seu Ingles" component={HomeScreen} />
      <Drawer.Screen name="Aprendidas" component={LearnedScreen} />
      <Drawer.Screen name="Indeciso" component={UndecidedScreen} />
      <Drawer.Screen name="Nao Aprendidas" component={NotLearnedScreen} />
    </Drawer.Navigator>
  );
}
