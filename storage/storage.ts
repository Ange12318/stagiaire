import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'interns_data';

export interface Intern {
  id: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  departement: string;
  cni: string | null;
  extrait: string | null;
  entreprise?: string;
  tuteur?: string;
  progression?: string; // "25%", "50%", "75%", "100%"
  dateEntree?: string;
  statut?: string; // "En cours", "Terminé", "Abandonné"
  history?: { date: string; changes: string }[];
}

export const saveIntern = async (intern: Omit<Intern, 'id' | 'history'>) => {
  try {
    const existingInterns = await AsyncStorage.getItem(STORAGE_KEY);
    const interns: Intern[] = existingInterns ? JSON.parse(existingInterns) : [];
    const newIntern = {
      id: Date.now().toString(),
      ...intern,
      history: [{ date: new Date().toISOString(), changes: 'Création du stagiaire' }],
    };
    interns.push(newIntern);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
    return newIntern;
  } catch (error) {
    console.error("Erreur d'enregistrement du stagiaire", error);
    throw error;
  }
};

export const getInterns = async (): Promise<Intern[]> => {
  try {
    const interns = await AsyncStorage.getItem(STORAGE_KEY);
    return interns ? JSON.parse(interns) : [];
  } catch (error) {
    console.error("Erreur de récupération des stagiaires", error);
    return [];
  }
};

export const updateIntern = async (id: string, updatedData: Partial<Intern>, changeDescription: string) => {
  try {
    const interns = await getInterns();
    const index = interns.findIndex((intern) => intern.id === id);
    if (index !== -1) {
      interns[index] = {
        ...interns[index],
        ...updatedData,
        history: [
          ...(interns[index].history || []),
          { date: new Date().toISOString(), changes: changeDescription },
        ],
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
      return interns[index];
    }
  } catch (error) {
    console.error("Erreur de mise à jour du stagiaire", error);
    throw error;
  }
};

export const deleteInternPhoto = async (id: string, photoType: 'cni' | 'extrait') => {
  try {
    const interns = await getInterns();
    const index = interns.findIndex((intern) => intern.id === id);
    if (index !== -1) {
      interns[index][photoType] = null;
      interns[index].history = [
        ...(interns[index].history || []),
        { date: new Date().toISOString(), changes: `Suppression de la photo ${photoType}` },
      ];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
    }
  } catch (error) {
    console.error("Erreur de suppression de la photo", error);
    throw error;
  }
};