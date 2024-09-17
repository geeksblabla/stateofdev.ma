import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const activeApps = getApps();

const serviceAccount = {
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

const initApp = () => {
  if (import.meta.env.PROD) {
    console.info("PROD env detected. Using default service account.");
    // Use default config in firebase functions. Should be already injected in the server by Firebase.
    return initializeApp();
  }
  console.info("Loading service account from env.");
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
  });
};

export const app = activeApps.length === 0 ? initApp() : activeApps[0];
