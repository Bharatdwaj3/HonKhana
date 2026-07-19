import 'dotenv/config';

export const PORT = process.env.PORT || 4002;
export const JWT_ACC_SECRECT = process.env.JWT_ACC_SECRECT as string;
export const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL as string;
export const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET as string;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

if (!JWT_ACC_SECRECT) throw new Error('JWT_ACC_SECRECT is missing from .env');
if (!CATALOG_SERVICE_URL) throw new Error('CATALOG_SERVICE_URL is missing from .env');
if (!INTERNAL_SERVICE_SECRET) throw new Error('INTERNAL_SERVICE_SECRET is missing from .env');