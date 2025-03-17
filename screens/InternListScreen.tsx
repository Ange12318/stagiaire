import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getInterns, Intern } from '../storage/storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function InternListScreen({ navigation }) {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
    if (filterCompany) {
      result = result.filter((intern) => intern.entreprise === filterCompany);
    }
    if (filterDate) {
      result = result.sort((a, b) =>
        filterDate === 'asc'
          ? a.dateEntree?.localeCompare(b.dateEntree || '') || 0
          : b.dateEntree?.localeCompare(a.dateEntree || '') || 0
      );
    }
    if (filterStatus) {
      result = result.filter((intern) => intern.statut === filterStatus);
    }
    setFilteredInterns(result);
    setPage(1);
  }, [search, filterCompany, filterDate, filterStatus, interns]);

  const paginatedInterns = filteredInterns.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleExportPDF = async () => {
    const csv = interns
      .map((i) => `${i.nom},${i.prenoms},${i.entreprise || ''},${i.statut || ''}`)
      .join('\n');
    const fileUri = `${FileSystem.documentDirectory}interns.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
  };

  const handleViewDetails = (intern: Intern) => {
    navigation.navigate('InternDetails', { intern });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Stagiaires</Text>

      <TextInput
        style={styles.input}
        placeholder="Rechercher par nom ou numéro"
        value={search}
        onChangeText={setSearch}
      />

      <Picker
        selectedValue={filterCompany}
        onValueChange={setFilterCompany}
        style={styles.picker}
      >
        <Picker.Item label="Toutes les entreprises" value="" />
        {Array.from(new Set(interns.map((i) => i.entreprise))).map((company) => (
          <Picker.Item key={company} label={company || 'Non défini'} value={company} />
        ))}
      </Picker>

      <Picker selectedValue={filterDate} onValueChange={setFilterDate} style={styles.picker}>
        <Picker.Item label="Trier par date" value="" />
        <Picker.Item label="Date croissante" value="asc" />
        <Picker.Item label="Date décroissante" value="desc" />
      </Picker>

      <Picker selectedValue={filterStatus} onValueChange={setFilterStatus} style={styles.picker}>
        <Picker.Item label="Tous les statuts" value="" />
        <Picker.Item label="En cours" value="En cours" />
        <Picker.Item label="Terminé" value="Terminé" />
        <Picker.Item label="Abandonné" value="Abandonné" />
      </Picker>

      <FlatList
        data={paginatedInterns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleViewDetails(item)}
          >
            <Text>{item.nom} {item.prenoms} - {item.departement}</Text>
            <Button title="Modifier" onPress={() => navigation.navigate('EditIntern', { intern: item })} color="#007AFF" />
          </TouchableOpacity>
        )}
      />

      <View style={styles.pagination}>
        <Button
          title="Précédent"
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
        />
        <Text>Page {page}</Text>
        <Button
          title="Suivant"
          disabled={page * itemsPerPage >= filteredInterns.length}
          onPress={() => setPage(page + 1)}
        />
      </View>

      <Button title="Exporter en CSV" onPress={handleExportPDF} color="#007AFF" />
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});