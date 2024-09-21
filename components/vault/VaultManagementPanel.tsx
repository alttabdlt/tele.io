import React from 'react';
import { Button } from "@/components/ui/button";
import { Vault } from '../../types/Vault';

interface VaultManagementPanelProps {
  vault: Vault;
  onCloseVault: () => void;
}

const VaultManagementPanel: React.FC<VaultManagementPanelProps> = ({ vault, onCloseVault }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{vault.name}</h2>
      <p>Investment Amount: ${vault.investmentAmount}</p>
      <p>Trade Time: {vault.tradeTime.toLocaleString()}</p>
      <p>Participants: {vault.participants.length}</p>
      <Button onClick={onCloseVault} variant="destructive" className="w-full">Close Vault</Button>
    </div>
  );
};

export default VaultManagementPanel;