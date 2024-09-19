"use client";

import { useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "@services/firebase/client/auth";
import { auth } from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default function SignInButton() {
  useEffect(() => {
    const uiConfig = {
      signInFlow: "popup",
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/dashboard",
    };

    const ui = auth.AuthUI.getInstance() ?? new auth.AuthUI(firebaseAuth);
    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return <div id="firebaseui-auth-container"></div>;
}
