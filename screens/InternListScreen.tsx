import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getInterns, Intern, deleteIntern } from '../storage/storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function InternListScreen({ navigation }) {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadInterns = async () => {
      const data = await getInterns();
      setInterns(data);
      setFilteredInterns(data);
    };
    loadInterns();
  }, []);

  useEffect(() => {
    let result = interns;
    if (search) {
      result = result.filter(
        (intern) =>
          intern.nom.toLowerCase().includes(search.toLowerCase()) ||
          intern.id.includes(search)
      );
    }
    if (filterDate) {
      result = result.sort((a, b) =>
        filterDate === 'asc'
          ? a.dateEntree?.localeCompare(b.dateEntree || '') || 0
          : b.dateEntree?.localeCompare(a.dateEntree || '') || 0
      );
    }
    setFilteredInterns(result);
    setPage(1);
  }, [search, filterDate, interns]);

  const paginatedInterns = filteredInterns.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleExportPDF = async () => {
    try {
      const csv = interns
        .map((i) => `${i.nom},${i.prenoms},${i.departement},${i.email || ''},${i.telephone || ''},${i.dateEntree || ''},${i.dateFin || ''},${i.cnps || ''},${i.renouvellementContrat || ''}`)
        .join('\n');
      const fileUri = `${FileSystem.documentDirectory}interns.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'exportation.');
    }
  };

  const handleViewDetails = (intern: Intern) => {
    navigation.navigate('InternDetails', { intern });
  };

  const handleDeleteIntern = async (id: string) => {
    try {
      await deleteIntern(id);
      const updatedInterns = interns.filter((intern) => intern.id !== id);
      setInterns(updatedInterns);
      setFilteredInterns(updatedInterns);
      Alert.alert('Succès', 'Stagiaire supprimé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
    }
  };

  const confirmDelete = (intern: Intern) => {
    Alert.alert(
      'Supprimer le stagiaire',
      `Êtes-vous sûr de vouloir supprimer ${intern.nom} ${intern.prenoms} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => handleDeleteIntern(intern.id), style: 'destructive' },
      ]
    );
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Liste des Stagiaires</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher par nom ou numéro"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={() => {}} // Empêche le clavier de se fermer
      />
      <Picker selectedValue={filterDate} onValueChange={setFilterDate} style={styles.picker}>
        <Picker.Item label="Trier par date" value="" />
        <Picker.Item label="Date croissante" value="asc" />
        <Picker.Item label="Date décroissante" value="desc" />
      </Picker>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.pagination}>
        <Button
          title="Précédent"
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          color="#3498DB"
        />
        <Text style={styles.pageText}>Page {page}</Text>
        <Button
          title="Suivant"
          disabled={page * itemsPerPage >= filteredInterns.length}
          onPress={() => setPage(page + 1)}
          color="#3498DB"
        />
      </View>
      <Button title="Exporter en CSV" onPress={handleExportPDF} color="#3498DB" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={paginatedInterns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleViewDetails(item)}
            onLongPress={() => confirmDelete(item)}
          >
            <Text style={styles.itemText}>{item.nom} {item.prenoms} - {item.departement}</Text>
            <Button
              title="Modifier"
              onPress={() => navigation.navigate('EditIntern', { intern: item })}
              color="#3498DB"
            />
          </TouchableOpacity>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
  },
  input: {
    height: 50,
    borderColor: '#3498DB',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 20,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderColor: '#3498DB',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: '#34495E',
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  pageText: {
    fontSize: 16,
    color: '#2C3E50',
  },
});