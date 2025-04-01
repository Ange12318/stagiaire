import React, { createContext, useContext, useState, useEffect } from 'react';
import { Intern, saveIntern, getInterns, updateIntern, deleteIntern, deleteInternPhoto } from '../storage/storage';

interface InternContextType {
  interns: Intern[];
  addIntern: (intern: Omit<Intern, 'id' | 'history'>) => Promise<void>;
  updateIntern: (id: string, updatedData: Partial<Intern>, changeDescription: string) => Promise<void>;
  deleteIntern: (id: string) => Promise<void>;
  deleteInternPhoto: (id: string, photoType: 'cni' | 'extrait' | 'cv') => Promise<void>;
  refreshInterns: () => Promise<void>;
}

const InternContext = createContext<InternContextType | undefined>(undefined);

export const InternProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interns, setInterns] = useState<Intern[]>([]);

  const refreshInterns = async () => {
    const data = await getInterns();
    setInterns(data);
  };

  useEffect(() => {
    refreshInterns();
  }, []);

  const addIntern = async (intern: Omit<Intern, 'id' | 'history'>) => {
    await saveIntern(intern);
    await refreshInterns();
  };

  const updateInternFn = async (id: string, updatedData: Partial<Intern>, changeDescription: string) => {
    await updateIntern(id, updatedData, changeDescription);
    await refreshInterns();
  };

  const deleteInternFn = async (id: string) => {
    await deleteIntern(id);
    await refreshInterns();
  };

  const deleteInternPhotoFn = async (id: string, photoType: 'cni' | 'extrait' | 'cv') => {
    await deleteInternPhoto(id, photoType);
    await refreshInterns();
  };

  return (
    <InternContext.Provider
      value={{
        interns,
        addIntern,
        updateIntern: updateInternFn,
        deleteIntern: deleteInternFn,
        deleteInternPhoto: deleteInternPhotoFn,
        refreshInterns,
      }}
    >
      {children}
    </InternContext.Provider>
  );
};

export const useInterns = () => {
  const context = useContext(InternContext);
  if (!context) {
    throw new Error('useInterns must be used within an InternProvider');
  }
  return context;
};