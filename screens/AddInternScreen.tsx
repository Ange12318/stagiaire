import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { saveIntern } from '../storage/storage';
import * as Permissions from 'react-native-permissions';

export default function AddInternScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [dateNaissance, setDateNaissance] = useState<Date | null>(null);
  const [showDateNaissancePicker, setShowDateNaissancePicker] = useState(false);
  const [dateEntree, setDateEntree] = useState<Date | null>(null);
  const [showDateEntreePicker, setShowDateEntreePicker] = useState(false);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [showDateFinPicker, setShowDateFinPicker] = useState(false);
  const [departement, setDepartement] = useState('');
  const [tuteur, setTuteur] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cnps, setCnps] = useState('');
  const [renouvellementContrat, setRenouvellementContrat] = useState<string | null>(null);
  const [dureeRenouvellement, setDureeRenouvellement] = useState<string | null>(null);
  const [cni, setCni] = useState<string | null>(null);
  const [extrait, setExtrait] = useState<string | null>(null);
  const [cv, setCv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (renouvellementContrat === 'Oui' && dateEntree && dureeRenouvellement) {
      const newDateFin = new Date(dateEntree);
      const monthsToAdd = parseInt(dureeRenouvellement.split(' ')[0], 10);
      newDateFin.setMonth(newDateFin.getMonth() + monthsToAdd);
      setDateFin(newDateFin);
    } else if (renouvellementContrat === 'Non') {
      setDureeRenouvellement(null);
      if (!dateFin) {
        setDateFin(null);
      }
    }
  }, [renouvellementContrat, dureeRenouvellement, dateEntree]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erreur', 'Permission d\'accès à la galerie refusée.');
      return false;
    }
    return true;
  };

  const handlePickImage = async (setImage: (uri: string | null) => void) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Réduction de la qualité pour optimiser le stockage
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

  const validateForm = () => {
    if (!nom || !prenoms || !dateNaissance || !departement) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return false;
    }
    if (telephone && !/^\+?\d{10,14}$/.test(telephone)) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide.');
      return false;
    }
    if (renouvellementContrat === 'Oui' && !dureeRenouvellement) {
      Alert.alert('Erreur', 'Veuillez sélectionner une durée de renouvellement.');
      return false;
    }
    if (renouvellementContrat === 'Oui' && !dateEntree) {
      Alert.alert('Erreur', 'Veuillez définir une date d\'entrée pour calculer la date de fin.');
      return false;
    }
    return true;
  };

  const handleAddIntern = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await saveIntern({
        nom,
        prenoms,
        dateNaissance: dateNaissance.toISOString().split('T')[0],
        departement,
        cni,
        extrait,
        cv,
        tuteur,
        dateEntree: dateEntree ? dateEntree.toISOString().split('T')[0] : undefined,
        dateFin: dateFin ? dateFin.toISOString().split('T')[0] : undefined,
        email,
        telephone,
        cnps,
        renouvellementContrat,
        dureeRenouvellement,
      });
      Alert.alert('Succès', 'Stagiaire ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const onDateNaissanceChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateNaissance;
    setShowDateNaissancePicker(Platform.OS === 'ios');
    setDateNaissance(currentDate);
  };

  const onDateEntreeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateEntree;
    setShowDateEntreePicker(Platform.OS === 'ios');
    setDateEntree(currentDate);
  };

  const onDateFinChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateFin;
    setShowDateFinPicker(Platform.OS === 'ios');
    setDateFin(currentDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Ajouter un Stagiaire</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom *"
          value={nom}
          onChangeText={setNom}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Prénoms *"
          value={prenoms}
          onChangeText={setPrenoms}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={telephone}
          onChangeText={setTelephone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDateNaissancePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {dateNaissance ? formatDate(dateNaissance) : 'Date de naissance (JJ/MM/AAAA) *'}
          </Text>
        </TouchableOpacity>
        {showDateNaissancePicker && (
          <DateTimePicker
            value={dateNaissance || new Date()}
            mode="date"
            display="default"
            onChange={onDateNaissanceChange}
            maximumDate={new Date()}
          />
        )}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDateEntreePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {dateEntree ? formatDate(dateEntree) : 'Date d’entrée (JJ/MM/AAAA)'}
          </Text>
        </TouchableOpacity>
        {showDateEntreePicker && (
          <DateTimePicker
            value={dateEntree || new Date()}
            mode="date"
            display="default"
            onChange={onDateEntreeChange}
            maximumDate={new Date()}
          />
        )}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDateFinPicker(true)}
          disabled={renouvellementContrat === 'Oui'}
        >
          <Text style={styles.datePickerText}>
            {dateFin ? formatDate(dateFin) : 'Date de fin (JJ/MM/AAAA)'}
          </Text>
        </TouchableOpacity>
        {showDateFinPicker && (
          <DateTimePicker
            value={dateFin || new Date()}
            mode="date"
            display="default"
            onChange={onDateFinChange}
            minimumDate={dateEntree || new Date()}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Tuteur"
          value={tuteur}
          onChangeText={setTuteur}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro CNPS"
          value={cnps}
          onChangeText={setCnps}
        />
        <Text style={styles.label}>Renouvellement de contrat</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.optionButton, renouvellementContrat === 'Oui' && styles.selectedOption]}
            onPress={() => setRenouvellementContrat('Oui')}
          >
            <Text style={[styles.optionButtonText, renouvellementContrat === 'Oui' && styles.selectedOptionText]}>
              Oui
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, renouvellementContrat === 'Non' && styles.selectedOption]}
            onPress={() => {
              setRenouvellementContrat('Non');
              setDureeRenouvellement(null);
            }}
          >
            <Text style={[styles.optionButtonText, renouvellementContrat === 'Non' && styles.selectedOptionText]}>
              Non
            </Text>
          </TouchableOpacity>
        </View>
        {renouvellementContrat === 'Oui' && (
          <>
            <Text style={styles.label}>Durée du renouvellement</Text>
            <View style={styles.buttonContainer}>
              {['1 mois', '3 mois', '6 mois'].map((duree) => (
                <TouchableOpacity
                  key={duree}
                  style={[styles.optionButton, dureeRenouvellement === duree && styles.selectedOption]}
                  onPress={() => setDureeRenouvellement(duree)}
                >
                  <Text style={[styles.optionButtonText, dureeRenouvellement === duree && styles.selectedOptionText]}>
                    {duree}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <Text style={styles.label}>Département *</Text>
        <View style={styles.buttonContainer}>
          {['MARKETING', 'JURIDIQUE', 'INFORMATIQUE'].map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[styles.deptButton, departement === dept && styles.selectedDept]}
              onPress={() => setDepartement(dept)}
            >
              <Text style={[styles.deptButtonText, departement === dept && styles.selectedDeptText]}>
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setCni)}>
            <Text style={styles.imagePickerText}>Ajouter CNI</Text>
          </TouchableOpacity>
          {cni && (
            <>
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleViewImage(cni)}>
                <Text style={styles.imagePickerText}>Voir CNI</Text>
              </TouchableOpacity>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: cni }} style={styles.imagePreview} resizeMode="contain" />
              </View>
            </>
          )}
        </View>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setExtrait)}>
            <Text style={styles.imagePickerText}>Ajouter Extrait</Text>
          </TouchableOpacity>
          {extrait && (
            <>
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleViewImage(extrait)}>
                <Text style={styles.imagePickerText}>Voir Extrait</Text>
              </TouchableOpacity>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: extrait }} style={styles.imagePreview} resizeMode="contain" />
              </View>
            </>
          )}
        </View>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage(setCv)}>
            <Text style={styles.imagePickerText}>Ajouter CV</Text>
          </TouchableOpacity>
          {cv && (
            <>
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleViewImage(cv)}>
                <Text style={styles.imagePickerText}>Voir CV</Text>
              </TouchableOpacity>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: cv }} style={styles.imagePreview} resizeMode="contain" />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddIntern}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    margin: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2C3E50',
  },
  input: {
    height: 50,
    borderColor: '#3498DB',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  datePickerButton: {
    height: 50,
    borderColor: '#3498DB',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  datePickerText: {
    fontSize: 16,
    color: '#2C3E50',
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2C3E50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deptButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedDept: {
    backgroundColor: '#3498DB',
  },
  deptButtonText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDeptText: {
    color: '#FFF',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedOption: {
    backgroundColor: '#3498DB',
  },
  optionButtonText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  imagePicker: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3498DB',
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  imageWrapper: {
    width: 150,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});