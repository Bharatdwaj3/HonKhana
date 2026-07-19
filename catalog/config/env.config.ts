import 'dotenv/config';

export const PORT = process.env.PORT || 4001;
export const JWT_ACC_SECRECT = process.env.JWT_ACC_SECRECT as string;
export const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET as string;



if (!JWT_ACC_SECRECT) throw new Error('JWT_ACC_SECRECT is missing from .env');
if (!INTERNAL_SERVICE_SECRET) throw new Error('INTERNAL_SERVICE_SECRET is missing from .env');