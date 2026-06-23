import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Whitepaper from './Whitepaper.jsx';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found');
}

try {
  createRoot(rootEl).render(
    <React.StrictMode>
      <Whitepaper />
    </React.StrictMode>,
  );
} catch (error) {
  rootEl.innerHTML = `<pre style="padding:2rem;font-family:monospace;color:#ff6b6b">Failed to load docs: ${error.message}</pre>`;
  console.error(error);
}
