import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

let isReloading = false;

// Register the adaptive service worker immediately
registerSW({ immediate: true });

// Ensure the page reloads once when the SW takes control for the first time
// This guarantees the vital initial API calls are intercepted and cached.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isReloading) {
      isReloading = true;
      console.log('[SW-Research] Service worker has successfully taken control. Reloading page to safely cache initial fetches...');
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
