import { getFirestore } from "firebase-admin/firestore";
import { app } from "./server";
import type { UserRecord } from "firebase-admin/auth";

const db = getFirestore(app);

const getResults = () => db.collection("results");

type Answers = {
  [key: string]: number | string | number[] | null;
};

type ExportedResult = {
  results: (Answers & { userId: string })[];
};

export const exportResults = async () => {
  const results = await getResults().get();
  return {
    results: results.docs.map((doc) => ({ ...doc.data(), userId: doc.id }))
  } as ExportedResult;
};

export const saveAnswers = (userId: string, data: Answers) => {
  const updatedData = {
    ...data,
    lastUpdated: new Date().toISOString()
  };

  return getResults().doc(userId).set(updatedData, { merge: true });
};

export const initUserSubmission = (user: UserRecord) => {
  const userData = {
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime
  };
  return getResults().doc(user.uid).set(userData, { merge: true });
};
