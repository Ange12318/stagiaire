import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestion des Stagiaires</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter un stagiaire"
            onPress={() => navigation.navigate('AddIntern')}
            color="#3498DB"
          />
          <Button
            title="Liste des stagiaires"
            onPress={() => navigation.navigate('InternList')}
            color="#3498DB"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2C3E50',
  },
  buttonContainer: {
    gap: 20,
    width: '80%',
  },
});