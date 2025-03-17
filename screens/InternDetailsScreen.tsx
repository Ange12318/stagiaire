import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Intern } from '../storage/storage';

export default function InternDetailsScreen({ route }) {
  const { intern }: { intern: Intern } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du Stagiaire</Text>
      <Text><Text style={styles.label}>Nom :</Text> {intern.nom} {intern.prenoms}</Text>
      <Text><Text style={styles.label}>Date de naissance :</Text> {intern.dateNaissance}</Text>
      <Text><Text style={styles.label}>Département :</Text> {intern.departement}</Text>
      <Text><Text style={styles.label}>Entreprise :</Text> {intern.entreprise || 'Non défini'}</Text>
      <Text><Text style={styles.label}>Tuteur :</Text> {intern.tuteur || 'Non défini'}</Text>
      <Text><Text style={styles.label}>Progression :</Text> {intern.progression || '0%'}</Text>
      <Text><Text style={styles.label}>Date d’entrée :</Text> {intern.dateEntree || 'Non défini'}</Text>
      <Text><Text style={styles.label}>Statut :</Text> {intern.statut || 'Non défini'}</Text>

      {intern.cni && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>CNI :</Text>
          <Image source={{ uri: intern.cni }} style={styles.image} />
        </View>
      )}
      {intern.extrait && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Extrait :</Text>
          <Image source={{ uri: intern.extrait }} style={styles.image} />
        </View>
      )}

      <Text style={styles.subtitle}>Historique des mises à jour</Text>
      <FlatList
        data={intern.history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.date} - {item.changes}</Text>
        )}
      />
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 150,
    marginTop: 5,
  },
});