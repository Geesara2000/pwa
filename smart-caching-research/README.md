# Smart Caching in Progressive Web Apps: Research Workspace

This repository is a controlled environment for comparing three distinct caching and offline strategies in modern web applications.

## Project Structure
- **/backend**: Shared Laravel 11 API (MySQL). Identical for all experiments.
- **/frontend-version-a**: **Baseline** (Traditional Web App). No caching. No Service Worker.
- **/frontend-version-b**: **Fixed PWA**. Uses `StaleWhileRevalidate` for all API calls.
- **/frontend-version-c**: **Adaptive PWA**. Switches strategies based on Network and Battery status.

## Port Assignments
- **Backend API**: http://localhost:8000
- **Version A**: http://localhost:3001
- **Version B**: http://localhost:3002
- **Version C**: http://localhost:3003

## Getting Started

### 1. One-Time Installation
From the root directory:
```bash
npm run install-all
```

### 2. Database Setup
Ensure MySQL is running and a database named `smart_caching` exists. Then:
```bash
npm run db-setup
```

### 3. Running the Workspace
Open 4 terminal tabs and run one command in each:
```bash
npm run start-backend
npm run start-a
npm run start-b
npm run start-c
```

---

## Fair Testing Sequence

To compare the strategies accurately, follow this sequence:

### Round 1: Good Conditions
1. Open all three versions in separate tabs.
2. Verify all show identical product data from the backend.
3. Observe initial load times (all should be similar).

### Round 2: Offline Resilience (The "Subway" Test)
1. In Chrome DevTools, go to the **Network** tab for each version.
2. Set all to **Offline**.
3. Refresh Version A: Observe **failure** (Offline error).
4. Refresh Version B: Observe **success** (Loads cached products).
5. Refresh Version C: Observe **success** (Loads cached products).

### Round 3: Resource Constraint (The "Low Battery" Test)
1. In Version C DevTools -> Sensors, set Battery to **5%**.
2. Set Network to **Fast 3G**.
3. Observe the Version C badge switch to **Cache-First**.
4. Compare interaction speed between B (StaleWhileRevalidate) and C (CacheFirst). C should feel faster on subsequent clicks as it bypasses the network check entirely.

### Round 4: Offline Action Sync
1. Go **Offline** in Version C.
2. Add a product to the cart and click **Checkout**.
3. Observe the "Action Queued" notification.
4. Go back **Online**.
5. Verify the order appears in the backend database (`orders` table).
