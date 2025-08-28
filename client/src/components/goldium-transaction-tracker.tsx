import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, RefreshCw, Search, Filter, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { goldiumTracker, GoldiumTransaction } from '@/lib/goldium-contract-tracker';

export function GoldiumTransactionTracker() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<GoldiumTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<GoldiumTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Load transactions and setup listener
  useEffect(() => {
    loadTransactions();
    setupTransactionListener();
    
    // Refresh transactions every 30 seconds
    const interval = setInterval(loadTransactions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter transactions when search or type changes
  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, selectedType]);

  // Load transactions from tracker
  const loadTransactions = () => {
    const txList = goldiumTracker.getTransactions();
    setTransactions(txList);
    
    // Calculate stats
    const transactionStats = goldiumTracker.getTransactionStats();
    setStats(transactionStats);
  };

  // Setup transaction listener
  const setupTransactionListener = () => {
    goldiumTracker.addListener((newTransaction) => {
      console.log('🆕 New transaction detected:', newTransaction);
      
      // Add to transactions list
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Show toast notification
      toast({
        title: `New ${newTransaction.type} Transaction`,
        description: `${newTransaction.amount} ${newTransaction.tokenFrom} → ${newTransaction.tokenTo}`,
      });
    });
  };

  // Filter transactions
  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.txSignature.toLowerCase().includes(query) ||
        tx.walletAddress.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  };

  // Refresh transactions
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      loadTransactions();
      toast({
        title: "Transactions Refreshed",
        description: "Latest transactions loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export transactions
  const handleExport = () => {
    try {
      const jsonData = goldiumTracker.exportTransactions();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goldium-transactions-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Transactions Exported",
        description: "Transaction data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export transactions",
        variant: "destructive",
      });
    }
  };

  // Clear transactions
  const handleClear = () => {
    goldiumTracker.clearTransactions();
    setTransactions([]);
    setFilteredTransactions([]);
    
    toast({
      title: "Transactions Cleared",
      description: "All transactions have been cleared",
    });
  };

  // Get transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap': return '🔄';
      case 'send': return '📤';
      case 'stake': return '🔒';
      case 'unstake': return '🔓';
      case 'buy_gold': return '💰';
      case 'sell_gold': return '💸';
      default: return '📋';
    }
  };

  // Get transaction type color
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'send': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'stake': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'unstake': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'buy_gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'sell_gold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return amount.toFixed(6);
  };

  // Truncate address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-yellow-400">Goldium Transaction Tracker</h2>
          <p className="text-yellow-200/70">Monitor all transactions on the Goldium contract</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="powerful-button"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="border-red-400/30 text-red-400 hover:bg-red-400/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="powerful-card">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.total}</div>
                <div className="text-sm text-yellow-200/70">Total Transactions</div>
              </div>
            </CardContent>
          </Card>
          <Card className="powerful-card">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.byType.swap || 0}</div>
                <div className="text-sm text-green-200/70">Swaps</div>
              </div>
            </CardContent>
          </Card>
          <Card className="powerful-card">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.byType.stake || 0}</div>
                <div className="text-sm text-blue-200/70">Stakes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="powerful-card">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{formatAmount(stats.totalVolume)}</div>
                <div className="text-sm text-purple-200/70">Total Volume</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="powerful-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 powerful-input"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-yellow-400 w-4 h-4" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-800/50 border border-yellow-400/30 text-yellow-400 rounded-md px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="swap">Swap</option>
                <option value="send">Send</option>
                <option value="stake">Stake</option>
                <option value="unstake">Unstake</option>
                <option value="buy_gold">Buy GOLD</option>
                <option value="sell_gold">Sell GOLD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-yellow-400">
            Recent Transactions ({filteredTransactions.length})
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <Card className="powerful-card">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-lg">No transactions found</div>
              <div className="text-gray-500 text-sm mt-2">
                {searchQuery || selectedType !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Transactions will appear here as they are detected'
                }
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx, index) => (
              <Card key={tx.txSignature} className="powerful-card hover:scale-[1.02] transition-transform">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTransactionColor(tx.type)}>
                            {tx.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-yellow-200 mt-1">
                          {formatAmount(tx.amount)} {tx.tokenFrom} → {tx.tokenTo}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          From: {truncateAddress(tx.walletAddress)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => window.open(tx.solscanUrl, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Solscan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 