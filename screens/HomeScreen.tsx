import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useInterns } from '../context/InternContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { interns } = useInterns();
  const [stats, setStats] = useState({
    total: 0,
    marketing: 0,
    juridique: 0,
    informatique: 0,
    comptabilite: 0,
    rh: 0,
    coton: 0,
    creditSupport: 0,
    appuieTechnique: 0,
  });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setLoading(true);
    const total = interns.length;
    const marketing = interns.filter((i) => i.departement === 'MARKETING').length;
    const juridique = interns.filter((i) => i.departement === 'JURIDIQUE').length;
    const informatique = interns.filter((i) => i.departement === 'INFORMATIQUE').length;
    const comptabilite = interns.filter((i) => i.departement === 'COMPTABILITE').length;
    const rh = interns.filter((i) => i.departement === 'RH').length;
    const coton = interns.filter((i) => i.departement === 'COTON').length;
    const creditSupport = interns.filter((i) => i.departement === 'CREDIT SUPPORT').length;
    const appuieTechnique = interns.filter((i) => i.departement === 'APPUIE TECHNIQUE').length;
    setStats({
      total,
      marketing,
      juridique,
      informatique,
      comptabilite,
      rh,
      coton,
      creditSupport,
      appuieTechnique,
    });
    setLoading(false);
  }, [interns]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestion des Stagiaires</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#3498DB" />
        ) : (
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Total des stagiaires : {stats.total}</Text>
            <Text style={styles.statText}>Marketing : {stats.marketing}</Text>
            <Text style={styles.statText}>Juridique : {stats.juridique}</Text>
            <Text style={styles.statText}>Informatique : {stats.informatique}</Text>
            <Text style={styles.statText}>Comptabilité : {stats.comptabilite}</Text>
            <Text style={styles.statText}>RH : {stats.rh}</Text>
            <Text style={styles.statText}>Coton : {stats.coton}</Text>
            <Text style={styles.statText}>Credit Support : {stats.creditSupport}</Text>
            <Text style={styles.statText}>Appuie Technique : {stats.appuieTechnique}</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AddIntern')}
          >
            <Text style={styles.buttonText}>Ajouter un stagiaire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('InternList')}
          >
            <Text style={styles.buttonText}>Liste des stagiaires</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
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
  statsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 20,
    width: '80%',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});