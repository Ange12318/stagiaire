// storage/storage.ts
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

// Wrapper pour localStorage compatible avec async/await
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const saveIntern = async (intern: Omit<Intern, 'id' | 'history'>) => {
  try {
    const existingInterns = await getInterns();
    const newIntern: Intern = {
      id: Date.now().toString(),
      history: [],
      ...intern,
    };
    const updatedInterns = [...existingInterns, newIntern];
    await storage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error saving intern:', error);
    throw error;
  }
};

export const getInterns = async (): Promise<Intern[]> => {
  try {
    const jsonValue = await storage.getItem(INTERN_STORAGE_KEY);
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
    await storage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error updating intern:', error);
    throw error;
  }
};

export const deleteIntern = async (id: string) => {
  try {
    const interns = await getInterns();
    const updatedInterns = interns.filter((intern) => intern.id !== id);
    await storage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
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
    await storage.setItem(INTERN_STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error('Error deleting intern photo:', error);
    throw error;
  }
};