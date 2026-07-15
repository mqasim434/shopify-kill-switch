import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import storesRouter from './routes/stores.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/stores', storesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`shopify-kill-switch listening on http://localhost:${PORT}`);
});
