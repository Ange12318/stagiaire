import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddInternScreen from './screens/AddInternScreen';
import EditInternScreen from './screens/EditInternScreen';
import InternListScreen from './screens/InternListScreen';
import InternDetailsScreen from './screens/InternDetailsScreen'; // À créer

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="Login" component={LoginScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Drawer.Screen name="AddIntern" component={AddInternScreen} options={{ title: 'Ajouter un Stagiaire' }} />
        <Drawer.Screen name="EditIntern" component={EditInternScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="InternList" component={InternListScreen} options={{ title: 'Liste des Stagiaires' }} />
        <Drawer.Screen name="InternDetails" component={InternDetailsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}