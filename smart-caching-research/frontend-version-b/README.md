# Frontend Version B: Fixed-Strategy PWA

This is the **Fixed-Strategy PWA Version** for the smart-caching research project. It uses a consistent, non-adaptive caching strategy for all network requests.

## Role in Research
- Represents a "Standard PWA" implementation.
- Uses `StaleWhileRevalidate` as the primary strategy for API responses.
- Used to compare against the traditional version (A) and the adaptive version (C).

## Caching Strategy
- **App Shell**: Precached for offline accessibility.
- **API Responses (`/api/*`)**: `StaleWhileRevalidate`
    - Fast: Returns cached data immediately.
    - Updated: Background fetch ensures the next visit has fresh data.
    - Offline-Capable: Works even when the backend is unreachable (serves last known state).

## Setup & Installation

### 1. Install Dependencies
```bash
cd frontend-version-b
npm install
```

### 2. Run Development Server
```bash
npm run dev -- --port 5174
```
*Port 5174 is reserved for the fixed PWA version.*

## Research Observations
- **First-Refresh Caching Verification**:
    - Clear site data (DevTools > Application > Clear storage).
    - Open the app online. The page will auto-reload once the SW takes control.
    - Refresh the page *once*.
    - Open Chrome DevTools > Application > Cache Storage.
    - Confirm `api-products-cache` already contains the product list data.
    - Switch DevTools Network to Offline.
    - Refresh again; the cached product data must display immediately.
- **Data Age Tracking**: 
    - The UI displays exactly how old the cached data is.
    - Note: This version uses `Stale-While-Revalidate`. You may see it briefly show "Source: cache" and then update to fresh network data once the background fetch completes.
- **Performance Logs**: Check console for `[SW-Research]` and `[RESEARCH_DATA_AGE]` metrics.
