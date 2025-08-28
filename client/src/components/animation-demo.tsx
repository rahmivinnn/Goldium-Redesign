import React, { useState } from 'react';
import { AnimatedCharacter, useAnimatedCharacter } from '@/components/animated-characters';
import { ModernAnimatedButton } from '@/components/modern-transaction-animation';

export function AnimationDemo() {
  const { isPlaying, playAnimation, stopAnimation } = useAnimatedCharacter();
  const [selectedCharacter, setSelectedCharacter] = useState<'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8'>('K1');

  const characters = [
    { id: 'K1', name: 'Gold Sparkle', description: 'Sparkle emas untuk staking', type: 'stake' },
    { id: 'K2', name: 'Coin Flip', description: 'Flip koin untuk swap', type: 'swap' },
    { id: 'K3', name: 'Diamond Shine', description: 'Shine berlian untuk success', type: 'success' },
    { id: 'K4', name: 'Fire Burst', description: 'Ledakan api untuk send', type: 'send' },
    { id: 'K5', name: 'Electric Spark', description: 'Spark listrik untuk error', type: 'error' },
    { id: 'K6', name: 'Rainbow Trail', description: 'Trail pelangi untuk celebration', type: 'random' },
    { id: 'K7', name: 'Crystal Glow', description: 'Glow kristal untuk magic', type: 'random' },
    { id: 'K8', name: 'Golden Explosion', description: 'Ledakan emas untuk buy', type: 'buy' }
  ];

  const handlePlayAnimation = (characterId: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8') => {
    setSelectedCharacter(characterId);
    playAnimation(characterId);
  };

  const handleButtonClick = (type: string) => {
    const character = characters.find(c => c.type === type);
    if (character) {
      handlePlayAnimation(character.id as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              K1-K8 Animation Characters
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Demo animasi karakter untuk transaksi Goldium
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-yellow-400/30 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-400/60 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {character.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {character.description}
                </p>
                <ModernAnimatedButton
                  onClick={() => handlePlayAnimation(character.id as any)}
                  animationType={character.type as any}
                  variant="primary"
                  className="w-full"
                >
                  Play {character.id}
                </ModernAnimatedButton>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction Buttons */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-yellow-400/30 rounded-2xl p-8 backdrop-blur-xl mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Test Transaction Animations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ModernAnimatedButton
              onClick={() => handleButtonClick('swap')}
              animationType="swap"
              variant="primary"
              className="w-full"
            >
              🔄 Swap
            </ModernAnimatedButton>
            <ModernAnimatedButton
              onClick={() => handleButtonClick('send')}
              animationType="send"
              variant="secondary"
              className="w-full"
            >
              📤 Send
            </ModernAnimatedButton>
            <ModernAnimatedButton
              onClick={() => handleButtonClick('stake')}
              animationType="stake"
              variant="success"
              className="w-full"
            >
              🔒 Stake
            </ModernAnimatedButton>
            <ModernAnimatedButton
              onClick={() => handleButtonClick('buy')}
              animationType="buy"
              variant="warning"
              className="w-full"
            >
              💰 Buy
            </ModernAnimatedButton>
          </div>
        </div>

        {/* Manual Character Controls */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-yellow-400/30 rounded-2xl p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Manual Character Controls
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => handlePlayAnimation(character.id as any)}
                className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/30 hover:border-yellow-400/60 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
              >
                {character.id}
              </button>
            ))}
          </div>
        </div>

        {/* Character Animation Display */}
        <AnimatedCharacter
          type={selectedCharacter}
          isPlaying={isPlaying}
          onAnimationComplete={stopAnimation}
          size="xl"
        />
      </div>
    </div>
  );
} 