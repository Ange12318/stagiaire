import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getInterns, updateIntern } from '../storage/storage';

export default function EditInternScreen({ route, navigation }) {
  const { intern } = route.params || {};
  const [name, setName] = useState(intern?.name || '');
  const [department, setDepartment] = useState(intern?.department || '');

  const handleUpdateIntern = async () => {
    if (intern?.id && name && department) {
      await updateIntern(intern.id, name, department);
      alert('Stagiaire modifié avec succès');
      navigation.goBack();
    } else {
      alert('Erreur lors de la modification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier un Stagiaire</Text>
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
      <Button title="Mettre à jour" onPress={handleUpdateIntern} color="#007AFF" />
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