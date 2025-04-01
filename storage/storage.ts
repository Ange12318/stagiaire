import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Intern {
  id: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  departement:
    | 'MARKETING'
    | 'JURIDIQUE'
    | 'INFORMATIQUE'
    | 'COMPTABILITE'
    | 'RH'
    | 'COTON'
    | 'CREDIT SUPPORT'
    | 'APPUIE TECHNIQUE';
  cni?: string;
  extrait?: string;
  cv?: string;
  tuteur?: string;
  dateEntree?: string;
  dateFin?: string;
  email?: string;
  telephone?: string;
  cnps?: string;
  renouvellementContrat?: string;
  dureeRenouvellement?: string;
  history?: { date: string; changes: string }[];
}

const INTERN_STORAGE_KEY = '@interns';

export const saveIntern = async (intern: Omit<Intern, 'id' | 'history'>) => {
  try {
    const existingInterns = await getInterns();
    const newIntern: Intern = {
      id: Date.now().toString(),
      history: [],
      ...intern,
    };
    const updatedInterns = [...existingInterns, newIntern];
    await AsyncStorage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error saving intern:', error);
    throw error;
  }
};

export const getInterns = async (): Promise<Intern[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(INTERN_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving interns:', error);
    throw error;
  }
};

export const updateIntern = async (id: string, updatedData: Partial<Intern>, changeDescription: string) => {
  try {
    const interns = await getInterns();
    const updatedInterns = interns.map((intern) => {
      if (intern.id === id) {
        const history = intern.history || [];
        return {
          ...intern,
          ...updatedData,
          history: [...history, { date: new Date().toISOString(), changes: changeDescription }],
        };
      }
      return intern;
    });
    await AsyncStorage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error updating intern:', error);
    throw error;
  }
};

export const deleteIntern = async (id: string) => {
  try {
    const interns = await getInterns();
    const updatedInterns = interns.filter((intern) => intern.id !== id);
    await AsyncStorage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error deleting intern:', error);
    throw error;
  }
};

export const deleteInternPhoto = async (id: string, photoType: 'cni' | 'extrait' | 'cv') => {
  try {
    const interns = await getInterns();
    const updatedInterns = interns.map((intern) => {
      if (intern.id === id) {
        return { ...intern, [photoType]: undefined };
      }
      return intern;
    });
    await AsyncStorage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error deleting intern photo:', error);
    throw error;
  }
};