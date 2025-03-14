import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé pour stocker la liste des stagiaires
const INTERN_KEY = '@Interns';

// Sauvegarder un stagiaire
export const saveIntern = async (name: string, department: string) => {
  const interns = await getInterns();
  interns.push({ id: Date.now().toString(), name, department });
  await AsyncStorage.setItem(INTERN_KEY, JSON.stringify(interns));
};

// Récupérer tous les stagiaires
export const getInterns = async (): Promise<{ id: string; name: string; department: string }[]> => {
  const interns = await AsyncStorage.getItem(INTERN_KEY);
  return interns ? JSON.parse(interns) : [];
};

// Mettre à jour un stagiaire
export const updateIntern = async (id: string, name: string, department: string) => {
  const interns = await getInterns();
  const updatedInterns = interns.map((intern) =>
    intern.id === id ? { ...intern, name, department } : intern
  );
  await AsyncStorage.setItem(INTERN_KEY, JSON.stringify(updatedInterns));
};

// Supprimer un stagiaire (facultatif, pour la modification)
export const deleteIntern = async (id: string) => {
  const interns = await getInterns();
  const filteredInterns = interns.filter((intern) => intern.id !== id);
  await AsyncStorage.setItem(INTERN_KEY, JSON.stringify(filteredInterns));
};

// Initialiser la liste (si vide)
const initializeStorage = async () => {
  const interns = await getInterns();
  if (interns.length === 0) {
    await AsyncStorage.setItem(INTERN_KEY, JSON.stringify([]));
  }
};

initializeStorage();