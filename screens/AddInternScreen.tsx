import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveIntern } from '../storage/storage';

export default function AddInternScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [departement, setDepartement] = useState('');
  const [cni, setCni] = useState(null);
  const [extrait, setExtrait] = useState(null);

  const handlePickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleAddIntern = async () => {
    if (nom && prenoms && dateNaissance && departement && cni && extrait) {
      await saveIntern({ nom, prenoms, dateNaissance, departement, cni, extrait });
      Alert.alert('Succès', 'Stagiaire ajouté avec succès');
      navigation.goBack();
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Stagiaire</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénoms"
        value={prenoms}
        onChangeText={setPrenoms}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (JJ/MM/AAAA)"
        value={dateNaissance}
        onChangeText={setDateNaissance}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Département</Text>
      <View style={styles.buttonContainer}>
        {['MARKETING', 'JURIDIQUE', 'INFORMATIQUE'].map((dept) => (
          <TouchableOpacity
            key={dept}
            style={[styles.deptButton, departement === dept && styles.selectedDept]}
            onPress={() => setDepartement(dept)}
          >
            <Text>{dept}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setCni)}>
        <Text>Ajouter CNI</Text>
      </TouchableOpacity>
      {cni && <Image source={{ uri: cni }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setExtrait)}>
        <Text>Ajouter Extrait</Text>
      </TouchableOpacity>
      {extrait && <Image source={{ uri: extrait }} style={styles.imagePreview} />}

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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  deptButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
  },
  selectedDept: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  imagePicker: {
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
