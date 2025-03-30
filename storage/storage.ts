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
  tuteur?: string;
  dateEntree?: string;
  email?: string;
  telephone?: string;
  dateFin?: string;
  cv?: string | null;
  cnps?: string;
  renouvellementContrat?: string; // "Oui" ou "Non"
  dureeRenouvellement?: string; // Durée en mois (ex. "1 mois", "3 mois", "6 mois")
  history?: { date: string; changes: string }[];
}

const validateInternData = (intern: Omit<Intern, 'id' | 'history'>) => {
  if (!intern.nom || intern.nom.trim() === '') {
    throw new Error('Le nom est requis.');
  }
  if (!intern.prenoms || intern.prenoms.trim() === '') {
    throw new Error('Les prénoms sont requis.');
  }
  if (!intern.dateNaissance || !/^\d{4}-\d{2}-\d{2}$/.test(intern.dateNaissance)) {
    throw new Error('La date de naissance est invalide (format attendu : YYYY-MM-DD).');
  }
  if (!intern.departement || !['MARKETING', 'JURIDIQUE', 'INFORMATIQUE'].includes(intern.departement)) {
    throw new Error('Le département est invalide.');
  }
  if (intern.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intern.email)) {
    throw new Error('L\'email est invalide.');
  }
  if (intern.telephone && !/^\+?\d{10,14}$/.test(intern.telephone)) {
    throw new Error('Le numéro de téléphone est invalide.');
  }
  if (intern.renouvellementContrat && !['Oui', 'Non'].includes(intern.renouvellementContrat)) {
    throw new Error('Le renouvellement de contrat doit être "Oui" ou "Non".');
  }
  if (intern.renouvellementContrat === 'Oui' && !intern.dureeRenouvellement) {
    throw new Error('La durée de renouvellement est requise si le renouvellement est "Oui".');
  }
  if (intern.dureeRenouvellement && !['1 mois', '3 mois', '6 mois'].includes(intern.dureeRenouvellement)) {
    throw new Error('La durée de renouvellement est invalide.');
  }
};

export const saveIntern = async (intern: Omit<Intern, 'id' | 'history'>) => {
  try {
    validateInternData(intern);
    const existingInterns = await AsyncStorage.getItem(STORAGE_KEY);
    const interns: Intern[] = existingInterns ? JSON.parse(existingInterns) : [];
    const newIntern: Intern = {
      id: Date.now().toString(),
      ...intern,
      history: [{ date: new Date().toISOString(), changes: 'Création du stagiaire' }],
    };
    interns.push(newIntern);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
    return newIntern;
  } catch (error) {
    console.error("Erreur d'enregistrement du stagiaire", error);
    throw error instanceof Error ? error : new Error('Erreur inconnue lors de l\'enregistrement.');
  }
};

export const getInterns = async (): Promise<Intern[]> => {
  try {
    const interns = await AsyncStorage.getItem(STORAGE_KEY);
    return interns ? JSON.parse(interns) : [];
  } catch (error) {
    console.error("Erreur de récupération des stagiaires", error);
    throw new Error('Erreur lors de la récupération des stagiaires.');
  }
};

export const updateIntern = async (id: string, updatedData: Partial<Intern>, changeDescription: string) => {
  try {
    const interns = await getInterns();
    const index = interns.findIndex((intern) => intern.id === id);
    if (index === -1) {
      throw new Error('Stagiaire non trouvé.');
    }
    const updatedIntern = { ...interns[index], ...updatedData };
    validateInternData(updatedIntern);
    interns[index] = {
      ...updatedIntern,
      history: [
        ...(interns[index].history || []),
        { date: new Date().toISOString(), changes: changeDescription },
      ],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
    return interns[index];
  } catch (error) {
    console.error("Erreur de mise à jour du stagiaire", error);
    throw error instanceof Error ? error : new Error('Erreur inconnue lors de la mise à jour.');
  }
};

export const deleteIntern = async (id: string) => {
  try {
    const interns = await getInterns();
    const updatedInterns = interns.filter((intern) => intern.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInterns));
  } catch (error) {
    console.error("Erreur de suppression du stagiaire", error);
    throw new Error('Erreur lors de la suppression du stagiaire.');
  }
};

export const deleteInternPhoto = async (id: string, photoType: 'cni' | 'extrait' | 'cv') => {
  try {
    const interns = await getInterns();
    const index = interns.findIndex((intern) => intern.id === id);
    if (index === -1) {
      throw new Error('Stagiaire non trouvé.');
    }
    interns[index][photoType] = null;
    interns[index].history = [
      ...(interns[index].history || []),
      { date: new Date().toISOString(), changes: `Suppression de la photo ${photoType}` },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(interns));
  } catch (error) {
    console.error("Erreur de suppression de la photo", error);
    throw new Error('Erreur lors de la suppression de la photo.');
  }
};