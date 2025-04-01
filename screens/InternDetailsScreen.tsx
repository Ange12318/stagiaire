import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useInterns } from '../context/InternContext';
import { Intern } from '../storage/storage';

export default function InternDetailsScreen({ route, navigation }) {
  const { intern: initialIntern }: { intern: Intern } = route.params;
  const { interns, deleteIntern } = useInterns();
  const intern = interns.find(i => i.id === initialIntern.id) || initialIntern;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTimeRemaining = (dateFin?: string) => {
    if (!dateFin) return 'Non défini';
    const endDate = new Date(dateFin);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Stage terminé';
    return `${diffDays} jour${diffDays !== 1 ? 's' : ''} restant${diffDays !== 1 ? 's' : ''}`;
  };

  const isStageTerminated = (dateFin?: string) => {
    if (!dateFin) return false;
    const endDate = new Date(dateFin);
    const today = new Date();
    return endDate < today;
  };

  const handleViewImage = (uri: string | null) => {
    if (uri) {
      setSelectedImage(uri);
      setModalVisible(true);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditIntern', { intern });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Supprimer le stagiaire',
      `Êtes-vous sûr de vouloir supprimer ${intern.nom} ${intern.prenoms} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteIntern(intern.id);
              Alert.alert('Succès', 'Stagiaire supprimé avec succès');
              navigation.navigate('InternList');
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Détails du Stagiaire</Text>
        <View style={styles.infoCard}>
          <Text style={styles.info}>
            <Text style={styles.label}>Nom :</Text> {intern.nom} {intern.prenoms}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Date de naissance :</Text> {intern.dateNaissance}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Département :</Text> {intern.departement}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Tuteur :</Text> {intern.tuteur || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Email :</Text> {intern.email || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Téléphone :</Text> {intern.telephone || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Date d’entrée :</Text> {intern.dateEntree || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Date de fin :</Text> {intern.dateFin || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Temps restant :</Text> {calculateTimeRemaining(intern.dateFin)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Numéro CNPS :</Text> {intern.cnps || 'Non défini'}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Renouvellement de contrat :</Text>{' '}
            {intern.renouvellementContrat || 'Non défini'}
          </Text>
          {intern.renouvellementContrat === 'Oui' && (
            <Text style={styles.info}>
              <Text style={styles.label}>Durée du renouvellement :</Text>{' '}
              {intern.dureeRenouvellement || 'Non défini'}
            </Text>
          )}
          {isStageTerminated(intern.dateFin) && (
            <Text style={styles.statusTerminated}>Stage terminé</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.disabledButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Supprimer</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          {intern.cni && (
            <View style={styles.imageContainer}>
              <Text style={styles.label}>CNI :</Text>
              <TouchableOpacity onPress={() => handleViewImage(intern.cni)}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: intern.cni }} style={styles.image} resizeMode="contain" />
                </View>
              </TouchableOpacity>
            </View>
          )}
          {intern.extrait && (
            <View style={styles.imageContainer}>
              <Text style={styles.label}>Extrait :</Text>
              <TouchableOpacity onPress={() => handleViewImage(intern.extrait)}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: intern.extrait }} style={styles.image} resizeMode="contain" />
                </View>
              </TouchableOpacity>
            </View>
          )}
          {intern.cv && (
            <View style={styles.imageContainer}>
              <Text style={styles.label}>CV :</Text>
              <TouchableOpacity onPress={() => handleViewImage(intern.cv)}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: intern.cv }} style={styles.image} resizeMode="contain" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.subtitle}>Historique des mises à jour</Text>
        <View style={styles.historyList}>
          {intern.history && intern.history.length > 0 ? (
            intern.history.map((item, index) => (
              <Text key={index} style={styles.historyItem}>
                {new Date(item.date).toLocaleString('fr-FR')} - {item.changes}
              </Text>
            ))
          ) : (
            <Text style={styles.historyItem}>Aucun historique disponible</Text>
          )}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
  infoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2C3E50',
  },
  label: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495E',
  },
  statusTerminated: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageContainer: {
    marginVertical: 15,
  },
  imageWrapper: {
    width: 250,
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  historyList: {
    marginTop: 5,
    paddingBottom: 20,
  },
  historyItem: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 5,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});