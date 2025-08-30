import React, { useState, useEffect } from 'react';
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle, Crown, Shield } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'parameter' | 'treasury' | 'upgrade' | 'partnership';
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  timeLeft: number;
  proposer: string;
  createdAt: number;
  executionDate?: number;
}

interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalVotingPower: number;
  userVotingPower: number;
  participationRate: number;
}

export const DAOGovernance: React.FC = () => {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<{[key: string]: 'for' | 'against' | null}>({});
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('active');

  const [proposals] = useState<Proposal[]>([
    {
      id: 'prop-001',
      title: 'Increase Staking Rewards by 25%',
      description: 'Proposal to increase base staking rewards from 12% to 15% APY to attract more liquidity and strengthen the ecosystem.',
      type: 'parameter',
      status: 'active',
      votesFor: 2847392,
      votesAgainst: 456789,
      totalVotes: 3304181,
      quorum: 5000000,
      timeLeft: 172800, // 2 days in seconds
      proposer: 'GoldiumDAO',
      createdAt: Date.now() - 432000000, // 5 days ago
    },
    {
      id: 'prop-002',
      title: 'Treasury Allocation for Marketing',
      description: 'Allocate 500,000 GOLD tokens from treasury for Q1 2024 marketing initiatives and partnerships.',
      type: 'treasury',
      status: 'active',
      votesFor: 1892456,
      votesAgainst: 1234567,
      totalVotes: 3127023,
      quorum: 5000000,
      timeLeft: 345600, // 4 days
      proposer: 'MarketingTeam',
      createdAt: Date.now() - 259200000, // 3 days ago
    },
    {
      id: 'prop-003',
      title: 'Smart Contract Upgrade v2.0',
      description: 'Upgrade core smart contracts to v2.0 with improved gas efficiency and new yield farming mechanisms.',
      type: 'upgrade',
      status: 'passed',
      votesFor: 8947392,
      votesAgainst: 1052608,
      totalVotes: 10000000,
      quorum: 5000000,
      timeLeft: 0,
      proposer: 'DevTeam',
      createdAt: Date.now() - 864000000, // 10 days ago
      executionDate: Date.now() + 604800000 // 7 days from now
    },
    {
      id: 'prop-004',
      title: 'Partnership with DeFi Protocol X',
      description: 'Strategic partnership proposal with Protocol X for cross-chain liquidity and yield opportunities.',
      type: 'partnership',
      status: 'rejected',
      votesFor: 2134567,
      votesAgainst: 7865433,
      totalVotes: 10000000,
      quorum: 5000000,
      timeLeft: 0,
      proposer: 'PartnershipTeam',
      createdAt: Date.now() - 1296000000, // 15 days ago
    }
  ]);

  const [stats] = useState<GovernanceStats>({
    totalProposals: proposals.length,
    activeProposals: proposals.filter(p => p.status === 'active').length,
    passedProposals: proposals.filter(p => p.status === 'passed').length,
    totalVotingPower: 50000000,
    userVotingPower: 12500,
    participationRate: 67.8
  });

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return 'Ended';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff41';
      case 'passed': return '#00d4ff';
      case 'rejected': return '#ff0080';
      case 'pending': return '#ffff00';
      default: return '#cccccc';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'parameter': return Shield;
      case 'treasury': return Crown;
      case 'upgrade': return AlertCircle;
      case 'partnership': return Users;
      default: return Vote;
    }
  };

  const filteredProposals = proposals.filter(p => 
    filter === 'all' || p.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Governance Header */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333',
        borderRadius: '8px'
      }}>
        <h2 className="text-3xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
        }}>
          🏛️ DAO Governance
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Proposals', value: stats.totalProposals.toString(), color: '#00ff41' },
            { label: 'Active Votes', value: stats.activeProposals.toString(), color: '#ffff00' },
            { label: 'Participation Rate', value: `${stats.participationRate}%`, color: '#00d4ff' },
            { label: 'Your Voting Power', value: `${(stats.userVotingPower / 1000).toFixed(1)}K`, color: '#8000ff' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold mb-1" style={{
                color: stat.color,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 5px ${stat.color}50`
              }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400" style={{
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="cyber-card p-1 flex" style={{
          background: 'rgba(21, 21, 21, 0.95)',
          border: '2px solid #333333',
          borderRadius: '8px'
        }}>
          {(['all', 'active', 'passed', 'rejected'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 font-medium transition-all duration-300`}
              style={{
                background: filter === filterType ? 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)' : 'transparent',
                color: filter === filterType ? '#0a0a0a' : '#cccccc',
                border: filter === filterType ? '1px solid #00ff41' : '1px solid transparent',
                borderRadius: '4px',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const IconComponent = getTypeIcon(proposal.type);
          const votingProgress = (proposal.totalVotes / proposal.quorum) * 100;
          const supportPercentage = (proposal.votesFor / proposal.totalVotes) * 100;
          
          return (
            <div key={proposal.id} className="cyber-card p-6 hover:border-green-400 transition-all duration-300" style={{
              background: 'rgba(21, 21, 21, 0.95)',
              border: `2px solid ${selectedProposal === proposal.id ? '#00ff41' : '#333333'}`,
              borderRadius: '8px'
            }}>
              {/* Proposal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                    background: `${getStatusColor(proposal.status)}20`,
                    border: `2px solid ${getStatusColor(proposal.status)}`
                  }}>
                    <IconComponent className="w-6 h-6" style={{color: getStatusColor(proposal.status)}} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white" style={{
                        fontFamily: 'Orbitron, monospace'
                      }}>
                        {proposal.title}
                      </h3>
                      
                      <span className="px-2 py-1 rounded text-xs font-bold" style={{
                        background: `${getStatusColor(proposal.status)}20`,
                        color: getStatusColor(proposal.status),
                        border: `1px solid ${getStatusColor(proposal.status)}`,
                        fontFamily: 'JetBrains Mono, monospace',
                        textTransform: 'uppercase'
                      }}>
                        {proposal.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3" style={{
                      fontFamily: 'Rajdhani, monospace'
                    }}>
                      {proposal.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      <span>By: {proposal.proposer}</span>
                      <span>•</span>
                      <span>{proposal.status === 'active' ? `Ends in: ${formatTimeLeft(proposal.timeLeft)}` : 'Voting Ended'}</span>
                    </div>
                  </div>
                </div>

                {proposal.status === 'active' && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-bold" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {formatTimeLeft(proposal.timeLeft)}
                    </span>
                  </div>
                )}
              </div>

              {/* Voting Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400" style={{
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase'
                  }}>
                    Voting Progress
                  </span>
                  <span className="text-sm" style={{
                    color: votingProgress >= 100 ? '#00ff41' : '#ffff00',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {votingProgress.toFixed(1)}% / 100% Quorum
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 rounded-full"
                    style={{
                      width: `${Math.min(votingProgress, 100)}%`,
                      background: votingProgress >= 100 ? 
                        'linear-gradient(90deg, #00ff41 0%, #00d4ff 100%)' : 
                        'linear-gradient(90deg, #ffff00 0%, #ff4000 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Vote Distribution */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="cyber-card p-3" style={{
                  background: 'rgba(0, 255, 65, 0.1)',
                  border: '1px solid rgba(0, 255, 65, 0.3)'
                }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      For
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-400" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {(proposal.votesFor / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-gray-400" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {supportPercentage.toFixed(1)}%
                  </div>
                </div>

                <div className="cyber-card p-3" style={{
                  background: 'rgba(255, 0, 128, 0.1)',
                  border: '1px solid rgba(255, 0, 128, 0.3)'
                }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-bold text-pink-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Against
                    </span>
                  </div>
                  <div className="text-xl font-bold text-pink-400" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {(proposal.votesAgainst / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-gray-400" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {(100 - supportPercentage).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Voting Interface */}
              {proposal.status === 'active' && (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setUserVote({...userVote, [proposal.id]: 'for'})}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                      userVote[proposal.id] === 'for' ? 'scale-105' : ''
                    }`}
                    style={{
                      background: userVote[proposal.id] === 'for' ? 
                        'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)' : 
                        'transparent',
                      border: '2px solid #00ff41',
                      color: userVote[proposal.id] === 'for' ? '#0a0a0a' : '#00ff41',
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Vote For
                  </button>
                  
                  <button 
                    onClick={() => setUserVote({...userVote, [proposal.id]: 'against'})}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                      userVote[proposal.id] === 'against' ? 'scale-105' : ''
                    }`}
                    style={{
                      background: userVote[proposal.id] === 'against' ? 
                        'linear-gradient(135deg, #ff0080 0%, #8000ff 100%)' : 
                        'transparent',
                      border: '2px solid #ff0080',
                      color: userVote[proposal.id] === 'against' ? '#ffffff' : '#ff0080',
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Vote Against
                  </button>
                </div>
              )}

              {/* Execution Info for Passed Proposals */}
              {proposal.status === 'passed' && proposal.executionDate && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Execution Scheduled
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    This proposal will be executed on {new Date(proposal.executionDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Governance Power */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase'
        }}>
          ⚡ Your Governance Power
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(0, 255, 65, 0.1)',
            border: '1px solid rgba(0, 255, 65, 0.3)'
          }}>
            <div className="text-2xl font-bold text-green-400 mb-2" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {(stats.userVotingPower / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Voting Power
            </div>
          </div>

          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <div className="text-2xl font-bold text-blue-400 mb-2" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {((stats.userVotingPower / stats.totalVotingPower) * 100).toFixed(3)}%
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Total Influence
            </div>
          </div>

          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(128, 0, 255, 0.1)',
            border: '1px solid rgba(128, 0, 255, 0.3)'
          }}>
            <div className="text-2xl font-bold text-purple-400 mb-2" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {Object.keys(userVote).length}
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Votes Cast
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="cyber-button-primary py-3 px-8 transition-all duration-300" style={{
            background: 'linear-gradient(135deg, #8000ff 0%, #ff0080 100%)',
            border: '2px solid #8000ff',
            color: '#ffffff',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            borderRadius: '4px'
          }}>
            <Vote className="w-4 h-4 inline mr-2" />
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  );
};