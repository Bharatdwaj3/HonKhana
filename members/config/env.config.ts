import 'dotenv/config';

export const PORT = process.env.PORT || 4003;
export const JWT_ACC_SECRECT = process.env.JWT_ACC_SECRECT as string;
export const JWT_ACC_EXPIRES_IN = process.env.JWT_ACC_EXPIRES_IN || '15m';
export const JWT_REF_SECRECT = process.env.JWT_REF_SECRECT as string;
export const JWT_REF_EXPIRES_IN = process.env.JWT_REF_EXPIRES_IN || '7d';

if (!JWT_ACC_SECRECT) throw new Error('JWT_ACC_SECRECT is missing from .env');
if (!JWT_REF_SECRECT) throw new Error('JWT_REF_SECRECT is missing from .env');