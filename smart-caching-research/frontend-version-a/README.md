# Frontend Version A: Traditional Web App

This is the **Baseline Control Version** for the smart-caching research project. It is a traditional React application with no service worker, no manifest, and no offline capabilities.

## Role in Research
- Represents the "Standard" web experience.
- Used to benchmark network-dependent performance and traditional failure states (offline).

## Setup & Installation

### 1. Install Dependencies
```bash
cd frontend-version-a
npm install
```

### 2. Run Development Server
```bash
npm run dev -- --port 5173
```
*Port 5173 is reserved for the traditional version.*

## Features
- **Product Catalog**: Fetched directly from the Laravel API on every load.
- **Dynamic Routing**: Uses React Router for deep linking.
- **Cart Management**: In-memory state (lost on refresh).
- **Simulated Checkout**: Posts order data to the shared backend.

## Expected Behavior
- **Offline**: Will show "Failed to fetch" errors.
- **Reload**: Cart state is cleared.
- **Caching**: Standard browser caching only (no intentional service worker cache).
