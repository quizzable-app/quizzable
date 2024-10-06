"use client";
/* eslint-disable no-unused-vars */
import {
  getAuth,
  connectAuthEmulator,
  signInWithCustomToken,
} from "firebase/auth";
import { useEmulators } from "../config";
import { firebaseApp } from "./app";

declare global {
  interface Window {
    signInWithCustomToken: (
      token: string
    ) => ReturnType<typeof signInWithCustomToken>;
  }
}

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

if (typeof window !== "undefined") {
  window.signInWithCustomToken = (token: string) =>
    signInWithCustomToken(firebaseAuth, token);
}
