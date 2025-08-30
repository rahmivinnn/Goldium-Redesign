import { createRoot } from "react-dom/client";
import { Buffer } from 'buffer';
import App from "./App";
import "./index.css";
import "./chainzoku-styles.css";

// Global Buffer polyfill for browser compatibility with Solana libraries
(window as any).Buffer = Buffer;

console.log('🚀 Goldium App Starting...');

// Error boundary component
import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('❌ React Error Boundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('❌ Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#ff0080',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'monospace',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1>⚠️ APPLICATION ERROR</h1>
          <p>Something went wrong. Check console for details.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '2px solid #ff0080',
              color: '#ff0080',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            RELOAD
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById("root");
if (!root) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, rendering app...');
  try {
    createRoot(root).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log('✅ App rendered successfully!');
  } catch (error) {
    console.error('❌ Failed to render app:', error);
  }
}
