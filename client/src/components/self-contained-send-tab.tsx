import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SelfContainedSendTab() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      console.log(`Mock send: ${amount} to ${recipient}`);
      // Mock implementation
      setTimeout(() => {
        setIsLoading(false);
        setAmount('');
        setRecipient('');
      }, 1000);
    } catch (error) {
      console.error('Send failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <Button 
          onClick={handleSend}
          disabled={!amount || !recipient || isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </CardContent>
    </Card>
  );
}