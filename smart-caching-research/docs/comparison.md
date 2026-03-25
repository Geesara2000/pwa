# Research Comparison Matrix

This table summarizes the core differences between the three experimental versions in the Smart Caching Research Workspace.

| Feature | Version A (Baseline) | Version B (Fixed PWA) | Version C (Adaptive PWA) |
| :--- | :--- | :--- | :--- |
| **Logic Type** | Traditional Web App | Fixed-Strategy PWA | Adaptive-Strategy PWA |
| **Service Worker** | ❌ None | ✅ Workbox (Auto) | ✅ Custom (Adaptive) |
| **Caching Strategy** | Browser Default | Stale-While-Revalidate | Dynamic (Network/Battery) |
| **Primary API Handler** | Network Only | Always SW Cache | Context-Aware SW Cache |
| **Offline Resilience** | ❌ None (Shows Error) | ✅ Browsing Only | ✅ Browsing + Action Queue |
| **Action Sync** | ❌ Manual (Requires Online) | ❌ Manual (Requires Online) | ✅ Auto (IndexedDB Sync) |
| **Network Triggers** | ❌ N/A | ❌ N/A | ✅ (2G, 3G, 4G detection) |
| **Battery Triggers** | ❌ N/A | ❌ N/A | ✅ (<20% detection) |
| **Experimental Goal** | Baseline Benchmark | Caching Benchmark | Strategic UX Benchmark |

## Research Design Verification

- **Shared State**: All versions use identical React components and CSS for pixel-perfect UI parity.
- **Shared Data**: All versions connect to the same Laravel API at `localhost:8000`.
- **Isolation**: Caching logic is isolated to `vite.config.js` and Service Worker files (`sw-adaptive.js`) to ensure no side-effects on the basic business logic.
- **Controlled Variable**: The only variable changing between tabs is the **Caching Strategy** and **Offline Sync Intelligence**.
