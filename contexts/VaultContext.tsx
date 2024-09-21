import React, { createContext, useState } from 'react';
import { Vault } from '../types/Vault';

interface VaultContextProps {
  vaults: Vault[];
  createVault: (vaultData: Vault) => void;
  joinVault: (vaultId: string, userId: string, amount: number) => void;
  closeVault: (vaultId: string) => void;
}

interface VaultProviderProps {
  children: React.ReactNode;
}

export const VaultContext = createContext<VaultContextProps | undefined>(undefined);

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
  const [vaults, setVaults] = useState<Vault[]>([]);

  const createVault = (vaultData: Vault) => {
    setVaults([...vaults, vaultData]);
  };

  const joinVault = (vaultId: string, userId: string, amount: number) => {
    const updatedVaults = vaults.map((vault) =>
      vault.id === vaultId
        ? { ...vault, participants: [...vault.participants, { userId, amount }] }
        : vault
    );
    setVaults(updatedVaults);
  };

  const closeVault = (vaultId: string) => {
    const updatedVaults = vaults.filter((vault) => vault.id !== vaultId);
    setVaults(updatedVaults);
  };

  return (
    <VaultContext.Provider value={{ vaults, createVault, joinVault, closeVault }}>
      {children}
    </VaultContext.Provider>
  );
};
