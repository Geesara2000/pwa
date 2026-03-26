import { openDB } from 'idb';

const DB_NAME = 'research-offline-queue-b';
const STORE_NAME = 'actions';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const queueAction = async (type, payload) => {
  const db = await dbPromise;
  const action = {
    type,
    payload,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  const id = await db.add(STORE_NAME, action);
  console.log(`[Research-B] Queued offline action: ${type}`, action);
  return id;
};

export const getPendingActions = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const clearAction = async (id) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};

export const processQueue = async (syncCallback) => {
  const actions = await getPendingActions();
  if (actions.length === 0) return;

  console.log(`[Research-B] Attempting to sync ${actions.length} actions...`);
  
  for (const action of actions) {
    try {
      await syncCallback(action);
      await clearAction(action.id);
      console.log(`[Research-B] Successfully synced action: ${action.type}`);
    } catch (e) {
      console.error(`[Research-B] Failed to sync action ${id}:`, e);
      break; 
    }
  }
};
