import { getFirestore } from "firebase-admin/firestore";
import { app } from "./server";
import type { UserRecord } from "firebase-admin/auth";

const db = getFirestore(app);

const getResults = () => db.collection("results");

type Answers = {
  [key: string]: number | number[] | null;
};

export const saveAnswers = (userId: string, data: Answers) => {
  return getResults().doc(userId).set(data, { merge: true });
};

export const initUserSubmission = (user: UserRecord) => {
  const userData = {
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime
  };
  return getResults().doc(user.uid).set(userData, { merge: true });
};
