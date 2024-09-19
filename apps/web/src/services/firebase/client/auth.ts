"use client";

import { getAuth, connectAuthEmulator } from "firebase/auth";
import { useEmulators } from "../config";
import { firebaseApp } from "./app";

export const firebaseAuth = getAuth(firebaseApp);
if (useEmulators) {
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099");
}

export async function signOut() {
  try {
    return firebaseAuth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
