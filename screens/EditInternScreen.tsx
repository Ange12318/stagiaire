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
import { useInterns } from '../context/InternContext';
import { Intern } from '../storage/storage';
import * as Permissions from 'react-native-permissions';

export default function EditInternScreen({ route, navigation }) {
  const { intern }: { intern: Intern } = route.params || {};
  const [nom, setNom] = useState(intern?.nom || '');
  const [prenoms, setPrenoms] = useState(intern?.prenoms || '');
  const [dateNaissance, setDateNaissance] = useState<Date | null>(
    intern?.dateNaissance ? new Date(intern.dateNaissance) : null
  );
  const [showDateNaissancePicker, setShowDateNaissancePicker] = useState(false);
  const [dateEntree, setDateEntree] = useState<Date | null>(
    intern?.dateEntree ? new Date(intern.dateEntree) : null
  );
  const [showDateEntreePicker, setShowDateEntreePicker] = useState(false);
  const [dateFin, setDateFin] = useState<Date | null>(
    intern?.dateFin ? new Date(intern.dateFin) : null
  );
  const [showDateFinPicker, setShowDateFinPicker] = useState(false);
  const [departement, setDepartement] = useState(intern?.departement || '');
  const [tuteur, setTuteur] = useState(intern?.tuteur || '');
  const [email, setEmail] = useState(intern?.email || '');
  const [telephone, setTelephone] = useState(intern?.telephone || '');
  const [cnps, setCnps] = useState(intern?.cnps || '');
  const [renouvellementContrat, setRenouvellementContrat] = useState<string | null>(intern?.renouvellementContrat || null);
  const [dureeRenouvellement, setDureeRenouvellement] = useState<string | null>(intern?.dureeRenouvellement || null);
  const [cni, setCni] = useState<string | null>(intern?.cni || null);
  const [extrait, setExtrait] = useState<string | null>(intern?.extrait || null);
  const [cv, setCv] = useState<string | null>(intern?.cv || null);
  const [loading, setLoading] = useState(false);

  const { updateIntern, deleteInternPhoto } = useInterns();

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
      quality: 0.5,
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

  const handleDeleteImage = async (type: 'cni' | 'extrait' | 'cv') => {
    if (intern?.id) {
      setLoading(true);
      try {
        await deleteInternPhoto(intern.id, type);
        if (type === 'cni') setCni(null);
        if (type === 'extrait') setExtrait(null);
        if (type === 'cv') setCv(null);
        Alert.alert('Succès', `Photo ${type} supprimée`);
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression de la photo.');
      } finally {
        setLoading(false);
      }
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

  const handleUpdateIntern = async () => {
    if (!intern?.id || !validateForm()) return;
    setLoading(true);
    try {
      const updatedIntern = {
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
      };
      await updateIntern(intern.id, updatedIntern, 'Mise à jour des informations');
      Alert.alert('Succès', 'Stagiaire modifié avec succès');
      navigation.navigate('InternDetails', { intern: { ...intern, ...updatedIntern } });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
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
        <Text style={styles.title}>Modifier un Stagiaire</Text>
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
          {[
            'MARKETING',
            'JURIDIQUE',
            'INFORMATIQUE',
            'COMPTABILITE',
            'RH',
            'COTON',
            'CREDIT SUPPORT',
            'APPUIE TECHNIQUE',
          ].map((dept) => (
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
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleDeleteImage('cni')}>
                <Text style={styles.imagePickerText}>Supprimer CNI</Text>
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
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleDeleteImage('extrait')}>
                <Text style={styles.imagePickerText}>Supprimer Extrait</Text>
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
              <TouchableOpacity style={styles.imagePicker} onPress={() => handleDeleteImage('cv')}>
                <Text style={styles.imagePickerText}>Supprimer CV</Text>
              </TouchableOpacity>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: cv }} style={styles.imagePreview} resizeMode="contain" />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleUpdateIntern}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Mettre à jour</Text>
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
    flexWrap: 'wrap',
  },
  deptButton: {
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minWidth: '30%',
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