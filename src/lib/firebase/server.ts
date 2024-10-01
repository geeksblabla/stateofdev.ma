import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const activeApps = getApps();
let serviceAccount = {};

// we are using multiple methods to load the service account
// because import.meta.env is not available while running the export-results script
// and process.env is not available with Vite on the server
if (import.meta.env?.FIREBASE_PROJECT_ID) {
  serviceAccount = {
    type: "service_account",
    project_id: import.meta.env.FIREBASE_PROJECT_ID,
    private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: import.meta.env.FIREBASE_PRIVATE_KEY,
    client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
    client_id: import.meta.env.FIREBASE_CLIENT_ID,
    auth_uri: import.meta.env.FIREBASE_AUTH_URI,
    token_uri: import.meta.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
    client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL
  };
} else if (process.env?.FIREBASE_PROJECT_ID) {
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID?.replace(/\\n/g, "\n"), // not sure why, but the private key is not working correctly without this in github actions
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };
} else {
  throw new Error("No Firebase project ID found");
}

const initApp = () => {
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
  });
};

export const app = activeApps.length === 0 ? initApp() : activeApps[0];
