import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Orbitron, monospace'
    }}>
      <h1 style={{
        fontSize: '4rem',
        background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        GOLDIUM
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#cccccc',
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        🎉 Chainzoku-Style DeFi Platform berhasil di-deploy!
      </p>
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: 'transparent',
        border: '2px solid #00ff41',
        borderRadius: '4px',
        color: '#00ff41',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
        Start Trading
      </div>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.1
      }} />
    </div>
  );
}

export default App;