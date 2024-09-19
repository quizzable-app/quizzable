import "server-only";

import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { firebaseConfig } from "../config";

export const adminApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const adminAuth = getAuth(adminApp);
