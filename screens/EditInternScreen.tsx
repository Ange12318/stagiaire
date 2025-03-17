import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { updateIntern, deleteInternPhoto, Intern } from '../storage/storage';

export default function EditInternScreen({ route, navigation }) {
  const { intern }: { intern: Intern } = route.params || {};
  const [nom, setNom] = useState(intern?.nom || '');
  const [prenoms, setPrenoms] = useState(intern?.prenoms || '');
  const [dateNaissance, setDateNaissance] = useState(intern?.dateNaissance || '');
  const [departement, setDepartement] = useState(intern?.departement || '');
  const [entreprise, setEntreprise] = useState(intern?.entreprise || '');
  const [tuteur, setTuteur] = useState(intern?.tuteur || '');
  const [progression, setProgression] = useState(intern?.progression || '0%');
  const [dateEntree, setDateEntree] = useState(intern?.dateEntree || '');
  const [statut, setStatut] = useState(intern?.statut || 'En cours');
  const [cni, setCni] = useState<string | null>(intern?.cni || null);
  const [extrait, setExtrait] = useState<string | null>(intern?.extrait || null);

  const handlePickImage = async (setImage: (uri: string | null) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleViewImage = (uri: string | null) => {
    if (uri) {
      Alert.alert('Photo', 'Affichage de la photo', [
        { text: 'OK', onPress: () => console.log('Photo vue :', uri) },
      ]);
    }
  };

  const handleDeleteImage = async (type: 'cni' | 'extrait') => {
    if (intern?.id) {
      await deleteInternPhoto(intern.id, type);
      if (type === 'cni') setCni(null);
      if (type === 'extrait') setExtrait(null);
      Alert.alert('Succès', `Photo ${type} supprimée`);
    }
  };

  const handleUpdateIntern = async () => {
    if (intern?.id && nom && prenoms && dateNaissance && departement) {
      await updateIntern(
        intern.id,
        {
          nom,
          prenoms,
          dateNaissance,
          departement,
          cni,
          extrait,
          entreprise,
          tuteur,
          progression,
          dateEntree,
          statut,
        },
        'Mise à jour des informations'
      );
      Alert.alert('Succès', 'Stagiaire modifié avec succès');
      navigation.goBack();
    } else {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier un Stagiaire</Text>

      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
      <TextInput style={styles.input} placeholder="Prénoms" value={prenoms} onChangeText={setPrenoms} />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (JJ/MM/AAAA)"
        value={dateNaissance}
        onChangeText={setDateNaissance}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date d’entrée (JJ/MM/AAAA)"
        value={dateEntree}
        onChangeText={setDateEntree}
        keyboardType="numeric"
      />
      <TextInput style={styles.input} placeholder="Entreprise" value={entreprise} onChangeText={setEntreprise} />
      <TextInput style={styles.input} placeholder="Tuteur" value={tuteur} onChangeText={setTuteur} />

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

      <Picker selectedValue={progression} onValueChange={setProgression} style={styles.picker}>
        <Picker.Item label="0%" value="0%" />
        <Picker.Item label="25%" value="25%" />
        <Picker.Item label="50%" value="50%" />
        <Picker.Item label="75%" value="75%" />
        <Picker.Item label="100%" value="100%" />
      </Picker>

      <Picker selectedValue={statut} onValueChange={setStatut} style={styles.picker}>
        <Picker.Item label="En cours" value="En cours" />
        <Picker.Item label="Terminé" value="Terminé" />
        <Picker.Item label="Abandonné" value="Abandonné" />
      </Picker>

      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setCni)}>
          <Text>Ajouter CNI</Text>
        </TouchableOpacity>
        {cni && (
          <>
            <TouchableOpacity style={styles.imagePicker} onPress={() => handleViewImage(cni)}>
              <Text>Voir CNI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePicker} onPress={() => handleDeleteImage('cni')}>
              <Text>Supprimer CNI</Text>
            </TouchableOpacity>
            <Image source={{ uri: cni }} style={styles.imagePreview} />
          </>
        )}
      </View>

      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setExtrait)}>
          <Text>Ajouter Extrait</Text>
        </TouchableOpacity>
        {extrait && (
          <>
            <TouchableOpacity style={styles.imagePicker} onPress={() => handleViewImage(extrait)}>
              <Text>Voir Extrait</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePicker} onPress={() => handleDeleteImage('extrait')}>
              <Text>Supprimer Extrait</Text>
            </TouchableOpacity>
            <Image source={{ uri: extrait }} style={styles.imagePreview} />
          </>
        )}
      </View>

      <Button title="Mettre à jour" onPress={handleUpdateIntern} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  picker: {
    height: 50,
    marginBottom: 15,
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
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePicker: {
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
  },
});