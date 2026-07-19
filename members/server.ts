import express from 'express';

import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.ts';
import facultyRoutes from './routes/faculty.routes.ts';
import studentRoutes from './routes/student.routes.ts';
import { PORT } from './config/env.config.ts';

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/student', studentRoutes);

app.listen(PORT, () => {
  console.log(`Members service running on port ${PORT}`);
});