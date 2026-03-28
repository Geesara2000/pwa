# Frontend Version C: Adaptive PWA

This is the **Experimental Adaptive Version** for the smart-caching research project. It dynamically adjust its behavior based on environmental signals.

## Role in Research
- Demonstrates advanced PWA capabilities (Adaptive Caching & Offline Action Sync).
- Evaluates whether environmental awareness improves UX in resource-constrained scenarios.

## Adaptive Logic
- **Triggers**:
    - **Network**: Uses Network Information API to detect 2G/3G speeds.
    - **Battery**: Uses Battery Status API to detect levels < 20%.
- **Caching Shifts**:
    - **Good Conditions**: `NetworkFirst` (Prefers fresh data).
    - **Low Resource/Poor Network**: `CacheFirst` (Prefers speed and energy saving).

## Offline Synchronization
- **IndexedDB Queue**: Stores `add-to-cart` and `checkout` actions when the device is offline.
- **Auto-Reconciliation**: Automatically syncs queued actions to the Laravel backend as soon as the `online` event is detected.

## Setup & Installation

### 1. Install Dependencies
```bash
cd frontend-version-c
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev -- --port 5175
```
*Port 5175 is reserved for the adaptive version.*

## Research Evaluation Steps
1. **Network Throttling**: Use Chrome DevTools to set network to "Fast 3G". Observe the status badge switch to `Cache-First`.
2. **Battery Simulation**: Use DevTools -> More Tools -> Sensors to simulate < 20% battery. Observe strategy switch.
3. **Data Age Tracking**: 
    - Click any product or stay on the Home page.
    - First load: `Source: network` and `Data Age: 0.00 min`.
    - Refresh: `Source: cache` and `Data Age: X.XX min` (increments based on when it was first cached).
    - Checks: Verify console logs start with `[RESEARCH_DATA_AGE]`.
4. **Offline Mode**: 
    - Go offline.
    - Search for products (should load from cache).
    - Add to cart and "Checkout".
    - Go back online.
    - Check Laravel logs (`storage/logs/laravel.log`) or the database to see the synced order.
