"use client";

import { firebaseConfig, useEmulators } from "../config";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firebaseDatabase = getDatabase(firebaseApp);

if (useEmulators) {
  connectDatabaseEmulator(firebaseDatabase, "127.0.0.1", 9000);
}
