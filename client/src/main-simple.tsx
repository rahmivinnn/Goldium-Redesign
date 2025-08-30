import { createRoot } from "react-dom/client";
import App from "./App-simple";

console.log('🚀 Goldium App Starting...');

const root = document.getElementById("root");
if (!root) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, rendering app...');
  createRoot(root).render(<App />);
}