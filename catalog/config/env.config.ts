import 'dotenv/config';

export const PORT = process.env.PORT || 4001;
export const JWT_ACC_SECRECT = process.env.JWT_ACC_SECRECT as string;
export const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET as string;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

export const Fbase_project_id = process.env.Fbase_project_id || 'demo-project';
export const Fbase_private_key_id = process.env.Fbase_private_key_id || 'demo-private-key-id';
export const Fbase_client_email = process.env.Fbase_client_email || 'demo@demo-project.iam.gserviceaccount.com';
export const Fbase_client_id = process.env.Fbase_client_id || 'demo-client-id';
export const Fbase_auth_uri = process.env.Fbase_auth_uri || 'https://accounts.google.com/o/oauth2/auth';
export const Fbase_token_uri = process.env.Fbase_token_uri || 'https://oauth2.googleapis.com/token';
export const Fbase_auth_provider_x509_cert_url = process.env.Fbase_auth_provider_x509_cert_url || 'https://www.googleapis.com/oauth2/v1/certs';
export const Fbase_client_x509_cert_url = process.env.Fbase_client_x509_cert_url || 'https://www.googleapis.com/robot/v1/metadata/x509/demo';
export const Fbase_universe_domain = process.env.Fbase_universe_domain || 'googleapis.com';

if (!JWT_ACC_SECRECT) throw new Error('JWT_ACC_SECRECT is missing from .env');
if (!INTERNAL_SERVICE_SECRET) throw new Error('INTERNAL_SERVICE_SECRET is missing from .env');
