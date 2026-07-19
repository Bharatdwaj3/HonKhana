import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bookRoutes from './routes/book.routes.ts';
import storageRoutes from './routes/storage.routes.ts';
import { PORT } from './config/env.config.ts';

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/storage', storageRoutes);

app.listen(PORT, () => {
  console.log(`Catalog service running on port ${PORT}`);
});