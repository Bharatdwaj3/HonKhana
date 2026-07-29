import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loanRoutes from './routes/loan.routes.ts';
import { PORT, FRONTEND_ORIGIN } from './config/env.config.ts';
import { startReminderCron } from './jobs/reminder.job.ts';

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/loan', loanRoutes);

app.listen(PORT, () => {
  console.log(`Circulation service running on port ${PORT}`);
  
  // Start the daily overdue/due-soon reminder check
  startReminderCron();
});
