import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'interns_data';

export const saveIntern = async (intern) => {
  try {
    const existingInterns = await AsyncStorage.getItem(STORAGE_KEY);
    const interns = existingInterns ? JSON.parse(existingInterns) : [];
    interns.push({ id: Date.now().toString(), ...intern });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
  } catch (error) {
    console.error("Erreur d'enregistrement du stagiaire", error);
  }
};

export const getInterns = async () => {
  try {
    const interns = await AsyncStorage.getItem(STORAGE_KEY);
    return interns ? JSON.parse(interns) : [];
  } catch (error) {
    console.error("Erreur de récupération des stagiaires", error);
    return [];
  }
};
