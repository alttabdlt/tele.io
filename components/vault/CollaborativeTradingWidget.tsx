import React, { useState, useContext, useEffect } from 'react';
import { VaultContext, VaultProvider } from '../../contexts/VaultContext';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VaultCreationPanel from './VaultCreationPanel';
import VaultManagementPanel from './VaultManagementPanel';
import VaultJoinPanel from './VaultJoinPanel';
import { Vault } from '@/types/Vault';

const CollaborativeTradingWidgetInner: React.FC = () => {
  const vaultContext = useContext(VaultContext);

  if (!vaultContext) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>VaultContext is undefined. Make sure CollaborativeTradingWidget is wrapped in a VaultProvider.</AlertDescription></Alert>;
  }

  const { vaults, createVault, joinVault, closeVault } = vaultContext;

  const [user, setUser] = useState<User | null>(null);
  const [widgetState, setWidgetState] = useState<'create' | 'manage' | 'join'>('create');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (vaults.length > 0) {
      setWidgetState('manage');
    } else if (user?.uid) {
      setWidgetState('create');
    } else {
      setWidgetState('join');
    }
  }, [vaults, user]);

  const initiatePayment = async (amount: number): Promise<boolean> => {
    // Simulating a payment process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Always return true for mock payment
      }, 2000);
    });
  };

  const handleCreateVault = async (vaultData: Partial<Vault>) => {
    if (!user) {
      setError('You must be logged in to create a vault.');
      return;
    }

    try {
      const newVault: Vault = {
        ...vaultData,
        id: Date.now().toString(),
        creatorId: user.uid,
        participants: [{ userId: user.uid, amount: vaultData.investmentAmount || 0 }],
        createdAt: new Date(),
      } as Vault;
      
      const docRef = await addDoc(collection(db, 'vaults'), newVault);
      createVault({ ...newVault, id: docRef.id });
      setWidgetState('manage');
    } catch (error) {
      console.error('Error creating vault:', error);
      setError('Error creating vault. Please try again.');
    }
  };

  const handleJoinVault = async (amount: number) => {
    if (user && vaults.length > 0) {
      try {
        await joinVault(vaults[0].id, user.uid, amount);
        setWidgetState('manage');
      } catch (error) {
        setError('Error joining vault. Please try again.');
        console.error('Error joining vault:', error);
      }
    }
  };

  const handleCloseVault = async () => {
    if (vaults.length > 0) {
      try {
        await closeVault(vaults[0].id);
        setWidgetState('create');
      } catch (error) {
        setError('Error closing vault. Please try again.');
        console.error('Error closing vault:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {widgetState === 'create' && (
          <VaultCreationPanel onCreateVault={handleCreateVault} onInitiatePayment={initiatePayment} />
        )}
        {widgetState === 'manage' && vaults.length > 0 && (
          <VaultManagementPanel vault={vaults[0]} onCloseVault={handleCloseVault} />
        )}
        {widgetState === 'join' && vaults.length > 0 && (
          <VaultJoinPanel vault={vaults[0]} onJoinVault={handleJoinVault} />
        )}
      </CardContent>
    </Card>
  );
};

const CollaborativeTradingWidget: React.FC = () => {
  return (
    <VaultProvider>
      <CollaborativeTradingWidgetInner />
    </VaultProvider>
  );
};

export default CollaborativeTradingWidget;
