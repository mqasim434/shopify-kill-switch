import { Router } from 'express';
import { storesCollection } from '../firebase.js';
import { normalizeStoreUrl, toDocId } from '../utils/storeUrl.js';

const router = Router();

/**
 * POST /stores
 * Body: { storeUrl: string, enabled: boolean }
 * Upserts a store kill-switch flag.
 */
router.post('/', async (req, res) => {
  try {
    const { storeUrl, enabled } = req.body ?? {};

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    const normalized = normalizeStoreUrl(storeUrl);
    const docId = toDocId(normalized);
    const payload = {
      storeUrl: normalized,
      enabled,
      updatedAt: new Date().toISOString(),
    };

    await storesCollection.doc(docId).set(payload, { merge: true });

    return res.status(200).json(payload);
  } catch (err) {
    const status = err.message?.includes('required') ? 400 : 500;
    return res.status(status).json({ error: err.message || 'Failed to save store' });
  }
});

/**
 * GET /stores
 * Returns all stores: [{ storeUrl, enabled }, ...]
 *
 * GET /stores?storeUrl=example.myshopify.com
 * Returns { storeUrl, enabled } for the given store URL.
 */
router.get('/', async (req, res) => {
  try {
    const storeUrl = req.query.storeUrl;

    if (!storeUrl) {
      const snap = await storesCollection.get();
      const stores = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          storeUrl: data.storeUrl,
          enabled: data.enabled === true,
        };
      });
      return res.status(200).json({ stores, count: stores.length });
    }

    const normalized = normalizeStoreUrl(String(storeUrl));
    const docId = toDocId(normalized);
    const snap = await storesCollection.doc(docId).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Store not found', storeUrl: normalized });
    }

    const data = snap.data();
    return res.status(200).json({
      storeUrl: data.storeUrl,
      enabled: data.enabled === true,
    });
  } catch (err) {
    const status = err.message?.includes('required') || err.message?.includes('Invalid')
      ? 400
      : 500;
    return res.status(status).json({ error: err.message || 'Failed to fetch store' });
  }
});

/**
 * GET /stores/status?storeUrl=...
 * Lightweight: returns only true/false (or 404).
 */
router.get('/status', async (req, res) => {
  try {
    const storeUrl = req.query.storeUrl;
    if (!storeUrl) {
      return res.status(400).json({ error: 'storeUrl query param is required' });
    }

    const normalized = normalizeStoreUrl(String(storeUrl));
    const docId = toDocId(normalized);
    const snap = await storesCollection.doc(docId).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Store not found', enabled: null });
    }

    return res.status(200).json({ enabled: snap.data().enabled === true });
  } catch (err) {
    const status = err.message?.includes('required') || err.message?.includes('Invalid URL')
      ? 400
      : 500;
    return res.status(status).json({ error: err.message || 'Failed to fetch status' });
  }
});

export default router;
