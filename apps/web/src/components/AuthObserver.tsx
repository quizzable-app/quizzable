"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "src/store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@services/firebase/client/auth";
import { setCookie, deleteCookie } from "cookies-next";

export function AuthObserver() {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (firebaseUser) {
          const { photoURL, email, displayName, uid } = firebaseUser;
          const { claims, expirationTime, token } =
            await firebaseUser.getIdTokenResult();

          const { userId, roles } = claims;
          setCookie("id_token", token, {
            expires: new Date(expirationTime),
            sameSite: "lax",
            secure: true,
          });

          setUser({
            email: email!,
            firebaseUid: uid,
            name: displayName!,
            imageUrl: photoURL!,
            userId: userId as string,
            roles: roles as string[],
          });

          if (pathname === "/") {
            router.push("/dashboard");
          }
        } else {
          deleteCookie("id_token");
          setUser(null);
          router.push("/");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return null;
}
