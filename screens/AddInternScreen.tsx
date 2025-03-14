import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveIntern } from '../storage/storage';

export default function AddInternScreen({ navigation }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const handleAddIntern = async () => {
    if (name && department) {
      await saveIntern(name, department);
      alert('Stagiaire ajouté avec succès');
      navigation.goBack();
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Stagiaire</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du stagiaire"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Département"
        value={department}
        onChangeText={setDepartment}
      />
      <Button title="Ajouter" onPress={handleAddIntern} color="#007AFF" />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
});