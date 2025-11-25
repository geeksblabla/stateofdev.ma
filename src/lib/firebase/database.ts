import type { UserRecord } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getActiveApp } from "./server";

const db = () => getFirestore(getActiveApp());

const getResults = () => db().collection("results");

interface Answers {
  [key: string]: number | string | number[] | null;
}

interface ExportedResult {
  results: (Answers & { userId: string })[];
}

export async function exportResults() {
  const results = await getResults().get();
  return {
    results: results.docs.map(doc => ({ ...doc.data(), userId: doc.id }))
  } as ExportedResult;
}

export async function saveAnswers(userId: string, data: Answers) {
  const updatedData = {
    ...data,
    lastUpdated: new Date().toISOString()
  };

  return getResults().doc(userId).set(updatedData, { merge: true });
}

export async function initUserSubmission(user: UserRecord) {
  const userData = {
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime
  };
  return getResults().doc(user.uid).set(userData, { merge: true });
}
