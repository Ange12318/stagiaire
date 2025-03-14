import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { getInterns } from '../storage/storage';

export default function InternListScreen({ navigation }) {
  const [interns, setInterns] = useState<{ id: string; name: string; department: string }[]>([]);

  useEffect(() => {
    const loadInterns = async () => {
      const data = await getInterns();
      setInterns(data);
    };
    loadInterns();
  }, []);

  const handleEdit = (intern: { id: string; name: string; department: string }) => {
    navigation.navigate('EditIntern', { intern });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Stagiaires</Text>
      <FlatList
        data={interns}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - {item.department}</Text>
            <Button title="Modifier" onPress={() => handleEdit(item)} color="#007AFF" />
          </View>
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
});