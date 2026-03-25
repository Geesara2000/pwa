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
- **Offline Behavior**: The product list should still appear if previously loaded.
- **Data Freshness**: You may notice prices or stock levels update slightly after a page refresh as the background sync completes.
