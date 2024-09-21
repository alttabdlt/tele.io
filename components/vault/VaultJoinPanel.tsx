import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Vault } from '../../types/Vault';

interface VaultJoinPanelProps {
  vault: Vault;
  onJoinVault: (amount: number) => void;
}

const VaultJoinPanel: React.FC<VaultJoinPanelProps> = ({ vault, onJoinVault }) => {
  const [joinAmount, setJoinAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    setError(null);
    const amount = parseFloat(joinAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid investment amount.');
      return;
    }
    onJoinVault(amount);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Join Vault: {vault.name}</h2>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <p>Required Investment: ${vault.investmentAmount}</p>
      <p>Trade Time: {vault.tradeTime.toLocaleString()}</p>
      <div className="space-y-2">
        <Label htmlFor="join-amount">Your Investment Amount</Label>
        <Input
          id="join-amount"
          type="number"
          value={joinAmount}
          onChange={(e) => setJoinAmount(e.target.value)}
          placeholder="Enter your investment amount"
        />
      </div>
      <Button onClick={handleJoin} className="w-full">Join Vault</Button>
    </div>
  );
};

export default VaultJoinPanel;
