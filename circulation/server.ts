import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loanRoutes from './routes/loan.routes.ts';
import { PORT } from './config/env.config.ts';

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/loan', loanRoutes);

app.listen(PORT, () => {
  console.log(`Circulation service running on port ${PORT}`);
});