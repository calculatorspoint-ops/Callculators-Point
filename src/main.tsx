import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import './styles/mobile.css'; // Comprehensive mobile-first overrides
import './styles/mobile-overflow-killer.css'; // Forces min-width: 0 on all flex children to fix mobile squish
import './i18n';


const container = document.getElementById('root')!;

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
