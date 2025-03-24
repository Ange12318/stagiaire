import 'react-native-gesture-handler'; // Ajout au début du fichier
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddInternScreen from './screens/AddInternScreen';
import EditInternScreen from './screens/EditInternScreen';
import InternListScreen from './screens/InternListScreen';
import InternDetailsScreen from './screens/InternDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gestion des Stagiaires' }} />
        <Stack.Screen name="AddIntern" component={AddInternScreen} options={{ title: 'Ajouter un Stagiaire' }} />
        <Stack.Screen name="EditIntern" component={EditInternScreen} options={{ title: 'Modifier un Stagiaire' }} />
        <Stack.Screen name="InternList" component={InternListScreen} options={{ title: 'Liste des Stagiaires' }} />
        <Stack.Screen name="InternDetails" component={InternDetailsScreen} options={{ title: 'Détails du Stagiaire' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}