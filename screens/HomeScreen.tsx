import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Stagiaires</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Ajouter un stagiaire"
          onPress={() => navigation.navigate('AddIntern')}
          color="#007AFF"
        />
        <Button
          title="Modifier un stagiaire"
          onPress={() => navigation.navigate('EditIntern')}
          color="#007AFF"
        />
        <Button
          title="Liste des stagiaires"
          onPress={() => navigation.navigate('InternList')}
          color="#007AFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    gap: 20,
  },
});