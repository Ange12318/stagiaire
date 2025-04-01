import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import { useInterns } from '../context/InternContext';
import { Intern } from '../storage/storage';

export default function InternListScreen({ navigation }) {
  const { interns } = useInterns();
  const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const internsPerPage = 5;

  useEffect(() => {
    let filtered = [...interns];
    if (searchQuery) {
      filtered = filtered.filter(
        (intern) =>
          intern.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          intern.prenoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
          intern.departement.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (intern.email && intern.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (intern.telephone && intern.telephone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    filtered.sort((a, b) => {
      const dateA = a.dateEntree ? new Date(a.dateEntree).getTime() : 0;
      const dateB = b.dateEntree ? new Date(b.dateEntree).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredInterns(filtered);
    setCurrentPage(1);
  }, [searchQuery, interns, sortOrder]);

  const totalPages = Math.ceil(filteredInterns.length / internsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (currentPage - 1) * internsPerPage,
    currentPage * internsPerPage
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleExportPDF = async () => {
    if (filteredInterns.length === 0) {
      Alert.alert('Erreur', 'Aucun stagiaire à exporter.');
      return;
    }

    try {
      const htmlContent = `
        <h1>Liste des Stagiaires</h1>
        <table border="1">
          <tr>
            <th>Nom</th>
            <th>Prénoms</th>
            <th>Département</th>
            <th>Date d'entrée</th>
            <th>Email</th>
            <th>Téléphone</th>
          </tr>
          ${filteredInterns
            .map(
              (intern) => `
                <tr>
                  <td>${intern.nom}</td>
                  <td>${intern.prenoms}</td>
                  <td>${intern.departement}</td>
                  <td>${intern.dateEntree || 'Non défini'}</td>
                  <td>${intern.email || 'Non défini'}</td>
                  <td>${intern.telephone || 'Non défini'}</td>
                </tr>
              `
            )
            .join('')}
        </table>
      `;

      const options = {
        html: htmlContent,
        fileName: `liste_stagiaires_${new Date().toISOString()}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      await Sharing.shareAsync(file.filePath);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’exportation en PDF.');
    }
  };

  const renderIntern = ({ item }: { item: Intern }) => (
    <TouchableOpacity
      style={styles.internCard}
      onPress={() => navigation.navigate('InternDetails', { intern: item })}
    >
      <Text style={styles.internName}>
        {item.nom} {item.prenoms}
      </Text>
      <Text style={styles.internInfo}>Département: {item.departement}</Text>
      <Text style={styles.internInfo}>Date d’entrée: {item.dateEntree || 'Non défini'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Stagiaires</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher (nom, prénom, département...)"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || filteredInterns.length === 0}
        >
          <Text style={styles.buttonText}>Précédent</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Page {filteredInterns.length === 0 ? 0 : currentPage} / {totalPages || 0}
        </Text>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || filteredInterns.length === 0}
        >
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
        <Text style={styles.buttonText}>
          Trier par date {sortOrder === 'asc' ? '↑' : '↓'}
        </Text>
      </TouchableOpacity>
      {filteredInterns.length === 0 ? (
        <Text style={styles.noDataText}>
          {searchQuery ? 'Aucun stagiaire trouvé pour cette recherche.' : 'Aucun stagiaire disponible.'}
        </Text>
      ) : (
        <FlatList
          data={paginatedInterns}
          renderItem={renderIntern}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity
        style={[styles.exportButton, filteredInterns.length === 0 && styles.disabledButton]}
        onPress={handleExportPDF}
        disabled={filteredInterns.length === 0}
      >
        <Text style={styles.buttonText}>Exporter en PDF</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  pageText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  sortButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  internCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  internName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  internInfo: {
    fontSize: 14,
    color: '#34495E',
  },
  noDataText: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginTop: 20,
  },
  exportButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
});